import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ASSET_URL } from '../services/api';
import {
  FiGrid,
  FiPlusCircle,
  FiList,
  FiUser,
  FiUsers,
  FiLayers,
  FiBell,
  FiBarChart2
} from 'react-icons/fi';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isOfficer = user.role === 'officer';

  const userLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
    { label: 'File Complaint', path: '/new-complaint', icon: <FiPlusCircle /> },
    { label: 'My Complaints', path: '/my-complaints', icon: <FiList /> },
    { label: 'My Profile', path: '/profile', icon: <FiUser /> },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
    { label: 'Manage Complaints', path: '/admin/complaints', icon: <FiList /> },
    { label: 'User Accounts', path: '/admin/users', icon: <FiUsers /> },
    { label: 'Departments', path: '/admin/departments', icon: <FiLayers /> },
    { label: 'Send Alert', path: '/admin/notifications', icon: <FiBell /> },
    { label: 'Export Reports', path: '/admin/reports', icon: <FiBarChart2 /> },
    { label: 'My Profile', path: '/profile', icon: <FiUser /> },
  ];

  const officerLinks = [
    { label: 'Dept Dashboard', path: '/officer/dashboard', icon: <FiGrid /> },
    { label: 'Dept Complaints', path: '/officer/complaints', icon: <FiList /> },
    { label: 'My Profile', path: '/profile', icon: <FiUser /> },
  ];

  const activeLinks = isAdmin ? adminLinks : isOfficer ? officerLinks : userLinks;

  return (
    <>
      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`absolute md:relative inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-transparent flex flex-col z-40 transition-all duration-300 h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex-1 py-6 px-4 overflow-y-auto flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">
              {isAdmin ? 'Administration Portal' : isOfficer ? 'Department Portal' : 'Citizen Services'}
            </span>
            <ul className="mt-3 flex flex-col gap-1">
              {activeLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600 to-tealbrand-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-700 dark:hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* User Identity Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950/40 flex items-center gap-3 mt-auto">
                    {user?.avatar ? (
            <img 
              src={user.avatar.startsWith('http') || user.avatar.startsWith('blob:') ? user.avatar : `${ASSET_URL}${user.avatar}`} 
              alt="Profile" 
              className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-transparent shrink-0" 
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 border border-slate-300 dark:border-transparent shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.name}</h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{user.role} Account</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


