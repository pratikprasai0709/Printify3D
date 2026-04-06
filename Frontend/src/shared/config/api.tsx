import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api'
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