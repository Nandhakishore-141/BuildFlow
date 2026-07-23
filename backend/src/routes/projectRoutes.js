import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import * as projectController from '../controllers/projectController.js';

const router = express.Router();

// All project routes require authentication
router.use(requireAuth);

// GET /api/projects - List projects (Available to all authenticated users)
router.get('/', projectController.listProjects);

// GET /api/projects/:id - Get project details
router.get('/:id', projectController.getProjectDetails);

// POST /api/projects - Create a new project (Contractor only)
router.post(
  '/', 
  requireRole('Contractor'), 
  projectController.validateProject, 
  projectController.createProject
);

// PUT /api/projects/:id - Update a project (Contractor only)
router.put(
  '/:id', 
  requireRole('Contractor'), 
  projectController.validateProject, 
  projectController.updateProject
);

// DELETE /api/projects/:id - Archive/Delete a project (Contractor only)
router.delete(
  '/:id', 
  requireRole('Contractor'), 
  projectController.archiveProject
);

// PATCH /api/projects/:id/status - Update project status (Contractor only)
router.patch(
  '/:id/status', 
  requireRole('Contractor'), 
  projectController.updateStatus
);

// PATCH /api/projects/:id/progress - Update project completion percentage (Contractor only)
router.patch(
  '/:id/progress', 
  requireRole('Contractor'), 
  projectController.updateProgress
);

export default router;
