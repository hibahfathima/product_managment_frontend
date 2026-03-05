import React, { createContext, useState, useEffect, useContext } from 'react';
import { verifyTokenApi, logoutApi } from '../Services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const result = await verifyTokenApi();
            if (result.success) {
                setUser(result.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await logoutApi();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
            setUser(null);
        }
    };


    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
