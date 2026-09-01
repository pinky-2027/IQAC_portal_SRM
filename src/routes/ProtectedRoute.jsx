import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-bg">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect user to their role appropriate default page if unauthorized
    if (['ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN'].includes(user.role)) return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'HOD') return <Navigate to="/hod/dashboard" replace />;
    if (user.role === 'FACULTY') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RootRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) return <Navigate to={`/login${location.search}`} replace />;
  if (['ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN'].includes(user.role)) return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'HOD') return <Navigate to="/hod/dashboard" replace />;
  if (user.role === 'FACULTY') return <Navigate to="/faculty/dashboard" replace />;

  return <Navigate to="/admin/dashboard" replace />;
};
