import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/components/Admin/AdminDashboard'));
export default function Home() {
  return <AdminDashboard />;
}
