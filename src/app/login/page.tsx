"use client";

import Login from '@/old_pages/Login';

export default function Page() {
  const handleLogin = () => {
    window.dispatchEvent(new Event('auth_updated'));
  };
  return <Login onLogin={handleLogin} />;
}
