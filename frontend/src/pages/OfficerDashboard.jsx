import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiFolder, FiClock, FiAlertTriangle, FiCheckCircle, FiUser, FiPhone, FiMail, FiCheck } from 'react-icons/fi';

const OfficerDashboard = () => {
  const { showToast } = useAuth();
  
  const [department, setDepartment] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, closed: 0, slaBreach: 0, avgResolutionTimeHours: 0 });
  const [unassignedComplaints, setUnassignedComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unassigned');
  const [updating, setUpdating] = useState(null);

  const fetchOfficerStats = useCallback(async () => {
    try {
      const data = await api.get('/reports/officer-dashboard');
      if (data.success) {
        setStats(data.stats);
        if (data.department) setDepartment(data.department);
        if (data.unassignedComplaints) setUnassignedComplaints(data.unassignedComplaints);
        if (data.myComplaints) setMyComplaints(data.myComplaints);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading stats', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOfficerStats();
  }, [fetchOfficerStats]);

  const handleClaim = async (id) => {
    try {
      const data = await api.put(`/complaints/${id}/claim`);
      if (data.success) {
        showToast('Complaint claimed successfully!', 'success');
        fetchOfficerStats();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickResolve = async (id) => {
    try {
      setUpdating(id);
      const data = await api.put(`/complaints/${id}/status`, {
        status: 'Resolved',
        remarks: 'Resolved directly from dashboard.',
        resolutionNotes: 'Case marked as resolved by officer.'
      });
      if (data.success) {
        showToast('Complaint resolved successfully!', 'success');
        fetchOfficerStats(); // Refresh data
      }
    } catch (err) {
      showToast(err.message || 'Failed to resolve', 'error');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  const dashboardCards = [
    { label: 'Total Tickets', value: stats.total, color: 'bg-indigo-50 border-indigo-100 text-indigo-700', icon: <FiFolder /> },
    { label: 'Active Pending', value: stats.pending, color: 'bg-amber-50 border-amber-100 text-amber-700', icon: <FiClock /> },
    { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-50 border-emerald-100 text-emerald-700', icon: <FiCheckCircle /> },
    { label: 'SLA Breached', value: stats.slaBreach, color: 'bg-rose-50 border-rose-100 text-rose-700', icon: <FiAlertTriangle /> },
  ];

  const getPriorityStyle = (pri) => {
    switch (pri) {
      case 'critical': return 'bg-rose-100 text-rose-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-sky-100 text-sky-700';
    }
  };

  const getStatusStyle = (st) => {
    switch (st) {
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Closed': return 'bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      default: return 'bg-brand-50 text-brand-700 border-brand-100';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen p-6 sm:p-10 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          {department ? `${department.name} Dashboard` : 'Department Dashboard'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
          Manage citizen grievances directly, view citizen contact details, and update case statuses.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-8 -mt-8 opacity-20 pointer-events-none transition-transform group-hover:scale-110 ${card.color.split(' ')[0]}`}></div>
            <div className="relative z-10">
              <span className="text-slate-500 dark:text-slate-400 font-extrabold text-[10px] uppercase tracking-widest block mb-2">
                {card.label}
              </span>
              <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 drop-shadow-sm">{card.value}</h2>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner relative z-10 ${card.color.split(' ')[0]} ${card.color.split(' ')[2]}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Action Center Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden flex-1 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                <FiUser className="text-sm" />
              </div>
              Action Center
            </h3>
            <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg">
              <button
                onClick={() => setActiveTab('unassigned')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'unassigned'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Unassigned Pool
              </button>
              <button
                onClick={() => setActiveTab('my_assigned')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'my_assigned'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                My Assigned
              </button>
            </div>
          </div>
          <Link to="/officer/complaints" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors shrink-0">
            View All &rarr;
          </Link>
        </div>

        {(() => {
          const displayedComplaints = activeTab === 'unassigned' ? unassignedComplaints : myComplaints;
          if (displayedComplaints.length === 0) {
            return (
              <div className="p-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                {activeTab === 'unassigned' ? 'No unassigned complaints in the pool.' : 'You have no assigned complaints.'}
              </div>
            );
          }
          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">Citizen Details</th>
                    <th className="py-4 px-6">Complaint Info</th>
                    <th className="py-4 px-6">Status & Priority</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 dark:text-slate-300">
                  {displayedComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <FiUser className="text-slate-400 dark:text-slate-500" />
                          {c.userId?.name || 'Unknown Citizen'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                          <FiMail className="text-slate-400 dark:text-slate-500" />
                          {c.userId?.email || 'N/A'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                          <FiPhone className="text-slate-400 dark:text-slate-500" />
                          {c.userId?.phone || 'No Phone'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 max-w-xs">
                      <Link to={`/officer/complaint/${c._id}`} className="font-bold text-brand-600 hover:underline mb-1 block">
                        {c.complaintId}
                      </Link>
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{c.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">{c.description}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`px-2.5 py-1 rounded-md font-black text-[10px] uppercase border shadow-sm ${getStatusStyle(c.status)}`}>
                          {c.status}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md font-black text-[10px] uppercase shadow-sm ${getPriorityStyle(c.priority)}`}>
                          {c.priority} PRIORITY
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'unassigned' && (
                          <button
                            onClick={() => handleClaim(c._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white border border-brand-200 hover:border-brand-500 rounded-xl font-bold text-xs transition-all"
                          >
                            <FiCheck />
                            Claim
                          </button>
                        )}
                        {activeTab === 'my_assigned' && ['Submitted', 'Assigned', 'In Progress'].includes(c.status) && (
                          <button
                            onClick={() => handleQuickResolve(c._id)}
                            disabled={updating === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 rounded-xl font-bold text-xs transition-all disabled:opacity-50"
                          >
                            {updating === c._id ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheck />
                            )}
                            Resolve
                          </button>
                        )}
                        <Link
                          to={`/officer/complaint/${c._id}`}
                          className="inline-flex items-center px-3 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-brand-600 border border-slate-200 dark:border-slate-700 hover:border-brand-200 rounded-xl font-bold text-xs transition-all shadow-sm group-hover:shadow-md"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          );
        })()}
        </div>
    </div>
  );
};

export default OfficerDashboard;
