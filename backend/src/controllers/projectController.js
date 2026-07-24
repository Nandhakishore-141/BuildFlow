import { body, validationResult } from 'express-validator';
import * as projectService from '../services/projectService.js';

export const validateProject = [
  body('project_name').notEmpty().withMessage('Project Name is required').trim(),
  body('project_code').notEmpty().withMessage('Project Code is required').trim(),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('completion_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Completion percentage must be between 0 and 100'),
  body('planned_start_date').optional().isISO8601().withMessage('Start Date must be a valid date'),
  body('planned_end_date').optional().isISO8601().custom((value, { req }) => {
    if (req.body.planned_start_date && new Date(value) <= new Date(req.body.planned_start_date)) {
      throw new Error('End Date must be after Start Date');
    }
    return true;
  })
];

export const createProject = async (req, res) => {
  console.log('[PROJECT] Creating Project...');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('[PROJECT] Validation Failed');
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  try {
    const project = await projectService.createProject(req.user.id, req.body);
    console.log(`[PROJECT] Project Created: ${project.id}`);
    res.status(201).json({ status: 'success', data: { project } });
  } catch (error) {
    console.error(`[PROJECT] Error creating project:`, error.message);
    const status = error.status || 500;
    res.status(status).json({ status: 'error', message: error.message });
  }
};

export const listProjects = async (req, res) => {
  console.log('[PROJECT] Listing Projects for User:', req.user.id);
  try {
    const { page, limit, search, status } = req.query;
    const filters = { page, limit, search, status };
    
    const result = await projectService.getProjects(req.user.id, req.user.role, filters);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    console.error(`[PROJECT] Error listing projects:`, error.message);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve projects' });
  }
};

export const getProjectDetails = async (req, res) => {
  console.log(`[PROJECT] Fetching Project Details: ${req.params.id}`);
  try {
    const project = await projectService.getProjectById(req.user.id, req.user.role, req.params.id);
    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    console.error(`[PROJECT] Error fetching project:`, error.message);
    const status = error.status || 500;
    res.status(status).json({ status: 'error', message: error.message });
  }
};

export const getBuildingWorkspace = async (req, res) => {
  console.log(`[PROJECT] Fetching Building Workspace: ${req.params.id} for User: ${req.user.id}`);
  try {
    const data = await projectService.getBuildingWorkspace(req.user.id, req.user.role, req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error(`[PROJECT] Error fetching building workspace:`, error.message);
    const status = error.status || 500;
    res.status(status).json({ status: 'error', message: error.message });
  }
};

export const updateProject = async (req, res) => {
  console.log(`[PROJECT] Updating Project: ${req.params.id}`);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('[PROJECT] Validation Failed');
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  try {
    const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    console.error(`[PROJECT] Error updating project:`, error.message);
    const status = error.status || 500;
    res.status(status).json({ status: 'error', message: error.message });
  }
};

export const archiveProject = async (req, res) => {
  console.log(`[PROJECT] Archiving Project: ${req.params.id}`);
  try {
    await projectService.archiveProject(req.user.id, req.params.id);
    console.log(`[PROJECT] Project Archived: ${req.params.id}`);
    res.status(200).json({ status: 'success', message: 'Project successfully archived' });
  } catch (error) {
    console.error(`[PROJECT] Error archiving project:`, error.message);
    const status = error.status || 500;
    res.status(status).json({ status: 'error', message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  console.log(`[PROJECT] Updating Project Status: ${req.params.id}`);
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ status: 'error', message: 'Status is required' });
    }
    const project = await projectService.updateStatus(req.user.id, req.params.id, status);
    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    console.error(`[PROJECT] Error updating status:`, error.message);
    const statusCode = error.status || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  console.log(`[PROJECT] Updating Project Progress: ${req.params.id}`);
  try {
    const { completion_percentage } = req.body;
    if (completion_percentage === undefined || completion_percentage < 0 || completion_percentage > 100) {
      return res.status(400).json({ status: 'error', message: 'Valid completion_percentage (0-100) is required' });
    }
    const project = await projectService.updateProgress(req.user.id, req.params.id, completion_percentage);
    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    console.error(`[PROJECT] Error updating progress:`, error.message);
    const statusCode = error.status || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const assignWorker = async (req, res) => {
  console.log(`[PROJECT] Assigning Worker ${req.params.workerId} to Project: ${req.params.id}`);
  try {
    await projectService.assignWorkerToProject(req.user.id, req.params.id, req.params.workerId);
    res.status(200).json({ status: 'success', message: 'Worker assigned successfully' });
  } catch (error) {
    console.error(`[PROJECT] Error assigning worker:`, error.message);
    const statusCode = error.status || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const removeWorker = async (req, res) => {
  console.log(`[PROJECT] Removing Worker ${req.params.workerId} from Project: ${req.params.id}`);
  try {
    await projectService.removeWorkerFromProject(req.user.id, req.params.id, req.params.workerId);
    res.status(200).json({ status: 'success', message: 'Worker removed successfully' });
  } catch (error) {
    console.error(`[PROJECT] Error removing worker:`, error.message);
    const statusCode = error.status || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};
