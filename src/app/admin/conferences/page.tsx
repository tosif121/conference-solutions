import dynamic from 'next/dynamic';

const Conference = dynamic(() => import('@/components/Admin/Conference'));

export default function ConferencePage() {
  return <Conference />;
}
