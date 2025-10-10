'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfilePage from '../../components/ProfilePage';

function ProfileContent() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  return <ProfilePage userType={userType} />;
}

export default function Profile() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Profile...</p>
      </div>
    </div>}>
      <ProfileContent />
    </Suspense>
  );
}