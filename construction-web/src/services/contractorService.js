import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contractor';

export const getOpportunities = async (params = {}) => {
  const response = await axios.get(`${API_URL}/opportunities`, { params });
  return response.data;
};

export const submitProposal = async (data) => {
  const response = await axios.post(`${API_URL}/proposals`, data);
  return response.data;
};

export const getInvitations = async () => {
  const response = await axios.get(`${API_URL}/invitations`);
  return response.data;
};

export const respondToInvitation = async (invitationId, status) => {
  const response = await axios.post(`${API_URL}/invitations/${invitationId}/respond`, { status });
  return response.data;
};
