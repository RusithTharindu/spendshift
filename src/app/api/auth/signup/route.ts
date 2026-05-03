import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import {
  createSessionToken,
  hashPassword,
  normalizeEmail,
  sessionCookieOptions,
  validateEmail,
  validatePassword,
  SESSION_COOKIE,
} from '@/lib/auth';

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const name = String(body.name || '').trim();
  const email = normalizeEmail(String(body.email || ''));
  const password = String(body.password || '');
  const passwordErrors = validatePassword(password);

  if (name.length < 2) {
    return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
  }
  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (passwordErrors.length > 0) {
    return NextResponse.json({ error: passwordErrors[0] }, { status: 400 });
  }

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return NextResponse.json({ error: 'An account already exists for this email.' }, { status: 409 });
  }

  const user = await User.create({
    userId: uuid(),
    name,
    email,
    passwordHash: await hashPassword(password),
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(user.userId), sessionCookieOptions());
  return res;
}
