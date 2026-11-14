import json
import re
import urllib.parse
import httpx
from typing import Dict, Any, Optional, List
from app.config import settings
from app.services.bengali_phonetics import transliterate_word_to_bengali, transliterate_sentence_to_bengali
from app.services.dictionary_service import lookup_local_word

# Initialize Gemini Client if key is available
gemini_client = None
if settings.GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        print(f"Warning: Could not initialize Gemini client: {e}")


async def enrich_word_relations(words: List[str]) -> List[Dict[str, str]]:
    """
    Takes a list of English words (synonyms or antonyms) and enriches each with its
    Bengali phonetic pronunciation and Bengali meaning.
    """
    results = []
    clean_words = list(dict.fromkeys([re.sub(r"[^a-zA-Z]", "", w).strip().lower() for w in words if w]))[:3]
    if not clean_words:
        return results

    async with httpx.AsyncClient(timeout=3.0) as client:
        for w in clean_words:
            if not w or len(w) < 2:
                continue
            pron = transliterate_word_to_bengali(w)
            meaning = ""
            try:
                r = await client.get(
                    f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q={w}",
                    headers={"User-Agent": "Mozilla/5.0"}
                )
                if r.status_code == 200:
                    data = r.json()
                    meaning = data[0][0][0] if (data and data[0] and data[0][0]) else ""
            except Exception:
                meaning = ""

            results.append({
                "word": w,
                "bengali_pronunciation": pron,
                "bengali_meaning": meaning or w
            })

    return results


async def fetch_online_bengali_dictionary(word: str, context_sentence: Optional[str] = None) -> Dict[str, Any]:
    """
    Fetches genuine Bengali meanings, part of speech, IPA phonetics, English definitions,
    and contextual synonyms and antonyms with Bengali pronunciations and meanings.
    """
    clean = re.sub(r"[^a-zA-Z]", "", word).strip().lower()
    bengali_pron = transliterate_word_to_bengali(clean)
    
    bengali_meaning = ""
    part_of_speech = ""
    english_definition = ""
    ipa_phonetic = None
    example_sentence = context_sentence or f"The word '{clean}' is frequently used in modern English."
    bengali_example = ""
    raw_synonyms = []
    raw_antonyms = []

    # 1. Fetch Bengali meaning from translation and bilingual dictionary API
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&dt=bd&q={clean}"
            r = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            if r.status_code == 200:
                data = r.json()
                primary = data[0][0][0] if (data and data[0] and data[0][0]) else ""
                meanings = []
                if len(data) > 1 and data[1]:
                    for group in data[1]:
                        if not part_of_speech:
                            part_of_speech = group[0]
                        meanings.extend(group[1][:4])
                
                # Combine primary + alternate dictionary meanings
                combined = [primary] + [m for m in meanings if m != primary]
                bengali_meaning = " / ".join(combined[:4]) if combined else primary
    except Exception as e:
        print(f"Online Bengali dictionary lookup notice: {e}")

    # 2. Fetch English definition, IPA, and raw synonyms & antonyms
    try:
        async with httpx.AsyncClient(timeout=3.5) as client:
            r = await client.get(f"https://api.dictionaryapi.dev/api/v2/entries/en/{clean}", headers={"User-Agent": "Mozilla/5.0"})
            if r.status_code == 200:
                entries = r.json()
                if isinstance(entries, list) and len(entries) > 0:
                    data = entries[0]
                    ipa_phonetic = data.get("phonetic")
                    if not ipa_phonetic and "phonetics" in data and isinstance(data["phonetics"], list):
                        for p in data["phonetics"]:
                            if p.get("text"):
                                ipa_phonetic = p["text"]
                                if "uk" in p.get("audio", "").lower():
                                    break
                    if not part_of_speech and data.get("meanings"):
                        part_of_speech = data["meanings"][0].get("partOfSpeech")
                    if data.get("meanings"):
                        for m in data["meanings"]:
                            raw_synonyms.extend(m.get("synonyms", []))
                            raw_antonyms.extend(m.get("antonyms", []))
                            for d in m.get("definitions", []):
                                raw_synonyms.extend(d.get("synonyms", []))
                                raw_antonyms.extend(d.get("antonyms", []))
                                if d.get("definition") and not english_definition:
                                    english_definition = d.get("definition")
                                if d.get("example") and not context_sentence:
                                    example_sentence = d.get("example")
    except Exception as e:
        print(f"Online English definition lookup notice: {e}")

    # 3. Datamuse fallback for synonyms & antonyms if empty
    if not raw_synonyms or not raw_antonyms:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                if not raw_synonyms:
                    syn_res = await client.get(f"https://api.datamuse.com/words?rel_syn={clean}&max=4")
                    if syn_res.status_code == 200:
                        raw_synonyms.extend([item["word"] for item in syn_res.json()])
                if not raw_antonyms:
                    ant_res = await client.get(f"https://api.datamuse.com/words?rel_ant={clean}&max=4")
                    if ant_res.status_code == 200:
                        raw_antonyms.extend([item["word"] for item in ant_res.json()])
        except Exception as e:
            print(f"Datamuse relation lookup notice: {e}")

    # 4. Enrich synonyms and antonyms with Bengali pronunciation and meaning
    bengali_pron = transliterate_word_to_bengali(clean, ipa_phonetic)
    enriched_synonyms = await enrich_word_relations(raw_synonyms)
    enriched_antonyms = await enrich_word_relations(raw_antonyms)

    # 5. Translate context sentence to Bengali if provided
    if context_sentence and not bengali_example:
        try:
            trans = await translate_text(context_sentence)
            bengali_example = trans.get("bengali_translation", "")
        except Exception:
            pass

    if not bengali_meaning:
        bengali_meaning = f"{clean} (অর্থ লোড হচ্ছে)"
    if not english_definition:
        english_definition = f"Definition and contextual usage of '{clean}'."

    return {
        "word": clean,
        "original_word": word,
        "bengali_pronunciation": bengali_pron,
        "bengali_meaning": bengali_meaning,
        "english_definition": english_definition,
        "ipa_phonetic": ipa_phonetic,
        "part_of_speech": part_of_speech or "word",
        "example_sentence": example_sentence,
        "bengali_example": bengali_example,
        "synonyms": enriched_synonyms,
        "antonyms": enriched_antonyms,
    }


async def lookup_word_with_context(word: str, context_sentence: Optional[str] = None) -> Dict[str, Any]:
    """
    Looks up an English word, determining its contextual meaning if surrounding sentence is provided.
    Includes rich synonyms and antonyms with Bengali pronunciations and meanings.
    """
    clean_word = re.sub(r"[^a-zA-Z]", "", word).strip().lower()
    
    # Try AI lookup if Gemini client is active
    if gemini_client:
        try:
            prompt = f"""You are an expert bilingual English-Bengali linguist and dictionary system.
Given the English word: "{clean_word}"
Context sentence where it appears: "{context_sentence or 'N/A'}"

Provide a JSON response with:
1. "bengali_pronunciation": Accurate Bengali phonetic script pronunciation of the word (বাংলা উচ্চারণ, e.g., "স্টুডেন্ট", "সিগনিফিক্যান্ট").
2. "bengali_meaning": Natural, contextual Bengali meaning (বাংলা অর্থ, e.g. "অভিজ্ঞতা লাভ করা / পরিবর্তন বা প্রক্রিয়ার ভেতর দিয়ে যাওয়া").
3. "english_definition": Clear and concise English definition fitting the context.
4. "ipa_phonetic": International Phonetic Alphabet (IPA).
5. "part_of_speech": noun, verb, adjective, adverb, etc.
6. "example_sentence": A natural English example sentence.
7. "bengali_example": Bengali translation of the example sentence.
8. "synonyms": Array of up to 3 objects: [{{"word": "synonym", "bengali_pronunciation": "বাংলা উচ্চারণ", "bengali_meaning": "বাংলা অর্থ"}}]
9. "antonyms": Array of up to 3 objects: [{{"word": "antonym", "bengali_pronunciation": "বাংলা উচ্চারণ", "bengali_meaning": "বাংলা অর্থ"}}]

Respond ONLY with valid JSON, no markdown formatting or backticks:
"""
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            text = response.text.strip()
            if text.startswith("```"):
                text = re.sub(r"^```(?:json)?\n?", "", text)
                text = re.sub(r"\n?```$", "", text)
            data = json.loads(text.strip())
            return {
                "word": clean_word,
                "original_word": word,
                "bengali_pronunciation": data.get("bengali_pronunciation") or transliterate_word_to_bengali(clean_word),
                "bengali_meaning": data.get("bengali_meaning", ""),
                "english_definition": data.get("english_definition", ""),
                "ipa_phonetic": data.get("ipa_phonetic", ""),
                "part_of_speech": data.get("part_of_speech", ""),
                "example_sentence": data.get("example_sentence", ""),
                "bengali_example": data.get("bengali_example", ""),
                "synonyms": data.get("synonyms", []),
                "antonyms": data.get("antonyms", [])
            }
        except Exception as e:
            print(f"AI Word Lookup notice: {e}, falling back to dictionary pipeline")

    # Local curated dictionary check
    local_data = lookup_local_word(clean_word)
    if local_data and local_data.get("synonyms"):
        local_data["original_word"] = word
        return local_data

    # Live bilingual dictionary API with synonyms and antonyms
    return await fetch_online_bengali_dictionary(clean_word, context_sentence)


async def translate_text(text: str, context: Optional[str] = None) -> Dict[str, str]:
    """
    Translates English sentence/text into natural Bengali and produces its Bengali phonetic pronunciation.
    """
    clean_text = text.strip()
    
    # Try AI translation if available
    if gemini_client:
        try:
            prompt = f"""You are an expert English to Bengali translator.
Translate the following English sentence to natural, idiomatic Bengali, and also provide the Bengali phonetic pronunciation of the English sentence (বাংলা লিপিতে ইংরেজি উচ্চারণ).
English: "{clean_text}"
Context: "{context or 'General'}"

Return JSON ONLY:
{{
  "bengali_translation": "সঠিক ও সাবলীল বাংলা অনুবাদ",
  "bengali_pronunciation": "পুরো ইংরেজি বাক্যটির বাংলা অক্ষরে সঠিক উচ্চারণ"
}}
"""
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = re.sub(r"^```(?:json)?\n?", "", raw)
                raw = re.sub(r"\n?```$", "", raw)
            res = json.loads(raw.strip())
            return {
                "source_text": clean_text,
                "bengali_translation": res.get("bengali_translation", ""),
                "bengali_pronunciation": res.get("bengali_pronunciation") or transliterate_sentence_to_bengali(clean_text)
            }
        except Exception as e:
            print(f"AI Translation notice: {e}, falling back to translation API")

    # High quality instant translation API
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            encoded = urllib.parse.quote(clean_text)
            url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q={encoded}"
            r = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            if r.status_code == 200:
                data = r.json()
                translated = "".join(segment[0] for segment in data[0] if segment and segment[0])
                if translated.strip():
                    return {
                        "source_text": clean_text,
                        "bengali_translation": translated.strip(),
                        "bengali_pronunciation": transliterate_sentence_to_bengali(clean_text)
                    }
    except Exception as e:
        print(f"Online sentence translation notice: {e}")

    # Fallback to local rule engine
    bengali_pron = transliterate_sentence_to_bengali(clean_text)
    return {
        "source_text": clean_text,
        "bengali_translation": f"'{clean_text}' - বাক্যটির ভাবানুবাদ।",
        "bengali_pronunciation": bengali_pron
    }


async def generate_ai_assistant_explanation(text: str, context: Optional[str] = None, mode: str = "explain_word") -> Dict[str, Any]:
    """
    Generates rich contextual language assistance:
    - Difficult English vocabulary in context
    - Complex sentences breakdown
    - Idioms and phrases
    - Grammar structures
    """
    clean_text = text.strip()
    
    if gemini_client:
        try:
            prompt = f"""You are a patient and encouraging English tutor for Bengali native speakers.
Student query text: "{clean_text}"
Surrounding context/paragraph: "{context or 'N/A'}"
Analysis mode: "{mode}" (explain_word, explain_sentence, grammar, idiom, breakdown)

Provide a detailed response in JSON:
{{
  "result": "Clear summary in English and Bengali",
  "bengali_explanation": "Detailed explanation written in friendly, easy-to-understand Bengali (সহজ ভাষায় বিস্তারিত বাংলা ব্যাখ্যা)",
  "grammar_notes": ["Grammar point 1 in Bengali", "Grammar point 2 in Bengali"],
  "vocabulary_breakdown": [{{"word": "example", "bengali_meaning": "উদাহরণ", "role": "noun"}}],
  "related_phrases": ["Similar useful phrase 1", "Similar useful phrase 2"]
}}
"""
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = re.sub(r"^```(?:json)?\n?", "", raw)
                raw = re.sub(r"\n?```$", "", raw)
            return json.loads(raw.strip())
        except Exception as e:
            print(f"AI Assistant notice: {e}")

    # Rich contextual explanation with live translation
    bengali_pron = transliterate_sentence_to_bengali(clean_text)
    trans = await translate_text(clean_text, context)
    bengali_trans = trans.get("bengali_translation", "")

    return {
        "result": f"Analysis for: '{clean_text}'",
        "bengali_explanation": f"এই অংশের বাংলা অর্থ: \"{bengali_trans}\"। এখানে শব্দ বা বাক্যটির বাংলা উচ্চারণ: \"{bengali_pron}\"। প্রসঙ্গ অনুযায়ী এটি ভাব প্রকাশে গুরুত্বপূর্ণ ভূমিকা রাখছে।",
        "grammar_notes": [
            "বাক্যের গঠন: Subject + Verb + Complement / Object",
            "প্রাসঙ্গিক শব্দের রূপ ও বাক্যে তার পদ (Part of Speech) লক্ষ্য করুন।"
        ],
        "vocabulary_breakdown": [
            {"word": w, "bengali_meaning": transliterate_word_to_bengali(w), "role": "vocabulary"}
            for w in clean_text.split()[:4]
        ],
        "related_phrases": [
            f"Practice sentence: {clean_text}",
            "Make your own example sentence with this vocabulary."
        ]
    }
