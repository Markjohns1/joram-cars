/**
 * Auth Context
 * 
 * Manages authentication state for admin users.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setIsLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        const response = await authAPI.login(email, password);

        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setUser(response.user);

        return response;
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (e) {
            // Ignore errors on logout
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Check if user is authenticated
    const isAuthenticated = !!user;

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export default AuthContext;
