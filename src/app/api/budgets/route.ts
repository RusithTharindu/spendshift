import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import BudgetModel from '@/lib/models/Budget';

function toDTO(d: { budgetId: string; categoryId: string; amount: number; period: string }) {
  return { id: d.budgetId, categoryId: d.categoryId, amount: d.amount, period: d.period };
}

export async function GET() {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const docs = await BudgetModel.find({ userId }).lean();
  return NextResponse.json(docs.map(toDTO));
}

export async function POST(req: Request) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const body = await req.json();
  const doc = await BudgetModel.create({
    budgetId: body.id,
    userId,
    categoryId: body.categoryId,
    amount: body.amount,
    period: body.period || 'month',
  });
  return NextResponse.json(toDTO(doc), { status: 201 });
}
