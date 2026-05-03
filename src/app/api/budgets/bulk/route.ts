import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import BudgetModel from '@/lib/models/Budget';

export async function POST(req: Request) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const body = await req.json();
  const docs = body.budgets.map((b: { id: string; categoryId: string; amount: number; period?: string }) => ({
    budgetId: b.id, userId, categoryId: b.categoryId, amount: b.amount, period: b.period || 'month',
  }));

  await BudgetModel.insertMany(docs, { ordered: false }).catch(() => {});
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  await BudgetModel.deleteMany({ userId });
  return NextResponse.json({ ok: true });
}
