import { Router } from 'express';
import * as contractorController from '../controllers/contractorController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Require Auth & Contractor Role
router.use(requireAuth, requireRole('Contractor'));

router.get('/opportunities', contractorController.getOpportunities);
router.post('/proposals', contractorController.submitProposal);
router.get('/invitations', contractorController.getInvitations);
router.post('/invitations/:id/respond', contractorController.respondToInvitation);

export default router;
