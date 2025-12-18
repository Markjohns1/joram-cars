/**
 * Vehicles API Service
 * 
 * All vehicle-related API calls.
 */

import api from './client';

export const vehiclesAPI = {
    // Get all vehicles with filters
    getAll: async (params = {}) => {
        const response = await api.get('/vehicles', { params });
        return response.data;
    },

    // Get single vehicle by ID
    getById: async (id) => {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    },

    // Get featured vehicles
    getFeatured: async (limit = 8) => {
        const response = await api.get('/vehicles/featured', { params: { limit } });
        return response.data;
    },

    // Get recent vehicles
    getRecent: async (limit = 8) => {
        const response = await api.get('/vehicles/recent', { params: { limit } });
        return response.data;
    },

    // Get all makes
    getMakes: async () => {
        const response = await api.get('/vehicles/makes');
        return response.data;
    },

    // Get models for a make
    getModels: async (make) => {
        const response = await api.get(`/vehicles/models/${make}`);
        return response.data;
    },
};

export default vehiclesAPI;
