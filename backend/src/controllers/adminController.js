import adminService from '../services/adminService.js';

export const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboard();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getUsers();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const data = await adminService.getProjects();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const data = await adminService.getAnnouncements();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const data = await adminService.createAnnouncement(req.body);
    res.status(201).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogs();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await adminService.updateUserStatus(id, status);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const verifyContractor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.verifyContractor(id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

// Placeholders for endpoints not strictly implemented yet but requested
export const getReports = async (req, res, next) => {
  res.status(200).json({ status: 'success', data: [] });
};

export const getAnalytics = async (req, res, next) => {
  res.status(200).json({ status: 'success', data: {} });
};
