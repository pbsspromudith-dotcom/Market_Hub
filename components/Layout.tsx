
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CURRENT_USER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

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
                MARKET<span className="text-primary">{isAdminPage ? 'ADMIN' : 'HUB'}</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {!isAdminPage && (
                <>
                  <Link to="/search" className="text-sm font-medium hover:text-primary transition-colors">Browse</Link>
                  <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-icons text-lg">dashboard</span>
                    My Dashboard
                  </Link>
                  <Link to="/post-ad" className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm">
                    <span className="material-icons text-sm">add</span>
                    Post an Ad
                  </Link>
                </>
              )}
              {isAdminPage && (
                <Link to="/" className="text-sm font-medium text-slate-500 hover:text-primary">Exit Admin</Link>
              )}
              <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold">{CURRENT_USER.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{CURRENT_USER.role}</p>
                </div>
                <Link to="/dashboard/settings">
                  <img src={CURRENT_USER.avatar} alt="Avatar" className="w-9 h-9 rounded-full border border-slate-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg">
                  <span className="material-icons text-white text-sm">shopping_bag</span>
                </div>
                <span className="text-lg font-bold tracking-tight">MARKET<span className="text-primary">HUB</span></span>
              </div>
              <p className="text-sm text-slate-500 mb-6 max-w-sm">
                The world's leading community-driven marketplace for local goods, services, and community connections.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Safety Tips</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <p>© 2024 MarketHub Pro. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Facebook</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
