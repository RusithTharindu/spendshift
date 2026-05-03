import { NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import CategoryModel from '@/lib/models/Category';

function toDTO(d: { categoryId: string; name: string; glyph: string; tone: string; isDefault: boolean }) {
  return { id: d.categoryId, name: d.name, glyph: d.glyph, tone: d.tone, isDefault: d.isDefault };
}

export async function GET() {
  await connectDB();
  const userId = await requireUserId();

  const docs = await CategoryModel.find({ userId }).lean();
  return NextResponse.json(docs.map(toDTO));
}

export async function POST(req: Request) {
  await connectDB();
  const userId = await requireUserId();

  const body = await req.json();
  const doc = await CategoryModel.create({
    categoryId: body.id,
    userId,
    name: body.name,
    glyph: body.glyph || '◇',
    tone: body.tone || '#807C73',
    isDefault: !!body.isDefault,
  });
  return NextResponse.json(toDTO(doc), { status: 201 });
}
