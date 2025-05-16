import dynamic from 'next/dynamic';

const AssignDIDs = dynamic(() => import('@/components/SuperAdmin/AssignDIDs'));

export default function AssignDIDsPage() {
  return <AssignDIDs />;
}
