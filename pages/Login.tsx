
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/HitAds.png';
import { trackUserRegistration } from '../analytics';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'verify-pending'>( location.state?.mode || 'login');
  const [pendingEmail, setPendingEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (location.state?.mode) {
      setAuthMode(location.state.mode);
    }
  }, [location.state]);

  // Handle ?verified=true or ?verified=already from verify.php redirect
  useEffect(() => {
    // HashRouter: params may be in location.search or inside window.location.hash
    let params = new URLSearchParams(location.search);
    if (!params.get('verified')) {
      // Fallback: parse from hash (e.g. /#/login?verified=true)
      const hash = window.location.hash;
      const qIndex = hash.indexOf('?');
      if (qIndex !== -1) {
        params = new URLSearchParams(hash.substring(qIndex));
      }
    }
    const verified = params.get('verified');
    if (verified === 'true') {
      setSuccessMsg('🎉 Email verified successfully! You can now sign in.');
      setAuthMode('login');
    } else if (verified === 'already') {
      setSuccessMsg('Your email is already verified. Please sign in.');
      setAuthMode('login');
    }
  }, [location.search]);

  const handleResendVerification = async () => {
    if (!pendingEmail) return;
    setResending(true);
    setError('');
    try {
      const response = await fetch('/api/auth/resend-verify.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(data.message);
      } else {
        setError(data.message || 'Failed to resend verification email.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (authMode === 'login') {
        const response = await fetch('/api/auth/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (data.success) {
          const userRole = data.user && data.user.role ? String(data.user.role).trim().toLowerCase() : '';
          const isUserAdmin = userRole === 'admin';
          localStorage.setItem('user', JSON.stringify({ ...data.user, isAdmin: isUserAdmin }));
          onLogin();
          navigate('/');
        } else if (data.needsVerification) {
          // User exists but email not verified
          setPendingEmail(data.email || email);
          setAuthMode('verify-pending');
        } else {
          setError(data.message || 'Invalid email or password.');
        }
      } else if (authMode === 'register') {
        const response = await fetch('/api/auth/register.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        
        if (data.success) {
          // Fire analytics event
          trackUserRegistration('email');
          // Show verify-pending screen instead of auto-login
          setPendingEmail(email);
          setAuthMode('verify-pending');
        } else {
          setError(data.message || 'Failed to register.');
        }
      } else if (authMode === 'forgot') {
        const response = await fetch('/api/auth/reset.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (data.success) {
          setSuccessMsg('Password reset successful! You can now sign in.');
          setAuthMode('login');
          setPassword('');
        } else {
          setError(data.message || 'Failed to reset password.');
        }
      }
    } catch (err) {
      setError('Network error. Backend might not be running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify-pending screen
  if (authMode === 'verify-pending') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Link to="/">
                <img src={logoImg} alt="HitAds Logo" className="h-24 object-contain transition-transform hover:scale-105" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-icons text-green-500" style={{ fontSize: '40px' }}>mark_email_read</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Check Your Email</h2>
            <p className="text-sm text-slate-500 font-medium mb-2">
              We've sent a verification link to
            </p>
            <p className="text-sm font-bold text-primary mb-6">{pendingEmail}</p>
            <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">
              Click the link in the email to verify your account. Check your spam folder if you don't see it.
            </p>

            {successMsg && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 mb-4">
                <span className="material-icons text-sm">check_circle</span>
                {successMsg}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 mb-4">
                <span className="material-icons text-sm">error</span>
                {error}
              </div>
            )}

            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
            >
              <span className="material-icons text-lg">refresh</span>
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  let title = 'Welcome Back';
  let subtitleText = "Don't have an account?";
  let subtitleAction = 'Sign up for free';
  let submitText = 'Sign In';

  if (authMode === 'register') {
    title = 'Create an Account';
    subtitleText = 'Already have an account?';
    subtitleAction = 'Sign In';
    submitText = 'Sign Up';
  } else if (authMode === 'forgot') {
    title = 'Reset Password';
    subtitleText = 'Remember your password?';
    subtitleAction = 'Sign In';
    submitText = 'Reset Password';
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Link to="/">
              <img src={logoImg} alt="HitAds Logo" className="h-24 object-contain transition-transform hover:scale-105" />
            </Link>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {subtitleText}{' '}
            <button 
              type="button" 
              onClick={() => {
                if (authMode === 'login') setAuthMode('register');
                else setAuthMode('login');
                setError('');
                setSuccessMsg('');
              }} 
              className="font-bold text-primary hover:underline"
            >
              {subtitleAction}
            </button>
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                <span className="material-icons text-sm">error</span>
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="material-icons text-sm">check_circle</span>
                {successMsg}
              </div>
            )}

            <div className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-400 text-lg">person</span>
                    <input 
                      type="text" 
                      required={authMode === 'register'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium transition-all" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                </div>
              )}
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
                    placeholder="alex.j@example.com" 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{authMode === 'forgot' ? 'New Password' : 'Password'}</label>
                  {authMode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3.5 text-slate-400 text-lg">lock_outline</span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium transition-all" 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-icons text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>

            {authMode !== 'forgot' && (
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
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary-hover text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-secondary/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {submitText}
              <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="material-icons text-xs">info</span> Demo Account
              </h4>
              <div className="flex justify-between items-center">
                <code className="text-[11px] font-bold text-slate-600">alex.j@example.com</code>
                <code className="text-[11px] font-bold text-slate-600">password123</code>
              </div>
              <button 
                type="button"
                onClick={() => { setEmail('alex.j@example.com'); setPassword('password123'); }}
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
