'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

function DefaultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication and redirect based on role
    const superAdminToken = Cookies.get('super_admin_token');
    const adminToken = Cookies.get('admin_token');

    // Small delay to ensure cookies are properly checked
    setTimeout(() => {
      if (superAdminToken) {
        // User is a super admin
        router.push('/super-admin/dashboard');
      } else if (adminToken) {
        // User is a regular admin
        router.push('/admin/dashboard');
      } else {
        // No valid token found, redirect to login
        toast.error('Please login to access the dashboard');
        router.push('admin/login');
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
