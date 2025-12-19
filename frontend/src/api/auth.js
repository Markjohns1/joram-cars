/**
 * Auth API Service
 * 
 * Admin authentication.
 */

import api from './client';

export const authAPI = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await api.post('/admin/users', {
            ...userData,
            role: 'staff' // Default to staff for public registration
        });
        return response.data;
    },

    // Update own profile
    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    }
};

export default authAPI;
