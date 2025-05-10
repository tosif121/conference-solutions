import dynamic from 'next/dynamic';

const ManageAdmins = dynamic(() => import('@/components/ManageAdmins'));
export default function Home() {
  return <ManageAdmins />;
}
