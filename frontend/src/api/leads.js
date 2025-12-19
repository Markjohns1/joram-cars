import client from './client';

export const leadsAPI = {
    capture: async (data) => {
        constresponse = await client.post('/leads/capture', data);
        return response.data;
    },
};
