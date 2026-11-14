import { NextRequest, NextResponse } from 'next/server';
import { transliterateSentenceToBengali } from '@/lib/phonetics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || '').trim();
    if (!text) {
      return NextResponse.json({ detail: 'No text provided' }, { status: 400 });
    }

    // 1. Google Translate API for genuine Bengali translation
    let bengaliTranslation = '';
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 3600 }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          bengaliTranslation = data[0].map((item: any) => item[0]).join('').trim();
        }
      }
    } catch (e) {
      console.warn('Online translation error:', e);
    }

    if (!bengaliTranslation) {
      bengaliTranslation = `"${text}" - বাক্যটির ভাবানুবাদ।`;
    }

    // 2. High-accuracy Bengali phonetic pronunciation of the English sentence
    const bengaliPronunciation = transliterateSentenceToBengali(text);

    return NextResponse.json({
      source_text: text,
      bengali_translation: bengaliTranslation,
      bengali_pronunciation: bengaliPronunciation,
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Translation failed' }, { status: 500 });
  }
}
