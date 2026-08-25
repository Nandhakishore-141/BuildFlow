import { Router } from 'express';
import * as contractorController from '../controllers/contractorController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all routes with authentication and Contractor role requirement
router.use(requireAuth, requireRole('Contractor'));

router.get('/dashboard', contractorController.getDashboardStats);
router.get('/projects', contractorController.getProjects);
router.get('/projects/:id', contractorController.getProjectWorkspace);
router.get('/workers', contractorController.getWorkers);
router.get('/projects/:id/available-workers', contractorController.getAvailableWorkers);
router.post('/projects/:id/invite-worker', contractorController.inviteWorker);
router.post('/projects/:id/workers/:workerId', contractorController.inviteWorker);
router.delete('/projects/:id/workers/:workerId', contractorController.removeWorker);
router.delete('/invitations/:invitationId/cancel', contractorController.cancelInvitation);
router.get('/attendance', contractorController.getAttendance);
router.post('/attendance', contractorController.markAttendance);
router.get('/materials', contractorController.getMaterials);
router.post('/materials', contractorController.createMaterial);
router.put('/materials/:id', contractorController.updateMaterial);
router.delete('/materials/:id', contractorController.deleteMaterial);
router.get('/expenses', contractorController.getExpenses);
router.post('/expenses', contractorController.createExpense);
router.put('/expenses/:id', contractorController.updateExpense);
router.delete('/expenses/:id', contractorController.deleteExpense);
router.get('/progress', contractorController.getProgressUpdates);
router.put('/progress/:id/approve', contractorController.approveProgressUpdate);
router.get('/documents', contractorController.getDocuments);
router.get('/notifications', contractorController.getNotifications);
router.put('/notifications/:id/read', contractorController.markNotificationRead);
router.get('/settings', contractorController.getSettings);
router.put('/settings', contractorController.updateSettings);

router.get('/opportunities', contractorController.getOpportunities);
router.post('/proposals', contractorController.submitProposal);
router.get('/invitations', contractorController.getInvitations);
router.post('/invitations/:id/respond', contractorController.respondToInvitation);

// Tasks Routes
router.get('/projects/:id/tasks', contractorController.getProjectTasks);
router.post('/projects/:id/tasks', contractorController.createTask);
router.put('/tasks/:taskId', contractorController.updateTask);
router.delete('/tasks/:taskId', contractorController.deleteTask);
router.post('/tasks/:taskId/review', contractorController.reviewTask);

// Status & Progress Routes
router.put('/projects/:id/status', contractorController.updateProjectStatus);
router.put('/projects/:id/progress', contractorController.updateProjectProgress);

// Milestones Routes
router.get('/projects/:id/milestones', contractorController.getProjectMilestones);
router.post('/projects/:id/milestones', contractorController.createMilestone);
router.put('/milestones/:milestoneId', contractorController.updateMilestone);
router.delete('/milestones/:milestoneId', contractorController.deleteMilestone);

// Daily Work Updates Routes
router.get('/projects/:id/work-updates', contractorController.getDailyWorkUpdates);
router.post('/projects/:id/work-updates', contractorController.createDailyWorkUpdate);

// Calendar Route
router.get('/calendar', contractorController.getCalendarEvents);

export default router;
