import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/auth'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const isAuthPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (!session && !isAuthPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/auth).*)',
  ],
};
