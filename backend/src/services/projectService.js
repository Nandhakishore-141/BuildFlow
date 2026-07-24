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
    const isAssigned = workerProjects.data.some(p => p.id === projectId);
    if (!isAssigned) {
      const error = new Error('Unauthorized. You are not assigned to this project.');
      error.status = 403;
      throw error;
    }
  }

  // Attach workers if Contractor, Admin, or Homeowner
  if (['Contractor', 'Admin', 'Homeowner'].includes(userRole)) {
    project.assigned_workers = await projectRepository.getProjectWorkers(projectId);
  }

  return project;
};

export const getProjects = async (userId, userRole, filters) => {
  let result;
  if (userRole === 'Contractor') {
    result = await projectRepository.findProjectsByContractor(userId, filters);
  } else if (userRole === 'Homeowner') {
    result = await projectRepository.findProjectsByOwner(userId, filters);
  } else if (userRole === 'Worker') {
    result = await projectRepository.findProjectsByWorker(userId, filters);
  } else if (userRole === 'Admin') {
    result = await projectRepository.findAllProjects(filters);
  } else {
    result = { data: [], total: 0, page: 1, limit: 10 };
  }
  
  return {
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    }
  };
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

export const assignWorkerToProject = async (contractorId, projectId, workerId) => {
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }
  if (project.contractor_id !== contractorId) {
    const error = new Error('Unauthorized. Only the assigned contractor can assign workers.');
    error.status = 403;
    throw error;
  }
  return await projectRepository.assignWorker(projectId, workerId);
};

export const getBuildingWorkspace = async (userId, userRole, projectId) => {
  if (userRole === 'Worker') {
    const workspace = await projectRepository.getWorkerBuildingWorkspace(userId, projectId);
    if (!workspace) {
      const error = new Error('Forbidden. You are not assigned to this building.');
      error.status = 403;
      throw error;
    }
    return workspace;
  }
  const project = await getProjectById(userId, userRole, projectId);
  return { project };
};

export const removeWorkerFromProject = async (contractorId, projectId, workerId) => {
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

  return await projectRepository.removeWorker(projectId, workerId);
};
