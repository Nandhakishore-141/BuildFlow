import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/contractor`;

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

export const getProjects = async (params = {}) => {
  const response = await axios.get(`${API_URL}/projects`, { params });
  return response.data;
};

export const getProjectWorkspace = async (id) => {
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

export const getContractorWorkers = async (search = '') => {
  const response = await axios.get(`${API_URL}/workers`, { params: { search } });
  return response.data;
};

export const getAvailableWorkersForProject = async (projectId, search = '') => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/available-workers`, { params: { search } });
  return response.data;
};

export const inviteWorkerToProject = async (projectId, workerId, message = '') => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/invite-worker`, { workerId, message });
  return response.data;
};

export const cancelWorkerInvitation = async (invitationId) => {
  const response = await axios.delete(`${API_URL}/invitations/${invitationId}/cancel`);
  return response.data;
};

export const assignWorkerToProject = inviteWorkerToProject;

export const removeWorkerFromProject = async (projectId, workerId) => {
  const response = await axios.delete(`${API_URL}/projects/${projectId}/workers/${workerId}`);
  return response.data;
};

export const getAttendance = async (date = '', projectId = '') => {
  const response = await axios.get(`${API_URL}/attendance`, { params: { date, projectId } });
  return response.data;
};

export const markAttendance = async (data) => {
  const response = await axios.post(`${API_URL}/attendance`, data);
  return response.data;
};

export const getMaterials = async (projectId = '') => {
  const response = await axios.get(`${API_URL}/materials`, { params: { projectId } });
  return response.data;
};

export const createMaterial = async (data) => {
  const response = await axios.post(`${API_URL}/materials`, data);
  return response.data;
};

export const updateMaterial = async (materialId, data) => {
  const response = await axios.put(`${API_URL}/materials/${materialId}`, data);
  return response.data;
};

export const deleteMaterial = async (materialId) => {
  const response = await axios.delete(`${API_URL}/materials/${materialId}`);
  return response.data;
};

export const getExpenses = async (projectId = '') => {
  const response = await axios.get(`${API_URL}/expenses`, { params: { projectId } });
  return response.data;
};

export const createExpense = async (data) => {
  const response = await axios.post(`${API_URL}/expenses`, data);
  return response.data;
};

export const updateExpense = async (expenseId, data) => {
  const response = await axios.put(`${API_URL}/expenses/${expenseId}`, data);
  return response.data;
};

export const deleteExpense = async (expenseId) => {
  const response = await axios.delete(`${API_URL}/expenses/${expenseId}`);
  return response.data;
};

export const getProgressUpdates = async (projectId = '') => {
  const response = await axios.get(`${API_URL}/progress`, { params: { projectId } });
  return response.data;
};

export const approveProgressUpdate = async (updateId, completion_percentage) => {
  const response = await axios.put(`${API_URL}/progress/${updateId}/approve`, { completion_percentage });
  return response.data;
};

export const getDocuments = async (projectId = '') => {
  const response = await axios.get(`${API_URL}/documents`, { params: { projectId } });
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

export const getSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`);
  return response.data;
};

export const updateSettings = async (data) => {
  const response = await axios.put(`${API_URL}/settings`, data);
  return response.data;
};

export const getOpportunities = async (params = {}) => {
  const response = await axios.get(`${API_URL}/opportunities`, { params });
  return response.data;
};

export const submitProposal = async (data) => {
  const response = await axios.post(`${API_URL}/proposals`, data);
  return response.data;
};

export const getInvitations = async () => {
  const response = await axios.get(`${API_URL}/invitations`);
  return response.data;
};

export const respondToInvitation = async (invitationId, status) => {
  const response = await axios.post(`${API_URL}/invitations/${invitationId}/respond`, { status });
  return response.data;
};

// Tasks API
export const getProjectTasks = async (projectId, params = {}) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`, { params });
  return response.data;
};

export const createTask = async (projectId, taskData) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
  return response.data;
};

export const reviewTask = async (taskId, reviewData) => {
  const response = await axios.post(`${API_URL}/tasks/${taskId}/review`, reviewData);
  return response.data;
};

// Status & Progress API
export const updateProjectStatus = async (projectId, status) => {
  const response = await axios.put(`${API_URL}/projects/${projectId}/status`, { status });
  return response.data;
};

export const updateProjectProgress = async (projectId, progressData) => {
  const response = await axios.put(`${API_URL}/projects/${projectId}/progress`, progressData);
  return response.data;
};

// Milestones API
export const getProjectMilestones = async (projectId) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/milestones`);
  return response.data;
};

export const createMilestone = async (projectId, milestoneData) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/milestones`, milestoneData);
  return response.data;
};

export const updateMilestone = async (milestoneId, milestoneData) => {
  const response = await axios.put(`${API_URL}/milestones/${milestoneId}`, milestoneData);
  return response.data;
};

export const deleteMilestone = async (milestoneId) => {
  const response = await axios.delete(`${API_URL}/milestones/${milestoneId}`);
  return response.data;
};

// Daily Work Updates API
export const getDailyWorkUpdates = async (projectId) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/work-updates`);
  return response.data;
};

export const createDailyWorkUpdate = async (projectId, updateData) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/work-updates`, updateData);
  return response.data;
};

// Calendar API
export const getCalendarEvents = async (params = {}) => {
  const response = await axios.get(`${API_URL}/calendar`, { params });
  return response.data;
};
