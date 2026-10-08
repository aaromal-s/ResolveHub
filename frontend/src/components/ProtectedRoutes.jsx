import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Spinner = ({ label }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
  </div>
);

// Helper: get the correct home dashboard for a given role
const getDashboard = (user) => {
  if (!user) return '/login';
  if (user.role === 'admin') return '/admin/dashboard';
  if (user.role === 'officer') return '/officer/dashboard';
  return '/dashboard';
};

// Standard Protected Route (Must be logged in)
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // While loading OR if token exists but user isn't loaded yet, show spinner
  if (loading || (!user && localStorage.getItem('token'))) {
    return <Spinner label="Loading your profile..." />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin Route (Must be Admin)
export const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading || (!user && localStorage.getItem('token'))) {
    return <Spinner label="Verifying access rights..." />;
  }

  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to={getDashboard(user)} replace />;
};

// Officer Route (Must be Officer)
export const OfficerRoute = () => {
  const { user, isOfficer, loading } = useAuth();

  if (loading || (!user && localStorage.getItem('token'))) {
    return <Spinner label="Verifying access rights..." />;
  }

  if (!user) return <Navigate to="/login" replace />;
  return isOfficer ? <Outlet /> : <Navigate to={getDashboard(user)} replace />;
};
