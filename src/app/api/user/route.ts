import { NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  await connectDB();
  const userId = await requireUserId();

  const user = await User.findOne({ userId });
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({
    name: user.name,
    email: user.email,
    baseCurrency: user.baseCurrency,
    accentId: user.accentId,
    theme: user.theme,
    onboarded: user.onboarded,
  });
}

export async function PATCH(req: Request) {
  await connectDB();
  const userId = await requireUserId();

  const body = await req.json();
  const allowed = ['name', 'baseCurrency', 'accentId', 'theme', 'onboarded'];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const user = await User.findOneAndUpdate({ userId }, update, { new: true });
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({
    name: user.name,
    email: user.email,
    baseCurrency: user.baseCurrency,
    accentId: user.accentId,
    theme: user.theme,
    onboarded: user.onboarded,
  });
}
