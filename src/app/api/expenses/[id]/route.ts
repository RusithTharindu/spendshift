import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ExpenseModel from '@/lib/models/Expense';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  const fields = ['merchant', 'amount', 'currency', 'amountOriginal', 'rate', 'categoryId', 'note', 'recurring'];
  for (const f of fields) {
    if (f in body) update[f] = body[f];
  }
  if (body.date) update.date = new Date(body.date);

  const doc = await ExpenseModel.findOneAndUpdate({ userId, expenseId: id }, update, { new: true });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    id: doc.expenseId,
    merchant: doc.merchant,
    amount: doc.amount,
    currency: doc.currency,
    amountOriginal: doc.amountOriginal,
    rate: doc.rate,
    categoryId: doc.categoryId,
    date: doc.date.toISOString(),
    note: doc.note,
    recurring: doc.recurring,
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const { id } = await params;
  await ExpenseModel.deleteOne({ userId, expenseId: id });
  return NextResponse.json({ ok: true });
}
