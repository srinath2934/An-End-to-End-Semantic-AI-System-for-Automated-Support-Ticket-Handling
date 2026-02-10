import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const predictTicket = async (description) => {
    try {
        const response = await api.post('/predict', { description });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getTickets = async () => {
    try {
        const response = await api.get('/tickets');
        return response.data;
    } catch (error) {
        console.error("API Error fetching tickets:", error);
        return [];
    }
};

export const updateTicket = async (id, data) => {
    try {
        const response = await api.put(`/tickets/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("API Error updating ticket:", error);
        throw error;
    }
};

// ============================================
// Analytics API Functions
// ============================================

export const getAnalyticsKPIs = async () => {
    try {
        const response = await api.get('/analytics/kpis');
        return response.data;
    } catch (error) {
        console.error("Analytics API Error:", error);
        throw error;
    }
};

export const getAnalyticsCategories = async () => {
    try {
        const response = await api.get('/analytics/categories');
        return response.data;
    } catch (error) {
        console.error("Analytics API Error:", error);
        throw error;
    }
};

export const getAnalyticsTimeline = async () => {
    try {
        const response = await api.get('/analytics/timeline');
        return response.data;
    } catch (error) {
        console.error("Analytics API Error:", error);
        throw error;
    }
};

export const getAnalyticsSummary = async () => {
    try {
        const response = await api.get('/analytics/summary');
        return response.data;
    } catch (error) {
        console.error("Analytics API Error:", error);
        throw error;
    }
};

export default api;
