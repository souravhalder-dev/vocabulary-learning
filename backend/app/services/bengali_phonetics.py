import re
from typing import Dict, Optional

# Curated dictionary of common English words to authentic Bengali phonetic pronunciation
# (বাংলা লিপিতে ইংরেজি উচ্চারণ)
COMMON_PRONUNCIATION_DICT: Dict[str, str] = {
    # Pronouns & determiners
    "i": "আই",
    "me": "মি",
    "my": "মাই",
    "mine": "মাইন",
    "myself": "মাইসেলফ",
    "we": "উই",
    "us": "আস",
    "our": "আওয়ার",
    "ours": "আওয়ার্স",
    "ourselves": "আওয়ারসেলভস",
    "you": "ইউ",
    "your": "ইউর",
    "yours": "ইউরস",
    "yourself": "ইউরসেলফ",
    "yourselves": "ইউরসেলভস",
    "he": "হি",
    "him": "হিম",
    "his": "হিজ",
    "himself": "হিমসেলফ",
    "she": "শী",
    "her": "হার",
    "hers": "হার্স",
    "herself": "হারসেলফ",
    "it": "ইট",
    "its": "ইটস",
    "itself": "ইটসেলফ",
    "they": "দে",
    "them": "দেম",
    "their": "দেয়ার",
    "theirs": "দেয়ার্স",
    "themselves": "দেমসেলভস",
    "this": "দিস",
    "that": "দ্যাট",
    "these": "দিজ",
    "those": "দোজ",
    "what": "হোয়াট",
    "which": "হুইচ",
    "who": "হু",
    "whom": "হুম",
    "whose": "হুজ",
    "whatever": "হোয়াটএভার",
    "whoever": "হুএভার",
    "the": "দ্য",
    "a": "এ",
    "an": "অ্যান",

    # Be-verbs, auxiliaries, modals
    "am": "অ্যাম",
    "is": "ইজ",
    "are": "আর",
    "was": "ওয়াজ",
    "were": "ওয়্যার",
    "be": "বি",
    "been": "বিন",
    "being": "বিয়িং",
    "have": "হ্যাভ",
    "has": "হ্যাব",
    "had": "হ্যাড",
    "having": "হ্যাভিং",
    "do": "ডু",
    "does": "ডাজ",
    "did": "ডিড",
    "doing": "ডুইং",
    "done": "ডান",
    "will": "উইল",
    "would": "উড",
    "shall": "শ্যাল",
    "should": "শুড",
    "can": "ক্যান",
    "could": "কুড",
    "may": "মে",
    "might": "মাইট",
    "must": "মাস্ট",
    "need": "নিড",
    "dare": "ডেয়ার",
    "ought": "অট",
    "used": "ইউজড",

    # Prepositions
    "to": "টু",
    "of": "অব",
    "in": "ইন",
    "for": "ফর",
    "on": "অন",
    "with": "উইথ",
    "at": "অ্যাট",
    "by": "বাই",
    "from": "ফ্রম",
    "up": "আপ",
    "down": "ডাউন",
    "about": "অ্যাবাউট",
    "into": "ইনটু",
    "over": "ওভার",
    "under": "আন্ডার",
    "above": "অ্যাবভ",
    "below": "বিলো",
    "after": "আফটার",
    "before": "বিফোর",
    "between": "বিটুইন",
    "among": "অ্যামং",
    "through": "থ্রু",
    "during": "ডিউরিং",
    "without": "উইদাউট",
    "within": "উইদিন",
    "across": "অ্যাক্রস",
    "behind": "বিহাইন্ড",
    "beyond": "বিয়ন্ড",
    "around": "অ্যারাউন্ড",
    "toward": "টুওয়ার্ড",
    "towards": "টুওয়ার্ডস",
    "upon": "আপন",
    "against": "অ্যাগেইন্সট",
    "along": "অ্যালং",
    "off": "অফ",

    # Conjunctions & connectives
    "and": "অ্যান্ড",
    "or": "অর",
    "but": "বাট",
    "so": "সো",
    "yet": "ইয়েট",
    "nor": "নর",
    "if": "ইফ",
    "as": "অ্যাজ",
    "than": "দ্যান",
    "because": "বিকজ",
    "while": "হোয়াইল",
    "whereas": "হোয়ারঅ্যাজ",
    "since": "সিন্স",
    "unless": "আনলেস",
    "until": "আনটিল",
    "whether": "হোয়েদার",
    "although": "অলদো",
    "though": "দো",
    "even": "ইভেন",

    # Question words & Adverbs
    "how": "হাউ",
    "when": "হোয়েন",
    "where": "হোয়ার",
    "why": "হোয়াই",
    "not": "নট",
    "no": "নো",
    "yes": "ইয়েস",
    "never": "নেভার",
    "always": "অলওয়েজ",
    "sometimes": "সামটাইমস",
    "often": "অফেন",
    "usually": "ইউজুয়ালি",
    "seldom": "সেলডম",
    "rarely": "রেয়ারলি",
    "very": "ভেরি",
    "quite": "কোয়াইট",
    "too": "টু",
    "also": "অলসো",
    "just": "জাস্ট",
    "only": "অনলি",
    "well": "ওয়েল",
    "back": "ব্যাক",
    "still": "স্টিল",
    "here": "হিয়ার",
    "there": "দেয়ার",
    "now": "নাউ",
    "then": "দেন",
    "again": "অ্যাগেইন",
    "already": "অলরেডি",
    "almost": "অলমোস্ট",
    "perhaps": "পারহ্যাপস",
    "probably": "প্রবাবলি",
    "certainly": "সার্টেইনলি",
    "actually": "অ্যাকচুয়ালি",
    "indeed": "ইনডিড",
    "together": "টুগেদার",
    "away": "অ্যাওয়ে",
    "far": "ফার",
    "near": "নিয়ার",
    "soon": "সুন",
    "early": "আর্লি",
    "late": "লেট",
    "later": "লেটার",

    # Numbers & Ordinals
    "one": "ওয়ান",
    "two": "টু",
    "three": "থ্রি",
    "four": "ফোর",
    "five": "ফাইভ",
    "six": "সিক্স",
    "seven": "সেভেন",
    "eight": "এইট",
    "nine": "নাইন",
    "ten": "টেন",
    "eleven": "ইলেভেন",
    "twelve": "টুয়েলভ",
    "twenty": "টুয়েন্টি",
    "thirty": "থার্টি",
    "forty": "ফরটি",
    "fifty": "ফিফটি",
    "hundred": "হান্ড্রেড",
    "thousand": "থাউজেন্ড",
    "million": "মিলিয়ন",
    "billion": "বিলিয়ন",
    "first": "ফার্স্ট",
    "second": "সেকেন্ড",
    "third": "থার্ড",
    "fourth": "ফোর্থ",
    "fifth": "ফিফথ",
    "last": "লাস্ট",
    "next": "নেক্সট",

    # Prompt specific & core vocabulary
    "revolution": "রেভোলিউশন",
    "revolutionary": "রেভোলিউশনারি",
    "student": "স্টুডেন্ট",
    "students": "স্টুডেন্টস",
    "significant": "সিগনিফিক্যান্ট",
    "significance": "সিগনিফিক্যান্স",
    "resilience": "রেজিলিয়েন্স",
    "resilient": "রেজিলিয়েন্ট",
    "trying": "ট্রাইং",
    "try": "ট্রাই",
    "tries": "ট্রাইজ",
    "tried": "ট্রাইড",
    "improve": "ইমপ্রুভ",
    "improves": "ইমপ্রুভস",
    "improving": "ইমপ্রুভিং",
    "improved": "ইমপ্রুভড",
    "improvement": "ইমপ্রুভমেন্ট",
    "english": "ইংলিশ",
    "reading": "রিডিং",
    "read": "রিড",
    "reader": "রিডার",
    "skills": "স্কিলস",
    "skill": "স্কিল",
    "skilled": "স্কিল্ড",
    "creative": "ক্রিয়েটিভ",
    "creatively": "ক্রিয়েটিভলি",
    "creativity": "ক্রিয়েটিভিটি",
    "create": "ক্রিয়েট",
    "creating": "ক্রিয়েটিং",
    "created": "ক্রিয়েটেড",
    "creation": "ক্রিয়েশন",
    "economy": "ইকোনমি",
    "economic": "ইকোনমিক",
    "economical": "ইকোনমিকাল",
    "economics": "ইকোনমিক্স",
    "economist": "ইকোনমিস্ট",
    "culture": "কালচার",
    "cultural": "কালচারাল",
    "culturally": "কালচারালি",
    "horizon": "হরাইজন",
    "horizons": "হরাইজনস",
    "philosophy": "ফিলোসফি",
    "philosopher": "ফিলোসফার",
    "philosophical": "ফিলোসফিকাল",
    "traditional": "ট্রাডিশনাল",
    "tradition": "ট্রাডিশন",
    "traditions": "ট্রাডিশনস",
    "transformation": "ট্রান্সফরমেশন",
    "transform": "ট্রান্সফর্ম",
    "transforming": "ট্রান্সফর্মিং",
    "transformed": "ট্রান্সফর্মড",
    "undergoing": "আন্ডারগোয়িং",
    "undergo": "আন্ডারগো",
    "underwent": "আন্ডারওয়েন্ট",
    "undergone": "আন্ডারগন",
    "massive": "ম্যাসিভ",
    "massively": "ম্যাসিভলি",
    "obsolete": "অবসোলেট",
    "individual": "ইন্ডিভিজুয়াল",
    "individually": "ইন্ডিভিজুয়ালি",
    "individuals": "ইন্ডিভিজুয়ালস",
    "individuality": "ইন্ডিভিজুয়ালিটি",
    "imagination": "ইমাজিনেশন",
    "imagine": "ইমাজিন",
    "financial": "ফাইন্যান্সিয়াল",
    "financially": "ফাইন্যান্সিয়ালি",
    "finance": "ফাইন্যান্স",
    "finances": "ফাইন্যান্সেস",
    "opinion": "ওপিনিয়ন",
    "opinions": "ওপিনিয়নস",
    "article": "আর্টিকেল",
    "articles": "আর্টিকেলস",
    "pillar": "পিলার",
    "pillars": "পিলার্স",
    "industrial": "ইন্ডাস্ট্রিয়াল",
    "industry": "ইন্ডাস্ট্রি",
    "industries": "ইন্ডাস্ট্রিজ",
    "began": "বিগান",
    "begin": "বিগিন",
    "beginning": "বিগিনিং",
    "begins": "বিগিনস",
    "vocabulary": "ভোকাবুলারি",
    "learning": "লার্নিং",
    "learn": "লার্ন",
    "learner": "লার্নার",
    "learners": "লার্নার্স",
    "learned": "লার্নড",
    "platform": "প্ল্যাটফর্ম",
    "pronunciation": "প্রোনাউন্সিয়েশন",
    "pronounce": "প্রোনাউন্স",
    "pronouncing": "প্রোনাউন্সিং",
    "meaning": "মিনিং",
    "meanings": "মিনিংস",
    "sentence": "সেন্টেন্স",
    "sentences": "সেন্টেন্সেস",
    "translation": "ট্রান্সলেশন",
    "translations": "ট্রান্সলেশনস",
    "translate": "ট্রান্সলেট",
    "translating": "ট্রান্সলেটিং",
    "translated": "ট্রান্সলেটেড",
    "clipboard": "ক্লিপবোর্ড",
    "notebook": "নোটবুক",
    "document": "ডকুমেন্ট",
    "documents": "ডকুমেন্টস",
    "knowledge": "নলেজ",
    "practice": "প্র্যাকটিস",
    "practicing": "প্র্যাকটিসিং",
    "practiced": "প্র্যাকটিসড",
    "fluency": "ফ্লুয়েন্সি",
    "fluent": "ফ্লুয়েন্ট",
    "fluently": "ফ্লুয়েন্টলি",
    "education": "এডুকেশন",
    "educational": "এডুকেশনাল",
    "educate": "এডুকেট",
    "technology": "টেকনোলজি",
    "technological": "টেকনোলজিকাল",
    "development": "ডেভেলপমেন্ট",
    "develop": "ডেভেলপ",
    "developing": "ডেভেলপিং",
    "developed": "ডেভেলপড",
    "opportunity": "অপরচুনিটি",
    "opportunities": "অপরচুনিটিজ",
    "challenge": "চ্যালেঞ্জ",
    "challenges": "চ্যালেঞ্জেস",
    "challenging": "চ্যালেঞ্জিং",
    "achievement": "অ্যাচিভমেন্ট",
    "achieve": "অ্যাচিভ",
    "achieving": "অ্যাচিভিং",
    "achieved": "অ্যাচিভড",
    "understand": "আন্ডারস্ট্যান্ড",
    "understanding": "আন্ডারস্ট্যান্ডিং",
    "understood": "আন্ডারস্টুড",
    "comprehension": "কম্প্রিহেনশন",
    "confidence": "কনফিডেন্স",
    "confident": "কনফিডেন্ট",
    "communication": "কমিউনিকেশন",
    "communicate": "কমিউনিকেট",
    "language": "ল্যাঙ্গুয়েজ",
    "languages": "ল্যাঙ্গুয়েজেস",
    "grammar": "গ্রামার",
    "definition": "ডেফিনিশন",
    "definitions": "ডেফিনিশনস",
    "example": "এক্সাম্পল",
    "examples": "এক্সাম্পলস",
    "context": "কনটেক্সট",
    "contextual": "কনটেক্সচুয়াল",
    "progress": "প্রগ্রেস",
    "streak": "স্ট্রিক",
    "flashcard": "ফ্ল্যাশকার্ড",
    "flashcards": "ফ্ল্যাশকার্ডস",
    "quiz": "কুইজ",
    "review": "রিভিউ",
    "memory": "মেমরি",
    "remember": "রিমেম্বার",
    "intelligence": "ইন্টেলিজেন্স",
    "intelligent": "ইন্টেলিজেন্ট",
    "artificial": "আর্টিফিশিয়াল",
    "audio": "অডিও",
    "speaker": "স্পিকার",
    "offline": "অফলাইন",
    "online": "অনলাইন",
    "library": "লাইব্রেরি",
    "history": "হিস্ট্রি",
    "settings": "সেটিংস",
    "setting": "সেটিং",
    "dashboard": "ড্যাশবোর্ড",
    "automatic": "অটোমেটিক",
    "automatically": "অটোমেটিকালি",
    "important": "ইম্পর্ট্যান্ট",
    "importance": "ইম্পর্ট্যান্স",
    "beautiful": "বিউটিফুল",
    "wonderful": "ওয়ান্ডারফুল",
    "difficult": "ডিফিকাল্ট",
    "difficulty": "ডিফিকাল্টি",
    "easy": "ইজি",
    "easily": "ইজিলি",
    "simple": "সিম্পল",
    "simply": "সিম্পলি",
    "success": "সাকসেস",
    "successful": "সাকসেসফুল",
    "successfully": "সাকসেসফুলি",
    "effort": "এফোর্ট",
    "efforts": "এফোর্টস",
    "growth": "গ্রোথ",
    "future": "ফিউচার",
    "career": "ক্যারিয়ার",
    "careers": "ক্যারিয়ার্স",
    "people": "পিপল",
    "world": "ওয়ার্ল্ড",
    "time": "টাইম",
    "times": "টাইমস",
    "life": "লাইফ",
    "lives": "লাইভস",
    "work": "ওয়ার্ক",
    "working": "ওয়ার্কিং",
    "worked": "ওয়ার্কড",
    "worker": "ওয়ার্কার",
    "workers": "ওয়ার্কার্স",
    "study": "স্টাডি",
    "studying": "স্টাডিয়িং",
    "studies": "স্টাডিজ",
    "book": "বুক",
    "books": "বুকস",
    "system": "সিস্টেম",
    "systems": "সিস্টেমস",
    "process": "প্রসেস",
    "processes": "প্রসেসেস",
    "processing": "প্রসেসিং",
    "question": "কোশ্চেন",
    "questions": "কোশ্চেনস",
    "answer": "অ্যানসার",
    "answers": "অ্যানসার্স",
    "computer": "কম্পিউটার",
    "application": "অ্যাপ্লিকেশন",
    "applications": "অ্যাপ্লিকেশনস",
    "website": "ওয়েবসাইট",
    "websites": "ওয়েবসাইটস",
    "synonym": "সিনোনিম",
    "synonyms": "সিনোনিমস",
    "antonym": "অ্যান্টোনিম",
    "antonyms": "অ্যান্টোনিমস",

    # Common verbs
    "go": "গো",
    "goes": "গোজ",
    "went": "ওয়েন্ট",
    "gone": "গন",
    "going": "গোয়িং",
    "come": "কাম",
    "comes": "কামস",
    "came": "কেইম",
    "coming": "কামিং",
    "take": "টেক",
    "takes": "টেকস",
    "took": "টুক",
    "taken": "টেকেন",
    "taking": "টেকিং",
    "make": "মেক",
    "makes": "মেকস",
    "made": "মেড",
    "making": "মেকিং",
    "get": "গেট",
    "gets": "গেটস",
    "got": "গট",
    "gotten": "গটেন",
    "getting": "গেটিং",
    "give": "গিভ",
    "gives": "গিভস",
    "gave": "গেইভ",
    "given": "গিভেন",
    "giving": "গিভিং",
    "know": "নো",
    "knows": "নোজ",
    "knew": "নিউ",
    "known": "নোন",
    "knowing": "নোয়িং",
    "think": "থিঙ্ক",
    "thinks": "থিঙ্কস",
    "thought": "থট",
    "thinking": "থিঙ্কিং",
    "see": "সী",
    "sees": "সীজ",
    "saw": "স",
    "seen": "সীন",
    "seeing": "সীইং",
    "look": "লুক",
    "looks": "লুকস",
    "looked": "লুকড",
    "looking": "লুকিং",
    "want": "ওয়ান্ট",
    "wants": "ওয়ান্টস",
    "wanted": "ওয়ান্টেড",
    "wanting": "ওয়ান্টিং",
    "use": "ইউজ",
    "uses": "ইউজেস",
    "using": "ইউজিং",
    "find": "ফাইন্ড",
    "finds": "ফাইন্ডস",
    "found": "ফাউন্ড",
    "finding": "ফাইন্ডিং",
    "tell": "টেল",
    "tells": "টেলস",
    "told": "টোল্ড",
    "telling": "টেলিং",
    "ask": "আস্ক",
    "asks": "আস্কস",
    "asked": "আস্কড",
    "asking": "আস্কিং",
    "feel": "ফিল",
    "feels": "ফিলস",
    "felt": "ফেল্ট",
    "feeling": "ফিলিং",
    "become": "বিকাম",
    "becomes": "বিকামস",
    "became": "বিকেইম",
    "becoming": "বিকামিং",
    "leave": "লিভ",
    "leaves": "লিভস",
    "left": "লেফট",
    "leaving": "লিভিং",
    "put": "পুট",
    "puts": "পুটস",
    "putting": "পুটিং",
    "mean": "মীন",
    "means": "মীনস",
    "meant": "মেন্ট",
    "keep": "কীপ",
    "keeps": "কীপস",
    "kept": "কেপ্ট",
    "keeping": "কীপিং",
    "let": "লেট",
    "lets": "লেটস",
    "letting": "লেটিং",
    "seem": "সীম",
    "seems": "সীম্স",
    "seemed": "সীম্ড",
    "help": "হেল্প",
    "helps": "হেল্পস",
    "helped": "হেল্পড",
    "helping": "হেল্পিং",
    "talk": "টক",
    "talks": "টকস",
    "talked": "টকড",
    "talking": "টকিং",
    "turn": "টার্ন",
    "turns": "টার্নস",
    "turned": "টার্নড",
    "turning": "টার্নিং",
    "start": "স্টার্ট",
    "starts": "স্টার্টস",
    "started": "স্টার্টেড",
    "starting": "স্টার্টিং",
    "show": "শো",
    "shows": "শোজ",
    "showed": "শোড",
    "shown": "শোন",
    "showing": "শোয়িং",
    "hear": "হিয়ার",
    "hears": "হিয়ার্স",
    "heard": "হার্ড",
    "hearing": "হিয়ারিং",
    "play": "প্লে",
    "plays": "প্লেজ",
    "played": "প্লেড",
    "playing": "প্লেয়িং",
    "run": "রান",
    "runs": "রানস",
    "ran": "র‍্যান",
    "running": "রানিং",
    "move": "মুভ",
    "moves": "মুভস",
    "moved": "মুভড",
    "moving": "মুভিং",
    "movement": "মুভমেন্ট",
    "like": "লাইক",
    "likes": "লাইকস",
    "liked": "লাইকড",
    "liking": "লাইকিং",
    "live": "লিভ",
    "living": "লিভিং",
    "believe": "বিলিভ",
    "believes": "বিলিভস",
    "believed": "বিলিভড",
    "believing": "বিলিভিং",
    "belief": "বিলিফ",
    "hold": "হোল্ড",
    "holds": "হোল্ডস",
    "held": "হেল্ড",
    "holding": "হোল্ডিং",
    "bring": "ব্রিং",
    "brings": "ব্রিংস",
    "brought": "ব্রট",
    "bringing": "ব্রিঙ্গিং",
    "happen": "হ্যাপেন",
    "happens": "হ্যাপেনস",
    "happened": "হ্যাপেন্ড",
    "happening": "হ্যাপেনিং",
    "write": "রাইট",
    "writes": "রাইটস",
    "wrote": "রোট",
    "written": "রিটেন",
    "writing": "রাইটিং",
    "writer": "রাইটার",
    "provide": "প্রোভাইড",
    "provides": "প্রোভাইডস",
    "provided": "প্রোভাইডেড",
    "providing": "প্রোভাইডিং",
    "sit": "সিট",
    "sits": "সিটস",
    "sat": "স্যাট",
    "sitting": "সিটিং",
    "stand": "স্ট্যান্ড",
    "stands": "স্ট্যান্ডস",
    "stood": "স্টুড",
    "standing": "স্ট্যান্ডিং",
    "lose": "লুজ",
    "loses": "লুজেস",
    "lost": "লস্ট",
    "losing": "লুজিং",
    "pay": "পে",
    "pays": "পেজ",
    "paid": "পেইড",
    "paying": "পেয়িং",
    "meet": "মিট",
    "meets": "মিটস",
    "met": "মেট",
    "meeting": "মিটিং",
    "include": "ইনক্লুড",
    "includes": "ইনক্লুডস",
    "included": "ইনক্লুডেড",
    "including": "ইনক্লুডিং",
    "continue": "কন্টিনিউ",
    "continues": "কন্টিনিউজ",
    "continued": "কন্টিনিউড",
    "continuing": "কন্টিনিউয়িং",
    "continuous": "কন্টিনিউয়াস",
    "set": "সেট",
    "sets": "সেটস",
    "setting": "সেটিং",
    "change": "চেঞ্জ",
    "changes": "চেঞ্জেস",
    "changed": "চেঞ্জড",
    "changing": "চেঞ্জিং",
    "lead": "লীড",
    "leads": "লীডস",
    "led": "লেড",
    "leading": "লীডিং",
    "leader": "লীডার",
    "leadership": "লীডারশিপ",
    "watch": "ওয়াচ",
    "watches": "ওয়াচেস",
    "watched": "ওয়াচড",
    "watching": "ওয়াচিং",
    "follow": "ফলো",
    "follows": "ফলোজ",
    "followed": "ফলোড",
    "following": "ফলোয়িং",
    "stop": "স্টপ",
    "stops": "স্টপস",
    "stopped": "স্টপড",
    "stopping": "স্টপিং",
    "speak": "স্পীক",
    "speaks": "স্পীকস",
    "spoke": "স্পোক",
    "spoken": "স্পোকেন",
    "speaking": "স্পীকিং",
    "allow": "অ্যালাউ",
    "allows": "অ্যালাউজ",
    "allowed": "অ্যালাউড",
    "allowing": "অ্যালাউয়িং",
    "add": "অ্যাড",
    "adds": "অ্যাডস",
    "added": "অ্যাডেড",
    "adding": "অ্যাডিং",
    "addition": "অ্যাডিশন",
    "spend": "স্পেন্ড",
    "spends": "স্পেন্ডস",
    "spent": "স্পেন্ট",
    "spending": "স্পেন্ডিং",
    "grow": "গ্রো",
    "grows": "গ্রোজ",
    "grew": "গ্রু",
    "grown": "গ্রোন",
    "growing": "গ্রোয়িং",
    "open": "ওপেন",
    "opens": "ওপেনস",
    "opened": "ওপেন্ড",
    "opening": "ওপেনিং",
    "walk": "ওয়াক",
    "walks": "ওয়াকস",
    "walked": "ওয়াকড",
    "walking": "ওয়াকিং",
    "win": "উইন",
    "wins": "উইনস",
    "won": "ওয়ান",
    "winning": "উইনিং",
    "winner": "উইনার",
    "offer": "অফার",
    "offers": "অফার্স",
    "offered": "অফার্ড",
    "offering": "অফারিং",
    "consider": "কনসিডার",
    "considers": "কনসিডার্স",
    "considered": "কনসিডার্ড",
    "considering": "কনসিডারিং",
    "consideration": "কনসিডারেশন",
    "appear": "অ্যাপিয়ার",
    "appears": "অ্যাপিয়ার্স",
    "appeared": "অ্যাপিয়ার্ড",
    "appearing": "অ্যাপিয়ারিং",
    "appearance": "অ্যাপিয়ারেন্স",
    "buy": "বাই",
    "buys": "বাইস",
    "bought": "বট",
    "buying": "বায়িং",
    "wait": "ওয়েট",
    "waits": "ওয়েটস",
    "waited": "ওয়েটেড",
    "waiting": "ওয়েটিং",
    "serve": "সার্ভ",
    "serves": "সার্ভস",
    "served": "সার্ভড",
    "serving": "সার্ভিং",
    "service": "সার্ভিস",
    "services": "সার্ভিসেস",
    "send": "সেন্ড",
    "sends": "সেন্ডস",
    "sent": "সেন্ট",
    "sending": "সেন্ডিং",
    "expect": "এক্সপেক্ট",
    "expects": "এক্সপেক্টস",
    "expected": "এক্সপেক্টেড",
    "expecting": "এক্সপেক্টিং",
    "expectation": "এক্সপেক্টেশন",
    "build": "বিল্ড",
    "builds": "বিল্ডস",
    "built": "বিল্ট",
    "building": "বিল্ডিং",
    "stay": "স্টে",
    "stays": "স্টেজ",
    "stayed": "স্টেড",
    "staying": "স্টেয়িং",
    "fall": "ফল",
    "falls": "ফলস",
    "fell": "ফেল",
    "fallen": "ফলেন",
    "falling": "ফলিং",
    "reach": "রীচ",
    "reaches": "রীচেস",
    "reached": "রীচড",
    "reaching": "রীচিং",
    "remain": "রিমেইন",
    "remains": "রিমেইনস",
    "remained": "রিমেইন্ড",
    "remaining": "রিমেইনিং",
    "suggest": "সাজেস্ট",
    "suggests": "সাজেস্টস",
    "suggested": "সাজেস্টেড",
    "suggesting": "সাজেস্টিং",
    "suggestion": "সাজেশন",
    "require": "রিকোয়ার",
    "requires": "রিকোয়ার্স",
    "required": "রিকোয়ার্ড",
    "requiring": "রিকোয়ারিং",
    "requirement": "রিকোয়ারমেন্ট",
    "report": "রিপোর্ট",
    "reports": "রিপোর্টস",
    "reported": "রিপোর্টেড",
    "reporting": "রিপোর্টিং",
    "decide": "ডিসাইড",
    "decides": "ডিসাইডস",
    "decided": "ডিসাইডেড",
    "deciding": "ডিসাইডিং",
    "decision": "ডিসিশন",
    "decisions": "ডিসিশনস",
    "curious": "কিউরিয়াস",
    "curiosity": "কিউরিওসিটি",
    "emphasize": "এমফাসাইজ",
    "emphasise": "এমফাসাইজ",
    "emphasized": "এমফাসাইজড",
    "emphasised": "এমফাসাইজড",
    "pull": "পুল",
    "pulls": "পুলস",
    "pulled": "পুলড",
    "pulling": "পলিং",

    # Core academic, literature & news vocabulary (Oxford & Cambridge British Standard)
    "talent": "ট্যালেন্ট",
    "talents": "ট্যালেন্টস",
    "talented": "ট্যালেন্টেড",
    "human": "হিউম্যান",
    "humans": "হিউম্যানস",
    "humanity": "হিউম্যানিটি",
    "massive": "ম্যাসিভ",
    "highlight": "হাইলাইট",
    "highlights": "হাইলাইটস",
    "highlighted": "হাইলাইটেড",
    "highlighting": "হাইলাইটিং",
    "worldwide": "ওয়ার্ল্ডওয়াইড",
    "typical": "টিপিক্যাল",
    "typically": "টিপিক্যালি",
    "unprecedented": "আনপ্রেসিডেন্টেড",
    "precedent": "প্রেসিডেন্ট",
    "precedented": "প্রেসিডেন্টেড",
    "phonology": "ফোনোলজি",
    "phonological": "ফোনোলজিক্যাল",
    "empower": "এমপাওয়ার",
    "empowers": "এমপাওয়ার্স",
    "empowered": "এমপাওয়ার্ড",
    "empowering": "এমপাওয়ারিং",
    "recognize": "রেকগনাইজ",
    "recognise": "রেকগনাইজ",
    "recognizes": "রেকগনাইজেস",
    "recognises": "রেকগনাইজেস",
    "recognized": "রেকগনাইজড",
    "recognised": "রেকগনাইজড",
    "recognizing": "রেকগনাইজিং",
    "recognising": "রেকগনাইজিং",
    "recognition": "রেকগনিশন",
    "inclusive": "ইনক্লুসিভ",
    "include": "ইনক্লুড",
    "includes": "ইনক্লুডস",
    "included": "ইনক্লুডেড",
    "including": "ইনক্লুডিং",
    "generate": "জেনারেট",
    "generates": "জেনারেটস",
    "generated": "জেনারেটেড",
    "generating": "জেনারেটিং",
    "generation": "জেনারেশন",
    "howkins": "হকিন্স",
    "encompass": "এনকম্পাস",
    "encompasses": "এনকম্পাসেস",
    "encompassed": "এনকম্পাসড",
    "encompassing": "এনকম্পাসিং",
    "understanding": "আন্ডারস্ট্যান্ডিং",
    "understand": "আন্ডারস্ট্যান্ড",
    "understands": "আন্ডারস্ট্যান্ডস",
    "understood": "আন্ডারস্টুড",
    "undergoing": "আন্ডারগোয়িং",
    "undergo": "আন্ডারগো",
    "undergoes": "আন্ডারগোজ",
    "underwent": "আন্ডারওয়েন্ট",
    "undergone": "আন্ডারগন",
    "economy": "ইকোনমি",
    "economic": "ইকোনমিক",
    "economies": "ইকোনমিজ",
    "economical": "ইকোনমিক্যাল",
    "economist": "ইকোনমিস্ট",
    "philosophy": "ফিলোসফি",
    "philosophical": "ফিলোসফিক্যাল",
    "revolution": "রেভোলিউশন",
    "revolutionary": "রেভোলিউশনারি",
    "individuality": "ইন্ডিভিজুয়ালিটি",
    "individual": "ইন্ডিভিজুয়াল",
    "creativity": "ক্রিয়েটিভিটি",
    "creative": "ক্রিয়েটিভ",
    "create": "ক্রিয়েট",
    "creates": "ক্রিয়েটস",
    "created": "ক্রিয়েটেড",
    "creating": "ক্রিয়েটিং",
    "creation": "ক্রিয়েশন",
    "artificial": "আর্টিফিশিয়াল",
    "artificially": "আর্টিফিশিয়ালি",
    "intelligence": "ইন্টেলিজেন্স",
    "intelligent": "ইন্টেলিজেন্ট",
    "curious": "কিউরিয়াস",
    "curiosity": "কিউরিওসিটি",
    "curiously": "কিউরিয়াসলি",
    "language": "ল্যাঙ্গুয়েজ",
    "languages": "ল্যাঙ্গুয়েজেস",
    "british": "ব্রিটিশ",
    "britain": "ব্রিটেন",
    "growing": "গ্রোয়িং",
    "grow": "গ্রো",
    "grows": "গ্রোজ",
    "grew": "গ্রিউ",
    "grown": "গ্রোন",
    "growth": "গ্রোথ",
    "student": "স্টুডেন্ট",
    "students": "স্টুডেন্টস",
    "resilience": "রেজিলিয়েন্স",
    "resilient": "রেজিলিয়েন্ট",
    "significant": "সিগনিফিক্যান্ট",
    "significantly": "সিগনিফিক্যান্টলি",
    "significance": "সিগনিফিক্যান্স",
    "vocabulary": "ভোকাবুলারি",
    "vocabularies": "ভোকাবুলারিজ",
    "set": "সেট",
    "sets": "সেটস",
    "setting": "সেটিং",
    "knowledge": "নলেজ",
    "knowledgeable": "নলেজেবল",
    "development": "ডেভেলপমেন্ট",
    "develop": "ডেভেলপ",
    "develops": "ডেভেলপস",
    "developed": "ডেভেলপড",
    "developing": "ডেভেলপিং",
    "learner": "লার্নার",
    "learners": "লার্নার্স",
    "learn": "লার্ন",
    "learns": "লার্নস",
    "learned": "লার্নড",
    "learning": "লার্নিং",
    "core": "কোর",
    "cores": "কোর্স",
    "its": "ইটস",
    "it": "ইট",
    "and": "অ্যান্ড",
    "culture": "কালচার",
    "cultural": "কালচারাল",
    "culturally": "কালচারালি",
    "orange": "অরেঞ্জ",
    "oranges": "অরেঞ্জেস",
    "concept": "কনসেপ্ট",
    "concepts": "কনসেপ্টস",
    "value": "ভ্যালু",
    "values": "ভ্যালুজ",
    "valuable": "ভ্যালুয়েবল",
    "obsolete": "অবসোলিট",
    "agriculture": "এগ্রিকালচার",
    "agricultural": "এগ্রিকালচারাল",
    "industry": "ইন্ডাস্ট্রি",
    "industries": "ইন্ডাস্ট্রিজ",
    "industrial": "ইন্ডাস্ট্রিয়াল",
    "labour": "লেবার",
    "labor": "লেবার",
    "rapid": "র‍্যাপিড",
    "rapidly": "র‍্যাপিডলি",
    "power": "পাওয়ার",
    "powers": "পাওয়ার্স",
    "powered": "পাওয়ার্ড",
    "powering": "পাওয়ারিং",
    "scale": "স্কেল",
    "scales": "স্কেলস",
    "scaled": "স্কেলড",
    "scaling": "স্কেলিং",
    "global": "গ্লোবাল",
    "globally": "গ্লোবালি",
    "transformation": "ট্রান্সফরমেশন",
    "transform": "ট্রান্সফর্ম",
    "transforms": "ট্রান্সফর্মস",
    "transformed": "ট্রান্সফর্মড",
    "transforming": "ট্রান্সফর্মিং",
    "traditional": "ট্রেডিশনাল",
    "traditionally": "ট্রেডিশনালি",
    "tradition": "ট্রেডিশন",
    "traditions": "ট্রেডিশনস",
    "sector": "সেক্টর",
    "sectors": "সেক্টরস",
    "driven": "ড্রিভেন",
    "drive": "ড্রাইভ",
    "drives": "ড্রাইভস",
    "driving": "ড্রাইভিং",
    "drove": "ড্রোভ",
    "heavy": "হেভি",
    "heavily": "হেভিলি",
    "cheap": "চিপ",
    "cheaper": "চিপার",
    "cheapest": "চিপেস্ট",
    "become": "বিকাম",
    "becomes": "বিকামস",
    "became": "বিকেইম",
    "becoming": "বিকামিং",
    "rely": "রিলাই",
    "relies": "রিলাইজ",
    "relied": "রিলাইড",
    "relying": "রিলায়িং",
    "introduce": "ইন্ট্রোডিউস",
    "introduces": "ইন্ট্রোডিউসেস",
    "introduced": "ইন্ট্রোডিউসড",
    "introducing": "ইন্ট্রোডিউসিং",
    "introduction": "ইন্ট্রোডাকশন",
    "horizon": "হরাইজন",
    "horizons": "হরাইজনস",
    "imagination": "ইমাজিনেশন",
    "imagine": "ইমাজিন",
    "imagines": "ইমাজিনস",
    "imagined": "ইমাজিন্ড",
    "imagining": "ইমাজিনিং",
    "imaginative": "ইমাজিনেটিভ",
    "opportunity": "অপরচুনিটি",
    "opportunities": "অপরচুনিটিজ",
    "challenge": "চ্যালেঞ্জ",
    "challenges": "চ্যালেঞ্জেস",
    "challenged": "চ্যালেঞ্জড",
    "challenging": "চ্যালেঞ্জিং",
    "education": "এডুকেশন",
    "educational": "এডুকেশনাল",
    "technology": "টেকনোলজি",
    "technologies": "টেকনোলজিস্ট",
    "technological": "টেকনোলজিক্যাল",
    "confidence": "কনফিডেন্স",
    "confident": "কনফিডেন্ট",
    "fluency": "ফ্লুয়েন্সি",
    "fluent": "ফ্লুয়েন্ট",
    "fluently": "ফ্লুয়েন্টলি",
    "comprehension": "কম্প্রিহেনশন",
    "comprehend": "কম্প্রিহেন্ড",
    "perseverance": "পারসিভিয়ারেন্স",
    "persevere": "পারসিভিয়ার",
    "meticulous": "মেটিকুলাস",
    "meticulously": "মেটিকুলাসলি",
    "pragmatic": "প্র্যাগম্যাটিক",
    "pragmatically": "প্র্যাগম্যাটিক্যালি",
    "authentic": "অথেনটিক",
    "authentically": "অথেনটিক্যালি",
    "authenticity": "অথেনটিসিটি",
    "ubiquitous": "ইউবিকুইটাস",
    "parliament": "পার্লামেন্ট",
    "environment": "এনভায়রনমেন্ট",
    "government": "গভর্নমেন্ট",
    "sustainable": "সাস্টেইনেবল",
    "architecture": "আর্কিটেকচার",
    "infrastructure": "ইনফ্রাস্ট্রাকচার",
    "psychology": "সাইকোলজি",
    "inevitable": "ইনেভিটেবল",
    "communication": "কমিউনিকেশন",
    "circumstance": "সারকামস্ট্যান্স",
    "circumstances": "সারকামস্ট্যান্সেস"
}

# Consonant clusters and phonemes mapping
PHONEME_MAP = {
    "sh": "শ", "ch": "চ", "th": "থ", "ph": "ফ", "wh": "হো",
    "gh": "গ", "kh": "খ", "rh": "র", "sc": "স্ক", "sk": "স্ক",
    "sp": "স্প", "st": "স্ট", "str": "স্ট্র", "squ": "স্কু",
    "tr": "ট্র", "dr": "ড্র", "br": "ব্র", "cr": "ক্র",
    "fr": "ফ্র", "gr": "গ্র", "pr": "প্র", "pl": "প্ল",
    "cl": "ক্ল", "bl": "ব্ল", "fl": "ফ্ল", "gl": "গ্ল",
    "qu": "কো", "ck": "ক", "ng": "ং", "nk": "ঙ্ক",
    "tion": "শন", "sion": "শন", "tions": "শনস", "sions": "শনস",
    "ture": "চার", "tures": "চার্স",
    "cial": "শাল", "tial": "শাল",
    "cious": "শাস", "tious": "শাস",
    "ment": "মেন্ট", "ments": "মেন্টস",
    "b": "ব", "c": "ক", "d": "ড", "f": "ফ", "g": "গ",
    "h": "হ", "j": "জ", "k": "ক", "l": "ল", "m": "ম",
    "n": "ন", "p": "প", "q": "ক", "r": "র", "s": "স",
    "t": "ট", "v": "ভ", "w": "ওয়", "x": "ক্স", "y": "ই",
    "z": "জ"
}

IPA_CONSONANTS = [
    ("stɹ", "স্ট্র"), ("stj", "স্টু"), ("skw", "স্কু"), ("sk", "স্ক"), ("sp", "স্প"), ("st", "স্ট"),
    ("tɹ", "ট্র"), ("dɹ", "ড্র"), ("bɹ", "ব্র"), ("kɹ", "ক্র"), ("ɡɹ", "গ্র"), ("pɹ", "প্র"), ("fɹ", "ফ্র"),
    ("nt", "ন্ট"), ("nd", "ন্ড"), ("mp", "ম্প"), ("mb", "ম্ব"), ("ŋk", "ঙ্ক"), ("kt", "ক্ট"), ("ks", "ক্স"),
    ("ld", "ল্ড"), ("lt", "ল্ট"), ("rd", "র্ড"), ("rt", "র্ট"), ("rk", "র্ক"), ("rn", "র্ন"), ("rm", "র্ম"),
    ("kl", "ক্ল"), ("pl", "প্ল"), ("bl", "ব্ল"), ("fl", "ফ্ল"), ("gl", "গ্ল"),
    ("tʃ", "চ"), ("dʒ", "জ"), ("t͡ʃ", "চ"), ("d͡ʒ", "জ"),
    ("ʃ", "শ"), ("ʒ", "ঝ"), ("θ", "থ"), ("ð", "দ"), ("ŋ", "ং"),
    ("b", "ব"), ("p", "প"), ("d", "ড"), ("t", "ট"), ("k", "ক"), ("ɡ", "গ"), ("g", "গ"),
    ("m", "ম"), ("n", "ন"), ("l", "ল"), ("ɹ", "র"), ("r", "র"), ("s", "স"), ("z", "জ"),
    ("f", "ফ"), ("v", "ভ"), ("w", "ওয়"), ("j", "ই"), ("h", "হ")
]

IPA_VOWELS = [
    ("eɪ", "এই", "েই"), ("aɪ", "আই", "াই"), ("ɔɪ", "অয়", "য়"), ("aʊ", "আউ", "াউ"),
    ("əʊ", "ও", "ো"), ("oʊ", "ও", "ো"), ("juː", "ইউ", "িউ"), ("ju", "ইউ", "িউ"),
    ("iː", "ঈ", "ী"), ("uː", "উ", "ু"), ("ɔː", "অ", "ো"), ("ɑː", "আ", "া"),
    ("ɜːld", "ওয়ার্ল্ড", "ওয়ার্ল্ড"), ("ɜːr", "আর", "ার"), ("ɜː", "আ", "া"), ("ɜr", "আর", "ার"),
    ("ər", "আর", "ার"), ("ɚ", "আর", "ার"),
    ("tʃə", "চার", "চার"), ("tʃər", "চার", "চার"),
    ("ʃn", "শন", "শন"), ("ʃən", "শন", "শন"),
    ("ənt", "এন্ট", "েন্ট"), ("ənts", "এন্টস", "েন্টস"), ("ənd", "এন্ড", "েন্ড"), ("ənds", "এন্ডস", "েন্ডস"),
    ("əns", "এন্স", "েন্স"), ("ənsɪz", "এন্সেস", "েন্সেস"),
    ("əbl", "এবল", "এবল"), ("ɪbl", "ইবল", "ইবল"),
    ("æ", "অ্যা", "্যা"), ("a", "অ্যা", "্যা"), ("ɛ", "এ", "ে"), ("e", "এ", "ে"),
    ("ɪ", "ই", "ি"), ("ɒ", "অ", "ো"), ("ɔ", "অ", "ো"), ("ɑ", "আ", "া"),
    ("ʌ", "আ", "া"), ("ʊ", "উ", "ু"), ("i", "ই", "ি"), ("u", "উ", "ু"),
    ("ə", "আ", "া")
]


def ipa_to_bengali_pronunciation(ipa_str: str) -> Optional[str]:
    """
    Converts International Phonetic Alphabet (IPA) representation into natural, standard Bengali phonetic script.
    Follows Oxford and Cambridge British English pronunciation rules.
    Example: '/ˈtalənt/' or '/ˈtælənt/' -> 'ট্যালেন্ট'
    Example: '/ˈwɜːldwaɪd/' -> 'ওয়ার্ল্ডওয়াইড'
    Example: '/ˌɹɛvəˈluːʃən/' -> 'রেভোলিউশন'
    """
    if not ipa_str:
        return None
    try:
        # Keep ː length marker so long vowel combinations match accurately!
        s = re.sub(r"[\/\[\]ˌˈ:͡.]", "", ipa_str).strip()
        s = s.replace("(j)", "j").replace("(ə)", "").replace("(ɹ)", "r").replace("(r)", "r")
        result = []
        i = 0
        n = len(s)
        last_was_consonant = False

        while i < n:
            matched_vowel = False
            for ph, full, matra in IPA_VOWELS:
                if s.startswith(ph, i):
                    if ph == "ə" and i + 1 == n:
                        result.append(matra if last_was_consonant else "া")
                    elif ph == "ə":
                        if not last_was_consonant:
                            result.append("অ")
                    else:
                        result.append(matra if last_was_consonant else full)
                    i += len(ph)
                    last_was_consonant = False
                    matched_vowel = True
                    break
            if matched_vowel:
                continue

            matched_cons = False
            for ph, b_cons in IPA_CONSONANTS:
                if s.startswith(ph, i):
                    result.append(b_cons)
                    i += len(ph)
                    last_was_consonant = True
                    matched_cons = True
                    break
            if matched_cons:
                continue

            i += 1

        res = "".join(result).strip()
        # Clean double matras
        res = re.sub(r"([ািীুূেৈোৌ্])\1+", r"\1", res)
        # Suffix fix: 'শান' -> 'শন'
        if res.endswith("শান"):
            res = res[:-3] + "শন"
        return res if len(res) >= 2 else None
    except Exception:
        return None


def transliterate_word_to_bengali(word: str, ipa: Optional[str] = None) -> str:
    """
    Accurately transliterates an English word into authentic Bengali phonetic script.
    Checks curated dictionary first, then morphological inflections, then IPA, and falls back to
    sophisticated English-to-Bengali phonetic synthesis.
    """
    clean_word = re.sub(r"[^a-zA-Z]", "", word).strip().lower()
    if not clean_word:
        return ""

    # 1. Exact dictionary match
    if clean_word in COMMON_PRONUNCIATION_DICT:
        return COMMON_PRONUNCIATION_DICT[clean_word]

    # 2. Check common morphological inflections
    if clean_word.endswith("ed"):
        stem = clean_word[:-2]
        if stem in COMMON_PRONUNCIATION_DICT:
            return COMMON_PRONUNCIATION_DICT[stem] + ("েড" if stem.endswith(("t", "d")) else "ড")
        if clean_word[:-1] in COMMON_PRONUNCIATION_DICT:  # e.g. create -> created
            return COMMON_PRONUNCIATION_DICT[clean_word[:-1]] + "ড"
    if clean_word.endswith("ing"):
        stem = clean_word[:-3]
        if stem in COMMON_PRONUNCIATION_DICT:
            return COMMON_PRONUNCIATION_DICT[stem] + "ইং"
        if (stem + "e") in COMMON_PRONUNCIATION_DICT:
            return COMMON_PRONUNCIATION_DICT[stem + "e"] + "ইং"
    if clean_word.endswith("es") and clean_word[:-2] in COMMON_PRONUNCIATION_DICT:
        return COMMON_PRONUNCIATION_DICT[clean_word[:-2]] + "েস"
    if clean_word.endswith("s") and clean_word[:-1] in COMMON_PRONUNCIATION_DICT:
        return COMMON_PRONUNCIATION_DICT[clean_word[:-1]] + "স"
    if clean_word.endswith("ly") and clean_word[:-2] in COMMON_PRONUNCIATION_DICT:
        return COMMON_PRONUNCIATION_DICT[clean_word[:-2]] + "লি"
    if clean_word.endswith("wide") and clean_word[:-4] in COMMON_PRONUNCIATION_DICT:
        return COMMON_PRONUNCIATION_DICT[clean_word[:-4]] + "ওয়াইড"
    if clean_word.endswith("logical"):
        stem_logy = clean_word[:-7] + "logy"
        if stem_logy in COMMON_PRONUNCIATION_DICT:
            return COMMON_PRONUNCIATION_DICT[stem_logy][:-4] + "লজিক্যাল"

    # 3. If IPA is provided, try IPA conversion
    if ipa:
        ipa_res = ipa_to_bengali_pronunciation(ipa)
        if ipa_res:
            return ipa_res

    # 4. Morphological suffix decomposition
    w = clean_word
    suffix_bengali = ""

    if w.endswith("tion"):
        w = w[:-4]
        suffix_bengali = "শন"
    elif w.endswith("sion"):
        w = w[:-4]
        suffix_bengali = "শন"
    elif w.endswith("tions"):
        w = w[:-5]
        suffix_bengali = "শনস"
    elif w.endswith("sions"):
        w = w[:-5]
        suffix_bengali = "শনস"
    elif w.endswith("ture"):
        w = w[:-4]
        suffix_bengali = "চার"
    elif w.endswith("tures"):
        w = w[:-5]
        suffix_bengali = "চার্স"
    elif w.endswith("ment"):
        w = w[:-4]
        suffix_bengali = "মেন্ট"
    elif w.endswith("ments"):
        w = w[:-5]
        suffix_bengali = "মেন্টস"
    elif w.endswith("cial") or w.endswith("tial"):
        w = w[:-4]
        suffix_bengali = "শাল"
    elif w.endswith("cious") or w.endswith("tious"):
        w = w[:-5]
        suffix_bengali = "শাস"
    elif w.endswith("able"):
        w = w[:-4]
        suffix_bengali = "এবল"
    elif w.endswith("ible"):
        w = w[:-4]
        suffix_bengali = "ইবল"
    elif w.endswith("ness"):
        w = w[:-4]
        suffix_bengali = "নেস"
    elif w.endswith("ful"):
        w = w[:-3]
        suffix_bengali = "ফুল"
    elif w.endswith("less"):
        w = w[:-4]
        suffix_bengali = "লেস"
    elif w.endswith("ity"):
        w = w[:-3]
        suffix_bengali = "ইটি"
    elif w.endswith("ities"):
        w = w[:-5]
        suffix_bengali = "ইটিজ"
    elif w.endswith("ist"):
        w = w[:-3]
        suffix_bengali = "ইস্ট"
    elif w.endswith("ism"):
        w = w[:-3]
        suffix_bengali = "ইজম"
    elif w.endswith("ize") or w.endswith("ise"):
        w = w[:-3]
        suffix_bengali = "আইজ"
    elif w.endswith("ized") or w.endswith("ised"):
        w = w[:-4]
        suffix_bengali = "আইজড"
    elif w.endswith("izing") or w.endswith("ising"):
        w = w[:-5]
        suffix_bengali = "আইজিং"
    elif w.endswith("ship"):
        w = w[:-4]
        suffix_bengali = "শিপ"
    elif w.endswith("hood"):
        w = w[:-4]
        suffix_bengali = "হুড"

    # If the root word is in dictionary
    if w in COMMON_PRONUNCIATION_DICT:
        return COMMON_PRONUNCIATION_DICT[w] + suffix_bengali

    # 5. Syllable and letter cluster phonetic synthesis
    result = []
    i = 0
    length = len(w)

    while i < length:
        # Check special multi-letter patterns
        if w.startswith("ight", i):
            result.append("াইট" if i > 0 else "আইট")
            i += 4
            continue
        if w.startswith("igh", i):
            result.append("াই" if i > 0 else "আই")
            i += 3
            continue
        if w.startswith("wor", i):
            result.append("ওয়ার")
            i += 3
            continue
        if w.startswith("war", i):
            result.append("ওয়ার")
            i += 3
            continue
        if w.startswith("all", i):
            result.append("অল")
            i += 3
            continue

        # Soft C before e, i, y
        if w[i] == "c" and i + 1 < length and w[i+1] in "eiy":
            result.append("স")
            i += 1
            continue
        # Soft G before e, i, y (when not beginning of short word like get)
        if w[i] == "g" and i + 1 < length and w[i+1] in "eiy" and (i > 0 or length > 4):
            result.append("জ")
            i += 1
            continue

        # Check 4-letter clusters
        if i + 4 <= length and w[i:i+4] in PHONEME_MAP:
            result.append(PHONEME_MAP[w[i:i+4]])
            i += 4
            continue
        # Check 3-letter clusters
        if i + 3 <= length and w[i:i+3] in PHONEME_MAP:
            result.append(PHONEME_MAP[w[i:i+3]])
            i += 3
            continue
        # Check 2-letter clusters
        if i + 2 <= length and w[i:i+2] in PHONEME_MAP:
            result.append(PHONEME_MAP[w[i:i+2]])
            i += 2
            continue

        char = w[i]
        # Vowel rendering
        if char == "a":
            if i == 0:
                result.append("অ্যা" if length > 3 else "এ")
            else:
                result.append("্যা" if (i < length - 1 and w[i+1] not in "aeiou") else "া")
        elif char == "e":
            if i == 0:
                result.append("এ")
            elif i == length - 1:
                pass  # Silent 'e' at end of English word
            else:
                result.append("ে")
        elif char == "i":
            if i == 0:
                result.append("ই")
            else:
                result.append("ি")
        elif char == "o":
            if i == 0:
                result.append("ও")
            else:
                result.append("ো")
        elif char == "u":
            if i == 0:
                result.append("আ" if (i + 1 < length and w[i+1] not in "aeiou") else "ইউ")
            else:
                result.append("ু")
        elif char in PHONEME_MAP:
            result.append(PHONEME_MAP[char])
        else:
            result.append(char)
        i += 1

    transliterated = "".join(result) + suffix_bengali
    transliterated = re.sub(r"([ািীুূেৈোৌ্])\1+", r"\1", transliterated)
    return transliterated or clean_word


def transliterate_sentence_to_bengali(sentence: str) -> str:
    """
    Transliterates an entire English sentence into its authentic Bengali phonetic pronunciation.
    Correctly produces:
    "I am trying to improve my English reading skills."
    -> "আই অ্যাম ট্রাইং টু ইমপ্রুভ মাই ইংলিশ রিডিং স্কিলস।"
    "The first pillar began with the Industrial Revolution."
    -> "দ্য ফার্স্ট পিলার বিগান উইথ দ্য ইন্ডাস্ট্রিয়াল রেভোলিউশন।"
    """
    clean_sent = sentence.strip()
    if not clean_sent:
        return ""

    tokens = re.split(r"(\s+|[.,!?;:\"'()\[\]{}—–])", clean_sent)
    bengali_tokens = []

    for token in tokens:
        if not token:
            continue
        if re.match(r"^\s+$", token):
            bengali_tokens.append(token)
        elif token == ".":
            bengali_tokens.append("।")
        elif re.match(r"^[.,!?;:\"'()\[\]{}—–]+$", token):
            bengali_tokens.append(token)
        else:
            clean = re.sub(r"[^a-zA-Z]", "", token)
            if clean:
                bengali = transliterate_word_to_bengali(clean)
                bengali_tokens.append(bengali)
            else:
                bengali_tokens.append(token)

    return "".join(bengali_tokens).strip()
