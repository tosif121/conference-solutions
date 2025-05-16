import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/components/Admin/AdminDashboard'));

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
