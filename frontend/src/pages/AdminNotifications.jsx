import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiUsers, FiShield, FiGlobe, FiAlertCircle } from 'react-icons/fi';

const AdminNotifications = () => {
  const { showToast } = useAuth();
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('citizens');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const data = await api.post('/notifications/broadcast', { message, targetGroup });
      if (data.success) {
        showToast(data.message || 'Announcement broadcasted successfully', 'success');
        setMessage('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  const getTargetDescription = () => {
    switch(targetGroup) {
      case 'citizens':
        return "This alert will be sent to all registered Citizens. Use this for general public updates or warnings.";
      case 'officers':
        return "This alert will be sent only to Officers. Use this for internal administrative announcements or policy changes.";
      case 'all':
        return "CRITICAL: This alert will be sent to EVERYONE in the system (Citizens and Officers). Use sparingly.";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Global Announcements</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Broadcast alerts and important updates directly to users' notification feeds.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleBroadcast} className="relative z-10 flex flex-col gap-10">
            
            {/* Target Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                Select Target Audience *
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className={`cursor-pointer relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${targetGroup === 'citizens' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 shadow-md shadow-brand-500/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-300'}`}>
                  <input type="radio" name="target" value="citizens" checked={targetGroup === 'citizens'} onChange={() => setTargetGroup('citizens')} className="sr-only" />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${targetGroup === 'citizens' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <FiUsers className="text-2xl" />
                  </div>
                  <span className={`font-bold ${targetGroup === 'citizens' ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'}`}>Citizens</span>
                </label>

                <label className={`cursor-pointer relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${targetGroup === 'officers' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-md shadow-indigo-500/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300'}`}>
                  <input type="radio" name="target" value="officers" checked={targetGroup === 'officers'} onChange={() => setTargetGroup('officers')} className="sr-only" />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${targetGroup === 'officers' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <FiShield className="text-2xl" />
                  </div>
                  <span className={`font-bold ${targetGroup === 'officers' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>Officers Only</span>
                </label>

                <label className={`cursor-pointer relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${targetGroup === 'all' ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/10 shadow-md shadow-rose-500/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-rose-300'}`}>
                  <input type="radio" name="target" value="all" checked={targetGroup === 'all'} onChange={() => setTargetGroup('all')} className="sr-only" />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${targetGroup === 'all' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <FiGlobe className="text-2xl" />
                  </div>
                  <span className={`font-bold ${targetGroup === 'all' ? 'text-rose-700 dark:text-rose-300' : 'text-slate-700 dark:text-slate-300'}`}>Everyone</span>
                </label>
              </div>
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                Announcement Message *
              </label>
              <div className="relative group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your notice message here... (e.g. Scheduled maintenance: Sector 4 water supply will be down on 9th July for valve repairs)"
                  className="w-full px-6 py-5 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-700 dark:text-slate-200 resize-none h-40 transition-all text-base"
                  required
                />
                <div className="absolute bottom-5 right-6 text-xs font-bold text-slate-400">
                  {message.length} chars
                </div>
              </div>
            </div>

            {/* Contextual Warning */}
            <div className={`flex gap-4 p-6 rounded-[2rem] border ${targetGroup === 'all' ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300' : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300'}`}>
              <FiAlertCircle className="text-2xl shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">Important Notice:</h4>
                <p className="text-sm font-medium opacity-90 leading-relaxed">
                  {getTargetDescription()} Broadcasting notifications generates database alert items for every single selected user.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="w-full py-5 bg-slate-900 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-black text-lg rounded-[2rem] shadow-xl shadow-slate-900/20 dark:shadow-brand-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed group"
            >
              {sending ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  Broadcasting...
                </>
              ) : (
                <>
                  <FiSend className="text-xl group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  Broadcast Announcement
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
