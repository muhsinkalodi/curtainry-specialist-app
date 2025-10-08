'use client';

import { useSearchParams } from 'next/navigation';
import OrdersPage from '../../components/OrdersPage';

export default function Orders() {
  const searchParams = useSearchParams();
  const userRole = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';

  // Mock user data - in real app this would come from auth/API
  const userData = {
    name: userRole === 'consultant' ? 'Sarah Chen' : 'Mike Rodriguez',
    email: userRole === 'consultant' ? 'sarah.chen@curtainry.com' : 'mike.rodriguez@curtainry.com'
  };

  return <OrdersPage userRole={userRole} userData={userData} />;
}