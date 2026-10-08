import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FiEye, FiEyeOff, FiMail, FiLock, FiShield, FiUser, FiCheckCircle } from 'react-icons/fi';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSentMessage, setForgotSentMessage] = useState('');

  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password, activeTab);
    setLoading(false);

    if (res.success && res.user) {
      // Small delay to ensure React state (user/loading) has propagated before route guards check
      setTimeout(() => {
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (res.user.role === 'officer') {
          navigate('/officer/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 100);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      const data = await api.post('/auth/forgotpassword', { email: forgotEmail });
      if (data.success) {
        setForgotSentMessage('Simulated email reset link has been dispatched! Check your backend server console.');
        showToast('Reset email simulated!', 'success');
      } else {
        showToast(data.message || 'Email not found', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex-shrink-0 min-h-full w-full flex justify-center items-start px-4 py-12 pb-24 bg-[#f4f7f9]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col justify-between w-[40%] p-10 lg:p-12 bg-gradient-to-br from-brand-900 via-brand-800 to-tealbrand-900 relative overflow-hidden transition-colors duration-500">
          {/* Subtle animated background shapes */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-500/20 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tealbrand-500/20 blur-[80px] rounded-full mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay"></div>
          </div>
          
          <div className="relative z-10 text-white mt-4 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-8 border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {activeTab === 'user' ? 'Citizen Portal' : 'Official Workspace'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-5 leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Resolve</span>
              <span className="text-brand-400">Hub</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed font-medium mb-8">
              {activeTab === 'user' 
                ? 'Your digital bridge to municipal services. Report issues, attach proof, and track resolution in real-time without the paperwork.' 
                : 'The centralized dashboard for department heads and officers to manage, route, and resolve civic grievances efficiently.'}
            </p>

            {/* Dynamic Features List */}
            <div className="space-y-4 mt-2">
              {activeTab === 'user' ? (
                <>
                  <div className="flex items-center gap-3 text-slate-200">
                    <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                    <span className="text-sm font-semibold">Real-time status tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                    <span className="text-sm font-semibold">Easy photo & location uploads</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                    <span className="text-sm font-semibold">Instant SMS notifications</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-slate-200">
                    <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                    <span className="text-sm font-semibold">Automated department routing</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                    <span className="text-sm font-semibold">Advanced analytics dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                    <span className="text-sm font-semibold">SLA monitoring & escalations</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="relative z-10 text-white mt-8 mb-2">
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'user' ? 'bg-brand-400' : 'bg-tealbrand-400'}`}></div>
              <p className="italic font-medium text-slate-200 text-xs leading-relaxed">
                {activeTab === 'user'
                  ? '"A significant step towards better governance and immediate resolution."'
                  : '"Empowering authorities with data-driven tools for faster urban maintenance."'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-[60%] flex flex-col bg-white px-8 py-10 sm:px-14 sm:py-14 z-10">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-semibold">
              {activeTab === 'admin'
                ? 'Sign in to access the secure authority control panel.'
                : 'Sign in to your citizen grievance dashboard.'}
            </p>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex p-1 bg-slate-100/70 backdrop-blur-sm rounded-xl mb-8 border border-slate-200/50">
            <button
              onClick={() => {
                setActiveTab('user');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 flex justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'user'
                  ? 'bg-white text-brand-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <FiUser className={activeTab === 'user' ? 'text-brand-600' : 'text-slate-400'} /> Citizen
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 flex justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-white text-brand-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <FiShield className={activeTab === 'admin' ? 'text-brand-600' : 'text-slate-400'} /> Official
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <FiMail className="text-lg" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'admin@city.gov.in' : 'citizen@example.com'}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotSentMessage('');
                    setForgotEmail('');
                  }}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <FiLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 h-6">
            {activeTab === 'user' ? (
              <p className="text-center text-sm text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-center text-sm text-slate-500 font-medium">
                Need administrative access?{' '}
                <span className="font-bold text-slate-400 cursor-not-allowed">
                  Contact IT Support
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-8 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex justify-center transition-colors"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-full bg-brand-50 flex justify-center text-brand-600 mb-4">
              <FiLock className="text-xl" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Enter your registered email address and we will output a password recovery link to the server logs.
            </p>
            {forgotSentMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium leading-relaxed flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {forgotSentMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                     <FiMail className="text-lg" />
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="citizen@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all shadow-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="py-3.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;






