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

// GET /api/projects/:id/building-workspace - Get building workspace details for worker
router.get('/:id/building-workspace', projectController.getBuildingWorkspace);

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

// POST /api/projects/:id/workers/:workerId - Assign a worker (Contractor only)
router.post(
  '/:id/workers/:workerId',
  requireRole('Contractor'),
  projectController.assignWorker
);

// DELETE /api/projects/:id/workers/:workerId - Remove a worker (Contractor only)
router.delete(
  '/:id/workers/:workerId',
  requireRole('Contractor'),
  projectController.removeWorker
);

export default router;
