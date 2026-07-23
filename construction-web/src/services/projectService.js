import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

// Fetch all projects (automatically scoped by the backend via JWT token)
export const getProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a single project's details
export const getProjectDetails = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a new project (Contractor only)
export const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
};

// Update a project (Contractor only)
export const updateProject = async (id, updateData) => {
  const response = await axios.put(`${API_URL}/${id}`, updateData);
  return response.data;
};

// Delete/Archive a project (Contractor only)
export const deleteProject = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Update project status (Contractor only)
export const updateProjectStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};

// Update project progress percentage (Contractor only)
export const updateProjectProgress = async (id, completion_percentage) => {
  const response = await axios.patch(`${API_URL}/${id}/progress`, { completion_percentage });
  return response.data;
};
