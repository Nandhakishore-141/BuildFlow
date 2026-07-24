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
    const data = await adminService.getUsers(req.query);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const data = await adminService.getProjects(req.query);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getAnalytics();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const data = await adminService.getReports();
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
    const data = await adminService.getAuditLogs(req.query);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const data = await adminService.getNotifications();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.markNotificationRead(id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const impersonateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const data = await adminService.impersonateUser(req.user, userId, ipAddress);
    res.status(200).json({ status: 'success', message: 'Impersonation started successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const stopImpersonation = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const data = await adminService.stopImpersonation(req.user, ipAddress);
    res.status(200).json({ status: 'success', message: 'Impersonation stopped successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
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
