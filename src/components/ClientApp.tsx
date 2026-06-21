"use client";

import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import LocationPrompt from './LocationPrompt';
import ChatBot from './ChatBot';
import { UIProvider } from './UIProvider';
import { usePathname } from 'next/navigation';

export default function ClientApp({ children }: { children: React.ReactNode }) {
  const checkAuth = () => {
    if (typeof window === 'undefined') return false;
    const userStr = localStorage.getItem('user');
    return !!userStr;
  };
  const checkAdmin = () => {
    if (typeof window === 'undefined') return false;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userRole = user.role ? String(user.role).trim().toLowerCase() : '';
        return !!user.isAdmin || userRole === 'admin' || userRole === 'seo';
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(checkAuth());
    setIsAdmin(checkAdmin());
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(checkAuth());
      setIsAdmin(checkAdmin());
    };
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth_updated', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth_updated', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setIsAdmin(false);
      window.dispatchEvent(new Event('auth_updated'));
    }
  };

  return (
    <UIProvider>
      <LocationPrompt />
      <ChatBot />
      <Layout isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout}>
        {children}
      </Layout>
    </UIProvider>
  );
}
