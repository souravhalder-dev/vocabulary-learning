import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notes = await prisma.personalGrammarNote.findMany();
    const map: Record<string, string> = {};
    for (const note of notes) {
      map[note.rule_id] = note.content;
    }
    return NextResponse.json(map);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rule_id, content } = body;
    if (!rule_id) {
      return NextResponse.json({ detail: 'rule_id is required' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      await prisma.personalGrammarNote.deleteMany({
        where: { rule_id },
      });
      return NextResponse.json({ rule_id, content: '' });
    }

    const note = await prisma.personalGrammarNote.upsert({
      where: { rule_id },
      update: { content: content.trim() },
      create: { rule_id, content: content.trim() },
    });

    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
