import { NextRequest, NextResponse } from 'next/server';
import { transliterateSentenceToBengali, transliterateWordToBengali } from '@/lib/phonetics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || '').trim();
    if (!text) {
      return NextResponse.json({ detail: 'Text is required' }, { status: 400 });
    }

    // Google Translate for meaning
    let bengaliTrans = '';
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          bengaliTrans = data[0].map((item: any) => item[0]).join('').trim();
        }
      }
    } catch {}

    const bengaliPron = transliterateSentenceToBengali(text);
    const words = text.split(/\s+/).slice(0, 4);
    const vocabBreakdown = words.map((w: string) => ({
      word: w,
      bengali_meaning: transliterateWordToBengali(w),
      role: 'vocabulary'
    }));

    return NextResponse.json({
      result: `Analysis for: "${text}"`,
      bengali_explanation: `বাংলা ভাবার্থ: "${bengaliTrans || text}"। বাংলা অক্ষরে সাবলীল উচ্চারণ: "${bengaliPron}"। প্রাসঙ্গিক ক্ষেত্রে বাক্যটির প্রতিটি শব্দের অর্থ ও ব্যাকরণিক গঠন লক্ষ্য করুন।`,
      grammar_notes: [
        'বাক্যের মৌলিক গঠন: Subject + Verb + Complement / Object',
        'উচ্চারণ ও শব্দের প্রয়োগ ইংরেজি জড়তা দূর করতে কার্যকর।'
      ],
      vocabulary_breakdown: vocabBreakdown,
      related_phrases: [
        `Practice sentence: ${text}`,
        'Make your own example sentence with this vocabulary.'
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'AI Assistant failed' }, { status: 500 });
  }
}
