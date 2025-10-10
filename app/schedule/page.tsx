'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SchedulePage from '../../components/SchedulePage';

function ScheduleContent() {
  const searchParams = useSearchParams();
  const userRole = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  // Mock user data - in real app this would come from auth/API
  const userData = {
    name: userRole === 'consultant' ? 'Sarah Chen' : 'Mike Rodriguez',
    email: userRole === 'consultant' ? 'sarah.chen@curtainry.com' : 'mike.rodriguez@curtainry.com'
  };

  return <SchedulePage userRole={userRole} userData={userData} />;
}

export default function Schedule() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Schedule...</p>
      </div>
    </div>}>
      <ScheduleContent />
    </Suspense>
  );
}