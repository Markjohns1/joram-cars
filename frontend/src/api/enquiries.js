/**
 * Enquiries API Service
 * 
 * Customer enquiry submissions.
 */

import api from './client';

export const enquiriesAPI = {
    // Submit an enquiry
    create: async (data) => {
        const response = await api.post('/enquiries', data);
        return response.data;
    },
};

export default enquiriesAPI;
