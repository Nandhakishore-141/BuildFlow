import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes
router.use(requireAuth);
router.use(requireRole('Admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/contractors', adminController.getUsers);
router.get('/homeowners', adminController.getUsers);
router.get('/workers', adminController.getUsers);
router.get('/projects', adminController.getProjects);
router.get('/reports', adminController.getReports);
router.get('/analytics', adminController.getAnalytics);
router.get('/audit-logs', adminController.getAuditLogs);

router.get('/announcements', adminController.getAnnouncements);
router.post('/announcements', adminController.createAnnouncement);

router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/contractors/:id/verify', adminController.verifyContractor);

export default router;
