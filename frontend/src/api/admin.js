/**
 * Admin API Service
 * 
 * Protected admin operations.
 */

import api from './client';

export const adminAPI = {
    // Dashboard
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    // Vehicles
    getVehicles: async (params = {}) => {
        const response = await api.get('/admin/vehicles', { params });
        return response.data;
    },

    createVehicle: async (data) => {
        const response = await api.post('/admin/vehicles', data);
        return response.data;
    },

    updateVehicle: async (id, data) => {
        const response = await api.put(`/admin/vehicles/${id}`, data);
        return response.data;
    },

    deleteVehicle: async (id) => {
        const response = await api.delete(`/admin/vehicles/${id}`);
        return response.data;
    },

    toggleFeatured: async (id) => {
        const response = await api.patch(`/admin/vehicles/${id}/feature`);
        return response.data;
    },

    uploadVehicleImage: async (vehicleId, file, isPrimary = false) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(
            `/admin/vehicles/${vehicleId}/upload-image?is_primary=${isPrimary}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    deleteVehicleImage: async (imageId) => {
        const response = await api.delete(`/admin/vehicles/images/${imageId}`);
        return response.data;
    },

    // Enquiries
    getEnquiries: async (params = {}) => {
        const response = await api.get('/admin/enquiries', { params });
        return response.data;
    },

    updateEnquiryStatus: async (id, status) => {
        const response = await api.patch(`/admin/enquiries/${id}/status`, { status });
        return response.data;
    },

    deleteEnquiry: async (id) => {
        const response = await api.delete(`/admin/enquiries/${id}`);
        return response.data;
    },

    // Sell Requests
    getSellRequests: async (params = {}) => {
        const response = await api.get('/admin/sell-requests', { params });
        return response.data;
    },

    updateSellRequestStatus: async (id, status) => {
        const response = await api.patch(`/admin/sell-requests/${id}/status`, { status });
        return response.data;
    },

    addValuation: async (id, amount) => {
        const response = await api.patch(`/admin/sell-requests/${id}/valuation`, { valuation_amount: amount });
        return response.data;
    },

    // Brands
    getBrands: async () => {
        const response = await api.get('/admin/brands');
        return response.data;
    },

    createBrand: async (data) => {
        const response = await api.post('/admin/brands', data);
        return response.data;
    },

    updateBrand: async (id, data) => {
        const response = await api.put(`/admin/brands/${id}`, data);
        return response.data;
    },

    deleteBrand: async (id) => {
        const response = await api.delete(`/admin/brands/${id}`);
        return response.data;
    },

    // Users
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    createUser: async (data) => {
        const response = await api.post('/admin/users', data);
        return response.data;
    },
};

export default adminAPI;
