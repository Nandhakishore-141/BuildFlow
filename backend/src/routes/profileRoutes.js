import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all routes with authentication
router.use(requireAuth);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

export default router;
