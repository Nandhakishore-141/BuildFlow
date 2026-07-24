import pool from '../config/db.js';

class AdminRepository {
  async getDashboardStats() {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const activeProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'In Progress'");
    const completedProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'Completed'");
    const verifiedContractors = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'Contractor' AND is_verified = true");
    const pendingContractors = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'Contractor' AND is_verified = false");
    const workersAssigned = await pool.query('SELECT COUNT(DISTINCT worker_id) FROM project_members');
    const totalBudgetRes = await pool.query('SELECT COALESCE(SUM(budget), 0) as total FROM projects');
    const totalExpensesRes = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM expenses');

    const recentRegistrations = await pool.query(`
      SELECT id, name, email, role, company_name, is_verified, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentProjects = await pool.query(`
      SELECT p.id, p.project_name, p.project_code, p.status, p.budget, p.completion_percentage, p.created_at,
             c.name as contractor_name, o.name as owner_name
      FROM projects p
      LEFT JOIN users c ON p.contractor_id = c.id
      LEFT JOIN users o ON p.owner_id = o.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    return {
      totalUsers: parseInt(usersCount.rows[0].count, 10),
      activeProjects: parseInt(activeProjects.rows[0].count, 10),
      completedProjects: parseInt(completedProjects.rows[0].count, 10),
      verifiedContractors: parseInt(verifiedContractors.rows[0].count, 10),
      pendingContractors: parseInt(pendingContractors.rows[0].count, 10),
      workersAssignedToday: parseInt(workersAssigned.rows[0].count, 10),
      totalBudget: parseFloat(totalBudgetRes.rows[0].total),
      totalExpenses: parseFloat(totalExpensesRes.rows[0].total),
      recentRegistrations: recentRegistrations.rows,
      recentProjects: recentProjects.rows
    };
  }

  async getAllUsers(filters = {}) {
    let query = `
      SELECT id, name, email, role, phone, company_name, is_verified, created_at 
      FROM users 
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.role) {
      query += ` AND role = $${paramIdx}`;
      params.push(filters.role);
      paramIdx++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramIdx} OR email ILIKE $${paramIdx} OR company_name ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    query += ` ORDER BY created_at DESC`;
    const res = await pool.query(query, params);
    return res.rows;
  }

  async getAllProjects(filters = {}) {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM projects p
      LEFT JOIN users c ON p.contractor_id = c.id
      LEFT JOIN users o ON p.owner_id = o.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.status && filters.status !== 'All') {
      baseQuery += ` AND p.status = $${paramIdx}`;
      params.push(filters.status);
      paramIdx++;
    }

    if (filters.search) {
      baseQuery += ` AND (p.project_name ILIKE $${paramIdx} OR p.project_code ILIKE $${paramIdx} OR p.city ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    const countRes = await pool.query(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countRes.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit) || 1;

    const selectQuery = `
      SELECT p.id, p.project_name, p.project_code, p.description, p.status, p.budget, 
             p.completion_percentage, p.city, p.state, p.created_at, p.planned_start_date, p.planned_end_date,
             c.name as contractor_name, c.company_name as contractor_company,
             o.name as owner_name, o.email as owner_email
      ${baseQuery}
      ORDER BY p.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;

    params.push(limit, offset);
    const res = await pool.query(selectQuery, params);

    return {
      projects: res.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  async getAnalytics() {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const contractors = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'Contractor'");
    const homeowners = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'Homeowner'");
    const workers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'Worker'");
    
    const activeProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'In Progress'");
    const completedProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'Completed'");
    const planningProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'Planning'");
    const suspendedProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'Suspended'");
    
    const totalBudget = await pool.query('SELECT COALESCE(SUM(budget), 0) as total FROM projects');
    const totalExpenses = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM expenses');
    const materialsLowStock = await pool.query("SELECT COUNT(*) FROM materials WHERE quantity < 50 OR status = 'Ordered'");
    const attendanceToday = await pool.query('SELECT COUNT(DISTINCT worker_id) FROM attendance WHERE DATE(clock_in) = CURRENT_DATE OR clock_in >= NOW() - INTERVAL \'24 hours\'');
    const pendingNotifications = await pool.query('SELECT COUNT(*) FROM notifications WHERE is_read = false');
    
    const recentRegistrations = await pool.query(`
      SELECT id, name, email, role, company_name, is_verified, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const expensesByCategory = await pool.query(`
      SELECT category, COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as count 
      FROM expenses 
      GROUP BY category
    `);

    const projectsByStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM projects 
      GROUP BY status
    `);

    return {
      totalUsers: parseInt(usersCount.rows[0].count, 10),
      contractorsCount: parseInt(contractors.rows[0].count, 10),
      homeownersCount: parseInt(homeowners.rows[0].count, 10),
      workersCount: parseInt(workers.rows[0].count, 10),
      activeProjects: parseInt(activeProjects.rows[0].count, 10),
      completedProjects: parseInt(completedProjects.rows[0].count, 10),
      planningProjects: parseInt(planningProjects.rows[0].count, 10),
      suspendedProjects: parseInt(suspendedProjects.rows[0].count, 10),
      totalBudget: parseFloat(totalBudget.rows[0].total),
      totalExpenses: parseFloat(totalExpenses.rows[0].total),
      materialsLowInStock: parseInt(materialsLowStock.rows[0].count, 10),
      attendanceToday: parseInt(attendanceToday.rows[0].count, 10),
      pendingNotifications: parseInt(pendingNotifications.rows[0].count, 10),
      recentRegistrations: recentRegistrations.rows,
      expensesByCategory: expensesByCategory.rows.map(r => ({ category: r.category, total_amount: parseFloat(r.total_amount), count: parseInt(r.count, 10) })),
      projectsByStatus: projectsByStatus.rows.map(r => ({ status: r.status, count: parseInt(r.count, 10) }))
    };
  }

  async getReports() {
    const projectsSummary = await pool.query(`
      SELECT COUNT(*) as total_projects, 
             COALESCE(SUM(budget), 0) as total_budget,
             COALESCE(AVG(completion_percentage), 0) as avg_completion
      FROM projects
    `);

    const financialSummary = await pool.query(`
      SELECT COALESCE(SUM(p.budget), 0) as total_budget,
             COALESCE(SUM(e.amount), 0) as total_expenses
      FROM projects p
      LEFT JOIN expenses e ON true
    `);

    const workforceSummary = await pool.query(`
      SELECT (SELECT COUNT(*) FROM users WHERE role = 'Worker') as total_workers,
             (SELECT COUNT(*) FROM project_members) as total_assignments,
             (SELECT COUNT(*) FROM attendance) as total_attendance_logs
    `);

    const materialsSummary = await pool.query(`
      SELECT COUNT(*) as total_materials,
             COALESCE(SUM(quantity * cost_per_unit), 0) as inventory_value,
             COUNT(CASE WHEN quantity < 50 THEN 1 END) as low_stock_count
      FROM materials
    `);

    return {
      projectsSummary: {
        totalProjects: parseInt(projectsSummary.rows[0].total_projects, 10),
        totalBudget: parseFloat(projectsSummary.rows[0].total_budget),
        avgCompletion: parseFloat(parseFloat(projectsSummary.rows[0].avg_completion).toFixed(1))
      },
      financialSummary: {
        totalBudget: parseFloat(financialSummary.rows[0].total_budget),
        totalExpenses: parseFloat(financialSummary.rows[0].total_expenses),
        netRemaining: parseFloat(financialSummary.rows[0].total_budget) - parseFloat(financialSummary.rows[0].total_expenses)
      },
      workforceSummary: {
        totalWorkers: parseInt(workforceSummary.rows[0].total_workers, 10),
        totalAssignments: parseInt(workforceSummary.rows[0].total_assignments, 10),
        totalAttendanceLogs: parseInt(workforceSummary.rows[0].total_attendance_logs, 10)
      },
      materialsSummary: {
        totalMaterials: parseInt(materialsSummary.rows[0].total_materials, 10),
        inventoryValue: parseFloat(materialsSummary.rows[0].inventory_value),
        lowStockCount: parseInt(materialsSummary.rows[0].low_stock_count, 10)
      }
    };
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

  async getAllAuditLogs(filters = {}) {
    let query = `
      SELECT a.*, u.name as user_name, u.email as user_email, u.role as user_role 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.search) {
      query += ` AND (a.action ILIKE $${paramIdx} OR a.details ILIKE $${paramIdx} OR u.name ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT 100`;
    const res = await pool.query(query, params);
    return res.rows;
  }

  async getNotifications() {
    const query = `
      SELECT n.*, u.name as user_name, u.email as user_email, u.role as user_role
      FROM notifications n
      LEFT JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
      LIMIT 100
    `;
    const res = await pool.query(query);
    return res.rows;
  }

  async markNotificationRead(id) {
    const query = `UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *`;
    const res = await pool.query(query, [id]);
    return res.rows[0];
  }

  async findUserById(id) {
    const res = await pool.query(`SELECT id, name, email, role, phone, company_name, is_verified, created_at FROM users WHERE id = $1`, [id]);
    return res.rows[0];
  }

  async logAuditAction(userId, action, details, ipAddress) {
    const query = `
      INSERT INTO audit_logs (user_id, action, details, ip_address)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const res = await pool.query(query, [userId, action, details, ipAddress || '127.0.0.1']);
    return res.rows[0];
  }

  async updateUserStatus(id, is_verified) {
    const query = `UPDATE users SET is_verified = $1 WHERE id = $2 RETURNING id, is_verified`;
    const res = await pool.query(query, [is_verified, id]);
    return res.rows[0];
  }
}

export default new AdminRepository();
