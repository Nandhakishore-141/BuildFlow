import pool from '../config/db.js';

class AdminRepository {
  async getDashboardStats() {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const projectsCount = await pool.query('SELECT COUNT(*) FROM projects WHERE status != $1', ['Completed']);
    const verifiedContractors = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'Contractor' AND is_verified = true");
    const workersAssigned = await pool.query('SELECT COUNT(DISTINCT worker_id) FROM project_members');

    return {
      totalUsers: parseInt(usersCount.rows[0].count),
      activeProjects: parseInt(projectsCount.rows[0].count),
      verifiedContractors: parseInt(verifiedContractors.rows[0].count),
      workersAssignedToday: parseInt(workersAssigned.rows[0].count),
      projectsCompleted: 0,
      revenuePlaceholder: "$45,200",
      pendingVerifications: 2,
      pendingReports: 4
    };
  }

  async getAllUsers() {
    const query = `
      SELECT id, name, email, role, phone, company_name, is_verified, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const res = await pool.query(query);
    return res.rows;
  }

  async getAllProjects() {
    const query = `
      SELECT p.id, p.project_name, p.project_code, p.status, p.budget, p.completion_percentage, p.created_at,
             c.name as contractor_name, o.name as owner_name
      FROM projects p
      LEFT JOIN users c ON p.contractor_id = c.id
      LEFT JOIN users o ON p.owner_id = o.id
      ORDER BY p.created_at DESC
    `;
    const res = await pool.query(query);
    return res.rows;
  }

  async getAllAnnouncements() {
    const res = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    return res.rows;
  }

  async createAnnouncement(data) {
    const { title, description, priority, target_role } = data;
    const query = `
      INSERT INTO announcements (title, description, priority, target_role)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const res = await pool.query(query, [title, description, priority || 'Normal', target_role || 'Everyone']);
    return res.rows[0];
  }

  async getAllAuditLogs() {
    const query = `
      SELECT a.*, u.name as user_name 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC LIMIT 100
    `;
    const res = await pool.query(query);
    return res.rows;
  }

  async updateUserStatus(id, is_verified) {
    const query = `UPDATE users SET is_verified = $1 WHERE id = $2 RETURNING id, is_verified`;
    const res = await pool.query(query, [is_verified, id]);
    return res.rows[0];
  }
}

export default new AdminRepository();
