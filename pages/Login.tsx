
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated network delay
    setTimeout(() => {
      if (email === 'admin@markethub.com' && password === 'admin123') {
        onLogin();
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please use the demo credentials below.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl shadow-xl shadow-primary/20 mb-6">
            <span className="material-icons text-white text-4xl">shopping_bag</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Don't have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign up for free</Link>
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                <span className="material-icons text-sm">error</span>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-400 text-lg">alternate_email</span>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium transition-all" 
                    placeholder="admin@markethub.com" 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-400 text-lg">lock_outline</span>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center px-1">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-5 w-5 text-primary focus:ring-primary border-slate-200 rounded-lg cursor-pointer transition-all" 
              />
              <label htmlFor="remember-me" className="ml-3 block text-xs font-bold text-slate-600 cursor-pointer">
                Keep me logged in
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Sign In
              <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="material-icons text-xs">info</span> Demo Account
              </h4>
              <div className="flex justify-between items-center">
                <code className="text-[11px] font-bold text-slate-600">admin@markethub.com</code>
                <code className="text-[11px] font-bold text-slate-600">admin123</code>
              </div>
              <button 
                type="button"
                onClick={() => { setEmail('admin@markethub.com'); setPassword('admin123'); }}
                className="mt-3 w-full text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                Auto-fill Credentials
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          By signing in, you agree to our <a href="#" className="text-slate-600 hover:text-primary underline transition-colors">Terms of Service</a> <br/> and <a href="#" className="text-slate-600 hover:text-primary underline transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
