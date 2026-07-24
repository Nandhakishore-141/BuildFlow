import { Router } from 'express';
import * as homeownerController from '../controllers/homeownerController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all routes with authentication and Homeowner role requirement
router.use(requireAuth, requireRole('Homeowner'));

router.get('/dashboard', homeownerController.getDashboardStats);
router.get('/buildings', homeownerController.getProjects);
router.post('/buildings', homeownerController.createBuilding);
router.get('/verified-contractors', homeownerController.getVerifiedContractors);
router.get('/buildings/:id', homeownerController.getProjectWorkspace);
router.get('/buildings/:id/proposals', homeownerController.getProposalsForProject);
router.post('/proposals/:id/accept', homeownerController.acceptProposal);
router.post('/proposals/:id/reject', homeownerController.rejectProposal);

// Backward Compatibility Routes
router.get('/projects', homeownerController.getProjects);
router.post('/projects', homeownerController.createBuilding);
router.get('/projects/:id', homeownerController.getProjectWorkspace);
router.get('/projects/:id/progress', homeownerController.getProjectProgress);
router.get('/projects/:id/expenses', homeownerController.getProjectExpenses);
router.get('/projects/:id/documents', homeownerController.getProjectDocuments);

router.get('/notifications', homeownerController.getNotifications);
router.put('/notifications/:id/read', homeownerController.markNotificationRead);

export default router;
