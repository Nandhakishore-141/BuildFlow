import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/projects`;

export const getProjects = async (params = {}) => {
  return await axios.get(API_URL, { params });
};

export const getProject = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

export const createProject = async (data) => {
  return await axios.post(API_URL, data);
};

export const updateProject = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

export const deleteProject = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateProjectStatus = async (id, status) => {
  return await axios.patch(`${API_URL}/${id}/status`, { status });
};

export const updateProjectProgress = async (id, completion_percentage) => {
  return await axios.patch(`${API_URL}/${id}/progress`, { completion_percentage });
};

export const assignWorker = async (projectId, workerId) => {
  return await axios.post(`${API_URL}/${projectId}/workers/${workerId}`);
};

export const removeWorker = async (projectId, workerId) => {
  return await axios.delete(`${API_URL}/${projectId}/workers/${workerId}`);
};

export const getHomeownerProjects = async () => {
  return await axios.get(`${BASE_API_URL}/homeowner/projects`);
};
