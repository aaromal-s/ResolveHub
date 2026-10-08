import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiCheckCircle } from 'react-icons/fi';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill in all mandatory fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex-shrink-0 min-h-full w-full flex justify-center items-start px-4 py-8 pb-24 bg-[#f4f7f9]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col justify-between w-[40%] p-8 lg:p-10 bg-gradient-to-br from-brand-900 via-brand-800 to-tealbrand-900 relative overflow-hidden transition-colors duration-500">
          {/* Subtle animated background shapes */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-500/20 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tealbrand-500/20 blur-[80px] rounded-full mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay"></div>
          </div>
          
          <div className="relative z-10 text-white mt-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Join the Community
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3 leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Resolve</span>
              <span className="text-brand-400">Hub</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed font-medium mb-6">
              Empowering citizens to build better cities, together. Start transforming your community today.
            </p>

            {/* Dynamic Features List */}
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-3 text-slate-200">
                <FiCheckCircle className="text-emerald-400 text-lg shrink-0" />
                <span className="text-sm font-semibold">Real-time status tracking</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <FiCheckCircle className="text-emerald-400 text-lg shrink-0" />
                <span className="text-sm font-semibold">Easy photo & location uploads</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <FiCheckCircle className="text-emerald-400 text-lg shrink-0" />
                <span className="text-sm font-semibold">Instant SMS notifications</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 text-white mt-6 mb-0">
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-400"></div>
              <p className="italic font-medium text-slate-200 text-xs leading-relaxed">
                "By creating an account, you get direct access to lodge grievances, track real-time resolution, and communicate with municipal departments."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-[60%] flex flex-col bg-white px-8 py-8 sm:px-12 sm:py-10 z-10">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Citizen Account
            </h2>
            <p className="text-slate-500 text-xs mt-1.5 font-semibold">
              Register to submit, track, and review civic grievances in your area
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <FiUser className="text-base" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <FiMail className="text-base" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <FiPhone className="text-base" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <FiLock className="text-base" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-semibold pl-1">Minimum 6 characters</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-1 bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? 'Registering account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 h-6">
            <p className="text-center text-sm text-slate-500 font-medium">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;





