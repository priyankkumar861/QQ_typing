import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Keyboard, 
  Train, 
  Landmark, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Users,
  Flame
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onContinueAsGuest }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    examType: 'SSC_CGL',
    category: 'UR'
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();

      if (data.success && data.user) {
        setSuccessMsg('Signed in successfully! Redirecting to dashboard...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 400);
      } else {
        setErrorMsg(data.message || 'Login failed. Please check your Gmail/password.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();

      if (data.success && data.user) {
        setSuccessMsg('Account registered successfully! Welcome aboard.');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 500);
      } else {
        setErrorMsg(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (accountType) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setSuccessMsg(`Logged in as ${data.user.name} (${data.user.email})`);
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 300);
      } else {
        setErrorMsg('Demo account unavailable.');
      }
    } catch (err) {
      setErrorMsg('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle ambient grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-70" />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Platform Branding & Official Telegram Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Logo & Portal Info */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Official CBT Typing Examination Portal</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              SSC & Railway <span className="text-blue-600">Typing Skill Test</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Real TCS iON and Ediquity exam simulations for SSC CGL Tier-II (DEST), SSC CHSL, and RRB NTPC Graduate & Under Graduate exams with authentic category cutoff analysis.
            </p>
          </div>

          {/* TELEGRAM COMMUNITY CARD (CLEAN VIBRANT SKY THEME) */}
          <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 border-2 border-sky-300 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[#0088cc] hover:shadow-md transition-all">
            
            {/* Telegram watermark icon in corner */}
            <div className="absolute -right-4 -bottom-4 text-[#0088cc]/10 pointer-events-none group-hover:scale-105 transition-transform">
              <Send className="w-32 h-32" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0088cc] text-white flex items-center justify-center shadow-md shadow-sky-500/25">
                    <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#0088cc]">Official Community</div>
                    <div className="text-base font-extrabold text-gray-900">@quizlauncherssc</div>
                  </div>
                </div>
                <span className="flex items-center space-x-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Active Channel</span>
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-normal">
                Join our official Telegram community for daily free typing practice passages (PDFs), SSC & RRB quizzes, live typing competitions, and cutoff alerts!
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 pt-1">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Daily Typing PDFs</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Live Speed Quizzes</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>NTPC & CGL Updates</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Weak Words Coaching</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://t.me/quizlauncherssc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0088cc] to-sky-600 hover:from-[#0077b5] hover:to-sky-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition transform hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4 -rotate-12" />
                  <span>Join Telegram Channel (@quizlauncherssc)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                </a>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="hidden sm:grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-2xs flex items-center space-x-2.5">
              <Landmark className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium text-gray-800">SSC CGL Tier-II & CHSL</span>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-2xs flex items-center space-x-2.5">
              <Train className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-gray-800">RRB NTPC Grad & UG</span>
            </div>
          </div>

        </div>

        {/* Right Column: Clean White Auth Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50">
            
            {/* Auth Mode Tabs: Sign In / Create Account */}
            <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In with Gmail
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  authMode === 'register'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Register New Candidate
              </button>
            </div>

            {/* Error / Success Messages */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Gmail / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ashish.cgl@gmail.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span>Remember candidate session</span>
                  </label>
                  <a 
                    href="https://t.me/quizlauncherssc" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Need Help? Telegram
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Sign In to Candidate Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick 1-Click Demo Logins */}
                <div className="pt-4 border-t border-gray-100 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Quick One-Click Demo Candidate Accounts:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('cgl')}
                      className="px-3 py-2 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-gray-800 rounded-xl text-xs font-semibold border border-gray-200 transition flex items-center justify-center space-x-1.5"
                    >
                      <Landmark className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ashish (SSC CGL Demo)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('ntpc')}
                      className="px-3 py-2 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 text-gray-800 rounded-xl text-xs font-semibold border border-gray-200 transition flex items-center justify-center space-x-1.5"
                    >
                      <Train className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Rahul (NTPC Demo)</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* FORM 2: REGISTER NEW CANDIDATE */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Candidate Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ashish Kumar"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Gmail / Email ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 4 characters"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 pl-10 pr-10 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Roll Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2401058392"
                      value={registerForm.rollNo}
                      onChange={(e) => setRegisterForm({ ...registerForm, rollNo: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Primary Target Exam
                    </label>
                    <select
                      value={registerForm.examType}
                      onChange={(e) => setRegisterForm({ ...registerForm, examType: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="SSC_CGL">SSC CGL Tier-II (DEST - 27 WPM)</option>
                      <option value="SSC_CHSL">SSC CHSL (LDC/JSA - 35 WPM)</option>
                      <option value="RRB_NTPC_GRAD">RRB NTPC Graduate Level 5 (30 WPM)</option>
                      <option value="RRB_NTPC_UG">RRB NTPC Under Graduate Level 2 (30 WPM)</option>
                      <option value="HINDI">Hindi Typing (25 / 30 WPM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Social Category (For Cutoff Rules)
                    </label>
                    <select
                      value={registerForm.category}
                      onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="UR">UR / General (5% / 7% Cutoff)</option>
                      <option value="OBC">OBC (7% / 10% Cutoff)</option>
                      <option value="EWS">EWS (7% / 10% Cutoff)</option>
                      <option value="SC">SC (10% Cutoff)</option>
                      <option value="ST">ST (10% Cutoff)</option>
                      <option value="PwD">PwD / PwBD (10% Cutoff)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Complete Registration & Enter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Guest Option */}
            <div className="mt-5 pt-3 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs text-gray-500 hover:text-gray-800 underline decoration-gray-300 hover:decoration-gray-600 transition"
              >
                Continue as Guest Candidate without signing in →
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
