'use client';

import React, { useState } from 'react';
import { LoginPage, Dashboard } from '../components';

type AppState = 'auth' | 'dashboard';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'consultant' | 'fitter' | null>(null);

  const handleLogin = (userData: any, role: 'consultant' | 'fitter') => {
    console.log('handleLogin called with:', userData, role);
    setUser(userData);
    setUserRole(role);
    setAppState('dashboard');
    console.log('App state set to dashboard');
    console.log('Current state after login:', { user: userData, userRole: role, appState: 'dashboard' });
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
    setAppState('auth');
  };

  // Add debugging for render
  console.log('Current render state:', { appState, user: !!user, userRole });

  return (
    <main>
      {appState === 'auth' && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {appState === 'dashboard' && user && userRole && (
        <Dashboard 
          userRole={userRole}
          userData={user}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}