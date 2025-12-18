/**
 * Public Stats API Service
 */

import api from './client';

export const publicAPI = {
    // Get public stats
    getStats: async () => {
        const response = await api.get('/stats/public');
        return response.data;
    },

    // Subscribe to newsletter
    subscribeNewsletter: async (email) => {
        const response = await api.post('/newsletter/subscribe', { email });
        return response.data;
    },
};

export default publicAPI;
