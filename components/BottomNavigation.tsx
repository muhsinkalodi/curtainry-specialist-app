'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, FileText, Calendar, DollarSign, Inbox, Smartphone } from 'lucide-react';

interface BottomNavigationProps {
  userRole: 'consultant' | 'fitter';
  currentPage: string;
}

export default function BottomNavigation({ userRole, currentPage }: BottomNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('userType', userRole);
    
    switch (tab) {
      case 'home':
        router.push(`/dashboard?${params.toString()}`);
        break;
      case 'orders':
        router.push(`/orders?${params.toString()}`);
        break;
      case 'requests':
        router.push(`/requests?${params.toString()}`);
        break;
      case 'ar-system':
        router.push(`/ar?${params.toString()}`);
        break;
      case 'schedule':
        router.push(`/schedule?${params.toString()}`);
        break;
      case 'revenue':
        router.push(`/revenue?${params.toString()}`);
        break;
      case 'analysis':
        router.push(`/analysis?${params.toString()}`);
        break;
      case 'profile':
        router.push(`/profile?${params.toString()}`);
        break;
      default:
        router.push(`/dashboard?${params.toString()}`);
    }
  };

  // Map route paths to tab names
  const getActiveTab = () => {
    if (currentPage === '/dashboard') return 'home';
    if (currentPage === '/orders') return 'orders';
    if (currentPage === '/ar') return 'ar-system';
    if (currentPage === '/requests') return 'requests';
    if (currentPage === '/schedule') return 'schedule';
    if (currentPage === '/revenue') return 'revenue';
    if (currentPage === '/analysis') return 'analysis';
    if (currentPage === '/profile') return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2">
      <div className="flex justify-around items-center">
        <button
          onClick={() => handleNavigation('home')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            activeTab === 'home'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Home size={16} />
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => handleNavigation('orders')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            activeTab === 'orders'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <FileText size={16} />
          <span className="text-xs font-medium">Orders</span>
        </button>

        {/* Role-specific middle tab */}
        {userRole === 'consultant' ? (
          <button
            onClick={() => handleNavigation('ar-system')}
            className={`relative flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
              activeTab === 'ar-system'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Smartphone size={16} />
            <span className="text-xs font-medium">AR</span>
          </button>
        ) : (
          <button
            onClick={() => handleNavigation('requests')}
            className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
              activeTab === 'requests'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Inbox size={16} />
            <span className="text-xs font-medium">Requests</span>
          </button>
        )}

        <button
          onClick={() => handleNavigation('schedule')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            activeTab === 'schedule'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Calendar size={16} />
          <span className="text-xs font-medium">Schedule</span>
        </button>

        <button
          onClick={() => handleNavigation('revenue')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            activeTab === 'revenue'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <DollarSign size={16} />
          <span className="text-xs font-medium">Revenue</span>
        </button>
      </div>
    </nav>
  );
}