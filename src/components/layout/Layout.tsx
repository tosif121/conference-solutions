'use client';
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { usePathname } from 'next/navigation';
import HeaderAdmin from './HeaderAdmin';

export default function Layout({ children }: { children: React.ReactNode }) {
  const PUBLIC_PATHS = ['/super-admin/login', 'admin/login'];

  const pathname = usePathname();

  // Check if current path matches any public path
  const isPublicPage = PUBLIC_PATHS.some((path) => pathname === path);

  return (
    <div className="min-h-screen flex flex-col">
      {isPublicPage ? <Header /> : <HeaderAdmin />}
      <main className="flex-1 p-6 bg-muted text-muted-foreground">{children}</main>
      <Footer />
    </div>
  );
}
