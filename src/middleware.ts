import { NextResponse } from 'next/server';

// Paths that don't require authentication
const PUBLIC_PATHS = ['/super-admin/login'];

export function middleware(req: { nextUrl: { pathname: any; }; cookies: { get: (arg0: string) => { (): any; new(): any; value: any; }; }; url: string | URL | undefined; }) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('super_admin_token')?.value;

  // Handle public paths
  if (PUBLIC_PATHS.some(publicPath => path === publicPath)) {
    if (token) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/super-admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Check if path is under super-admin and requires protection
  if (path.startsWith('/super-admin') && !token) {
    return NextResponse.redirect(new URL('/super-admin/login', req.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all super-admin paths
    '/super-admin/:path*',
    // Exclude static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)'
  ],
};