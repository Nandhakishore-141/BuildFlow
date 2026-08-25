import { v4 as uuidv4 } from 'uuid';
import * as contractorRepository from '../repositories/contractorRepository.js';

export const getDashboardStats = async (contractorId) => {
  return await contractorRepository.getDashboardStats(contractorId);
};

export const getContractorProjects = async (contractorId, filters) => {
  return await contractorRepository.getContractorProjects(contractorId, filters);
};

export const getContractorProjectWorkspace = async (contractorId, projectId) => {
  const ws = await contractorRepository.getContractorProjectWorkspace(contractorId, projectId);
  if (!ws) {
    const err = new Error('Forbidden or Project Not Found. You are not assigned as lead contractor for this project.');
    err.statusCode = 403;
    throw err;
  }
  return ws;
};

export const getContractorWorkers = async (contractorId, search) => {
  return await contractorRepository.getContractorWorkers(contractorId, search);
};

export const getAvailableWorkersForProject = async (contractorId, projectId, search) => {
  return await contractorRepository.getAvailableWorkersForProject(contractorId, projectId, search);
};

export const inviteWorkerToProject = async (contractorId, projectId, workerId, message) => {
  return await contractorRepository.inviteWorkerToProject(contractorId, projectId, workerId, message);
};

export const cancelWorkerInvitation = async (contractorId, invitationId) => {
  return await contractorRepository.cancelWorkerInvitation(contractorId, invitationId);
};

export const removeWorkerFromProject = async (contractorId, projectId, workerId) => {
  const res = await contractorRepository.removeWorkerFromProject(contractorId, projectId, workerId);
  if (!res) {
    const err = new Error('Failed to remove worker.');
    err.statusCode = 403;
    throw err;
  }
  return res;
};

export const getAttendance = async (contractorId, date, projectId) => {
  return await contractorRepository.getAttendance(contractorId, date, projectId);
};

export const markAttendance = async (contractorId, data) => {
  return await contractorRepository.markAttendance(contractorId, data);
};

export const getMaterials = async (contractorId, projectId) => {
  return await contractorRepository.getMaterials(contractorId, projectId);
};

export const createMaterial = async (contractorId, data) => {
  return await contractorRepository.createMaterial(contractorId, data);
};

export const updateMaterial = async (contractorId, materialId, data) => {
  return await contractorRepository.updateMaterial(contractorId, materialId, data);
};

export const deleteMaterial = async (contractorId, materialId) => {
  return await contractorRepository.deleteMaterial(contractorId, materialId);
};

export const getExpenses = async (contractorId, projectId) => {
  return await contractorRepository.getExpenses(contractorId, projectId);
};

export const createExpense = async (contractorId, data) => {
  return await contractorRepository.createExpense(contractorId, data);
};

export const updateExpense = async (contractorId, expenseId, data) => {
  return await contractorRepository.updateExpense(contractorId, expenseId, data);
};

export const deleteExpense = async (contractorId, expenseId) => {
  return await contractorRepository.deleteExpense(contractorId, expenseId);
};

export const getProgressUpdates = async (contractorId, projectId) => {
  return await contractorRepository.getProgressUpdates(contractorId, projectId);
};

export const approveProgressUpdate = async (contractorId, updateId, completionPercentage) => {
  const res = await contractorRepository.approveProgressUpdate(contractorId, updateId, completionPercentage);
  if (!res) {
    const err = new Error('Progress update not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }
  return res;
};

export const getDocuments = async (contractorId, projectId) => {
  return await contractorRepository.getDocuments(contractorId, projectId);
};

export const getNotifications = async (contractorId) => {
  return await contractorRepository.getNotifications(contractorId);
};

export const markNotificationRead = async (contractorId, notificationId) => {
  return await contractorRepository.markNotificationRead(contractorId, notificationId);
};

export const getSettings = async (contractorId) => {
  return await contractorRepository.getSettings(contractorId);
};

export const updateSettings = async (contractorId, data) => {
  return await contractorRepository.updateSettings(contractorId, data);
};

export const getOpportunities = async (contractorId, filters) => {
  return await contractorRepository.getOpportunities(contractorId, filters);
};

export const submitProposal = async (contractorId, proposalData) => {
  const proposalId = uuidv4();
  return await contractorRepository.submitProposal({
    id: proposalId,
    contractor_id: contractorId,
    ...proposalData
  });
};

export const getInvitations = async (contractorId) => {
  return await contractorRepository.getInvitations(contractorId);
};

export const respondToInvitation = async (invitationId, contractorId, status) => {
  const res = await contractorRepository.respondToInvitation(invitationId, contractorId, status);
  if (!res) {
    const err = new Error('Invitation not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }
  return res;
};

// Task Management
export const getProjectTasks = async (contractorId, projectId, filters) => {
  return await contractorRepository.getProjectTasks(contractorId, projectId, filters);
};

export const createTask = async (contractorId, taskData) => {
  if (!taskData.title || !taskData.project_id) {
    const err = new Error('Task title and building project selection are required.');
    err.statusCode = 400;
    throw err;
  }
  return await contractorRepository.createTask(contractorId, taskData);
};

export const updateTask = async (contractorId, taskId, taskData) => {
  return await contractorRepository.updateTask(contractorId, taskId, taskData);
};

export const deleteTask = async (contractorId, taskId) => {
  return await contractorRepository.deleteTask(contractorId, taskId);
};

export const reviewTask = async (contractorId, taskId, reviewData) => {
  if (!reviewData.action || !['approve', 'reject'].includes(reviewData.action)) {
    const err = new Error('Action must be either "approve" or "reject".');
    err.statusCode = 400;
    throw err;
  }
  return await contractorRepository.reviewTask(contractorId, taskId, reviewData);
};

// Status & Progress Management
export const updateProjectStatus = async (contractorId, projectId, status) => {
  if (!status) {
    const err = new Error('Status is required.');
    err.statusCode = 400;
    throw err;
  }
  return await contractorRepository.updateProjectStatus(contractorId, projectId, status);
};

export const updateProjectProgress = async (contractorId, projectId, progressData) => {
  return await contractorRepository.updateProjectProgress(contractorId, projectId, progressData);
};

// Milestones
export const getProjectMilestones = async (projectId) => {
  return await contractorRepository.getProjectMilestones(projectId);
};

export const createMilestone = async (contractorId, milestoneData) => {
  if (!milestoneData.name || !milestoneData.project_id) {
    const err = new Error('Milestone name and project are required.');
    err.statusCode = 400;
    throw err;
  }
  return await contractorRepository.createMilestone(contractorId, milestoneData);
};

export const updateMilestone = async (contractorId, milestoneId, data) => {
  return await contractorRepository.updateMilestone(contractorId, milestoneId, data);
};

export const deleteMilestone = async (contractorId, milestoneId) => {
  return await contractorRepository.deleteMilestone(contractorId, milestoneId);
};

// Daily Work Updates
export const getDailyWorkUpdates = async (projectId) => {
  return await contractorRepository.getDailyWorkUpdates(projectId);
};

export const createDailyWorkUpdate = async (contractorId, updateData) => {
  if (!updateData.content || !updateData.project_id) {
    const err = new Error('Project and work update content are required.');
    err.statusCode = 400;
    throw err;
  }
  return await contractorRepository.createDailyWorkUpdate(contractorId, updateData);
};

// Calendar Events
export const getCalendarEvents = async (contractorId, startDate, endDate) => {
  return await contractorRepository.getCalendarEvents(contractorId, startDate, endDate);
};
