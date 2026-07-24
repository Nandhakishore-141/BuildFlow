import axios from 'axios';

const API_URL = 'http://localhost:5000/api/homeowner';

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/buildings`);
  return response.data;
};

export const createBuilding = async (data) => {
  const response = await axios.post(`${API_URL}/buildings`, data);
  return response.data;
};

export const getVerifiedContractors = async (search = '') => {
  const response = await axios.get(`${API_URL}/verified-contractors`, { params: { search } });
  return response.data;
};

export const getProjectWorkspace = async (id) => {
  const response = await axios.get(`${API_URL}/buildings/${id}`);
  return response.data;
};

export const getProposalsForProject = async (id) => {
  const response = await axios.get(`${API_URL}/buildings/${id}/proposals`);
  return response.data;
};

export const acceptProposal = async (proposalId) => {
  const response = await axios.post(`${API_URL}/proposals/${proposalId}/accept`);
  return response.data;
};

export const rejectProposal = async (proposalId) => {
  const response = await axios.post(`${API_URL}/proposals/${proposalId}/reject`);
  return response.data;
};

export const getProjectProgress = async (id) => {
  const response = await axios.get(`${API_URL}/projects/${id}/progress`);
  return response.data;
};

export const getProjectExpenses = async (id) => {
  const response = await axios.get(`${API_URL}/projects/${id}/expenses`);
  return response.data;
};

export const getProjectDocuments = async (id) => {
  const response = await axios.get(`${API_URL}/projects/${id}/documents`);
  return response.data;
};

export const getNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`);
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await axios.put(`${API_URL}/notifications/${id}/read`);
  return response.data;
};
