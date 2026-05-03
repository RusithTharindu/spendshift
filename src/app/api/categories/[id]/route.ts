import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CategoryModel from '@/lib/models/Category';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const f of ['name', 'glyph', 'tone']) {
    if (f in body) update[f] = body[f];
  }

  const doc = await CategoryModel.findOneAndUpdate({ userId, categoryId: id }, update, { new: true });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ id: doc.categoryId, name: doc.name, glyph: doc.glyph, tone: doc.tone, isDefault: doc.isDefault });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const { id } = await params;
  await CategoryModel.deleteOne({ userId, categoryId: id });
  return NextResponse.json({ ok: true });
}
