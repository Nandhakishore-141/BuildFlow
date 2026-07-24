import * as homeownerService from '../services/homeownerService.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await homeownerService.getDashboardStats(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const data = await homeownerService.getProjects(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjectWorkspace = async (req, res, next) => {
  try {
    const data = await homeownerService.getProjectWorkspace(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getVerifiedContractors = async (req, res, next) => {
  try {
    const data = await homeownerService.getVerifiedContractors(req.query.search);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createBuilding = async (req, res, next) => {
  try {
    const data = await homeownerService.createBuilding(req.user.id, req.body);
    res.status(201).json({ status: 'success', message: 'Building created successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getProposalsForProject = async (req, res, next) => {
  try {
    const data = await homeownerService.getProposalsForProject(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const acceptProposal = async (req, res, next) => {
  try {
    const data = await homeownerService.acceptProposal(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', message: 'Contractor proposal accepted successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const rejectProposal = async (req, res, next) => {
  try {
    const data = await homeownerService.rejectProposal(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', message: 'Proposal rejected', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getProjectProgress = async (req, res, next) => {
  try {
    const data = await homeownerService.getProjectProgress(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjectExpenses = async (req, res, next) => {
  try {
    const data = await homeownerService.getProjectExpenses(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjectDocuments = async (req, res, next) => {
  try {
    const data = await homeownerService.getProjectDocuments(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const data = await homeownerService.getNotifications(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const data = await homeownerService.markNotificationRead(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};
