import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiSliders, FiEye } from 'react-icons/fi';

const AdminComplaints = () => {
  const { isOfficer, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      let query = '';
      const params = [];
      if (status) params.push(`status=${status}`);
      if (priority) params.push(`priority=${priority}`);
      if (department) params.push(`department=${department}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);

      if (params.length > 0) {
        query = `?${params.join('&')}`;
      }

      const endpoint = isOfficer ? '/complaints/department' : '/complaints/all';
      const data = await api.get(`${endpoint}${query}`);
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.error('Failed loading complaints', err.message);
    } finally {
      setLoading(false);
    }
  }, [status, priority, department, search, isOfficer]);

  useEffect(() => {
    const fetchDependencies = async () => {
      if (!isAdmin) return;
      try {
        const deptData = await api.get('/departments');
        if (deptData.success) {
          setDepartments(deptData.departments);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDependencies();
  }, [isAdmin]);

  useEffect(() => {
    fetchComplaints();
    setCurrentPage(1); // Reset page on new fetch
  }, [fetchComplaints]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const getPriorityStyle = (pri) => {
    switch (pri) {
      case 'critical':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'high':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-sky-50 text-sky-600 border-sky-100';
    }
  };

  const getStatusStyle = (st) => {
    switch (st) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Closed':
        return 'bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen p-6 sm:p-10 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Citizens Grievances</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
          Review, assign, escalate, and resolve citizen grievances filed across the platform.
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col gap-5 relative overflow-hidden">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 relative z-10">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-5 top-4 text-slate-400 dark:text-slate-500 text-lg group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tracking ID, title, address, or complainant name..."
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/20 transition-all active:scale-95"
          >
            Search DB
          </button>
        </form>

        <div className="flex flex-wrap gap-6 items-center border-t border-slate-100 dark:border-slate-800 pt-5 text-sm font-semibold text-slate-600 dark:text-slate-300 relative z-10">
          <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs font-bold">
            <FiSliders /> Filters
          </span>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">STATUS</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">PRIORITY</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {!isOfficer && (
            <div className="flex items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">DEPARTMENT</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Grid table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">Querying registry database...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <FiSearch className="text-2xl" />
            </div>
            <h3 className="text-slate-700 dark:text-slate-200 font-bold text-lg">No records found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 max-w-sm">
              We couldn't find any complaints matching your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="py-5 px-6 lg:px-8">Tracking ID</th>
                  <th className="py-5 px-6 lg:px-8">Complaint Title</th>
                  <th className="py-5 px-6 lg:px-8">Submitted By</th>
                  <th className="py-5 px-6 lg:px-8">Department</th>
                  <th className="py-5 px-6 lg:px-8">Priority</th>
                  <th className="py-5 px-6 lg:px-8">Status</th>
                  <th className="py-5 px-6 lg:px-8">Assignee</th>
                  <th className="py-5 px-6 lg:px-8 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 dark:text-slate-300">
                {complaints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 dark:bg-slate-800/80 transition-colors group">
                    <td className="py-5 px-6 lg:px-8 font-extrabold text-brand-600">
                      <Link to={isOfficer ? `/officer/complaint/${c._id}` : `/admin/complaint/${c._id}`} className="hover:underline">{c.complaintId}</Link>
                    </td>
                    <td className="py-5 px-6 lg:px-8 font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">{c.title}</td>
                    <td className="py-5 px-6 lg:px-8">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100">{c.userId?.name || 'Deleted User'}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{c.userId?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 lg:px-8 font-medium text-slate-500 dark:text-slate-400">{c.category?.name || 'Unassigned'}</td>
                    <td className="py-5 px-6 lg:px-8">
                      <span className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase border tracking-wider shadow-sm ${getPriorityStyle(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-5 px-6 lg:px-8">
                      <span className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase border tracking-wider shadow-sm flex items-center w-fit gap-1.5 ${getStatusStyle(c.status)}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'Resolved' ? 'bg-emerald-500' : c.status === 'Closed' ? 'bg-slate-400' : 'bg-amber-500'
                        }`}></span>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 lg:px-8 font-bold text-slate-600 dark:text-slate-300">
                      {c.assignedTo ? c.assignedTo.name : 'Pending'}
                    </td>
                    <td className="py-5 px-6 lg:px-8 text-center">
                      <Link
                        to={isOfficer ? `/officer/complaint/${c._id}` : `/admin/complaint/${c._id}`}
                        className="inline-flex items-center justify-center p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 text-slate-400 dark:text-slate-500 rounded-xl transition-all shadow-sm group-hover:shadow-md"
                        title="View Details"
                      >
                        <FiEye className="text-lg" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {complaints.length > itemsPerPage && (
              <div className="flex items-center justify-between px-6 lg:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, complaints.length)} of {complaints.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage === Math.ceil(complaints.length / itemsPerPage)}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
