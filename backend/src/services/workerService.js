import { v4 as uuidv4 } from 'uuid';
import * as workerRepository from '../repositories/workerRepository.js';
import * as projectRepository from '../repositories/projectRepository.js';

export const getDashboardStats = async (workerId) => {
  return await workerRepository.getDashboardStats(workerId);
};

export const getWorkerTasks = async (workerId) => {
  return await workerRepository.getWorkerTasks(workerId);
};

export const updateTaskStatus = async (workerId, taskId, status, notes = null, fileUrl = null) => {
  const updatedTask = await workerRepository.updateTaskStatus(workerId, taskId, status);
  if (!updatedTask) {
    const error = new Error('Task not found or not assigned to you.');
    error.statusCode = 404;
    throw error;
  }

  // If completion photo or notes provided, create progress update
  if (fileUrl || notes) {
    await workerRepository.createProgressUpdate(workerId, {
      id: uuidv4(),
      project_id: updatedTask.project_id,
      description: notes || `Completed task: ${updatedTask.title}`,
      file_url: fileUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800',
      file_type: 'Photo'
    });
  }

  return updatedTask;
};

export const getWorkerAttendance = async (workerId) => {
  return await workerRepository.getWorkerAttendance(workerId);
};

export const acceptAttendanceTiming = async (workerId, attendanceId) => {
  return await workerRepository.acceptAttendanceTiming(workerId, attendanceId);
};

export const submitAbsenceReason = async (workerId, attendanceId, reason) => {
  return await workerRepository.submitAbsenceReason(workerId, attendanceId, reason);
};

export const clockIn = async (workerId, data) => {
  const { project_id } = data;
  if (!project_id) {
    const error = new Error('Project selection is required for check-in.');
    error.statusCode = 400;
    throw error;
  }

  // Verify worker is assigned to this project
  const workspace = await projectRepository.getWorkerBuildingWorkspace(workerId, project_id);
  if (!workspace) {
    const error = new Error('You are not assigned to this project site.');
    error.statusCode = 403;
    throw error;
  }

  // Check for active check in today
  const activeRecord = await workerRepository.findTodayActiveClockIn(workerId);
  if (activeRecord && !activeRecord.clock_out) {
    const error = new Error(`Already checked in today for ${activeRecord.project_name} at ${new Date(activeRecord.clock_in).toLocaleTimeString()}.`);
    error.statusCode = 400;
    throw error;
  }

  return await workerRepository.clockIn(workerId, data);
};

export const clockOut = async (workerId, data) => {
  const activeRecord = await workerRepository.findTodayActiveClockIn(workerId);
  if (!activeRecord) {
    const error = new Error('No check-in record found for today.');
    error.statusCode = 400;
    throw error;
  }

  if (activeRecord.clock_out) {
    const error = new Error('You have already clocked out for today.');
    error.statusCode = 400;
    throw error;
  }

  return await workerRepository.clockOut(activeRecord.id, data);
};

export const getWorkerAnnouncements = async () => {
  return await workerRepository.getWorkerAnnouncements();
};

export const getWorkerProfile = async (workerId) => {
  const profile = await workerRepository.getWorkerProfile(workerId);
  if (!profile) {
    const error = new Error('Worker profile not found.');
    error.statusCode = 404;
    throw error;
  }
  return profile;
};

export const updateWorkerProfile = async (workerId, updateData) => {
  // Reject sensitive / read-only fields
  if (updateData.role || updateData.id || updateData.contractor_id || updateData.email) {
    const error = new Error('Editing role, employee ID, assigned contractor, or email is prohibited.');
    error.statusCode = 400;
    throw error;
  }

  return await workerRepository.updateWorkerProfile(workerId, updateData);
};

export const getWorkerNotifications = async (workerId) => {
  return await workerRepository.getWorkerNotifications(workerId);
};

export const markNotificationRead = async (workerId, notificationId) => {
  return await workerRepository.markNotificationRead(workerId, notificationId);
};

export const createProgress = async (workerId, data) => {
  const { project_id, description, file_url, file_type = 'Photo' } = data;
  if (!project_id) {
    const error = new Error('Project ID is required.');
    error.statusCode = 400;
    throw error;
  }

  const workspace = await projectRepository.getWorkerBuildingWorkspace(workerId, project_id);
  if (!workspace) {
    const error = new Error('You are not assigned to this building project.');
    error.statusCode = 403;
    throw error;
  }

  const progressData = {
    id: uuidv4(),
    project_id,
    description: description || 'Site progress update',
    file_url: file_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800',
    file_type
  };

  return await workerRepository.createProgressUpdate(workerId, progressData);
};

export const getWorkerInvitations = async (workerId) => {
  return await workerRepository.getWorkerInvitations(workerId);
};

export const respondToInvitation = async (workerId, invitationId, status) => {
  return await workerRepository.respondToWorkerInvitation(workerId, invitationId, status);
};
