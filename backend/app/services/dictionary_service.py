import re
from typing import Dict, Any, Optional
from app.services.bengali_phonetics import transliterate_word_to_bengali

# Curated high-utility dictionary with comprehensive definitions, POS, IPA, examples
LOCAL_DICTIONARY: Dict[str, Dict[str, Any]] = {
    "student": {
        "bengali_pronunciation": "স্টুডেন্ট",
        "bengali_meaning": "শিক্ষার্থী / ছাত্র / ছাত্রী",
        "english_definition": "A person who is studying at a school, college, or university.",
        "ipa_phonetic": "/ˈstjuː.dənt/",
        "part_of_speech": "noun",
        "example_sentence": "She is an ambitious student who loves learning new languages.",
        "bengali_example": "তিনি একজন উচ্চাকাঙ্ক্ষী শিক্ষার্থী যিনি নতুন ভাষা শিখতে ভালোবাসেন।"
    },
    "significant": {
        "bengali_pronunciation": "সিগনিফিক্যান্ট",
        "bengali_meaning": "গুরুত্বপূর্ণ / তাৎপর্যপূর্ণ",
        "english_definition": "Sufficiently great or important to be worthy of attention; noteworthy.",
        "ipa_phonetic": "/sɪɡˈnɪf.ɪ.kənt/",
        "part_of_speech": "adjective",
        "example_sentence": "There has been a significant improvement in his reading comprehension.",
        "bengali_example": "তার পড়ার বোধগম্যতায় একটি গুরুত্বপূর্ণ উন্নতি হয়েছে।"
    },
    "resilience": {
        "bengali_pronunciation": "রেজিলিয়েন্স",
        "bengali_meaning": "প্রতিকূলতা কাটিয়ে ওঠার ক্ষমতা / সহনশীলতা",
        "english_definition": "The capacity to recover quickly from difficulties; toughness.",
        "ipa_phonetic": "/rɪˈzɪl.jəns/",
        "part_of_speech": "noun",
        "example_sentence": "Courage and resilience are essential for overcoming life's hurdles.",
        "bengali_example": "জীবনের বাধা অতিক্রম করার জন্য সাহস এবং সহনশীলতা অপরিহার্য।"
    },
    "improve": {
        "bengali_pronunciation": "ইমপ্রুভ",
        "bengali_meaning": "উন্নত করা / উন্নতি সাধন করা",
        "english_definition": "Make or become better.",
        "ipa_phonetic": "/ɪmˈpruːv/",
        "part_of_speech": "verb",
        "example_sentence": "Daily practice will help you improve your vocabulary quickly.",
        "bengali_example": "দৈনিক অনুশীলন আপনার শব্দভাণ্ডার দ্রুত উন্নত করতে সহায়তা করবে।"
    },
    "vocabulary": {
        "bengali_pronunciation": "ভোকাবুলারি",
        "bengali_meaning": "শব্দভাণ্ডার / শব্দসম্ভার",
        "english_definition": "A body of words used in a particular language or activity.",
        "ipa_phonetic": "/vəˈkæb.jʊ.lər.i/",
        "part_of_speech": "noun",
        "example_sentence": "Reading books is one of the best ways to expand your vocabulary.",
        "bengali_example": "বই পড়া আপনার শব্দভাণ্ডার বৃদ্ধি করার অন্যতম সেরা উপায়।"
    },
    "fluency": {
        "bengali_pronunciation": "ফ্লুয়েন্সি",
        "bengali_meaning": "সাবলীলতা / অনর্গল কথা বলার দক্ষতা",
        "english_definition": "The ability to speak or write a foreign language easily and accurately.",
        "ipa_phonetic": "/ˈfluː.ən.si/",
        "part_of_speech": "noun",
        "example_sentence": "He achieved English fluency after six months of consistent reading.",
        "bengali_example": "ছয় মাসের নিয়মিত পড়ার পর তিনি ইংরেজিতে সাবলীলতা অর্জন করেন।"
    },
    "comprehension": {
        "bengali_pronunciation": "কম্প্রিহেনশন",
        "bengali_meaning": "বোধগম্যতা / উপলব্ধি করার ক্ষমতা",
        "english_definition": "The ability to understand something completely.",
        "ipa_phonetic": "/ˌkɒm.prɪˈhen.ʃən/",
        "part_of_speech": "noun",
        "example_sentence": "Reading context clues improves your overall reading comprehension.",
        "bengali_example": "প্রসঙ্গের সূত্র পড়া সামগ্রিক পাঠের বোধগম্যতা উন্নত করে।"
    },
    "knowledge": {
        "bengali_pronunciation": "নলেজ",
        "bengali_meaning": "জ্ঞান / পাণ্ডিত্য",
        "english_definition": "Facts, information, and skills acquired through experience or education.",
        "ipa_phonetic": "/ˈnɒl.ɪdʒ/",
        "part_of_speech": "noun",
        "example_sentence": "Knowledge is a powerful tool for personal development.",
        "bengali_example": "জ্ঞান ব্যক্তিগত উন্নয়নের জন্য একটি শক্তিশালী হাতিয়ার।"
    },
    "opportunity": {
        "bengali_pronunciation": "অপরচুনিটি",
        "bengali_meaning": "সুযোগ / সম্ভাবনা",
        "english_definition": "A set of circumstances that makes it possible to do something.",
        "ipa_phonetic": "/ˌɒp.əˈtjuː.nə.ti/",
        "part_of_speech": "noun",
        "example_sentence": "This scholarship offers a great opportunity to study abroad.",
        "bengali_example": "এই বৃত্তি বিদেশে পড়ার একটি দারুণ সুযোগ দেয়।"
    },
    "challenge": {
        "bengali_pronunciation": "চ্যালেঞ্জ",
        "bengali_meaning": "চ্যালেঞ্জ / কঠিন প্রতিদ্বন্দ্বিতা",
        "english_definition": "A task or situation that tests someone's abilities.",
        "ipa_phonetic": "/ˈtʃæl.ɪndʒ/",
        "part_of_speech": "noun / verb",
        "example_sentence": "Embrace every challenge as an opportunity to grow stronger.",
        "bengali_example": "প্রতিটি চ্যালেঞ্জকে আরও শক্তিশালী হওয়ার সুযোগ হিসেবে গ্রহণ করুন।"
    },
    "education": {
        "bengali_pronunciation": "এডুকেশন",
        "bengali_meaning": "শিক্ষা / প্রশিক্ষণ",
        "english_definition": "The process of receiving or giving systematic instruction.",
        "ipa_phonetic": "/ˌedʒ.ʊˈkeɪ.ʃən/",
        "part_of_speech": "noun",
        "example_sentence": "Quality education empowers individuals to build a brighter future.",
        "bengali_example": "মানসম্মত শিক্ষা ব্যক্তিদের একটি উজ্জ্বল ভবিষ্যৎ গড়তে সক্ষম করে।"
    },
    "technology": {
        "bengali_pronunciation": "টেকনোলজি",
        "bengali_meaning": "প্রযুক্তি",
        "english_definition": "The application of scientific knowledge for practical purposes.",
        "ipa_phonetic": "/tekˈnɒl.ə.dʒi/",
        "part_of_speech": "noun",
        "example_sentence": "Modern technology makes language learning accessible anywhere.",
        "bengali_example": "আধুনিক প্রযুক্তি যেকোনো জায়গায় ভাষা শিক্ষাকে সহজলভ্য করে তোলে।"
    },
    "development": {
        "bengali_pronunciation": "ডেভেলপমেন্ট",
        "bengali_meaning": "উন্নয়ন / বিকাশ",
        "english_definition": "The process of developing or being developed.",
        "ipa_phonetic": "/dɪˈvel.əp.mənt/",
        "part_of_speech": "noun",
        "example_sentence": "Continuous skill development is essential in today's workforce.",
        "bengali_example": "আজকের কর্মক্ষেত্রে অবিচ্ছিন্ন দক্ষতা উন্নয়ন অপরিহার্য।"
    },
    "confidence": {
        "bengali_pronunciation": "কনফিডেন্স",
        "bengali_meaning": "আত্মবিশ্বাস / বিশ্বাস",
        "english_definition": "A feeling of self-assurance arising from one's appreciation of one's abilities.",
        "ipa_phonetic": "/ˈkɒn.fɪ.dəns/",
        "part_of_speech": "noun",
        "example_sentence": "Speaking regularly will give you the confidence you need.",
        "bengali_example": "নিয়মিত কথা বলা আপনাকে প্রয়োজনীয় আত্মবিশ্বাস যোগাবে।"
    },
    "perseverance": {
        "bengali_pronunciation": "পারসিভিয়ারেন্স",
        "bengali_meaning": "অধ্যবসায় / দৃঢ় সংকল্প",
        "english_definition": "Persistence in doing something despite difficulty or delay in achieving success.",
        "ipa_phonetic": "/ˌpɜː.sɪˈvɪə.rəns/",
        "part_of_speech": "noun",
        "example_sentence": "His perseverance was rewarded when he mastered the language.",
        "bengali_example": "তার অধ্যবসায়ের ফল পাওয়া গেল যখন সে ভাষাটিতে দক্ষতা অর্জন করল।"
    },
    "meticulous": {
        "bengali_pronunciation": "মেটিকুলাস",
        "bengali_meaning": "খুঁতখুঁতে / অত্যন্ত সতর্ক ও নিখুঁত",
        "english_definition": "Showing great attention to detail; very careful and precise.",
        "ipa_phonetic": "/məˈtɪk.jʊ.ləs/",
        "part_of_speech": "adjective",
        "example_sentence": "She did meticulous research before writing the analytical essay.",
        "bengali_example": "বিশ্লেষণমূলক প্রবন্ধটি লেখার আগে তিনি অত্যন্ত সতর্ক গবেষণা করেছিলেন।"
    },
    "pragmatic": {
        "bengali_pronunciation": "প্র্যাগম্যাটিক",
        "bengali_meaning": "বাস্তবধর্মী / প্রয়োগমূলক",
        "english_definition": "Dealing with things sensibly and realistically based on practical considerations.",
        "ipa_phonetic": "/præɡˈmæt.ɪk/",
        "part_of_speech": "adjective",
        "example_sentence": "We need a pragmatic approach to solve this educational barrier.",
        "bengali_example": "এই শিক্ষামূলক বাধা সমাধানের জন্য আমাদের একটি বাস্তবমুখী পন্থা প্রয়োজন।"
    },
    "authentic": {
        "bengali_pronunciation": "অথেনটিক",
        "bengali_meaning": "আসল / খাঁটি / প্রামাণ্য",
        "english_definition": "Of undisputed origin; genuine and true.",
        "ipa_phonetic": "/ɔːˈθen.tɪk/",
        "part_of_speech": "adjective",
        "example_sentence": "Reading authentic articles improves natural language intuition.",
        "bengali_example": "প্রামাণ্য প্রবন্ধ পড়া স্বাভাবিক ভাষার বোধশক্তি উন্নত করে।"
    },
    "curiosity": {
        "bengali_pronunciation": "কিউরিওসিটি",
        "bengali_meaning": "কৌতূহল / জানার আগ্রহ",
        "english_definition": "A strong desire to know or learn something.",
        "ipa_phonetic": "/ˌkjʊə.riˈɒs.ə.ti/",
        "part_of_speech": "noun",
        "example_sentence": "Intellectual curiosity fuels lifelong learning and discovery.",
        "bengali_example": "বুদ্ধিবৃত্তিক কৌতূহল আজীবন শিক্ষা এবং আবিষ্কারকে উৎসাহিত করে।"
    },
    "ubiquitous": {
        "bengali_pronunciation": "ইউবিকুইটাস",
        "bengali_meaning": "সর্বব্যাপী / সর্বত্র বিদ্যমান",
        "english_definition": "Present, appearing, or found everywhere.",
        "ipa_phonetic": "/juːˈbɪk.wɪ.təs/",
        "part_of_speech": "adjective",
        "example_sentence": "Smartphones have become ubiquitous in modern everyday life.",
        "bengali_example": "স্মার্টফোন আধুনিক দৈনন্দিন জীবনে সর্বত্র বিদ্যমান হয়ে উঠেছে।"
    }
}

def lookup_local_word(word: str) -> Optional[Dict[str, Any]]:
    clean = re.sub(r"[^a-zA-Z]", "", word).strip().lower()
    if clean in LOCAL_DICTIONARY:
        data = LOCAL_DICTIONARY[clean].copy()
        data["word"] = clean
        return data

    # Check common stem matches (e.g., removing s, ed, ing)
    stems = []
    if clean.endswith("s") and len(clean) > 3:
        stems.append(clean[:-1])
    if clean.endswith("es") and len(clean) > 4:
        stems.append(clean[:-2])
    if clean.endswith("ed") and len(clean) > 4:
        stems.append(clean[:-2])
    if clean.endswith("ing") and len(clean) > 5:
        stems.append(clean[:-3])
        stems.append(clean[:-3] + "e")

    for stem in stems:
        if stem in LOCAL_DICTIONARY:
            data = LOCAL_DICTIONARY[stem].copy()
            data["word"] = clean
            data["bengali_pronunciation"] = transliterate_word_to_bengali(clean)
            return data

    return None

def generate_fallback_word_entry(word: str, context_sentence: Optional[str] = None) -> Dict[str, Any]:
    clean = re.sub(r"[^a-zA-Z]", "", word).strip().lower()
    bengali_pron = transliterate_word_to_bengali(clean)
    
    return {
        "word": clean,
        "original_word": word,
        "bengali_pronunciation": bengali_pron,
        "bengali_meaning": f"'{word}'-এর পারিভাষিক অর্থ",
        "english_definition": f"Definition of '{word}' in contextual usage.",
        "ipa_phonetic": None,
        "part_of_speech": "word",
        "example_sentence": context_sentence or f"The word '{word}' was encountered while reading.",
        "bengali_example": f"পড়ার সময় '{word}' শব্দটি পাওয়া গেছে।"
    }
