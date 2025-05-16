import dynamic from 'next/dynamic';

const SuperAdminLogin = dynamic(() => import('@/components/SuperAdmin/SuperAdminLogin'));

export default function SuperAdminLoginPage() {
  return <SuperAdminLogin />;
}
