import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, encrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Protected routes pattern
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/mis');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  // Decrypt session
  const parsed = session ? await decrypt(session) : null;

  // 1. If trying to access protected route without valid session, redirect to login
  if (isProtectedRoute && !parsed) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // If session existed but was invalid, clear it
    if (session) {
      response.cookies.delete('session');
    }
    return response;
  }

  // 2. If trying to access login/register with valid session, redirect to dashboard
  if (isAuthRoute && parsed) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Update session expiration if session is valid
  // Temporarily disabled to prevent potential race conditions or loops
  /*
  if (parsed) {
    const response = NextResponse.next();
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    response.cookies.set({
      name: 'session',
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires,
    });
    return response;
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
