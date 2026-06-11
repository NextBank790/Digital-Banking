import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const loggedInEmail = localStorage.getItem('loggedInUser');

  if (!isAuthenticated && !loggedInEmail) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
