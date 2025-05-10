'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '../components/ThemeProvider';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

const Layout = dynamic(() => import('@/components/layout/Layout'));

const inter = Inter({ subsets: ['latin'] });

const PUBLIC_PATHS = ['/super-admin/login', '/admin/login'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_PATHS.some((path) => pathname === path);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-right" reverseOrder={false} />
          {isPublicPage ? children : <Layout>{children}</Layout>}
        </ThemeProvider>
      </body>
    </html>
  );
}
