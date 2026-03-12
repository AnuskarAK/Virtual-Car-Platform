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
export const followUser = (id) => API.post(`/auth/follow/${id}`);

// Cars
export const getCars = () => API.get('/cars');
export const getCarById = (id) => API.get(`/cars/${id}`);

// Builds
export const saveNewBuild = (data) => API.post('/builds', data);
export const getBuilds = () => API.get('/builds');
export const getPublicBuilds = () => API.get('/builds/public');
export const getBuildById = (id) => API.get(`/builds/${id}`);
export const updateBuild = (id, data) => API.put(`/builds/${id}`, data);
export const deleteBuild = (id) => API.delete(`/builds/${id}`);
export const likeBuild = (id) => API.post(`/builds/${id}/like`);
export const commentBuild = (id, text) => API.post(`/builds/${id}/comment`, { text });

// AI
export const getAiSuggestions = (data) => API.post('/ai/suggest', data);

export default API;
