import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ExpenseModel from '@/lib/models/Expense';

export async function GET() {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const docs = await ExpenseModel.find({ userId }).sort({ date: -1 }).lean();
  return NextResponse.json(docs.map(d => ({
    id: d.expenseId,
    merchant: d.merchant,
    amount: d.amount,
    currency: d.currency,
    amountOriginal: d.amountOriginal,
    rate: d.rate,
    categoryId: d.categoryId,
    date: d.date instanceof Date ? d.date.toISOString() : d.date,
    note: d.note,
    recurring: d.recurring,
  })));
}

export async function POST(req: Request) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const body = await req.json();
  const doc = await ExpenseModel.create({
    expenseId: body.id,
    userId,
    merchant: body.merchant,
    amount: body.amount,
    currency: body.currency,
    amountOriginal: body.amountOriginal,
    rate: body.rate,
    categoryId: body.categoryId,
    date: new Date(body.date),
    note: body.note || '',
    recurring: !!body.recurring,
  });

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
  }, { status: 201 });
}
