import { v4 as uuidv4 } from 'uuid';
import * as homeownerRepository from '../repositories/homeownerRepository.js';

export const getDashboardStats = async (ownerId) => {
  return await homeownerRepository.getDashboardStats(ownerId);
};

export const getProjects = async (ownerId) => {
  return await homeownerRepository.getProjects(ownerId);
};

export const getProjectWorkspace = async (projectId, ownerId) => {
  const workspace = await homeownerRepository.getProjectWorkspace(projectId, ownerId);
  if (!workspace) {
    const error = new Error('Forbidden or Project Not Found. You do not own this project.');
    error.statusCode = 403;
    throw error;
  }
  return workspace;
};

export const getVerifiedContractors = async (search) => {
  return await homeownerRepository.getVerifiedContractors(search);
};

export const createBuilding = async (ownerId, buildingData) => {
  const buildingId = uuidv4();
  const projectCode = 'BLD-' + Math.floor(100000 + Math.random() * 900000);

  let initialStatus = 'Looking for Contractor';
  if (buildingData.hiringMethod === 'invite' && buildingData.selectedContractorId) {
    initialStatus = 'Waiting for Contractor Acceptance';
  }

  const newBuilding = await homeownerRepository.createBuilding(ownerId, {
    id: buildingId,
    project_code: projectCode,
    status: initialStatus,
    contractor_id: buildingData.hiringMethod === 'invite' ? buildingData.selectedContractorId : null,
    ...buildingData
  });

  // If Option 1: Direct Invitation
  if (buildingData.hiringMethod === 'invite' && buildingData.selectedContractorId) {
    await homeownerRepository.createInvitation({
      id: uuidv4(),
      project_id: buildingId,
      homeowner_id: ownerId,
      contractor_id: buildingData.selectedContractorId
    });
  }

  return newBuilding;
};

export const getProposalsForProject = async (projectId, ownerId) => {
  const proposals = await homeownerRepository.getProposalsForProject(projectId, ownerId);
  if (proposals === null) {
    const err = new Error('Forbidden or Project Not Found');
    err.statusCode = 403;
    throw err;
  }
  return proposals;
};

export const acceptProposal = async (proposalId, ownerId) => {
  const res = await homeownerRepository.acceptProposal(proposalId, ownerId);
  if (!res) {
    const err = new Error('Proposal not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }
  return res;
};

export const rejectProposal = async (proposalId, ownerId) => {
  const res = await homeownerRepository.rejectProposal(proposalId, ownerId);
  if (!res) {
    const err = new Error('Proposal not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }
  return res;
};

export const getProjectProgress = async (projectId, ownerId) => {
  return await homeownerRepository.getProjectProgress(projectId, ownerId);
};

export const getProjectExpenses = async (projectId, ownerId) => {
  return await homeownerRepository.getProjectExpenses(projectId, ownerId);
};

export const getProjectDocuments = async (projectId, ownerId) => {
  return await homeownerRepository.getProjectDocuments(projectId, ownerId);
};

export const getNotifications = async (ownerId) => {
  return await homeownerRepository.getNotifications(ownerId);
};

export const markNotificationRead = async (notificationId, ownerId) => {
  return await homeownerRepository.markNotificationRead(notificationId, ownerId);
};
