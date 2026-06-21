"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminRouteProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ isAdmin, children }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const localIsAdmin = (() => {
    if (typeof window === 'undefined') return false;
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      const userRole = user.role ? String(user.role).trim().toLowerCase() : '';
      return !!user.isAdmin || userRole === 'admin' || userRole === 'seo';
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (mounted && !isAdmin && !localIsAdmin) {
      router.push('/admin-login');
    }
  }, [mounted, isAdmin, localIsAdmin, router]);

  if (!mounted) return null;

  if (!isAdmin && !localIsAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
