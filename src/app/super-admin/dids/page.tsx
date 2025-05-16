import dynamic from 'next/dynamic';

const AssignDIDs = dynamic(() => import('@/components/SuperAdmin/AssignDIDs'));
export default function Home() {
  return <AssignDIDs />;
}
