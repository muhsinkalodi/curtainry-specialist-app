'use client';

import { useSearchParams } from 'next/navigation';
import ProfilePage from '../../components/ProfilePage';

export default function Profile() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  return <ProfilePage userType={userType} />;
}