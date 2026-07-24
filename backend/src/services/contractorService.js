import { v4 as uuidv4 } from 'uuid';
import * as contractorRepository from '../repositories/contractorRepository.js';

export const getOpportunities = async (contractorId, filters) => {
  return await contractorRepository.getOpportunities(contractorId, filters);
};

export const submitProposal = async (contractorId, proposalData) => {
  const proposalId = uuidv4();
  return await contractorRepository.submitProposal({
    id: proposalId,
    contractor_id: contractorId,
    ...proposalData
  });
};

export const getInvitations = async (contractorId) => {
  return await contractorRepository.getInvitations(contractorId);
};

export const respondToInvitation = async (invitationId, contractorId, status) => {
  const res = await contractorRepository.respondToInvitation(invitationId, contractorId, status);
  if (!res) {
    const err = new Error('Invitation not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }
  return res;
};
