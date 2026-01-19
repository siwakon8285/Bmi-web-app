import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Update session expiration if session exists
  const response = await updateSession(request);
  if (response) return response;

  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Protected routes pattern
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/mis');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  // If trying to access protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login/register with session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
