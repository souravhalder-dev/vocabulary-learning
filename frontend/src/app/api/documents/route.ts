import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let docs = await prisma.document.findMany({
      orderBy: { last_read_at: 'desc' },
    });

    if (docs.length === 0) {
      // Seed initial demo document
      const demo = await prisma.document.create({
        data: {
          title: "The Industrial Revolution & Global Progress",
          source_type: "text",
          content: "The first pillar began with the Industrial Revolution. It brought massive transformation and shaped the modern creative economy. Students of history examine how resilience and innovation overcome challenges.",
          total_words: 29,
          total_pages: 1,
          current_page: 1,
          reading_progress: 0,
        },
      });
      docs = [demo];
    }

    return NextResponse.json(docs);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch documents' }, { status: 500 });
  }
}
