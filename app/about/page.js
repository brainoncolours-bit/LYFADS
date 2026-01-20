'use client';

import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';

// Dynamically import the Camera Landing component with no SSR
const CameraLanding = dynamic(() => import('@/components/CameraLanding'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 to-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
        <p className="text-gray-800">Loading Camera Experience...</p>
      </div>
    </div>
  )
});

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: '#aa302a' }}>
        <CameraLanding />
      </div>
    </Layout>
  );
}
