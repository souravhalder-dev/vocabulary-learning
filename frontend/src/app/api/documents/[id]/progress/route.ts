import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = parseInt(id, 10);
    if (isNaN(docId)) {
      return NextResponse.json({ detail: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const currentPage = body.current_page !== undefined ? Number(body.current_page) : undefined;
    const readingProgress = body.reading_progress !== undefined ? Number(body.reading_progress) : undefined;

    const updated = await prisma.document.update({
      where: { id: docId },
      data: {
        ...(currentPage !== undefined ? { current_page: currentPage } : {}),
        ...(readingProgress !== undefined ? { reading_progress: readingProgress } : {}),
        last_read_at: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
