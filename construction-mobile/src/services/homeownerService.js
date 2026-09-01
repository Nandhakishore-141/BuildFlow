import apiClient from './apiClient';

export const getDashboard = () => apiClient.get('/homeowner/dashboard');
export const getBuildings = () => apiClient.get('/homeowner/buildings');
export const getBuilding = (id) => apiClient.get(`/homeowner/buildings/${id}`);
export const getBuildingWorkspace = (id) => apiClient.get(`/homeowner/buildings/${id}`);
export const getVerifiedContractors = () => apiClient.get('/homeowner/verified-contractors');
export const getContractorProfile = (id) => apiClient.get(`/homeowner/contractors/${id}`);
export const getProposals = (id) => apiClient.get(`/homeowner/buildings/${id}/proposals`);
export const respondToProposal = (projectId, proposalId, action) => apiClient.post(`/homeowner/buildings/${projectId}/proposals/${proposalId}/respond`, { action });
export const getProjectProgress = (id) => apiClient.get(`/homeowner/projects/${id}/progress`);
export const getProjectExpenses = (id) => apiClient.get(`/homeowner/projects/${id}/expenses`);
export const getProjectDocuments = (id) => apiClient.get(`/homeowner/projects/${id}/documents`);
export const getNotifications = () => apiClient.get('/homeowner/notifications');
