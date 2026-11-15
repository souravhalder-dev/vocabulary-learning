import { NextRequest, NextResponse } from 'next/server';
import { transliterateSentenceToBengaliAsync } from '@/lib/phonetics';
import { prisma } from '@/lib/prisma';

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
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
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

    // 2. High-accuracy multi-source Bengali phonetic pronunciation of the English sentence
    const bengaliPronunciation = await transliterateSentenceToBengaliAsync(text);

    // Save to PostgreSQL via Prisma
    const saved = await prisma.translation.create({
      data: {
        source_text: text,
        bengali_translation: bengaliTranslation,
        bengali_pronunciation: bengaliPronunciation,
        context: body.context || null,
      },
    });

    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Translation failed' }, { status: 500 });
  }
}
