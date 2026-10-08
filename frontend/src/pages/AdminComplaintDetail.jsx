import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, ASSET_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FiMapPin, FiUser, FiPaperclip, FiArrowLeft,
  FiClock, FiStar, FiFileText, FiUserCheck, FiActivity
} from 'react-icons/fi';

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, isAdmin } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Administrative form inputs
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get(`/complaints/${id}`);
      if (data.success) {
        setComplaint(data.complaint);
        setTimeline(data.timeline);
        setFeedback(data.feedback);
        
        setSelectedDept(data.complaint.assignedDepartment?._id || '');
        setSelectedOfficer(data.complaint.assignedTo?._id || '');
        setActionStatus(data.complaint.status);
        setResolutionNotes(data.complaint.resolutionNotes || '');
      }

      if (isAdmin) {
        // Load departments for assignment dropdown
        const deptData = await api.get('/departments');
        if (deptData.success) {
          setDepartments(deptData.departments);
        }

        // Load administrative users/officers for assignment dropdown
        const usersData = await api.get('/users?role=officer'); // Get officers for assignment
        if (usersData.success) {
          setOfficers(usersData.users);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
      navigate(isAdmin ? '/admin/complaints' : '/officer/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, isAdmin, navigate, showToast]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDept) {
      showToast('Please select a department', 'error');
      return;
    }
    setSubmittingAction(true);
    try {
      const data = await api.put(`/complaints/${complaint._id}/assign`, {
        departmentId: selectedDept,
        officerId: selectedOfficer || null,
      });
      if (data.success) {
        showToast('Complaint routing updated successfully', 'success');
        fetchDetails();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!actionStatus) return;
    
    if (actionStatus === 'Resolved' && !resolutionNotes.trim()) {
      showToast('Please enter resolution notes detailing the work completed.', 'error');
      return;
    }

    setSubmittingAction(true);
    try {
      const data = await api.put(`/complaints/${complaint._id}/status`, {
        status: actionStatus,
        remarks: remarks || `Status advanced to ${actionStatus} by Admin`,
        resolutionNotes: actionStatus === 'Resolved' ? resolutionNotes : undefined,
      });
      if (data.success) {
        showToast('Complaint status updated successfully', 'success');
        setRemarks('');
        fetchDetails();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

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
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen pb-12">
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-6 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link
            to="/admin/complaints"
            className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-white text-sm font-bold transition-colors"
          >
            <FiArrowLeft className="text-lg" /> Back to Grievance Records
          </Link>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-sm ${getPriorityStyle(complaint.priority)}`}>
              {complaint.priority} Priority
            </span>
            <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${getStatusStyle(complaint.status)}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${
                  complaint.status === 'Resolved' ? 'bg-emerald-500' : complaint.status === 'Closed' ? 'bg-slate-400' : 'bg-amber-500'
                }`}></span>
              {complaint.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column: Complaint Details & Admin Operations */}
        <div className="xl:col-span-2 flex flex-col gap-8 w-full">
          
          {/* Main Info Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
            
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 relative z-10">
              Ticket ID: <span className="text-brand-600">{complaint.complaintId}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 leading-snug relative z-10 mb-6">
              {complaint.title}
            </h1>
            
            <div className="bg-slate-50/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 mb-8 relative z-10">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium">
                {complaint.description}
              </p>
            </div>

            {/* Complainant metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mb-8">
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <FiUser className="text-sm" /> Citizen Details
                </span>
                <p className="font-black text-slate-800 dark:text-slate-100 text-base mt-1">{complaint.userId?.name || 'Deleted User'}</p>
                <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">{complaint.userId?.email}</p>
                <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">{complaint.userId?.phone || 'No Phone'}</p>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-1 justify-center">
                <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <FiClock className="text-sm" /> Filing Date
                </span>
                <p className="font-black text-slate-800 dark:text-slate-100 text-base mt-1">
                  {new Date(complaint.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">
                  {new Date(complaint.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Location & attachments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm relative z-10">
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <FiMapPin className="text-lg" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Location</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 truncate block">{complaint.location || 'Not Specified'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <FiClock className="text-lg" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">SLA Limit</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 truncate block">{new Date(complaint.slaDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Citzen Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 relative z-10">
                <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FiPaperclip /> Citizen Attachments ({complaint.attachments.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {complaint.attachments.map((filePath, i) => (
                    <a
                      key={i}
                      href={filePath.startsWith('http') ? filePath : `${ASSET_URL}${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 px-4 py-2 border border-brand-100 bg-brand-50/50 hover:bg-brand-100 rounded-xl transition-colors shadow-sm"
                    >
                      <FiPaperclip className="text-brand-500" /> Evidence File {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Operations Card (Department and officer assignment) */}
          {isAdmin && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiUserCheck className="text-lg" />
              </div>
              Delegate Department Routing
            </h3>
            
            <form onSubmit={handleAssignSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Assigned Category/Dept
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all cursor-pointer appearance-none"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Assigned Officer (Optional)
                </label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all cursor-pointer appearance-none"
                >
                  <option value="">Unassigned</option>
                  {officers.map((off) => (
                    <option key={off._id} value={off._id}>
                      {off.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submittingAction}
                className="w-full md:col-span-2 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {submittingAction ? 'Updating Routing...' : 'Save Routing Changes'}
              </button>
            </form>
          </div>
            )}

          {/* Admin Operations Card (Status changes) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <FiActivity className="text-lg" />
              </div>
              Advance Case Status
            </h3>

            <form onSubmit={handleStatusUpdate} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Action Status
                  </label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all cursor-pointer appearance-none"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Internal/Audit Log Remarks
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter audit logs remarks for history timeline..."
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {actionStatus === 'Resolved' && (
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Resolution Note (Visible to citizen) *
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Provide details of works performed to resolve this grievance..."
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all resize-none"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submittingAction}
                className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-2"
              >
                {submittingAction ? 'Updating Status...' : 'Apply Status Update'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Timeline progress & User Rating */}
        <div className="flex flex-col gap-8 w-full xl:sticky xl:top-8">
          {/* Feedbacks if closed */}
          {feedback && (
            <div className="bg-amber-50 border border-amber-200/50 rounded-3xl p-8 shadow-xl shadow-amber-500/10 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white dark:bg-slate-900/40 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
              
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg relative z-10">Citizen Service Rating</h3>
              <div className="flex items-center gap-1.5 relative z-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`text-2xl drop-shadow-sm ${
                      star <= feedback.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-amber-100/50 relative z-10 mt-2">
                <p className="text-slate-700 dark:text-slate-200 text-sm italic font-medium">"{feedback.comment || 'No comment provided.'}"</p>
              </div>
            </div>
          )}

          {/* Timeline progress list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                <FiFileText className="text-lg" />
              </div>
              Resolution Audit Timeline
            </h3>

            <div className="flex flex-col gap-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
              {timeline.map((log, index) => (
                <div key={log._id} className="flex gap-5 relative z-10 group">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-md shadow-slate-200 ${
                      log.status === 'Resolved' || log.status === 'Closed'
                        ? 'bg-emerald-500'
                        : log.status === 'In Progress'
                        ? 'bg-brand-500'
                        : log.status === 'Assigned'
                        ? 'bg-sky-500'
                        : 'bg-amber-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex flex-col gap-1 pt-0.5">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm group-hover:text-brand-600 transition-colors">{log.status}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString()} •{' '}
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300 border border-slate-100 dark:border-slate-800 p-3 rounded-xl mt-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                        {log.remarks || 'No remarks provided.'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 block">
                      Updated by: {log.updatedBy?.name} ({log.updatedBy?.role})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetail;
