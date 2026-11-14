import ipaddress
import socket
import urllib.parse
import re
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any

# SSRF Protection: blocked IP networks
PRIVATE_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def is_safe_url(url: str) -> bool:
    """
    Validates URL scheme and resolves hostname to ensure it does not point to internal/private IPs (SSRF protection).
    """
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        
        hostname = parsed.hostname
        if not hostname:
            return False
        
        # Check against localhost string
        if hostname.lower() in ("localhost", "127.0.0.1", "::1"):
            return False

        # Resolve IP
        ip_str = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(ip_str)

        for net in PRIVATE_NETWORKS:
            if ip in net:
                return False

        return True
    except Exception:
        return False


async def extract_article_content(url: str) -> Dict[str, Any]:
    """
    Safely fetches and extracts clean article content from any web URL.
    Handles complex newspaper layouts (like New Age, Daily Star, Prothom Alo English, BBC, etc.)
    by using semantic class matching and heuristic paragraph density scoring so that ALL
    article paragraphs are fully extracted without omitting text or including unrelated sidebars.
    """
    if not is_safe_url(url):
        raise ValueError("Invalid or restricted URL. Access to internal or unsafe addresses is blocked.")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch article. HTTP status: {response.status_code}")

    html = response.content.decode("utf-8", errors="replace")
    soup = BeautifulSoup(html, "html.parser")

    # Extract clean article title
    title = ""
    h1 = soup.find("h1")
    if h1 and h1.get_text():
        title = h1.get_text().strip()
    if not title and soup.title and soup.title.string:
        title = soup.title.string.strip()
    if not title:
        title = "Extracted Article"

    # Remove unwanted non-content tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "svg", "form", "iframe"]):
        tag.decompose()

    # Standard article body container class identifiers across international and Bangladeshi news portals
    EXACT_ARTICLE_CLASSES = [
        "post-content",
        "article-content",
        "story-content",
        "entry-content",
        "article-body",
        "post-body",
        "news-content",
        "content-body",
        "story__content",
        "article__body",
        "detail-content"
    ]

    best_container = None

    # 1. Try finding container with standard article classes having multiple paragraphs
    for cls in EXACT_ARTICLE_CLASSES:
        found = soup.find(
            lambda el: el.name in ["div", "article", "section", "main"] 
            and el.get("class") 
            and any(cls in str(c).lower() for c in el.get("class", []))
        )
        if found and len(found.find_all("p")) >= 3:
            best_container = found
            break

    # 2. Check schema.org itemprop="articleBody"
    if not best_container:
        found = soup.find(attrs={"itemprop": re.compile(r"articleBody|text", re.I)})
        if found and len(found.find_all("p")) >= 3:
            best_container = found

    # 3. Heuristic density scoring if no exact class matched
    if not best_container:
        candidates = soup.find_all(["main", "article", "section", "div"])
        max_score = 0
        for cand in candidates:
            # Ignore candidates that are tiny cards or navigation lists
            c_class = " ".join(cand.get("class", [])).lower()
            if any(x in c_class for x in ["list-group-item", "card-header", "sidebar", "widget", "comment"]):
                continue

            ps = [p.get_text().strip() for p in cand.find_all("p", recursive=True) if len(p.get_text().strip()) > 30]
            score = sum(len(p) for p in ps)
            if score > max_score:
                max_score = score
                best_container = cand

    target_node = best_container if best_container else soup.body or soup

    paragraphs = []
    cleaned_html_parts = []
    seen = set()

    # Filter keywords for advertisement or editorial footer lines
    skip_keywords = [
        "for advertisement", 
        "cell: +88", 
        "published by the chairman", 
        "editor: nurul kabir", 
        "cookie policy", 
        "terms of use", 
        "all rights reserved"
    ]

    for elem in target_node.find_all(["p", "h2", "h3", "h4", "blockquote"]):
        text = elem.get_text().strip()
        lower = text.lower()
        if len(text) > 25 and text not in seen:
            if any(k in lower for k in skip_keywords):
                continue
            seen.add(text)
            paragraphs.append(text)
            cleaned_html_parts.append(f"<{elem.name}>{text}</{elem.name}>")

    # Fallback: if targeted container had very few paragraphs but page has many
    if len(paragraphs) < 3:
        all_ps = soup.find_all(["p", "h2", "h3", "h4", "blockquote"])
        for elem in all_ps:
            text = elem.get_text().strip()
            lower = text.lower()
            if len(text) > 25 and text not in seen:
                if any(k in lower for k in skip_keywords):
                    continue
                seen.add(text)
                paragraphs.append(text)
                cleaned_html_parts.append(f"<{elem.name}>{text}</{elem.name}>")

    extracted_content = "\n\n".join(paragraphs)
    cleaned_html = "".join(cleaned_html_parts)
    total_words = len(re.findall(r"\b\w+\b", extracted_content))

    return {
        "title": title,
        "content": extracted_content,
        "html_content": cleaned_html,
        "total_words": total_words,
        "source_url": url
    }
