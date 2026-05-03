import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import BudgetModel from '@/lib/models/Budget';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const f of ['categoryId', 'amount', 'period']) {
    if (f in body) update[f] = body[f];
  }

  const doc = await BudgetModel.findOneAndUpdate({ userId, budgetId: id }, update, { new: true });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ id: doc.budgetId, categoryId: doc.categoryId, amount: doc.amount, period: doc.period });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const { id } = await params;
  await BudgetModel.deleteOne({ userId, budgetId: id });
  return NextResponse.json({ ok: true });
}
