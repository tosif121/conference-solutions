'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function DefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/super-admin/dashboard');
  }, []);

  return <></>;
}
export default DefaultPage;