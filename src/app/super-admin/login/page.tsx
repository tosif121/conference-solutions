import dynamic from 'next/dynamic';

const SuperAdminLogin = dynamic(() => import('@/components/SuperAdminLogin'));
export default function Home() {
  return <SuperAdminLogin />;
}
