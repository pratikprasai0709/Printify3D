import axios from "axios";

export const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? 'https://printify3d-backend.onrender.com/api'
        : 'http://127.0.0.1:5000/api');
export const API_ORIGIN = new URL(API_BASE_URL).origin;
export const getBackendAssetUrl = (path: string) => {
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_BASE_URL
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginApi = (data: { username: string, password: string }) => {
    return api.post('/auth/login', data);
}

export const registerApi = (data: { username: string, password: string, phoneNumber: string }) => {
    return api.post('/auth/register', data);
}

export const addBottleApi = (formData: FormData) => {
    return api.post('/bottles', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getBottlesApi = () => {
    return api.get('/bottles');
}

export const updateBottleApi = (id: string, formData: FormData) => {
    return api.put(`/bottles/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteBottleApi = (id: string) => {
    return api.delete(`/bottles/${id}`);
}

export const initiateEsewaApi = (data: { amount: number, productName: string, customerDetails: { name: string, phone: string, address: string }, designImage?: string, bottlePreviewImage?: string }) => {
    console.log("API: Sending initiation request...");
    return api.post('/payment/initiate', data);
}

export const verifyEsewaApi = (data: { data: string }) => {
    console.log("API: Sending verification request...");
    return api.post('/payment/verify', data);
}

export const getOrdersApi = () => {
    return api.get('/payment/orders');
}

export default api;
