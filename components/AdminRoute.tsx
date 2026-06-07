import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ isAdmin, children }) => {
  // Check both the live React prop AND localStorage as a fallback
  // This avoids the race condition where navigate('/dashboard') fires 
  // before the parent setState has re-rendered with the new isAdmin value
  const localIsAdmin = (() => {
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

  if (!isAdmin && !localIsAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
