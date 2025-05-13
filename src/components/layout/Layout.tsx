'use client';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 bg-muted text-muted-foreground">{children}</main>
      <Footer />
    </div>
  );
}
