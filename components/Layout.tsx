
import React, { useState } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');
  const isLoginPage = location.pathname === '/login';

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-sm">
                <span className="material-icons text-white">shopping_bag</span>
              </div>
              <span className="text-xl font-black tracking-tight text-[#0f172a]">
                MARKET<span className="text-primary">{isLoggedIn && isAdminPage ? 'ADMIN' : 'HUB'}</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {!isLoginPage && (
                <>
                  <Link to="/search" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Browse</Link>
                  <Link 
                    to={isLoggedIn ? "/post-ad" : "/login"} 
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/10"
                  >
                    <span className="material-icons text-sm">add</span>
                    Post an Ad
                  </Link>
                </>
              )}

              <div className="h-8 w-px bg-slate-100 mx-2"></div>

              <div className="flex items-center gap-6">
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden">
                      <img src={CURRENT_USER.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </Link>
                    <button 
                      onClick={handleLogoutClick}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-icons text-lg">logout</span>
                    </button>
                  </div>
                ) : !isLoginPage ? (
                  <div className="flex items-center gap-6">
                    <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/login" className="px-6 py-3 border-2 border-[#0f172a] text-[#0f172a] rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#0f172a] hover:text-white transition-all">
                      Join Free
                    </Link>
                  </div>
                ) : (
                  <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary">Cancel</Link>
                )}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-3">
              {!isLoginPage && (
                <Link 
                  to={isLoggedIn ? "/post-ad" : "/login"} 
                  className="bg-primary text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <span className="material-icons text-lg">add</span>
                </Link>
              )}
              <button 
                onClick={toggleMobileMenu}
                className="w-10 h-10 flex items-center justify-center text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-6 px-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
            {!isLoginPage && (
              <>
                <Link 
                  to="/search" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Browse
                </Link>
                {isLoggedIn && (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="h-px bg-slate-50 mx-4"></div>
                {isLoggedIn ? (
                  <button 
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-3 text-lg font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="space-y-4 pt-2">
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center py-4 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                    >
                      Join Free
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {!isLoginPage && (
        <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 mb-12">
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                <span className="material-icons text-lg">facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all font-black text-xs">
                X
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                <span className="material-icons text-lg">tag</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Support</h4>
                <ul className="space-y-4">
                  <li><Link to="/help" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Contact Us</Link></li>
                  <li><Link to="/help" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Trust & Safety</Link></li>
                </ul>
              </div>
            </div>

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
