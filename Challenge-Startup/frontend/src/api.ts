import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

const getToken = (): string | null => localStorage.getItem('token');

// Auth
export const signup = (data: any): Promise<AxiosResponse<any>> => api.post('/auth/signup', data);

export const login = (data: any): Promise<AxiosResponse<any>> => api.post('/auth/login', data).then((res) => {
    console.log(res);
    if (res.data && res.data.data && res.data.data.session && res.data.data.session.access_token) {
        localStorage.setItem('token', res.data.data.session.access_token);
        localStorage.setItem("userEmail", res.data.data.user.email);
        localStorage.setItem("userId", res.data.data.user.id);
    }
    console.log(localStorage.getItem('token'));
    return res;
});

export const logout = (): Promise<AxiosResponse<any>> => {
    localStorage.removeItem('token');
    return api.post('/auth/logout', {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
}

// Projects
export const getProjects = (): Promise<AxiosResponse<any>> => api.get('/projects', {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const getProject = (id: string): Promise<AxiosResponse<any>> => api.get(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const createProject = (data: any): Promise<AxiosResponse<any>> => api.post('/projects', data, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const updateProject = (id: string, data: any): Promise<AxiosResponse<any>> => api.put(`/projects/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const deleteProject = (id: string): Promise<AxiosResponse<any>> => api.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const getUsersFromProject = (projectId: string): Promise<AxiosResponse<any>> => api.get(`/projects/${projectId}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

// Tasks
export const getTasksFromProject = (projectId: string): Promise<AxiosResponse<any>> => api.get(`/projects/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const getTask = (taskId: string): Promise<AxiosResponse<any>> => api.get(`/projects/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const createTask = (projectId: string, data: any): Promise<AxiosResponse<any>> => api.post(`/projects/${projectId}/tasks`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const updateTask = (projectId: string, taskId: string, data: any): Promise<AxiosResponse<any>> => api.put(`/projects/${projectId}/tasks/${taskId}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const deleteTask = (projectId: string, taskId: string): Promise<AxiosResponse<any>> => api.delete(`/projects/${projectId}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const updateTaskStatus = (taskId: string, data: any): Promise<AxiosResponse<any>> => api.put(`/projects/tasks/${taskId}/status`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const assignTask = (projectId: string, taskId: string, data: any): Promise<AxiosResponse<any>> => api.put(`/projects/${projectId}/tasks/${taskId}/assign`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const unassignTask = (projectId: string, taskId: string): Promise<AxiosResponse<any>> => api.put(`/projects/${projectId}/tasks/${taskId}/unassign`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const getTasksFromUserAndProject = (projectId: string, userEmail: string): Promise<AxiosResponse<any>> => api.get(`/projects/${projectId}/tasks?email=${userEmail}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const getTasksFromUser = (): Promise<AxiosResponse<any>> => api.get(`/projects/user/allTasks`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const getAssigneesFromTask = (taskId: string): Promise<AxiosResponse<any>> => api.get(`/projects/tasks/${taskId}/assignees`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

// Comments

export const getCommentsFromTask = (taskId: string): Promise<AxiosResponse<any>> => api.get(`/projects/tasks/${taskId}/comments`, {
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const createComment = (taskId: string, data: any): Promise<AxiosResponse<any>> => api.post(`/projects/tasks/${taskId}/comments`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
});
