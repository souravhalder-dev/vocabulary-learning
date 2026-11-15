import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const history = await prisma.translation.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
    });
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
