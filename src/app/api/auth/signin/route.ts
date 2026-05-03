import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import {
  createSessionToken,
  normalizeEmail,
  sessionCookieOptions,
  validateEmail,
  verifyPassword,
  SESSION_COOKIE,
} from '@/lib/auth';

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const email = normalizeEmail(String(body.email || ''));
  const password = String(body.password || '');

  if (!validateEmail(email) || !password) {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  const valid = await verifyPassword(password, user?.passwordHash);
  if (!user || !valid) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(user.userId), sessionCookieOptions());
  return res;
}
