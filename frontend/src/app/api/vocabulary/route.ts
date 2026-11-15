import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase();
    const learnedParam = req.nextUrl.searchParams.get('learned');
    const docIdParam = req.nextUrl.searchParams.get('doc_id');

    const where: any = {};

    if (learnedParam !== null && learnedParam !== undefined) {
      where.is_learned = learnedParam === 'true';
    }

    if (docIdParam) {
      const docId = parseInt(docIdParam, 10);
      if (!isNaN(docId)) {
        where.document_id = docId;
      }
    }

    if (q) {
      where.OR = [
        { word: { contains: q, mode: 'insensitive' } },
        { bengali_meaning: { contains: q, mode: 'insensitive' } },
        { bengali_pronunciation: { contains: q, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.vocabulary.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    const parsed = items.map((item) => {
      let synonyms = [];
      let antonyms = [];
      let pronunciation_uk = undefined;
      let pronunciation_us = undefined;

      try {
        if (item.synonyms_json) synonyms = JSON.parse(item.synonyms_json);
      } catch {}
      try {
        if (item.antonyms_json) antonyms = JSON.parse(item.antonyms_json);
      } catch {}
      try {
        if (item.pronunciation_uk) pronunciation_uk = JSON.parse(item.pronunciation_uk);
      } catch {}
      try {
        if (item.pronunciation_us) pronunciation_us = JSON.parse(item.pronunciation_us);
      } catch {}

      return {
        ...item,
        synonyms,
        antonyms,
        pronunciation_uk,
        pronunciation_us,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error fetching vocabulary:', error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
