import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CategoryModel from '@/lib/models/Category';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

export async function POST() {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const docs = DEFAULT_CATEGORIES.map(c => ({
    categoryId: c.id, userId, name: c.name, glyph: c.glyph, tone: c.tone, isDefault: true,
  }));

  await CategoryModel.insertMany(docs, { ordered: false }).catch(() => {});
  return NextResponse.json({ ok: true });
}
