import { Router } from 'express';
import * as workerController from '../controllers/workerController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all worker routes with authentication and Worker role check
router.use(requireAuth, requireRole('Worker'));

router.get('/dashboard', workerController.getDashboardStats);
router.get('/tasks', workerController.getTasks);
router.patch('/tasks/:taskId', workerController.updateTaskStatus);

router.get('/attendance', workerController.getAttendance);
router.post('/attendance/:id/accept', workerController.acceptAttendanceTiming);
router.post('/attendance/:id/absence-reason', workerController.submitAbsenceReason);
router.post('/attendance/clock-in', workerController.clockIn);
router.post('/attendance/clock-out', workerController.clockOut);

router.get('/announcements', workerController.getAnnouncements);

router.get('/profile', workerController.getProfile);
router.put('/profile', workerController.updateProfile);

router.get('/notifications', workerController.getNotifications);
router.put('/notifications/:id/read', workerController.markNotificationRead);

router.post('/progress', workerController.createProgress);

router.get('/invitations', workerController.getInvitations);
router.post('/invitations/:id/respond', workerController.respondToInvitation);

export default router;
