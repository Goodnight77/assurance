import { useState, useEffect } from 'react';

interface AuthData {
  isAuthenticated: boolean;
  email: string;
  role: string;
  timestamp: number;
  expiresAt: number;
}

export const useAuth = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedAuth = localStorage.getItem('authData');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth) as AuthData;
        
        // Check if token is expired
        if (parsedAuth.expiresAt && Date.now() > parsedAuth.expiresAt) {
          logout();
          return;
        }
        
        setAuthData(parsedAuth);
      } catch (error) {
        console.error('Error parsing auth data:', error);
        logout();
      }
    }
  };

  const isAuthenticated = () => {
    return authData?.isAuthenticated === true;
  };

  const logout = () => {
    localStorage.removeItem('authData');
    setAuthData(null);
    window.location.href = '/login';
  };

  return {
    isAuthenticated: isAuthenticated(),
    authData,
    logout,
    checkAuth
  };
};