import * as workerService from '../services/workerService.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await workerService.getDashboardStats(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const data = await workerService.getWorkerTasks(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status, notes, file_url } = req.body;
    const data = await workerService.updateTaskStatus(req.user.id, taskId, status, notes, file_url);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const data = await workerService.getWorkerAttendance(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const acceptAttendanceTiming = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await workerService.acceptAttendanceTiming(req.user.id, id);
    res.status(200).json({ status: 'success', message: 'Shift timing accepted successfully!', data });
  } catch (error) {
    next(error);
  }
};

export const submitAbsenceReason = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const data = await workerService.submitAbsenceReason(req.user.id, id, reason);
    res.status(200).json({ status: 'success', message: 'Absence reason submitted successfully!', data });
  } catch (error) {
    next(error);
  }
};

export const clockIn = async (req, res, next) => {
  try {
    const data = await workerService.clockIn(req.user.id, req.body);
    res.status(200).json({ status: 'success', message: 'Checked in successfully!', data });
  } catch (error) {
    next(error);
  }
};

export const clockOut = async (req, res, next) => {
  try {
    const data = await workerService.clockOut(req.user.id, req.body);
    res.status(200).json({ status: 'success', message: 'Checked out successfully!', data });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const data = await workerService.getWorkerAnnouncements();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const data = await workerService.getWorkerProfile(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await workerService.updateWorkerProfile(req.user.id, req.body);
    res.status(200).json({ status: 'success', message: 'Profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await workerService.getWorkerNotifications(req.user.id);
    res.status(200).json({ status: 'success', notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const data = await workerService.markNotificationRead(req.user.id, req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createProgress = async (req, res, next) => {
  try {
    const data = await workerService.createProgress(req.user.id, req.body);
    res.status(201).json({ status: 'success', message: 'Progress update uploaded', data });
  } catch (error) {
    next(error);
  }
};

export const getInvitations = async (req, res, next) => {
  try {
    const data = await workerService.getWorkerInvitations(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const respondToInvitation = async (req, res, next) => {
  try {
    const { action, status } = req.body;
    const targetStatus = action || status;
    const data = await workerService.respondToInvitation(req.user.id, req.params.id, targetStatus);
    res.status(200).json({ status: 'success', message: `Invitation ${data.status}`, data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};
