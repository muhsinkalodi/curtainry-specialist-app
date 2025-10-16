'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfilePage from '../../components/ProfilePage';
import BackButton from '../../components/BackButton';
import BottomNavigation from '../../components/BottomNavigation';

function ProfileContent() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  return (
    <div className="pb-16">
      <div className="p-4">
        <BackButton fallbackUrl={`/dashboard?userType=${userType}`} />
      </div>
      <ProfilePage userType={userType} />
      <BottomNavigation userRole={userType} currentPage="/profile" />
    </div>
  );
}

export default function ProfilePageRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
