/**
 * Sell Requests API Service
 * 
 * Sell your car form submissions.
 */

import api from './client';

export const sellRequestsAPI = {
    // Submit a sell request
    create: async (data) => {
        const response = await api.post('/sell-requests', data);
        return response.data;
    },

    // Upload image for sell request
    uploadImage: async (requestId, file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(
            `/sell-requests/${requestId}/upload-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },
};

export default sellRequestsAPI;
