'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ARSystem from '../../components/ARSystem';
import BackButton from '../../components/BackButton';
import BottomNavigation from '../../components/BottomNavigation';

function ARContent() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  return (
    <div className="pb-16">
      <div className="p-4">
        <BackButton fallbackUrl={`/dashboard?userType=${userType}`} />
      </div>
      <ARSystem userType={userType} />
      <BottomNavigation userRole={userType} currentPage="/ar" />
    </div>
  );
}

export default function ARPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AR System...</p>
        </div>
      </div>
    }>
      <ARContent />
    </Suspense>
  );
}
