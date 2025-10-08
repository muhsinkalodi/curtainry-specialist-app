'use client';

import { useSearchParams } from 'next/navigation';
import NewRequests from '../../components/NewRequests';

export default function Requests() {
  const searchParams = useSearchParams();
  const userRole = (searchParams.get('userType') as 'consultant' | 'fitter') || 'fitter';

  // Mock user data - in real app this would come from auth/API
  const userData = {
    name: userRole === 'consultant' ? 'Sarah Chen' : 'Mike Rodriguez',
    email: userRole === 'consultant' ? 'sarah.chen@curtainry.com' : 'mike.rodriguez@curtainry.com'
  };

  return <NewRequests userRole={userRole} userData={userData} />;
}