
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ItemDetails from './pages/ItemDetails';
import PostAd from './pages/PostAd';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Help from './pages/Help';
import Contact from './pages/Contact';
import LocationPrompt from './components/LocationPrompt';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const checkAuth = () => {
    const userStr = localStorage.getItem('user');
    return !!userStr;
  };
  const checkAdmin = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return !!user.isAdmin;
    }
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth());
  const [isAdmin, setIsAdmin] = useState(checkAdmin());

  const handleLogin = () => {
     setIsLoggedIn(true);
     setIsAdmin(checkAdmin());
  };
  const handleLogout = () => {
     localStorage.removeItem('user');
     setIsLoggedIn(false);
     setIsAdmin(false);
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
          <Route path="/post-ad" element={<PostAd />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
