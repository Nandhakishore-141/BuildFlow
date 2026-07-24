import adminRepository from '../repositories/adminRepository.js';
import { generateAccessToken, generateImpersonationAccessToken } from '../utils/tokenHelper.js';

class AdminService {
  async getDashboard() {
    return await adminRepository.getDashboardStats();
  }

  async getUsers(filters) {
    return await adminRepository.getAllUsers(filters);
  }

  async getProjects(filters) {
    return await adminRepository.getAllProjects(filters);
  }

  async getAnalytics() {
    return await adminRepository.getAnalytics();
  }

  async getReports() {
    return await adminRepository.getReports();
  }

  async getAnnouncements() {
    return await adminRepository.getAllAnnouncements();
  }

  async createAnnouncement(data) {
    return await adminRepository.createAnnouncement(data);
  }

  async getAuditLogs(filters) {
    return await adminRepository.getAllAuditLogs(filters);
  }

  async getNotifications() {
    return await adminRepository.getNotifications();
  }

  async markNotificationRead(id) {
    return await adminRepository.markNotificationRead(id);
  }

  async impersonateUser(adminUser, targetUserId, ipAddress) {
    if (adminUser.isImpersonating) {
      const err = new Error('Forbidden. Cannot chain impersonation sessions.');
      err.statusCode = 400;
      throw err;
    }

    const targetUser = await adminRepository.findUserById(targetUserId);
    if (!targetUser) {
      const err = new Error('Target user for impersonation not found.');
      err.statusCode = 404;
      throw err;
    }

    if (targetUser.role === 'Admin') {
      const err = new Error('Forbidden. Admin cannot impersonate another Admin.');
      err.statusCode = 400;
      throw err;
    }

    const impersonationToken = generateImpersonationAccessToken(targetUser, adminUser);

    await adminRepository.logAuditAction(
      adminUser.id,
      'USER_IMPERSONATION_STARTED',
      `Admin "${adminUser.email}" (id: ${adminUser.id}) started impersonating user "${targetUser.name}" (id: ${targetUser.id}, role: ${targetUser.role})`,
      ipAddress
    );

    return {
      user: targetUser,
      tokens: {
        accessToken: impersonationToken
      },
      originalAdmin: {
        id: adminUser.id,
        email: adminUser.email,
        role: 'Admin'
      },
      isImpersonating: true
    };
  }

  async stopImpersonation(currentUser, ipAddress) {
    const originalAdminId = currentUser.originalAdminId || currentUser.id;
    const adminUser = await adminRepository.findUserById(originalAdminId);

    if (!adminUser) {
      const err = new Error('Original Admin user context not found.');
      err.statusCode = 404;
      throw err;
    }

    const adminToken = generateAccessToken(adminUser);

    await adminRepository.logAuditAction(
      adminUser.id,
      'USER_IMPERSONATION_STOPPED',
      `Admin "${adminUser.email}" (id: ${adminUser.id}) stopped impersonating user context (id: ${currentUser.id})`,
      ipAddress
    );

    return {
      user: adminUser,
      tokens: {
        accessToken: adminToken
      },
      isImpersonating: false
    };
  }

  async updateUserStatus(id, status) {
    const is_verified = status === 'Active' || status === true;
    return await adminRepository.updateUserStatus(id, is_verified);
  }

  async verifyContractor(id) {
    return await adminRepository.updateUserStatus(id, true);
  }
}

export default new AdminService();
