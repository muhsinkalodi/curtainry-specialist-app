'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RevenuePage from '../../components/RevenuePage';

function RevenueContent() {
  const searchParams = useSearchParams();
  const userRole = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  // Mock user data - in real app this would come from auth/API
  const userData = {
    name: userRole === 'consultant' ? 'Sarah Chen' : 'Mike Rodriguez',
    email: userRole === 'consultant' ? 'sarah.chen@curtainry.com' : 'mike.rodriguez@curtainry.com'
  };

  return <RevenuePage userRole={userRole} userData={userData} />;
}

export default function Revenue() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Revenue Dashboard...</p>
      </div>
    </div>}>
      <RevenueContent />
    </Suspense>
  );
}