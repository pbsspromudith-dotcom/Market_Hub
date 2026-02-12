
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
    <div className="min-h-screen flex flex-col">
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
                    {/* Logout Dropdown (Simplified for Demo) */}
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
        <footer className="bg-white border-t border-slate-200 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg">
                    <span className="material-icons text-white text-sm">shopping_bag</span>
                  </div>
                  <span className="text-xl font-black tracking-tight text-slate-900 uppercase">MARKET<span className="text-primary">HUB</span></span>
                </div>
                <p className="text-sm text-slate-500 mb-8 max-w-sm leading-relaxed">
                  Join millions of local users buying and selling anything from cars to furniture. The safest marketplace in your neighborhood.
                </p>
                <div className="flex gap-4">
                  {['facebook', 'twitter', 'instagram'].map(social => (
                    <a key={social} href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                      <span className="material-icons text-lg">{social === 'twitter' ? 'X' : social}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">Marketplace</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-600">
                  <li><Link to="/search" className="hover:text-primary">Vehicles</Link></li>
                  <li><Link to="/search" className="hover:text-primary">Electronics</Link></li>
                  <li><Link to="/search" className="hover:text-primary">Real Estate</Link></li>
                  <li><Link to="/search" className="hover:text-primary">Community</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">Company</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-600">
                  <li><a href="#" className="hover:text-primary">About Us</a></li>
                  <li><a href="#" className="hover:text-primary">Safety Tips</a></li>
                  <li><a href="#" className="hover:text-primary">Terms of Use</a></li>
                  <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">Mobile App</h4>
                <div className="space-y-3">
                   <button className="w-full bg-slate-900 text-white p-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-colors">
                      <span className="material-icons text-lg">apple</span>
                      <div className="text-left">
                        <p className="text-[8px] font-bold uppercase leading-none opacity-60">Download on</p>
                        <p className="text-[10px] font-black leading-none">App Store</p>
                      </div>
                   </button>
                   <button className="w-full bg-slate-900 text-white p-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-colors">
                      <span className="material-icons text-lg">android</span>
                      <div className="text-left">
                        <p className="text-[8px] font-bold uppercase leading-none opacity-60">Get it on</p>
                        <p className="text-[10px] font-black leading-none">Google Play</p>
                      </div>
                   </button>
                </div>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <p>© 2024 MarketHub Pro. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-primary">Status</a>
                <a href="#" className="hover:text-primary">Help</a>
                <a href="#" className="hover:text-primary">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
