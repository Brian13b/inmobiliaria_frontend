import { api } from './api';

export const login = async (username: string, password: string) => {
    const response = await api.post('/Auth/login', { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

export const getToken = () => localStorage.getItem('token');
export const isAuthenticated = () => !!localStorage.getItem('token');