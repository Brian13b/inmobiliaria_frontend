import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7177/api";

export const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getPropiedades = async () => {
    const response = await api.get('/Propiedades');
    return response.data;
};

export const getPropiedadById = async (id: number) => {
    const response = await api.get(`/Propiedades/${id}`);
    return response.data;
};

export const createPropiedad = async (data: any) => {
    const response = await api.post('/Propiedades', data);
    return response.data;
};

export const updatePropiedad = async (id: number, data: any) => {
    const response = await api.put(`/Propiedades/${id}`, data);
    return response.data;
};

export const deletePropiedad = async (id: number) => {
    await api.delete(`/Propiedades/${id}`);
};

export const uploadImagen = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('archivo', file);
    const response = await api.post(`/Propiedades/${id}/imagenes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteImagen = async (propiedadId: number, imagenId: number) => {
    await api.delete(`/Propiedades/${propiedadId}/imagenes/${imagenId}`);
};

export const enviarMensaje = async (data: any) => {
    await api.post('/Mensajes', data);
};

export const getMensajes = async () => {
    const response = await api.get('/Mensajes');
    return response.data;
};

export const deleteMensaje = async (id: number) => {
    await api.delete(`/Mensajes/${id}`);
};