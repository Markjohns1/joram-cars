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

    // Create a new vehicle
    create: async (data) => {
        const response = await api.post('/admin/vehicles', data);
        return response.data;
    },

    // Update an existing vehicle
    update: async (id, data) => {
        const response = await api.put(`/admin/vehicles/${id}`, data);
        return response.data;
    },

    // Delete a vehicle
    delete: async (id) => {
        const response = await api.delete(`/admin/vehicles/${id}`);
        return response.data;
    },

    // Upload vehicle images
    uploadImage: async (id, file, options = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        if (options.is_primary) formData.append('is_primary', 'true');

        const response = await api.post(`/admin/vehicles/${id}/upload-image`, formData, {
            params: { is_primary: options.is_primary || false },
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete a vehicle image
    deleteImage: async (imageId) => {
        const response = await api.delete(`/admin/vehicles/images/${imageId}`);
        return response.data;
    }
};

export default vehiclesAPI;
