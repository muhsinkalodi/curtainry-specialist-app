'use client';

import { Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import OrdersPage from '../../../components/OrdersPage';
import BackButton from '../../../components/BackButton';
import BottomNavigation from '../../../components/BottomNavigation';

function OrderDetailContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const userRole = (searchParams.get('userType') as 'consultant' | 'fitter') || 'consultant';
  const orderId = params?.id as string;

  // Mock user data - in real app this would come from auth/API
  const userData = {
    name: userRole === 'consultant' ? 'Sarah Chen' : 'Mike Rodriguez',
    email: userRole === 'consultant' ? 'sarah.chen@curtainry.com' : 'mike.rodriguez@curtainry.com',
    rating: userRole === 'consultant' ? 4.9 : 4.7
  };

  return (
    <div className="pb-16">
      <div className="p-4">
        <BackButton fallbackUrl={`/orders?userType=${userRole}`} />
      </div>
      {/* The OrdersPage component handles order details internally */}
      <OrdersPage userRole={userRole} userData={userData} />
      <BottomNavigation userRole={userRole} currentPage="/orders" />
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Order Details...</p>
        </div>
      </div>
    }>
      <OrderDetailContent />
    </Suspense>
  );
}
