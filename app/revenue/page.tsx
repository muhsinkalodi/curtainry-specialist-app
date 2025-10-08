'use client';

import { useSearchParams } from 'next/navigation';
import RevenuePage from '../../components/RevenuePage';

export default function Revenue() {
  const searchParams = useSearchParams();
  const userRole = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  // Mock user data - in real app this would come from auth/API
  const userData = {
    name: userRole === 'consultant' ? 'Sarah Chen' : 'Mike Rodriguez',
    email: userRole === 'consultant' ? 'sarah.chen@curtainry.com' : 'mike.rodriguez@curtainry.com'
  };

  return <RevenuePage userRole={userRole} userData={userData} />;
}