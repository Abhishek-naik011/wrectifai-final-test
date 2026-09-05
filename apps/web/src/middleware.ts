import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    const decodedStr = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedStr);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || request.cookies.get('refreshToken')?.value;
  const path = request.nextUrl.pathname;

  const isProtected = 
    path.startsWith('/admin') ||
    path.startsWith('/garage') ||
    path.startsWith('/customer') ||
    path === '/garages' ||
    path === '/settings' ||
    path === '/shop' ||
    path === '/dashboard';

  // If no token exists
  if (!token) {
    if (isProtected) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If token exists and path is root "/", redirect based on role
  if (token && path === '/') {
    const decoded = decodeJwt(token);
    if (decoded && decoded.roles) {
      if (decoded.roles.includes('admin')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (decoded.roles.includes('garage')) {
        return NextResponse.redirect(new URL('/garage/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    // Fallback if parsing fails
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)'],
};
