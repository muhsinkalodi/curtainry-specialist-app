'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { User, Bell, Menu, FileText, UserCircle, LogOut, Star, Home, Calendar, TrendingUp, DollarSign, Inbox, X, CheckCircle, Clock, Smartphone, ArrowLeft } from 'lucide-react';
import HomeDashboard from './HomeDashboard';
import OrdersPage from './OrdersPage';
import SchedulePage from './SchedulePage';
import RevenuePage from './RevenuePage';
import Profile from './Profile';
import ARSystem from './ARSystem';
import NewRequests from './NewRequests';

interface DashboardProps {
  userRole: 'consultant' | 'fitter';
  userData: any;
  onLogout: () => void;
}

export default function Dashboard({ userRole, userData, onLogout }: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Determine current page from pathname
  const getCurrentPage = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'home';
    if (pathname === '/orders') return 'orders';
    if (pathname.startsWith('/orders/')) return 'order-detail';
    if (pathname === '/ar') return 'ar-system';
    if (pathname === '/requests') return 'requests';
    if (pathname === '/schedule') return 'schedule';
    if (pathname === '/revenue') return 'revenue';
    if (pathname === '/profile') return 'profile';
    return 'home';
  };

  const currentPage = getCurrentPage();

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
      case 'profile':
        router.push(`/profile?${params.toString()}`);
        break;
      default:
        router.push(`/dashboard?${params.toString()}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderBackButton = () => {
    if (currentPage === 'home') return null;
    
    return (
      <div className="p-4">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft 
            size={20} 
            className="group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" 
          />
          <span className="font-medium">Back</span>
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomeDashboard userType={userRole} />;
      
      case 'orders':
        return (
          <div>
            {renderBackButton()}
            <OrdersPage userRole={userRole} userData={userData} />
          </div>
        );
      
      case 'schedule':
        return (
          <div>
            {renderBackButton()}
            <SchedulePage userRole={userRole} userData={userData} />
          </div>
        );
      
      case 'revenue':
        return (
          <div>
            {renderBackButton()}
            <RevenuePage userRole={userRole} userData={userData} />
          </div>
        );
      
      case 'profile':
        return (
          <div>
            {renderBackButton()}
            <Profile userRole={userRole} userData={userData} />
          </div>
        );
      
      case 'ar-system':
        return (
          <div>
            {renderBackButton()}
            <ARSystem userType={userRole} />
          </div>
        );
      
      case 'requests':
        return (
          <div>
            {renderBackButton()}
            <NewRequests userRole={userRole} userData={userData} />
          </div>
        );
      
      default:
        return <HomeDashboard userType={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              {/* Hamburger Menu */}
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Curtainry</h1>
                <p className="text-xs text-gray-500 capitalize">{userRole} Dashboard</p>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {userData?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {userData?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{userData?.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star size={12} className="text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{userData?.rating || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        handleNavigation('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <UserCircle size={16} />
                      <span>View Profile</span>
                    </button>
                    
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowSidebar(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-xl z-50 transform transition-transform">
            <div className="h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                      <p className="text-sm text-gray-500 capitalize">{userRole} Menu</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {/* Main Navigation */}
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</h3>
                    <div className="space-y-1">
                      {(() => {
                        const baseItems = [
                          { id: 'home', label: 'Dashboard', icon: Home },
                          { id: 'orders', label: 'Orders', icon: FileText },
                        ];
                        
                        const roleSpecificItems = userRole === 'consultant' 
                          ? [{ id: 'ar-system', label: 'AR System', icon: Smartphone }]
                          : [{ id: 'requests', label: 'New Requests', icon: Inbox }];
                        
                        const commonItems = [
                          { id: 'schedule', label: 'Schedule', icon: Calendar },
                          { id: 'revenue', label: 'Revenue', icon: DollarSign },
                        ];
                        
                        return [...baseItems, ...roleSpecificItems, ...commonItems];
                      })().map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              handleNavigation(item.id);
                              setShowSidebar(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              currentPage === item.id
                                ? 'bg-primary-light text-primary border-r-2 border-primary'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon size={18} />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    handleNavigation('profile');
                    setShowSidebar(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserCircle size={18} />
                  <span className="font-medium">Profile Settings</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-16">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2">
        <div className="flex justify-around items-center">
          <button
            onClick={() => handleNavigation('home')}
            className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
              currentPage === 'home'
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
              currentPage === 'orders'
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
                currentPage === 'ar-system'
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
                currentPage === 'requests'
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
              currentPage === 'schedule'
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
              currentPage === 'revenue'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <DollarSign size={16} />
            <span className="text-xs font-medium">Revenue</span>
          </button>
        </div>
      </nav>

      {/* Background overlay for mobile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
}