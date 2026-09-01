import apiClient from './apiClient';

export const getDashboard = () => apiClient.get('/contractor/dashboard');
export const getProjects = () => apiClient.get('/contractor/projects');
export const getProject = (id) => apiClient.get(`/contractor/projects/${id}`);
export const getAvailableWorkers = (projectId) => apiClient.get(`/contractor/projects/${projectId}/available-workers`);
export const getWorkers = () => apiClient.get('/contractor/workers');
export const getOpportunities = () => apiClient.get('/contractor/opportunities');
export const getInvitations = () => apiClient.get('/contractor/invitations');
export const getCalendar = (month, year) => apiClient.get('/contractor/calendar', { params: { month, year } });
export const getNotifications = () => apiClient.get('/contractor/notifications');
export const getSettings = () => apiClient.get('/contractor/settings');
export const updateSettings = (data) => apiClient.put('/contractor/settings', data);

// Project Team & Tasks
export const getProjectTasks = (id) => apiClient.get(`/contractor/projects/${id}/tasks`);
export const createProjectTask = (id, data) => apiClient.post(`/contractor/projects/${id}/tasks`, data);
export const getProjectMilestones = (id) => apiClient.get(`/contractor/projects/${id}/milestones`);
export const getProjectWorkUpdates = (id) => apiClient.get(`/contractor/projects/${id}/work-updates`);
export const inviteWorker = (projectId, workerId) => apiClient.post(`/contractor/projects/${projectId}/invite`, { worker_id: workerId });
export const assignWorker = (projectId, workerId) => apiClient.post(`/contractor/projects/${projectId}/assign`, { worker_id: workerId });
export const removeWorker = (projectId, workerId) => apiClient.delete(`/contractor/projects/${projectId}/workers/${workerId}`);

// Attendance Muster
export const getAttendance = (date, projectId) => apiClient.get('/contractor/attendance', { params: { date, project_id: projectId } });
export const markAttendance = (data) => apiClient.post('/contractor/attendance', data);

// Materials Management
export const getMaterials = (projectId) => apiClient.get('/contractor/materials', { params: { project_id: projectId } });
export const createMaterial = (data) => apiClient.post('/contractor/materials', data);
export const updateMaterial = (id, data) => apiClient.put(`/contractor/materials/${id}`, data);
export const deleteMaterial = (id) => apiClient.delete(`/contractor/materials/${id}`);

// Expenses Management
export const getExpenses = (projectId) => apiClient.get('/contractor/expenses', { params: { project_id: projectId } });
export const createExpense = (data) => apiClient.post('/contractor/expenses', data);
export const updateExpense = (id, data) => apiClient.put(`/contractor/expenses/${id}`, data);
export const deleteExpense = (id) => apiClient.delete(`/contractor/expenses/${id}`);

// Site Progress Updates & Approvals
export const getProgressUpdates = (projectId) => apiClient.get('/contractor/progress', { params: { project_id: projectId } });
export const approveProgressUpdate = (id, data = {}) => apiClient.put(`/contractor/progress/${id}/approve`, data);

// Documents & Reports
export const getDocuments = (projectId) => apiClient.get('/contractor/documents', { params: { project_id: projectId } });
