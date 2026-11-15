import { NextRequest, NextResponse } from 'next/server';
import { lookupWordDualAccentPronunciation } from '@/lib/phonetics-engine';

async function fetchBengaliMeaning(word: string) {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&dt=bd&dt=rm&q=${encodeURIComponent(word)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const primary = data?.[0]?.[0]?.[0] || '';
      const list: string[] = [];
      let pos = '';
      if (data?.[1]) {
        for (const grp of data[1]) {
          if (!pos && grp[0]) pos = grp[0];
          if (grp[1]) list.push(...grp[1].slice(0, 3));
        }
      }
      const combined = [primary, ...list.filter((m) => m !== primary)];
      return {
        meaning: combined.slice(0, 4).join(' / ') || primary || word,
        pos: pos || 'word',
        googleIpa: data?.[0]?.[1]?.[3] || '',
      };
    }
  } catch (e) {
    console.warn('Meaning lookup notice:', e);
  }
  return { meaning: word, pos: 'word', googleIpa: '' };
}

async function enrichRelationList(words: string[]) {
  const cleanList = Array.from(new Set(words.map((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase()).filter(Boolean))).slice(0, 3);
  return await Promise.all(
    cleanList.map(async (w) => {
      let meaning = w;
      try {
        const trRes = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(w)}`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        if (trRes.ok) {
          const d = await trRes.json();
          if (d?.[0]?.[0]?.[0]) meaning = d[0][0][0];
        }
      } catch {}

      // Fast synchronous rule + verified dict for relations so request never exceeds Vercel limits
      const { transliterateWordToBengali } = await import('@/lib/phonetics');
      const pron = transliterateWordToBengali(w);
      return {
        word: w,
        bengali_pronunciation: pron,
        bengali_meaning: meaning,
      };
    })
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawWord = body.word || '';
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '').trim().toLowerCase();
    if (!cleanWord) {
      return NextResponse.json({ detail: 'Invalid word' }, { status: 400 });
    }

    let englishDefinition = `Contextual usage and definition of '${cleanWord}'.`;
    let ipaPhonetic = '';
    let exampleSentence = body.context_sentence || `The word '${cleanWord}' is frequently used in modern English.`;
    const rawSynonyms: string[] = [];
    const rawAntonyms: string[] = [];

    // Parallel fetch: Bengali Meaning, Dictionary API (meanings/relations), Datamuse, and Dual-Accent Pronunciation Engine
    const [meaningData, dictData, datamuseData, dualPronResult] = await Promise.allSettled([
      fetchBengaliMeaning(cleanWord),
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(cleanWord)}&qe=sp&md=dfrps&ipa=1&max=1`)
        .then(r => r.ok ? r.json() : null).catch(() => null),
      lookupWordDualAccentPronunciation(cleanWord)
    ]);

    const bengaliMeaning = meaningData.status === 'fulfilled' ? meaningData.value.meaning : cleanWord;
    const pos = meaningData.status === 'fulfilled' ? meaningData.value.pos : 'word';

    const dualPron = dualPronResult.status === 'fulfilled' ? dualPronResult.value : null;

    let ukIpa = dualPron?.uk.ipa || '';
    let usIpa = dualPron?.us.ipa || '';
    let ukAudio = dualPron?.uk.audio_url || '';
    let usAudio = dualPron?.us.audio_url || '';

    if (dictData.status === 'fulfilled' && Array.isArray(dictData.value) && dictData.value.length > 0) {
      const first = dictData.value[0];
      if (first.phonetics) {
        for (const p of first.phonetics) {
          const audio = (p.audio || '').toLowerCase();
          if (audio.includes('-uk') || audio.includes('/uk/')) {
            if (!ukAudio) ukAudio = p.audio!;
          } else if (audio.includes('-us') || audio.includes('/us/')) {
            if (!usAudio) usAudio = p.audio!;
          }
        }
      }
      if (first.meanings) {
        for (const m of first.meanings) {
          if (m.synonyms) rawSynonyms.push(...m.synonyms);
          if (m.antonyms) rawAntonyms.push(...m.antonyms);
          for (const d of m.definitions || []) {
            if (d.synonyms) rawSynonyms.push(...d.synonyms);
            if (d.antonyms) rawAntonyms.push(...d.antonyms);
            if (d.definition && !englishDefinition) englishDefinition = d.definition;
            if (d.example && !body.context_sentence) exampleSentence = d.example;
          }
        }
      }
    }

    if (datamuseData.status === 'fulfilled' && Array.isArray(datamuseData.value) && datamuseData.value.length > 0) {
      const dm = datamuseData.value[0];
      if (dm.defs && dm.defs.length > 0 && englishDefinition.startsWith('Contextual usage')) {
        englishDefinition = dm.defs[0].replace(/^[a-z]+\t/, '').trim();
      }
    }

    // Default to British English (UK) as required by specification
    const defaultBengaliPron = dualPron?.uk.bengali_pronunciation || 'উচ্চারণ পাওয়া যায়নি';
    const defaultIpa = ukIpa || usIpa || '';
    const defaultAudio = ukAudio || usAudio || '';

    const [synonyms, antonyms] = await Promise.all([
      enrichRelationList(rawSynonyms),
      enrichRelationList(rawAntonyms)
    ]);

    return NextResponse.json({
      id: Date.now(),
      word: cleanWord,
      original_word: rawWord,
      // Default (British English) properties for backwards compatibility
      bengali_pronunciation: defaultBengaliPron,
      bengali_meaning: bengaliMeaning,
      english_definition: englishDefinition,
      ipa_phonetic: defaultIpa,
      audio_url: defaultAudio,

      // Dual Accent configuration
      active_accent: 'uk',
      pronunciation_uk: {
        ipa: ukIpa,
        bengali_pronunciation: dualPron?.uk.bengali_pronunciation || defaultBengaliPron,
        audio_url: ukAudio || undefined,
        source: dualPron?.uk.source || 'unavailable',
      },
      pronunciation_us: {
        ipa: usIpa,
        bengali_pronunciation: dualPron?.us.bengali_pronunciation || defaultBengaliPron,
        audio_url: usAudio || undefined,
        source: dualPron?.us.source || 'unavailable',
      },

      part_of_speech: pos,
      example_sentence: exampleSentence,
      bengali_example: '',
      context_sentence: body.context_sentence || null,
      document_id: body.document_id || null,
      document_title: body.document_title || null,
      is_learned: false,
      review_count: 0,
      leitner_box: 1,
      next_review_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      synonyms,
      antonyms
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Lookup failed' }, { status: 500 });
  }
}
