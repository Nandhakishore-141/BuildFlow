import apiClient from './apiClient';

export const getProjects = (params = {}) => apiClient.get('/projects', { params });
export const getProject = (id) => apiClient.get(`/projects/${id}`);
export const createProject = (data) => apiClient.post('/projects', data);
export const updateProject = (id, data) => apiClient.put(`/projects/${id}`, data);
export const deleteProject = (id) => apiClient.delete(`/projects/${id}`);
export const updateProjectStatus = (id, status) => apiClient.patch(`/projects/${id}/status`, { status });
export const updateProjectProgress = (id, completion_percentage) => apiClient.patch(`/projects/${id}/progress`, { completion_percentage });
export const getBuildingWorkspace = (id) => apiClient.get(`/projects/${id}/building-workspace`);
