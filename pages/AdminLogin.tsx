import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/HitAds.png';

interface AdminLoginProps {
  onLogin?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real application, there would be a dedicated admin table,
      // or an isAdmin column returned from the login endpoint.
      // For demonstration, we simply attempt the auth and then forcibly elevate.
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (data.success) {
        const userRole = data.user.role ? String(data.user.role).trim().toLowerCase() : '';
        if (userRole !== 'admin' && userRole !== 'seo') {
          setError('Access denied. Only Admin and SEO users can log in here.');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('user', JSON.stringify({ ...data.user, isAdmin: true }));
        if (onLogin) onLogin();
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError('Network error. Backend might not be running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <img src={logoImg} alt="HitAds Admin Logo" className="h-24 object-contain brightness-0 invert drop-shadow-md opacity-90" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Restricted Access. Authorized personnel only.
          </p>
        </div>

        <div className="bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl shadow-black/60 border border-slate-700 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAdminLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                <span className="material-icons text-sm">error</span>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Admin Email</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-500 text-lg">alternate_email</span>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border-slate-700 text-white rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium transition-all" 
                    placeholder="admin@hitads.ca" 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Password</label>
                </div>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-500 text-lg">lock_outline</span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-900 border-slate-700 text-white rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium transition-all" 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-icons text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary-hover text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-secondary/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Secure Login
              <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
