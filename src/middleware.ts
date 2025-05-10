import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/super-admin/login', '/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve tokens from cookies
  const superAdminToken = req.cookies.get('super_admin_token')?.value;
  const adminToken = req.cookies.get('admin_token')?.value;

  // Allow access to public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    // Redirect authenticated users away from login pages
    if (pathname === '/super-admin/login' && superAdminToken) {
      return NextResponse.redirect(new URL('/super-admin/dashboard', req.url));
    }
    if (pathname === '/admin/login' && adminToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Protect super-admin routes
  if (pathname.startsWith('/super-admin')) {
    if (!superAdminToken) {
      return NextResponse.redirect(new URL('/super-admin/login', req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/super-admin/:path*',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};
