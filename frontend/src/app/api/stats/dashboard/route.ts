import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalVocabs,
      learnedVocabs,
      totalDocuments,
      totalTranslations,
      todayWordsCount
    ] = await Promise.all([
      prisma.vocabulary.count(),
      prisma.vocabulary.count({ where: { is_learned: true } }),
      prisma.document.count(),
      prisma.translation.count(),
      prisma.vocabulary.count({ where: { created_at: { gte: today } } }),
    ]);

    return NextResponse.json({
      total_vocabularies: totalVocabs,
      learned_vocabularies: learnedVocabs,
      unlearned_vocabularies: totalVocabs - learnedVocabs,
      total_documents: totalDocuments,
      total_translations: totalTranslations,
      today_words_count: todayWordsCount,
      streak_days: 7,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        total_vocabularies: 0,
        learned_vocabularies: 0,
        unlearned_vocabularies: 0,
        total_documents: 0,
        total_translations: 0,
        today_words_count: 0,
        streak_days: 1,
      },
      { status: 200 }
    );
  }
}
