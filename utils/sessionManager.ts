// Simple session management with browser storage
export const SessionManager = {
  // Check if localStorage is available
  isLocalStorageAvailable: () => {
    try {
      if (typeof window === 'undefined') return false;
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Save current route and user data
  saveSession: (userType: string, userId: string, currentRoute?: string) => {
    try {
      if (typeof window !== 'undefined' && SessionManager.isLocalStorageAvailable()) {
        const sessionData = {
          userType,
          userId,
          currentRoute: currentRoute || window.location.pathname,
          timestamp: Date.now()
        };
        localStorage.setItem('curtainry_session', JSON.stringify(sessionData));
      }
    } catch (error) {
      console.warn('Failed to save session data:', error);
      // Silently fail - session management is not critical for app functionality
    }
  },

  // Get saved session
  getSession: () => {
    try {
      if (typeof window !== 'undefined' && SessionManager.isLocalStorageAvailable()) {
        const sessionData = localStorage.getItem('curtainry_session');
        if (sessionData) {
          try {
            const parsed = JSON.parse(sessionData);
            // Check if session is less than 24 hours old
            if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
              return parsed;
            }
          } catch (error) {
            console.error('Error parsing session data:', error);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get session data:', error);
    }
    return null;
  },

  // Clear session
  clearSession: () => {
    try {
      if (typeof window !== 'undefined' && SessionManager.isLocalStorageAvailable()) {
        localStorage.removeItem('curtainry_session');
      }
    } catch (error) {
      console.warn('Failed to clear session data:', error);
    }
  },

  // Update current route
  updateRoute: (route: string) => {
    try {
      if (typeof window !== 'undefined' && SessionManager.isLocalStorageAvailable()) {
        const sessionData = SessionManager.getSession();
        if (sessionData) {
          sessionData.currentRoute = route;
          sessionData.timestamp = Date.now();
          localStorage.setItem('curtainry_session', JSON.stringify(sessionData));
        }
      }
    } catch (error) {
      console.warn('Failed to update route in session:', error);
    }
  }
};

// Hook for browser back button handling
export const useBrowserNavigation = (onBackNavigation?: () => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', (event) => {
      if (onBackNavigation) {
        onBackNavigation();
      }
    });
  }
};