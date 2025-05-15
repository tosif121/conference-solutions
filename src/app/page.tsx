'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function DefaultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication and redirect based on role
    const conferenceToken = Cookies.get('conference_token');
    const userRole = Cookies.get('user_role');

    // Small delay to ensure cookies are properly checked
    setTimeout(() => {
      if (conferenceToken) {
        if (userRole === 'super_admin') {
          // User is a super admin
          router.push('/super-admin/dashboard');
        } else if (userRole === 'admin') {
          // User is a regular admin
          router.push('/admin/dashboard');
        } else {
          // Token exists but role is invalid or missing
          // Clear potentially corrupted cookies
          Cookies.remove('conference_token');
          Cookies.remove('user_role');
          router.push('/admin/login');
        }
      } else {
        // No valid token found, redirect to login
        router.push('/admin/login');
      }
      setIsLoading(false);
    }, 100);
  }, [router]);

  // Show a simple loading indicator while checking auth
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
      {isLoading && (
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Redirecting...</p>
        </div>
      )}
    </div>
  );
}

export default DefaultPage;
