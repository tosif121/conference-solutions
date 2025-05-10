import dynamic from 'next/dynamic';

const AssignDIDs = dynamic(() => import('@/components/AssignDIDs'));
export default function Home() {
  return <AssignDIDs />;
}
