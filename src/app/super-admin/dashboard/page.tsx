import dynamic from 'next/dynamic';

const SuperAdminDashboard = dynamic(() => import('@/components/SuperAdmin/SuperAdminDashboard'));
export default function Home() {
  return <SuperAdminDashboard />;
}
