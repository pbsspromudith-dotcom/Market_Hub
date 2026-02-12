
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');
  const isLoginPage = location.pathname === '/login';

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-sm">
                <span className="material-icons text-white">shopping_bag</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                MARKET<span className="text-primary">{isLoggedIn && isAdminPage ? 'ADMIN' : 'HUB'}</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {!isLoginPage && (
                <>
                  <Link to="/search" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Browse</Link>
                  {isLoggedIn && (
                    <Link to="/dashboard" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-1">
                      <span className="material-icons text-lg">dashboard</span>
                      Dashboard
                    </Link>
                  )}
                  <Link 
                    to={isLoggedIn ? "/post-ad" : "/login"} 
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                  >
                    <span className="material-icons text-sm">add</span>
                    Post an Ad
                  </Link>
                </>
              )}

              <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
                {isLoggedIn ? (
                  <div className="flex items-center gap-3 group relative cursor-pointer">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Welcome</p>
                      <p className="text-xs font-bold text-slate-900">{CURRENT_USER.name}</p>
                    </div>
                    <div className="relative">
                      <img src={CURRENT_USER.avatar} alt="Avatar" className="w-9 h-9 rounded-full border border-slate-200" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <button 
                      onClick={handleLogoutClick}
                      className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <span className="material-icons text-lg">logout</span>
                    </button>
                  </div>
                ) : !isLoginPage ? (
                  <div className="flex items-center gap-4">
                    <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                      Sign In
                    </Link>
                    <Link to="/login" className="px-5 py-2.5 border-2 border-slate-900 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                      Join Free
                    </Link>
                  </div>
                ) : (
                  <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary">Cancel</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {!isLoginPage && (
        <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Social Icons (As per screenshot) */}
            <div className="flex gap-4 mb-12">
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                <span className="material-icons text-lg">facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all font-bold">
                X
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                <span className="material-icons text-lg">tag</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              {/* SUPPORT Section (As per screenshot) */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Support</h4>
                <ul className="space-y-4">
                  <li>
                    <Link to="/help" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Help Center</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/help" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Trust & Safety</Link>
                  </li>
                </ul>
              </div>

              {/* Other sections can go here but keeping focus on user's screenshot layout */}
            </div>

            {/* Bottom Bar (As per screenshot) */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                © 2024 MarketHub Pro. All Rights Reserved.
              </div>
              <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Link to="/help" className="hover:text-primary">Help</Link>
                <Link to="/contact" className="hover:text-primary">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
