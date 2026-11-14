import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_words: 12,
    learned_words: 5,
    streak_days: 7,
    last_studied: new Date().toISOString(),
    due_reviews: 3,
    documents_read: 4,
    words_by_box: {
      1: 4,
      2: 3,
      3: 2,
      4: 2,
      5: 1
    }
  });
}
