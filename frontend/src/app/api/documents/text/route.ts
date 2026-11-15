import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content = (body.content || '').trim();
    const title = (body.title || 'Pasted English Content').trim();

    if (!content) {
      return NextResponse.json({ detail: 'Content is required' }, { status: 400 });
    }

    const totalWords = (content.match(/\b\w+\b/g) || []).length;
    const paragraphs = content.split(/\n\s*\n/).map((p: string) => `<p>${p.trim()}</p>`).join('');

    const document = await prisma.document.create({
      data: {
        title,
        source_type: 'text',
        content,
        html_content: paragraphs,
        total_words: totalWords,
        total_pages: 1,
        current_page: 1,
        reading_progress: 0,
      },
    });

    return NextResponse.json(document);
  } catch (error: any) {
    console.error('Error creating text document:', error);
    return NextResponse.json({ detail: error.message || 'Text creation failed' }, { status: 500 });
  }
}
