import * as contractorService from '../services/contractorService.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await contractorService.getDashboardStats(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const data = await contractorService.getContractorProjects(req.user.id, req.query);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjectWorkspace = async (req, res, next) => {
  try {
    const data = await contractorService.getContractorProjectWorkspace(req.user.id, req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getWorkers = async (req, res, next) => {
  try {
    const data = await contractorService.getContractorWorkers(req.user.id, req.query.search);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getAvailableWorkers = async (req, res, next) => {
  try {
    const data = await contractorService.getAvailableWorkersForProject(req.user.id, req.params.id, req.query.search);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const inviteWorker = async (req, res, next) => {
  try {
    const { workerId, message } = req.body;
    const targetWorkerId = workerId || req.params.workerId;
    const data = await contractorService.inviteWorkerToProject(req.user.id, req.params.id, targetWorkerId, message);
    res.status(201).json({ status: 'success', message: 'Project invitation sent to worker', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const cancelInvitation = async (req, res, next) => {
  try {
    const data = await contractorService.cancelWorkerInvitation(req.user.id, req.params.invitationId);
    res.status(200).json({ status: 'success', message: 'Invitation cancelled', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const assignWorker = inviteWorker;

export const removeWorker = async (req, res, next) => {
  try {
    const data = await contractorService.removeWorkerFromProject(req.user.id, req.params.id, req.params.workerId);
    res.status(200).json({ status: 'success', message: 'Worker removed from building', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const data = await contractorService.getAttendance(req.user.id, req.query.date, req.query.projectId);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const data = await contractorService.markAttendance(req.user.id, req.body);
    res.status(201).json({ status: 'success', message: 'Attendance logged', data });
  } catch (error) {
    next(error);
  }
};

export const getMaterials = async (req, res, next) => {
  try {
    const data = await contractorService.getMaterials(req.user.id, req.query.projectId);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const data = await contractorService.createMaterial(req.user.id, req.body);
    res.status(201).json({ status: 'success', message: 'Material record added', data });
  } catch (error) {
    next(error);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contractorService.updateMaterial(req.user.id, id, req.body);
    res.status(200).json({ status: 'success', message: 'Material record updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contractorService.deleteMaterial(req.user.id, id);
    res.status(200).json({ status: 'success', message: 'Material removed successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const data = await contractorService.getExpenses(req.user.id, req.query.projectId);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const data = await contractorService.createExpense(req.user.id, req.body);
    res.status(201).json({ status: 'success', message: 'Expense logged successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contractorService.updateExpense(req.user.id, id, req.body);
    res.status(200).json({ status: 'success', message: 'Expense updated successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const data = await contractorService.deleteExpense(req.user.id, req.params.id);
    res.status(200).json({ status: 'success', message: 'Expense deleted', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getProgressUpdates = async (req, res, next) => {
  try {
    const data = await contractorService.getProgressUpdates(req.user.id, req.query.projectId);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const approveProgressUpdate = async (req, res, next) => {
  try {
    const { completion_percentage } = req.body;
    const data = await contractorService.approveProgressUpdate(req.user.id, req.params.id, completion_percentage);
    res.status(200).json({ status: 'success', message: 'Progress update approved', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const data = await contractorService.getDocuments(req.user.id, req.query.projectId);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const data = await contractorService.getNotifications(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const data = await contractorService.markNotificationRead(req.user.id, req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const data = await contractorService.getSettings(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const data = await contractorService.updateSettings(req.user.id, req.body);
    res.status(200).json({ status: 'success', message: 'Company profile updated', data });
  } catch (error) {
    next(error);
  }
};

export const getOpportunities = async (req, res, next) => {
  try {
    const data = await contractorService.getOpportunities(req.user.id, req.query);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const submitProposal = async (req, res, next) => {
  try {
    const data = await contractorService.submitProposal(req.user.id, req.body);
    res.status(201).json({ status: 'success', message: 'Proposal submitted successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getInvitations = async (req, res, next) => {
  try {
    const data = await contractorService.getInvitations(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const respondToInvitation = async (req, res, next) => {
  try {
    const { status } = req.body;
    const data = await contractorService.respondToInvitation(req.params.id, req.user.id, status);
    res.status(200).json({ status: 'success', message: `Invitation ${status}`, data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Task Handlers
export const getProjectTasks = async (req, res, next) => {
  try {
    const data = await contractorService.getProjectTasks(req.user.id, req.params.id, req.query);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const data = await contractorService.createTask(req.user.id, { ...req.body, project_id: req.params.id || req.body.project_id });
    res.status(201).json({ status: 'success', message: 'Task created and assigned to worker(s)', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const data = await contractorService.updateTask(req.user.id, req.params.taskId, req.body);
    res.status(200).json({ status: 'success', message: 'Task updated successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const data = await contractorService.deleteTask(req.user.id, req.params.taskId);
    res.status(200).json({ status: 'success', message: 'Task deleted', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const reviewTask = async (req, res, next) => {
  try {
    const data = await contractorService.reviewTask(req.user.id, req.params.taskId, req.body);
    res.status(200).json({ status: 'success', message: `Task ${req.body.action === 'approve' ? 'approved' : 'returned for revisions'}`, data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Project Status & Progress Handlers
export const updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const data = await contractorService.updateProjectStatus(req.user.id, req.params.id, status);
    res.status(200).json({ status: 'success', message: `Project status updated to ${status}`, data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const updateProjectProgress = async (req, res, next) => {
  try {
    const data = await contractorService.updateProjectProgress(req.user.id, req.params.id, req.body);
    res.status(200).json({ status: 'success', message: 'Project progress updated', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Milestones Handlers
export const getProjectMilestones = async (req, res, next) => {
  try {
    const data = await contractorService.getProjectMilestones(req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createMilestone = async (req, res, next) => {
  try {
    const data = await contractorService.createMilestone(req.user.id, { ...req.body, project_id: req.params.id || req.body.project_id });
    res.status(201).json({ status: 'success', message: 'Milestone created', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const updateMilestone = async (req, res, next) => {
  try {
    const data = await contractorService.updateMilestone(req.user.id, req.params.milestoneId, req.body);
    res.status(200).json({ status: 'success', message: 'Milestone updated', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const deleteMilestone = async (req, res, next) => {
  try {
    const data = await contractorService.deleteMilestone(req.user.id, req.params.milestoneId);
    res.status(200).json({ status: 'success', message: 'Milestone deleted', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Daily Work Updates Handlers
export const getDailyWorkUpdates = async (req, res, next) => {
  try {
    const data = await contractorService.getDailyWorkUpdates(req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createDailyWorkUpdate = async (req, res, next) => {
  try {
    const data = await contractorService.createDailyWorkUpdate(req.user.id, { ...req.body, project_id: req.params.id || req.body.project_id });
    res.status(201).json({ status: 'success', message: 'Daily work update posted', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Calendar Events Handler
export const getCalendarEvents = async (req, res, next) => {
  try {
    const data = await contractorService.getCalendarEvents(req.user.id, req.query.startDate, req.query.endDate);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};
