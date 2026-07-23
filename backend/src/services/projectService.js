import { v4 as uuidv4 } from 'uuid';
import * as projectRepository from '../repositories/projectRepository.js';

export const createProject = async (contractorId, projectData) => {
  const existingProject = await projectRepository.findProjectByCode(projectData.project_code);
  if (existingProject) {
    const error = new Error('Project with this code already exists.');
    error.status = 409;
    throw error;
  }

  const newProject = {
    id: uuidv4(),
    contractor_id: contractorId,
    status: 'Planning',
    completion_percentage: 0.00,
    ...projectData
  };

  return await projectRepository.createProject(newProject);
};

export const getProjectById = async (userId, userRole, projectId) => {
  const project = await projectRepository.findProjectById(projectId);
  
  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  // Authorization check
  if (userRole === 'Contractor' && project.contractor_id !== userId) {
    const error = new Error('Unauthorized access to this project.');
    error.status = 403;
    throw error;
  }
  
  if (userRole === 'Homeowner' && project.owner_id !== userId) {
    const error = new Error('Unauthorized access to this project.');
    error.status = 403;
    throw error;
  }

  if (userRole === 'Worker') {
    const workerProjects = await projectRepository.findProjectsByWorker(userId);
    const isAssigned = workerProjects.some(p => p.id === projectId);
    if (!isAssigned) {
      const error = new Error('Unauthorized. You are not assigned to this project.');
      error.status = 403;
      throw error;
    }
  }

  return project;
};

export const getProjects = async (userId, userRole) => {
  if (userRole === 'Contractor') {
    return await projectRepository.findProjectsByContractor(userId);
  } else if (userRole === 'Homeowner') {
    return await projectRepository.findProjectsByOwner(userId);
  } else if (userRole === 'Worker') {
    return await projectRepository.findProjectsByWorker(userId);
  } else if (userRole === 'Admin') {
    // Return all projects for admin - assuming we add findAllProjects to repository if needed later
    return [];
  }
  return [];
};

export const updateProject = async (contractorId, projectId, updateData) => {
  const project = await projectRepository.findProjectById(projectId);
  
  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  if (project.contractor_id !== contractorId) {
    const error = new Error('Unauthorized. Only the assigned contractor can update this project.');
    error.status = 403;
    throw error;
  }

  if (updateData.project_code && updateData.project_code !== project.project_code) {
    const existingProject = await projectRepository.findProjectByCode(updateData.project_code);
    if (existingProject) {
      const error = new Error('Project with this code already exists.');
      error.status = 409;
      throw error;
    }
  }

  return await projectRepository.updateProject(projectId, updateData);
};

export const archiveProject = async (contractorId, projectId) => {
  const project = await projectRepository.findProjectById(projectId);
  
  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  if (project.contractor_id !== contractorId) {
    const error = new Error('Unauthorized. Only the assigned contractor can delete this project.');
    error.status = 403;
    throw error;
  }

  // Instead of hard deleting, we might want to just archive by status. But the prompt says "Soft Delete / Archive"
  // Let's implement it as a hard delete for now, or update status to 'Suspended'/'Completed' based on standard.
  // Actually, deleteProject deletes it. We will just use deleteProject as per repo.
  return await projectRepository.deleteProject(projectId);
};

export const updateStatus = async (contractorId, projectId, status) => {
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }
  if (project.contractor_id !== contractorId) {
    const error = new Error('Unauthorized access.');
    error.status = 403;
    throw error;
  }
  return await projectRepository.updateProjectStatus(projectId, status);
};

export const updateProgress = async (contractorId, projectId, progress) => {
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }
  if (project.contractor_id !== contractorId) {
    const error = new Error('Unauthorized access.');
    error.status = 403;
    throw error;
  }
  return await projectRepository.updateProjectProgress(projectId, progress);
};
