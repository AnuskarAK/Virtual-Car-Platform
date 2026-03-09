import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

// Add auth token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Cars
export const getCars = () => API.get('/cars');
export const getCarById = (id) => API.get(`/cars/${id}`);

// Builds
export const saveNewBuild = (data) => API.post('/builds', data);
export const getBuilds = () => API.get('/builds');
export const getBuildById = (id) => API.get(`/builds/${id}`);
export const updateBuild = (id, data) => API.put(`/builds/${id}`, data);
export const deleteBuild = (id) => API.delete(`/builds/${id}`);

export default API;
