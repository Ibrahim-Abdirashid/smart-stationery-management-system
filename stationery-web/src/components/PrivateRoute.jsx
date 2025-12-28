import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Simple logic: If Owner required but not Owner, redirect (or show 403)
        // For simplicity redirect to dashboard
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;
