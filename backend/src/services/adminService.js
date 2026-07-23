import adminRepository from '../repositories/adminRepository.js';

class AdminService {
  async getDashboard() {
    return await adminRepository.getDashboardStats();
  }

  async getUsers() {
    return await adminRepository.getAllUsers();
  }

  async getProjects() {
    return await adminRepository.getAllProjects();
  }

  async getAnnouncements() {
    return await adminRepository.getAllAnnouncements();
  }

  async createAnnouncement(data) {
    return await adminRepository.createAnnouncement(data);
  }

  async getAuditLogs() {
    return await adminRepository.getAllAuditLogs();
  }

  async updateUserStatus(id, status) {
    // Assuming status mapping to is_verified for now for suspend/activate
    const is_verified = status === 'Active';
    return await adminRepository.updateUserStatus(id, is_verified);
  }

  async verifyContractor(id) {
    return await adminRepository.updateUserStatus(id, true);
  }
}

export default new AdminService();
