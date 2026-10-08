import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Load user on startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Session restore failed:', err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Show a toast message helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const login = async (email, password, roleType) => {
    try {
      setLoading(true);
      const data = await api.post('/auth/login', { email, password, roleType });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        showToast('Logged in successfully', 'success');
        return { success: true, user: data.user };
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      const data = await api.post('/auth/register', { name, email, password, phone });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        showToast('Account registered successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const isMultipart = profileData instanceof FormData;
      const data = await api.put('/auth/profile', profileData, isMultipart);
      if (data.success) {
        setUser(data.user);
        showToast('Profile updated successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      return { success: false, error: err.message };
    }
  };

  const isAdmin = user && user.role === 'admin';
  const isOfficer = user && user.role === 'officer';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isOfficer,
        login,
        register,
        logout,
        updateProfile,
        showToast,
        toasts,
      }}
    >
      {children}
      
      {/* Dynamic Toast Renderer */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow-lg border text-white transition-all transform duration-300 translate-y-0 scale-100 ${
              toast.type === 'success'
                ? 'bg-emerald-600 border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 border-rose-500'
                : toast.type === 'info'
                ? 'bg-sky-600 border-sky-500'
                : 'bg-amber-600 border-amber-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white hover:text-slate-200 ml-4 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line
export const useAuth = () => useContext(AuthContext);


