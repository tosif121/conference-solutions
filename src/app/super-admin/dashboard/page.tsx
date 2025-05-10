import dynamic from 'next/dynamic';

const SuperAdminDashboard = dynamic(() => import('@/components/SuperAdminDashboard'));
export default function Home() {
  return <SuperAdminDashboard />;
}
