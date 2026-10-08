import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { FiFolder, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const { showToast } = useAuth();
  
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, closed: 0, slaBreach: 0, avgResolutionTimeHours: 0 });
  const [prioritySplit, setPrioritySplit] = useState({});
  const [categorySplit, setCategorySplit] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  // SLA breach detailed array
  const [breaches, setBreaches] = useState([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await api.get('/reports/admin-dashboard');
        if (data.success) {
          setStats(data.stats);
          setPrioritySplit(data.prioritySplit);
          setCategorySplit(data.categorySplit);
          setMonthlyTrend(data.monthlyTrend);
        }

        // Fetch actual list of complaints to check SLA breaches
        const complaintsData = await api.get('/complaints/all');
        if (complaintsData.success) {
          const now = new Date();
          const activeBreaches = complaintsData.complaints.filter((c) => 
            ['Submitted', 'Assigned', 'In Progress'].includes(c.status) &&
            new Date(c.slaDeadline) < now
          );
          setBreaches(activeBreaches.slice(0, 5)); // show top 5
        }
      } catch (err) {
        console.error(err);
        showToast('Error loading stats', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Format charts data
  const priorityChartData = Object.keys(prioritySplit).map((key) => ({
    name: key.toUpperCase(),
    value: prioritySplit[key],
  }));

  const categoryChartData = categorySplit.map((item) => ({
    name: item.name,
    value: item.count,
  }));

  const COLORS = ['#0e8ee9', '#14b8a6', '#f59e0b', '#f43f5e', '#6366f1'];

  const dashboardCards = [
    { label: 'Total Tickets', value: stats.total, color: 'bg-indigo-50 border-indigo-100 text-indigo-700', icon: <FiFolder /> },
    { label: 'Active Pending', value: stats.pending, color: 'bg-amber-50 border-amber-100 text-amber-700', icon: <FiClock /> },
    { label: 'Resolved (Avg: ' + stats.avgResolutionTimeHours + 'h)', value: stats.resolved, color: 'bg-emerald-50 border-emerald-100 text-emerald-700', icon: <FiCheckCircle /> },
    { label: 'SLA Breached', value: stats.slaBreach, color: 'bg-rose-50 border-rose-100 text-rose-700', icon: <FiAlertTriangle /> },
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen p-6 sm:p-10 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Operational Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
          Monitor service speed metrics, SLA benchmarks, and category breakdown reports.
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend line chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <FiFolder className="text-sm" />
            </div>
            Grievance Submission Trends (6 Months)
          </h3>
          <div className="h-72 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e8ee9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0e8ee9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#0e8ee9" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Bar chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <FiAlertTriangle className="text-sm" />
            </div>
            Grievances by Severity Level
          </h3>
          <div className="h-72 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown donut chart & SLA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FiFolder className="text-sm" />
                </div>
                Splits per Department
              </h3>
              <div className="h-72 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600, color: '#475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* SLA Breach warning table (subset) */}
            <div className="flex flex-col gap-5 bg-rose-50/30 p-6 rounded-3xl border border-rose-100 h-full">
              <h4 className="text-sm font-black text-rose-700 uppercase tracking-widest flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center animate-pulse">
                  <FiAlertTriangle className="text-sm" />
                </div>
                Critical SLA Breach Alerts
              </h4>
              {breaches.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm font-bold text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-100 p-6 text-center">
                  All departments are currently adhering to SLA timelines. No critical alerts.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {breaches.map((b) => (
                    <div key={b._id} className="p-4 bg-white dark:bg-slate-900 shadow-sm border border-rose-200/60 rounded-2xl flex items-center justify-between group hover:border-rose-400 transition-colors">
                      <div className="overflow-hidden mr-4">
                        <Link to={`/admin/complaint/${b._id}`} className="font-bold text-slate-800 dark:text-slate-100 hover:text-rose-600 text-sm block truncate transition-colors">
                          {b.complaintId}
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs truncate mt-0.5">{b.title}</p>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        OVERDUE
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
