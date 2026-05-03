import { NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import ExpenseModel from '@/lib/models/Expense';

export async function POST(req: Request) {
  await connectDB();
  const userId = await requireUserId();

  const body = await req.json();
  const docs = body.expenses.map((e: {
    id: string; merchant: string; amount: number; currency: string;
    amountOriginal?: number; rate?: number; categoryId: string;
    date: string; note?: string; recurring?: boolean;
  }) => ({
    expenseId: e.id, userId, merchant: e.merchant, amount: e.amount,
    currency: e.currency, amountOriginal: e.amountOriginal, rate: e.rate,
    categoryId: e.categoryId, date: new Date(e.date), note: e.note || '', recurring: !!e.recurring,
  }));

  await ExpenseModel.insertMany(docs, { ordered: false }).catch(() => {});
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await connectDB();
  const userId = await requireUserId();

  await ExpenseModel.deleteMany({ userId });
  return NextResponse.json({ ok: true });
}
