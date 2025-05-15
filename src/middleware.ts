import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/super-admin/login', '/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve tokens and role from cookies
  const conferenceToken = req.cookies.get('conference_token')?.value;
  const userRole = req.cookies.get('user_role')?.value;

  // Allow access to public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    // Redirect authenticated users away from login pages
    if (pathname === '/super-admin/login' && conferenceToken && userRole === 'super_admin') {
      return NextResponse.redirect(new URL('/super-admin/dashboard', req.url));
    }
    if (pathname === '/admin/login' && conferenceToken && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Protect super-admin routes
  if (pathname.startsWith('/super-admin')) {
    if (!conferenceToken || userRole !== 'super_admin') {
      return NextResponse.redirect(new URL('/super-admin/login', req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!conferenceToken || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ['/super-admin/:path*', '/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
};
