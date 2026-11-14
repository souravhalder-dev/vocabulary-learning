import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = (body.url || '').trim();
    if (!url) {
      return NextResponse.json({ detail: 'URL is required' }, { status: 400 });
    }

    // SSRF validation
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return NextResponse.json({ detail: 'Only http and https protocols are supported' }, { status: 400 });
      }
      if (['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)) {
        return NextResponse.json({ detail: 'Localhost addresses are restricted' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ detail: 'Invalid URL format' }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      return NextResponse.json({ detail: `Failed to fetch article: HTTP ${res.status}` }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove unwanted non-content tags
    $('script, style, nav, footer, header, aside, noscript, svg, form, iframe').remove();

    // Extract title
    let title = $('h1').first().text().trim();
    if (!title) title = $('title').text().trim() || 'Extracted Article';

    const EXACT_ARTICLE_CLASSES = [
      'post-content', 'article-content', 'story-content', 'entry-content',
      'article-body', 'post-body', 'news-content', 'content-body',
      'story__content', 'article__body', 'detail-content'
    ];

    let $container: cheerio.Cheerio<any> | null = null;

    for (const cls of EXACT_ARTICLE_CLASSES) {
      const found = $(`div[class*="${cls}"], article[class*="${cls}"], section[class*="${cls}"], main[class*="${cls}"]`);
      if (found.length > 0 && found.find('p').length >= 3) {
        $container = found.first();
        break;
      }
    }

    if (!$container) {
      const itemprop = $('[itemprop="articleBody"], [itemprop="text"]');
      if (itemprop.length > 0 && itemprop.find('p').length >= 3) {
        $container = itemprop.first();
      }
    }

    const targetNode = $container || $('article').first() || $('main').first() || $('body');

    const paragraphs: string[] = [];
    const cleanedHtmlParts: string[] = [];
    const seen = new Set<string>();

    const skipKeywords = [
      'for advertisement', 'cell: +88', 'published by the chairman',
      'editor: nurul kabir', 'cookie policy', 'terms of use', 'all rights reserved'
    ];

    targetNode.find('p, h2, h3, h4, blockquote').each((_, el) => {
      const text = $(el).text().trim();
      const lower = text.toLowerCase();
      if (text.length > 25 && !seen.has(text)) {
        if (skipKeywords.some((k) => lower.includes(k))) return;
        seen.add(text);
        paragraphs.push(text);
        const tag = el.type === 'tag' ? el.name : 'p';
        cleanedHtmlParts.push(`<${tag}>${text}</${tag}>`);
      }
    });

    if (paragraphs.length < 3) {
      $('p, h2, h3, h4, blockquote').each((_, el) => {
        const text = $(el).text().trim();
        const lower = text.toLowerCase();
        if (text.length > 25 && !seen.has(text)) {
          if (skipKeywords.some((k) => lower.includes(k))) return;
          seen.add(text);
          paragraphs.push(text);
          const tag = el.type === 'tag' ? el.name : 'p';
          cleanedHtmlParts.push(`<${tag}>${text}</${tag}>`);
        }
      });
    }

    const content = paragraphs.join('\n\n');
    const totalWords = (content.match(/\b\w+\b/g) || []).length;

    return NextResponse.json({
      id: Date.now(),
      title,
      source_type: 'url',
      source_url: url,
      content,
      html_content: cleanedHtmlParts.join(''),
      total_words: totalWords,
      total_pages: 1,
      current_page: 1,
      reading_progress: 0,
      created_at: new Date().toISOString(),
      last_read_at: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Article extraction failed' }, { status: 500 });
  }
}
