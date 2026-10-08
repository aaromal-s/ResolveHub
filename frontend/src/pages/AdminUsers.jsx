import React, { useState, useEffect, useCallback } from 'react';
import { api, ASSET_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiUserX, FiUserCheck, FiAlertTriangle, FiPlus, FiX } from 'react-icons/fi';

const AdminUsers = () => {
  const { showToast, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });
  const [addOfficerModal, setAddOfficerModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [newOfficer, setNewOfficer] = useState({ name: '', email: '', password: '', phone: '', department: '' });

  
  const fetchDepartments = useCallback(async () => {
    try {
      const data = await api.get('/departments');
      if (data.success) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (addOfficerModal && departments.length === 0) {
      fetchDepartments();
    }
  }, [addOfficerModal, departments.length, fetchDepartments]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      let query = '';
      const params = [];
      if (role) params.push(`role=${role}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      
      if (params.length > 0) {
        query = `?${params.join('&')}`;
      }
      
      const data = await api.get(`/users${query}`);
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [role, search, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  
  const handleAddOfficer = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/users/officer', newOfficer);
      if (data.success) {
        showToast('Officer created successfully', 'success');
        setAddOfficerModal(false);
        setNewOfficer({ name: '', email: '', password: '', phone: '', department: '' });
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Opens confirmation modal before toggling
  const handleToggleStatus = (userToUpdate) => {
    if (userToUpdate._id === currentUser._id) {
      showToast('You cannot block your own administrative account', 'error');
      return;
    }
    setConfirmModal({ isOpen: true, user: userToUpdate });
  };

  const confirmToggleStatus = async () => {
    const userToUpdate = confirmModal.user;
    const nextStatus = userToUpdate.status === 'active' ? 'blocked' : 'active';
    setConfirmModal({ isOpen: false, user: null });
    try {
      const data = await api.put(`/users/${userToUpdate._id}/status`, { status: nextStatus });
      if (data.success) {
        showToast(`User "${userToUpdate.name}" is now ${nextStatus === 'active' ? 'Activated' : 'Deactivated'}`, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === userToUpdate._id ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen p-6 sm:p-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start w-full gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">User Registries</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
              Review details of citizens and staff members. Restrict access or block accounts when necessary.
            </p>
          </div>
          <button onClick={() => setAddOfficerModal(true)} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 shrink-0 h-fit mt-1">
            <FiPlus /> Add Officer
          </button>
        </div>

      {/* Search & filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col sm:flex-row gap-6 items-center justify-between relative overflow-hidden">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-xl relative z-10">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-5 top-4 text-slate-400 dark:text-slate-500 text-lg group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone number..."
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all active:scale-95"
          >
            Search
          </button>
        </form>

        <div className="flex gap-4 items-center relative z-10 w-full sm:w-auto">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider flex-shrink-0">Role Filter</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full sm:w-48 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer appearance-none"
          >
            <option value="">All Roles</option>
            <option value="user">Citizens (User)</option>
            <option value="admin">Officers (Admin)</option>
          </select>
        </div>
      </div>

      {/* Grid table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">Fetching user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <FiUserX className="text-2xl" />
            </div>
            <h3 className="text-slate-700 dark:text-slate-200 font-bold text-lg">No accounts found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 max-w-sm">
              We couldn't find any users matching your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="py-5 px-6 lg:px-8">User Name</th>
                  <th className="py-5 px-6 lg:px-8">Email Address</th>
                  <th className="py-5 px-6 lg:px-8">Phone Number</th>
                  <th className="py-5 px-6 lg:px-8">System Role</th>
                  <th className="py-5 px-6 lg:px-8">Account Status</th>
                  <th className="py-5 px-6 lg:px-8">Registered Date</th>
                  <th className="py-5 px-6 lg:px-8 text-center">Action Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 dark:text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 dark:bg-slate-800/80 transition-colors group">
                    <td className="py-5 px-6 lg:px-8 font-extrabold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                            {u.avatar ? (
                              <img src={u.avatar.startsWith("http") || u.avatar.startsWith("data:") || u.avatar.startsWith("blob:") ? u.avatar : `${ASSET_URL}${u.avatar}`} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              u.name.charAt(0).toUpperCase()
                            )}
                          </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="py-5 px-6 lg:px-8 font-medium text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="py-5 px-6 lg:px-8 font-medium text-slate-500 dark:text-slate-400">{u.phone || 'N/A'}</td>
                    <td className="py-5 px-6 lg:px-8">
                      <span
                        className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider border shadow-sm ${
                          u.role === 'admin'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                            : 'bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-5 px-6 lg:px-8">
                      <span
                        className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider border shadow-sm flex items-center w-fit gap-1.5 ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 lg:px-8 text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-6 lg:px-8">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={u._id === currentUser._id}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 border ${
                            u.status === 'active'
                              ? 'bg-white dark:bg-slate-900 hover:bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-200'
                              : 'bg-white dark:bg-slate-900 hover:bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200'
                          } disabled:opacity-40 disabled:active:scale-100`}
                        >
                          {u.status === 'active' ? (
                            <>
                              <FiUserX className="text-sm" /> Deactivate
                            </>
                          ) : (
                            <>
                              <FiUserCheck className="text-sm" /> Activate
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    
      {/* Add Officer Modal */}
      {addOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add New Officer</h3>
              <button onClick={() => setAddOfficerModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleAddOfficer} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input required type="text" value={newOfficer.name} onChange={e => setNewOfficer({...newOfficer, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input required type="email" value={newOfficer.email} onChange={e => setNewOfficer({...newOfficer, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Temporary Password</label>
                <input required type="password" value={newOfficer.password} onChange={e => setNewOfficer({...newOfficer, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number (Optional)</label>
                <input type="tel" value={newOfficer.phone} onChange={e => setNewOfficer({...newOfficer, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                <select required value={newOfficer.department} onChange={e => setNewOfficer({...newOfficer, department: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none">
                  <option value="">Select a department...</option>
                  {departments.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="mt-4 w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors">
                Create Officer Account
              </button>
            </form>
          </div>
        </div>
      )}
      {/* -- Status Confirmation Modal -- */}
      {confirmModal.isOpen && confirmModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setConfirmModal({ isOpen: false, user: null })}
          />
          {/* Modal Card */}
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm p-8 flex flex-col items-center gap-6 z-10 animate-fade-in">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${confirmModal.user.status === 'active' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-500' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500'}`}>
              <FiAlertTriangle className="text-3xl" />
            </div>
            {/* Text */}
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">
                {confirmModal.user.status === 'active' ? 'Deactivate Account?' : 'Activate Account?'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {confirmModal.user.status === 'active'
                  ? <>Are you sure you want to <span className="font-bold text-rose-500">deactivate</span> <span className="font-bold text-slate-700 dark:text-slate-200">"{confirmModal.user.name}"</span>? They will lose access to the portal.</>
                  : <>Are you sure you want to <span className="font-bold text-emerald-500">activate</span> <span className="font-bold text-slate-700 dark:text-slate-200">"{confirmModal.user.name}"</span>? They will regain portal access.</>
                }
              </p>
            </div>
            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setConfirmModal({ isOpen: false, user: null })}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                className={`flex-1 py-3 rounded-2xl text-white font-black transition-all active:scale-95 shadow-lg ${confirmModal.user.status === 'active' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
              >
                {confirmModal.user.status === 'active' ? 'Yes, Deactivate' : 'Yes, Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
