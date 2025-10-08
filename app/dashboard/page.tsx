'use client';

import { useSearchParams } from 'next/navigation';
import HomeDashboard from '../../components/HomeDashboard';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  return <HomeDashboard userType={userType} />;
}