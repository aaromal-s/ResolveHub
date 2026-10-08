import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FiPlus, FiAlertCircle, FiFolder, FiCheckSquare, FiArchive, FiMessageSquare, FiX, FiStar } from 'react-icons/fi';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, closed: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Platform Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const { showToast } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.get('/reports/user-dashboard');
        if (data.success) {
          setStats(data.stats);
          setRecentComplaints(data.recentComplaints);
        }
      } catch (err) {
        console.error('Failed to load user dashboard', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      showToast('Please provide a comment', 'error');
      return;
    }
    
    setSubmittingFeedback(true);
    try {
      const res = await api.post('/platform-feedback', { rating: feedbackRating, comment: feedbackComment });
      if (res.success) {
        showToast('Thank you! Your feedback has been published.', 'success');
        setShowFeedbackModal(false);
        setFeedbackComment('');
        setFeedbackRating(5);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-brand-200 dark:border-slate-800 border-t-brand-600 dark:border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Filed', count: stats.total, color: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-100 dark:border-brand-500/20', icon: <FiFolder /> },
    { label: 'Active / Pending', count: stats.pending, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20', icon: <FiAlertCircle /> },
    { label: 'Resolved', count: stats.resolved, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20', icon: <FiCheckSquare /> },
    { label: 'Closed Cases', count: stats.closed, color: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20', icon: <FiArchive /> },
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen pb-12 transition-colors duration-300">
      {/* Premium Header Banner */}
      <div className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-tealbrand-600 dark:from-brand-900 dark:via-brand-800 dark:to-tealbrand-900 py-12 px-6 sm:px-10 overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 dark:bg-black/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-brand-100 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Manage your civic grievances, track live resolution statuses, and help build a better community.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-6 py-3.5 text-sm font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-95"
            >
              <FiMessageSquare className="text-lg" /> Give Feedback
            </button>
            <Link
              to="/new-complaint"
              className="px-6 py-3.5 text-sm font-bold bg-white text-brand-700 hover:bg-brand-50 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20 transition-all active:scale-95"
            >
              <FiPlus className="text-lg" /> File New Complaint
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-8 relative z-20 flex flex-col gap-8">
        {/* KPI Stats Cards (Lifted) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-brand-200 dark:hover:border-brand-700 transition-colors"
            >
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 block">
                  {card.label}
                </span>
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{card.count}</h2>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${card.color} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden mt-4">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">Recent Submissions</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Live tracking of your latest filed grievances</p>
            </div>
            <Link to="/my-complaints" className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-700 rounded-lg text-xs font-bold transition-colors">
              View Complete History
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                <FiFolder className="text-2xl" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">No complaints filed yet.</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 mb-6">Your civic issue reports will appear here.</p>
              <Link to="/new-complaint" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 dark:bg-brand-600 text-white font-semibold rounded-lg text-sm transition-colors">
                File your first complaint
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs">
                    <th className="py-5 px-8">Tracking ID</th>
                    <th className="py-5 px-8">Issue Title</th>
                    <th className="py-5 px-8">Category</th>
                    <th className="py-5 px-8">Priority Level</th>
                    <th className="py-5 px-8">Current Status</th>
                    <th className="py-5 px-8">Filing Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-slate-600 dark:text-slate-300">
                  {recentComplaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="py-5 px-8 font-extrabold text-brand-600 dark:text-brand-400">
                        <Link to={`/complaint/${c._id}`} className="hover:underline">{c.complaintId}</Link>
                      </td>
                      <td className="py-5 px-8 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {c.title}
                      </td>
                      <td className="py-5 px-8 text-slate-500 dark:text-slate-400">{c.category ? c.category.name : 'Unassigned'}</td>
                      <td className="py-5 px-8">
                        <span
                          className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase border tracking-wider ${
                            c.priority === 'critical'
                              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                              : c.priority === 'high'
                              ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
                              : c.priority === 'medium'
                              ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                              : 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <span
                          className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center w-fit gap-1.5 ${
                            c.status === 'Resolved'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : c.status === 'Closed'
                              ? 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400'
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Resolved' ? 'bg-emerald-500 dark:bg-emerald-400' : c.status === 'Closed' ? 'bg-slate-400 dark:bg-slate-500' : 'bg-amber-500 dark:bg-amber-400'
                          }`}></span>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-slate-400 dark:text-slate-500 font-medium text-xs">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <FiMessageSquare className="text-brand-600" /> Platform Feedback
              </h3>
              <button onClick={() => setShowFeedbackModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Rate your experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${feedbackRating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                      <FiStar fill={feedbackRating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Share your testimonial
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="How was your experience using the portal? Your testimonial will be displayed on the main page."
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/20 transition-colors disabled:opacity-50"
                >
                  {submittingFeedback ? 'Publishing...' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
