import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
