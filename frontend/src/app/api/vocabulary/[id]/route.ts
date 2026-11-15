import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vocabId = parseInt(id, 10);
    if (isNaN(vocabId)) {
      return NextResponse.json({ detail: 'Invalid ID' }, { status: 400 });
    }

    const item = await prisma.vocabulary.findUnique({
      where: { id: vocabId },
    });

    if (!item) {
      return NextResponse.json({ detail: 'Vocabulary not found' }, { status: 404 });
    }

    let synonyms = [];
    let antonyms = [];
    let pronunciation_uk = undefined;
    let pronunciation_us = undefined;

    try { if (item.synonyms_json) synonyms = JSON.parse(item.synonyms_json); } catch {}
    try { if (item.antonyms_json) antonyms = JSON.parse(item.antonyms_json); } catch {}
    try { if (item.pronunciation_uk) pronunciation_uk = JSON.parse(item.pronunciation_uk); } catch {}
    try { if (item.pronunciation_us) pronunciation_us = JSON.parse(item.pronunciation_us); } catch {}

    return NextResponse.json({
      ...item,
      synonyms,
      antonyms,
      pronunciation_uk,
      pronunciation_us,
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vocabId = parseInt(id, 10);
    if (isNaN(vocabId)) {
      return NextResponse.json({ detail: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const updateData: any = {};

    if (body.is_learned !== undefined) updateData.is_learned = Boolean(body.is_learned);
    if (body.leitner_box !== undefined) updateData.leitner_box = Number(body.leitner_box);
    if (body.review_count !== undefined) updateData.review_count = Number(body.review_count);
    if (body.notes !== undefined) updateData.notes = String(body.notes);
    if (body.active_accent !== undefined) updateData.active_accent = String(body.active_accent);
    if (body.bengali_pronunciation !== undefined) updateData.bengali_pronunciation = String(body.bengali_pronunciation);
    if (body.bengali_meaning !== undefined) updateData.bengali_meaning = String(body.bengali_meaning);

    const updated = await prisma.vocabulary.update({
      where: { id: vocabId },
      data: updateData,
    });

    let synonyms = [];
    let antonyms = [];
    let pronunciation_uk = undefined;
    let pronunciation_us = undefined;

    try { if (updated.synonyms_json) synonyms = JSON.parse(updated.synonyms_json); } catch {}
    try { if (updated.antonyms_json) antonyms = JSON.parse(updated.antonyms_json); } catch {}
    try { if (updated.pronunciation_uk) pronunciation_uk = JSON.parse(updated.pronunciation_uk); } catch {}
    try { if (updated.pronunciation_us) pronunciation_us = JSON.parse(updated.pronunciation_us); } catch {}

    return NextResponse.json({
      ...updated,
      synonyms,
      antonyms,
      pronunciation_uk,
      pronunciation_us,
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vocabId = parseInt(id, 10);
    if (isNaN(vocabId)) {
      return NextResponse.json({ detail: 'Invalid ID' }, { status: 400 });
    }

    await prisma.vocabulary.delete({
      where: { id: vocabId },
    });

    return NextResponse.json({ status: 'deleted', id: vocabId });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
