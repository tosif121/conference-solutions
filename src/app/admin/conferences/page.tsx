import dynamic from 'next/dynamic';

const Conference = dynamic(() => import('@/components/Conference'));
export default function Home() {
  return <Conference />;
}
