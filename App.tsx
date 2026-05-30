
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LocationPrompt from './components/LocationPrompt';
import ChatBot from './components/ChatBot';
import AdminRoute from './components/AdminRoute';

// ── Lazy-loaded page components for code splitting ──
const Home = React.lazy(() => import('./pages/Home'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const ItemDetails = React.lazy(() => import('./pages/ItemDetails'));
const PostAd = React.lazy(() => import('./pages/PostAd'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Login = React.lazy(() => import('./pages/Login'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Help = React.lazy(() => import('./pages/Help'));
const Contact = React.lazy(() => import('./pages/Contact'));
const BuyingGuides = React.lazy(() => import('./pages/BuyingGuides'));
const SafetyTips = React.lazy(() => import('./pages/SafetyTips'));
const SellingAdvice = React.lazy(() => import('./pages/SellingAdvice'));
const MarketTrends = React.lazy(() => import('./pages/MarketTrends'));
const Terms = React.lazy(() => import('./pages/Terms'));
const PaymentPortal = React.lazy(() => import('./pages/PaymentPortal'));

// ── SEO Landing Pages ──
const TorontoClassifieds = React.lazy(() => import('./pages/TorontoClassifieds'));
const BuyAndSellToronto = React.lazy(() => import('./pages/BuyAndSellToronto'));
const LocalServicesToronto = React.lazy(() => import('./pages/LocalServicesToronto'));
const JobsToronto = React.lazy(() => import('./pages/JobsToronto'));
const RealEstateToronto = React.lazy(() => import('./pages/RealEstateToronto'));
const SriLankanMarketplace = React.lazy(() => import('./pages/SriLankanMarketplace'));

// ── Loading Fallback ──
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading...</span>
    </div>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/buying-guides" element={<BuyingGuides />} />
            <Route path="/safety-tips" element={<SafetyTips />} />
            <Route path="/selling-advice" element={<SellingAdvice />} />
            <Route path="/market-trends" element={<MarketTrends />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/payment-portal" element={isLoggedIn ? <PaymentPortal /> : <Navigate to="/login" replace state={{ from: '/payment-portal' }} />} />

            {/* SEO Landing Pages */}
            <Route path="/toronto-classifieds" element={<TorontoClassifieds />} />
            <Route path="/buy-and-sell-toronto" element={<BuyAndSellToronto />} />
            <Route path="/local-services-toronto" element={<LocalServicesToronto />} />
            <Route path="/jobs-toronto" element={<JobsToronto />} />
            <Route path="/real-estate-toronto" element={<RealEstateToronto />} />
            <Route path="/sri-lankan-marketplace-canada" element={<SriLankanMarketplace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
