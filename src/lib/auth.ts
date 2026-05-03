import crypto from 'node:crypto';

export const SESSION_COOKIE = 'spendshift_session';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_KEYLEN = 64;
const SCRYPT_COST = 16384;

export interface SessionPayload {
  userId: string;
  expiresAt: number;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validatePassword(password: string) {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Use at least 8 characters.');
  if (!/[a-z]/i.test(password)) errors.push('Include at least one letter.');
  if (!/[0-9]/.test(password)) errors.push('Include at least one number.');
  if (!/[^a-zA-Z0-9]/.test(password)) errors.push('Include at least one special character.');
  return errors;
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const derived = await scrypt(password, salt);
  return `scrypt:${SCRYPT_COST}:${salt}:${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, storedHash?: string) {
  if (!storedHash) return false;

  const [algorithm, cost, salt, hash] = storedHash.split(':');
  if (algorithm !== 'scrypt' || cost !== String(SCRYPT_COST) || !salt || !hash) return false;

  const expected = Buffer.from(hash, 'base64url');
  const actual = await scrypt(password, salt);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export function createSessionToken(userId: string) {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [userId, expiresAtValue, signature] = parts;
  const expiresAt = Number(expiresAtValue);
  if (!userId || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;

  const payload = `${userId}.${expiresAt}`;
  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (provided.length !== expectedBuffer.length || !crypto.timingSafeEqual(provided, expectedBuffer)) {
    return null;
  }

  return { userId, expiresAt };
}

export async function getCurrentUserId() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)?.userId ?? null;
}

export async function requireUserId() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Unauthorized');
  return userId;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function expiredSessionCookieOptions() {
  return {
    ...sessionCookieOptions(),
    maxAge: 0,
  };
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function getSessionSecret() {
  return process.env.SESSION_SECRET || 'spendshift-dev-session-secret-change-me';
}

function scrypt(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, PASSWORD_KEYLEN, { cost: SCRYPT_COST }, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}
