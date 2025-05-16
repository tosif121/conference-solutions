import dynamic from 'next/dynamic';

const ManageAdmins = dynamic(() => import('@/components/SuperAdmin/ManageAdmins'));

export default function ManageAdminsPage() {
  return <ManageAdmins />;
}
