import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Syncing Floor Credentials...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Smart routing split if a user tries to cross onto the wrong page
    return user.role === 'staff' || user.role === 'admin' 
      ? <Navigate to="/staff/dashboard" replace />
      : <Navigate to="/tables" replace />;
  }

  return children;
}