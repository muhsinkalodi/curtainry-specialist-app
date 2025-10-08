'use client';

import { useSearchParams } from 'next/navigation';
import ARSystem from '../../components/ARSystem';

export default function AR() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  return <ARSystem userType={userType} />;
}