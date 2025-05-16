import dynamic from 'next/dynamic';

const AdminLogin = dynamic(() => import('@/components/Admin/AdminLogin'));

export default function AdminLoginPage() {
  return <AdminLogin />;
}
