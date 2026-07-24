import * as contractorService from '../services/contractorService.js';

export const getOpportunities = async (req, res, next) => {
  try {
    const data = await contractorService.getOpportunities(req.user.id, req.query);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const submitProposal = async (req, res, next) => {
  try {
    const data = await contractorService.submitProposal(req.user.id, req.body);
    res.status(201).json({ status: 'success', message: 'Proposal submitted successfully', data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getInvitations = async (req, res, next) => {
  try {
    const data = await contractorService.getInvitations(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const respondToInvitation = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const data = await contractorService.respondToInvitation(req.params.id, req.user.id, status);
    res.status(200).json({ status: 'success', message: `Invitation ${status}`, data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};
