
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ItemDetails from './pages/ItemDetails';
import PostAd from './pages/PostAd';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Help from './pages/Help';
import Contact from './pages/Contact';
import LocationPrompt from './components/LocationPrompt';
import ChatBot from './components/ChatBot';
import AdminRoute from './components/AdminRoute';

const App: React.FC = () => {
  const checkAuth = () => {
    const userStr = localStorage.getItem('user');
    return !!userStr;
  };
  const checkAdmin = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const userRole = user.role ? String(user.role).trim().toLowerCase() : '';
      return !!user.isAdmin || userRole === 'admin';
    }
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth());
  const [isAdmin, setIsAdmin] = useState(checkAdmin());

  // Re-sync auth state from localStorage (fixes race condition after login/navigate)
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAdmin(checkAdmin());
    // Dispatch custom event so the listener above fires on same-window updates too
    window.dispatchEvent(new Event('auth_updated'));
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.dispatchEvent(new Event('auth_updated'));
  };

  return (
    <Router>
      <LocationPrompt />
      <ChatBot />
      <Layout isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/post-ad" element={isLoggedIn ? <PostAd /> : <Navigate to="/login" replace state={{ from: '/post-ad' }} />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<AdminRoute isAdmin={isAdmin}><AdminDashboard /></AdminRoute>} />
          <Route path="/admin" element={<AdminRoute isAdmin={isAdmin}><AdminDashboard /></AdminRoute>} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
