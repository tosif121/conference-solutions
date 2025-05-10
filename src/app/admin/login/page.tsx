import dynamic from 'next/dynamic';

const AdminLogin = dynamic(() => import('@/components/AdminLogin'));
export default function Home() {
  return <AdminLogin />;
}
