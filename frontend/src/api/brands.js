/**
 * Brands API Service
 * 
 * Fetch car brands.
 */

import api from './client';

export const brandsAPI = {
    // Get all active brands
    getAll: async () => {
        const response = await api.get('/brands');
        return response.data;
    },
};

export default brandsAPI;
