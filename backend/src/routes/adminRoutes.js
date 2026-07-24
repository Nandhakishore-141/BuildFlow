import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Require authentication for all admin routes
router.use(requireAuth);

// Stop impersonation endpoint (must be accessible when in impersonated user role)
router.post('/stop-impersonation', adminController.stopImpersonation);

// Restrict all remaining admin routes to Admin role only
router.use(requireRole('Admin'));

router.post('/impersonate/:userId', adminController.impersonateUser);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/contractors', adminController.getUsers);
router.get('/homeowners', adminController.getUsers);
router.get('/workers', adminController.getUsers);
router.get('/projects', adminController.getProjects);
router.get('/reports', adminController.getReports);
router.get('/analytics', adminController.getAnalytics);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/notifications', adminController.getNotifications);
router.put('/notifications/:id/read', adminController.markNotificationRead);

router.get('/announcements', adminController.getAnnouncements);
router.post('/announcements', adminController.createAnnouncement);

router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/contractors/:id/verify', adminController.verifyContractor);

export default router;
