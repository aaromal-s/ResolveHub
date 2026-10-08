import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiUsers, FiTrendingUp, FiShield, FiArrowRight, FiFileText, FiMapPin, FiStar } from 'react-icons/fi';

const LandingPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const defaultFeedbacks = [
    {
      _id: 'default-1',
      comment: 'The turnaround time for fixing our street lights was astounding. Submitted on Monday, fixed by Tuesday night with constant tracking updates!',
      rating: 5,
      user: { name: 'Priya Nair', role: 'user', image: '12' }
    },
    {
      _id: 'default-2',
      comment: 'No more waiting at municipal offices with physical paperwork. ResolveHub let me take a picture of the water leak and assigned an officer in hours.',
      rating: 5,
      user: { name: 'Arjun Menon', role: 'user', image: '15' }
    },
    {
      _id: 'default-3',
      comment: 'As a department officer, this platform brings immense clarity to our daily queue. The SLA tracking helps us prioritize urgent civic repairs.',
      rating: 5,
      user: { name: 'Officer Sarah', role: 'admin', image: '32' }
    }
  ];

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await api.get('/platform-feedback');
        if (data.success && data.feedbacks && data.feedbacks.length > 0) {
          setFeedbacks(data.feedbacks);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeedbacks();
  }, []);

  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : defaultFeedbacks;

  const stats = [
    { label: 'Grievances Resolved', count: '14,820+', icon: <FiCheckCircle className="text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Avg Resolution Time', count: '3.2 Days', icon: <FiClock className="text-brand-500" />, bg: 'bg-brand-50 dark:bg-brand-500/10' },
    { label: 'Active Citizens', count: '45,000+', icon: <FiUsers className="text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'SLA Adherence', count: '97.8%', icon: <FiTrendingUp className="text-tealbrand-500" />, bg: 'bg-tealbrand-50 dark:bg-tealbrand-500/10' },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Submit Grievance',
      desc: 'Fill in details of the issue, select a category, set the priority level, and upload photo or document proof.',
      icon: <FiFileText className="text-xl" />
    },
    {
      step: '02',
      title: 'Automated Routing',
      desc: 'Our intelligent system immediately routes the complaint to the head of the respective public department.',
      icon: <FiMapPin className="text-xl" />
    },
    {
      step: '03',
      title: 'Active Resolution',
      desc: 'Track the status and timeline logs of the officer on site as they address the complaint in real-time.',
      icon: <FiClock className="text-xl" />
    },
    {
      step: '04',
      title: 'Citizen Feedback',
      desc: 'Verify the resolution notes, close the case, and leave feedback or a rating on the service quality.',
      icon: <FiStar className="text-xl" />
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0f1c] text-white pt-32 pb-40 px-6 sm:px-12 lg:px-24">
        {/* Advanced Animated Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/30 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-indigo-600/30 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-tealbrand-600/20 blur-[140px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1c]/50 to-[#0a0f1c]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Column (Text) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest w-fit backdrop-blur-md shadow-lg shadow-black/20">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-slate-300">Certified E-Governance Portal</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
              Smarter <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-tealbrand-400 drop-shadow-sm pb-2 inline-block">
                Civic Resolution.
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg sm:text-xl max-w-xl leading-relaxed mt-2 font-medium">
              Empowering citizens to report municipal issues, track resolution workflows in real-time, and hold public services accountable with total transparency.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/register"
                className="px-8 py-4 text-sm font-bold bg-white text-slate-900 rounded-2xl hover:bg-slate-100 hover:scale-105 transition-all flex items-center gap-2 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
              >
                File a Grievance <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-sm font-bold bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-2xl transition-all active:scale-95 flex items-center gap-2"
              >
                Track Status
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-5 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-fit">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?img=3" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-brand-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">+14k</div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-amber-400 text-xs">
                  <FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" />
                </div>
                <p className="text-xs font-medium text-slate-300 mt-1">Trusted by citizens statewide</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Mockup) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-6 xl:col-span-7 relative w-full perspective-1000 mt-10 lg:mt-0"
          >
            {/* Main Dashboard Card */}
            <div className="relative z-20 bg-[#111827]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-900/40 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-700 ease-out preserve-3d">
              
              {/* Fake Mac Titlebar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 backdrop-blur-md">
                   <FiShield className="text-brand-400 text-sm" />
                   <span className="text-xs font-medium text-slate-300">ResolveHub Workspace</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 relative">
                <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.5}} className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/10 transition-colors backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                      <FiCheckCircle className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">Water Pipeline Leakage</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                        <span className="text-slate-300">CMP-004</span> • <span>Public Works</span> • <span>Just now</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-1.5 w-fit mt-2 sm:mt-0">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Resolved
                  </span>
                </motion.div>

                <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.7}} className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/10 transition-colors backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                      <FiClock className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">Street Light Outage</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                        <span className="text-slate-300">CMP-002</span> • <span>Electrical</span> • <span>2h ago</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 w-fit mt-2 sm:mt-0">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span> Assigned
                  </span>
                </motion.div>

                <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.9}} className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/10 transition-colors backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/10">
                      <FiMapPin className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">Garbage Accumulation</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                        <span className="text-slate-300">CMP-003</span> • <span>Sanitation</span> • <span>5h ago</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center gap-1.5 w-fit mt-2 sm:mt-0">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse"></span> In Progress
                  </span>
                </motion.div>
              </div>
            </div>
            
            {/* Floating Elements (Decorative) */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
              className="absolute -right-4 lg:-right-8 -top-8 z-30 bg-gradient-to-br from-tealbrand-500 to-tealbrand-600 p-4 rounded-2xl shadow-xl shadow-tealbrand-500/30 border border-white/20 hidden sm:flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <FiTrendingUp className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-tealbrand-100 uppercase tracking-widest">Resolution Rate</p>
                <p className="text-xl font-black text-white">98.5%</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} 
              className="absolute -left-4 lg:-left-12 bottom-4 lg:bottom-12 z-30 bg-[#1e293b]/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-black/50 border border-white/10 hidden sm:flex items-center gap-3"
            >
              <div className="relative">
                <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border-2 border-slate-700" alt="Officer" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#1e293b] rounded-full"></span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Officer</p>
                <p className="text-sm font-bold text-white">S. Kumar (PWD)</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section (Lifted) */}
      <section className="max-w-7xl mx-auto -mt-16 px-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className={`p-4 ${stat.bg} rounded-2xl text-2xl group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.count}</h3>
                <p className="text-xs lg:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto py-28 px-6 sm:px-12 lg:px-24">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest border border-brand-100 dark:border-brand-500/20">Workflow</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">How It Works</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mt-2 leading-relaxed">
            A simplified, 4-step digital process replacing manual paper trails with transparency and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-12 left-24 right-24 h-0.5 bg-gradient-to-r from-slate-200 dark:from-slate-800 via-brand-200 dark:via-brand-500/30 to-slate-200 dark:to-slate-800 z-0"></div>

          {workflowSteps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center mb-8 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute inset-0 bg-brand-50 dark:bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-3xl text-brand-600 dark:text-brand-400">
                  {step.icon}
                </div>
                <div className="absolute top-2 right-2 text-3xl font-extrabold text-slate-100/50 dark:text-slate-800/50 -mr-2 -mt-2 group-hover:text-brand-100 dark:group-hover:text-slate-700 transition-colors">
                  {step.step}
                </div>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xl mb-3">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-28 px-6 sm:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center flex flex-col items-center gap-3 mb-20">
            <span className="px-4 py-1.5 rounded-full bg-tealbrand-500/10 text-tealbrand-400 text-xs font-bold uppercase tracking-widest border border-tealbrand-500/20">Testimonials</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Citizen Feedback</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayFeedbacks.slice(0, 3).map((fb) => (
              <div key={fb._id} className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 flex flex-col gap-6 relative group hover:bg-slate-800 transition-colors">
                <div className="absolute -top-4 -left-4 text-6xl text-slate-700/50 font-serif font-black">"</div>
                <p className="text-slate-300 text-sm leading-relaxed relative z-10 font-medium line-clamp-4">
                  {fb.comment}
                </p>
                <div className="mt-auto border-t border-slate-700/50 pt-6 flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/100?img=${fb.user?.image || '11'}`} className="w-12 h-12 rounded-full border-2 border-slate-600 object-cover" alt="Avatar" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{fb.user?.name || 'Citizen'}</h4>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${fb.user?.role === 'admin' ? 'text-tealbrand-400' : 'text-brand-400'}`}>
                      {fb.user?.role === 'admin' ? 'Dept Officer' : 'Verified Citizen'}
                    </span>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`text-xs ${i < fb.rating ? 'text-amber-400' : 'text-slate-600'}`} fill={i < fb.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-600 to-tealbrand-600 rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-brand-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 relative z-10">
            Ready to make a difference?
          </h2>
          <p className="text-brand-50 text-base md:text-lg max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed">
            Join thousands of citizens actively contributing to a better, more accountable civic infrastructure.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="px-10 py-4 text-sm font-bold bg-white text-brand-700 rounded-2xl hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
