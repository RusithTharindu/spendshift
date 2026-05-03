import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  let user = await User.findOne({ userId });
  if (!user) {
    user = await User.create({ userId });
  }
  return NextResponse.json({
    name: user.name,
    baseCurrency: user.baseCurrency,
    accentId: user.accentId,
    theme: user.theme,
    onboarded: user.onboarded,
  });
}

export async function PATCH(req: Request) {
  await connectDB();
  const hdrs = await headers();
  const userId = hdrs.get('X-User-Id');
  if (!userId) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

  const body = await req.json();
  const allowed = ['name', 'baseCurrency', 'accentId', 'theme', 'onboarded'];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const user = await User.findOneAndUpdate({ userId }, update, { new: true, upsert: true });
  return NextResponse.json({
    name: user.name,
    baseCurrency: user.baseCurrency,
    accentId: user.accentId,
    theme: user.theme,
    onboarded: user.onboarded,
  });
}
