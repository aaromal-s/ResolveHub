import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api, ASSET_URL } from '../services/api';
import { FiBell, FiUser, FiLogOut, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const fetchNotifications = useCallback(async () => {
    try {
      if (!user) return;
      const data = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = async (id) => {
    try {
      const data = await api.put(`/notifications/${id}`);
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const data = await api.put('/notifications/read-all');
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="relative z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-transparent shadow-sm dark:shadow-none flex items-center justify-between px-6 py-2 transition-colors duration-300">
      {/* Left side brand/menu button */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 md:hidden text-2xl focus:outline-none"
        >
          <FiMenu />
        </button>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-tealbrand-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-brand-500/20">
            C
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800 dark:text-white hidden sm:inline-block">
            Resolve<span className="text-brand-600 dark:text-brand-400 font-extrabold">Hub</span>
          </span>
        </Link>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-4 relative">
          {/* Notification center */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors focus:outline-none"
            >
              <FiBell className="text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce-short">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => markRead(notif._id)}
                        className={`p-4 border-b border-slate-50 dark:border-slate-700/50 flex flex-col gap-1 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                          !notif.isRead ? 'bg-brand-50/50 dark:bg-brand-900/20' : ''
                        }`}
                      >
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(notif.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none"
        >
          {theme === 'dark' ? <FiSun className="text-2xl" /> : <FiMoon className="text-2xl" />}
        </button>

          {/* User profile dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 focus:outline-none"
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar.startsWith('http') || user.avatar.startsWith('blob:') ? user.avatar : `${ASSET_URL}${user.avatar}?v=${user.updatedAt || Date.now()}`} 
                  alt="Profile" 
                  className="w-11 h-11 rounded-full object-cover border border-slate-300 dark:border-slate-700" 
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-lg text-brand-700 dark:text-brand-400">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="text-[15px] font-bold text-slate-700 dark:text-slate-300 hidden md:inline-block">
                {user.name}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                    {user.role}
                  </span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <FiUser /> Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
                >
                  <FiLogOut /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className={location.pathname === '/login' 
                ? "px-8 py-2 text-base font-bold text-white bg-gradient-to-r from-brand-600 to-tealbrand-500 rounded-xl shadow-md shadow-brand-500/30 hover:shadow-lg hover:from-brand-700 hover:to-tealbrand-600 transition-all min-w-[100px] text-center"
                : "px-6 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors min-w-[100px] text-center"
              }
            >
              Log In
            </Link>
            <Link
              to="/register"
              className={location.pathname !== '/login' 
                ? "px-8 py-2 text-base font-bold text-white bg-gradient-to-r from-brand-600 to-tealbrand-500 rounded-xl shadow-md shadow-brand-500/30 hover:shadow-lg hover:from-brand-700 hover:to-tealbrand-600 transition-all min-w-[100px] text-center"
                : "px-6 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors min-w-[100px] text-center"
              }
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
