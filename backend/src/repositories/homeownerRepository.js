import db from '../config/db.js';

export const getDashboardStats = async (ownerId) => {
  const query = `
    SELECT 
      COUNT(*) as total_projects,
      COUNT(*) FILTER (WHERE status = 'In Progress') as active_projects,
      COUNT(*) FILTER (WHERE status = 'Completed') as completed_projects,
      COUNT(*) FILTER (WHERE status = 'Planning') as planning_projects,
      COALESCE(AVG(completion_percentage), 0) as avg_completion,
      COALESCE(SUM(budget), 0) as total_budget
    FROM projects
    WHERE owner_id = $1;
  `;
  
  const milestoneQuery = `
    SELECT COUNT(*) as upcoming_milestones
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE p.owner_id = $1 AND t.due_date > CURRENT_DATE AND t.status != 'Completed';
  `;

  const totalSpentQuery = `
    SELECT COALESCE(SUM(e.amount), 0) as total_spent
    FROM expenses e
    JOIN projects p ON e.project_id = p.id
    WHERE p.owner_id = $1;
  `;

  const [statsResult, milestoneResult, spentResult] = await Promise.all([
    db.query(query, [ownerId]),
    db.query(milestoneQuery, [ownerId]),
    db.query(totalSpentQuery, [ownerId])
  ]);

  return {
    ...statsResult.rows[0],
    avg_completion: parseFloat(parseFloat(statsResult.rows[0].avg_completion).toFixed(1)),
    total_budget: parseFloat(statsResult.rows[0].total_budget),
    total_spent: parseFloat(spentResult.rows[0].total_spent),
    upcoming_milestones: parseInt(milestoneResult.rows[0].upcoming_milestones, 10)
  };
};

export const getProjects = async (ownerId) => {
  const query = `
    SELECT 
      p.*, 
      c.name as contractor_name, 
      c.company_name as contractor_company,
      (
        SELECT created_at FROM progress_updates 
        WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1
      ) as last_update_at,
      (
        SELECT COUNT(*) FROM project_members WHERE project_id = p.id
      ) as total_workers
    FROM projects p
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE p.owner_id = $1
    ORDER BY p.created_at DESC;
  `;
  const result = await db.query(query, [ownerId]);
  return result.rows;
};

export const getProjectWorkspace = async (projectId, ownerId) => {
  const projectQuery = `
    SELECT 
      p.*,
      c.id as contractor_user_id,
      c.name as contractor_name,
      c.company_name as contractor_company,
      c.email as contractor_email,
      c.phone as contractor_phone,
      c.is_verified as contractor_is_verified,
      (SELECT COUNT(*) FROM projects WHERE contractor_id = p.contractor_id) as contractor_total_projects,
      (SELECT COUNT(*) FROM projects WHERE contractor_id = p.contractor_id AND status = 'Completed') as contractor_completed_projects,
      (SELECT COALESCE(AVG(completion_percentage), 0) FROM projects WHERE contractor_id = p.contractor_id) as contractor_avg_completion
    FROM projects p
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE p.id = $1 AND p.owner_id = $2;
  `;

  const projectRes = await db.query(projectQuery, [projectId, ownerId]);
  if (projectRes.rows.length === 0) return null;
  const project = projectRes.rows[0];

  const workersQuery = `
    SELECT 
      u.id as worker_id,
      u.name as worker_name,
      u.email as worker_email,
      u.phone as worker_phone,
      pm.joined_at as assigned_date,
      wp.skill as trade,
      wp.experience,
      wp.location,
      wp.availability,
      wp.avatar_url,
      wp.rating,
      wp.about_me,
      (
        SELECT title FROM tasks 
        WHERE project_id = $1 AND assigned_worker_id = u.id AND status != 'Completed'
        ORDER BY due_date ASC LIMIT 1
      ) as current_task,
      (
        SELECT COUNT(*) FROM tasks 
        WHERE project_id = $1 AND assigned_worker_id = u.id AND status = 'Completed'
      ) as completed_tasks_count,
      (
        SELECT description FROM progress_updates 
        WHERE project_id = $1 AND worker_id = u.id 
        ORDER BY created_at DESC LIMIT 1
      ) as latest_work_description,
      (
        SELECT clock_in FROM attendance 
        WHERE project_id = $1 AND worker_id = u.id AND DATE(clock_in) = CURRENT_DATE
        ORDER BY clock_in DESC LIMIT 1
      ) as clock_in_today
    FROM project_members pm
    JOIN users u ON pm.worker_id = u.id
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    WHERE pm.project_id = $1
    ORDER BY pm.joined_at ASC;
  `;

  const progressQuery = `
    SELECT 
      pu.*,
      w.name as uploader_name,
      wp.skill as uploader_trade,
      c.name as approver_name
    FROM progress_updates pu
    JOIN users w ON pu.worker_id = w.id
    LEFT JOIN worker_profiles wp ON w.id = wp.user_id
    LEFT JOIN users c ON pu.approved_by = c.id
    WHERE pu.project_id = $1
    ORDER BY pu.created_at DESC;
  `;

  const tasksQuery = `
    SELECT t.*, u.name as assigned_worker_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_worker_id = u.id
    WHERE t.project_id = $1
    ORDER BY t.due_date ASC, t.created_at ASC;
  `;

  const expensesQuery = `
    SELECT e.*, u.name as logged_by_name
    FROM expenses e
    LEFT JOIN users u ON e.logged_by = u.id
    WHERE e.project_id = $1
    ORDER BY e.date DESC;
  `;

  const docsQuery = `
    SELECT d.*, u.name as uploader_name
    FROM documents d
    LEFT JOIN users u ON d.uploaded_by = u.id
    WHERE d.project_id = $1
    ORDER BY d.created_at DESC;
  `;

  const [workersRes, progressRes, tasksRes, expensesRes, docsRes] = await Promise.all([
    db.query(workersQuery, [projectId]),
    db.query(progressQuery, [projectId]),
    db.query(tasksQuery, [projectId]),
    db.query(expensesQuery, [projectId]),
    db.query(docsQuery, [projectId])
  ]);

  const budget = parseFloat(project.budget || 0);
  const transactions = expensesRes.rows;
  const totalSpent = transactions.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  const categoryMap = {};
  transactions.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + parseFloat(t.amount || 0);
  });
  const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
    category: cat,
    amount: categoryMap[cat],
    percentage: totalSpent > 0 ? parseFloat(((categoryMap[cat] / totalSpent) * 100).toFixed(1)) : 0
  }));

  return {
    project,
    team: {
      contractor: {
        id: project.contractor_user_id,
        name: project.contractor_name,
        company_name: project.contractor_company,
        email: project.contractor_email,
        phone: project.contractor_phone,
        is_verified: project.contractor_is_verified,
        total_projects: parseInt(project.contractor_total_projects, 10),
        completed_projects: parseInt(project.contractor_completed_projects, 10),
        avg_completion: parseFloat(parseFloat(project.contractor_avg_completion).toFixed(1))
      },
      workers: workersRes.rows.map(w => ({
        ...w,
        attendance_today: w.clock_in_today ? 'Present' : 'Absent',
        completed_tasks_count: parseInt(w.completed_tasks_count, 10)
      }))
    },
    progress: progressRes.rows,
    tasks: tasksRes.rows,
    expenses: {
      budget,
      spent: totalSpent,
      remaining: budget - totalSpent,
      categoryBreakdown,
      transactions
    },
    documents: docsRes.rows
  };
};

export const getVerifiedContractors = async (search = '') => {
  let query = `
    SELECT 
      u.id, u.name, u.email, u.company_name, u.phone, u.is_verified, u.created_at,
      (SELECT COUNT(*) FROM projects WHERE contractor_id = u.id) as active_projects,
      (SELECT COUNT(*) FROM projects WHERE contractor_id = u.id AND status = 'Completed') as completed_projects
    FROM users u
    WHERE u.role = 'Contractor' AND u.is_verified = true
  `;
  const params = [];
  if (search) {
    query += ` AND (u.name ILIKE $1 OR u.company_name ILIKE $1 OR u.email ILIKE $1)`;
    params.push(`%${search}%`);
  }
  query += ` ORDER BY u.company_name ASC LIMIT 50;`;
  const res = await db.query(query, params);
  return res.rows.map(r => ({
    ...r,
    years_experience: 8,
    active_projects: parseInt(r.active_projects, 10),
    completed_projects: parseInt(r.completed_projects, 10)
  }));
};

export const createBuilding = async (ownerId, data) => {
  const {
    id, project_name, project_code, description, project_type, status,
    planned_start_date, planned_end_date, budget, priority,
    address, city, state, country, postal_code, contractor_id
  } = data;

  const query = `
    INSERT INTO projects (
      id, project_name, project_code, description, project_type, owner_id, contractor_id,
      status, planned_start_date, planned_end_date, budget, priority,
      address, city, state, country, postal_code
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    RETURNING *;
  `;

  const values = [
    id, project_name, project_code, description || '', project_type || 'House', ownerId, contractor_id || null,
    status || 'Looking for Contractor', planned_start_date || null, planned_end_date || null,
    budget || 0, priority || 'Medium', address || '', city || '', state || '', country || 'India', postal_code || ''
  ];

  const res = await db.query(query, values);
  return res.rows[0];
};

export const createInvitation = async (invitationData) => {
  const { id, project_id, homeowner_id, contractor_id } = invitationData;
  const query = `
    INSERT INTO contractor_invitations (id, project_id, homeowner_id, contractor_id, status)
    VALUES ($1, $2, $3, $4, 'pending')
    ON CONFLICT (project_id, contractor_id) DO UPDATE SET status = 'pending', sent_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const res = await db.query(query, [id, project_id, homeowner_id, contractor_id]);

  await db.query(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES ($1, 'New Project Invitation', 'You have received an invitation from a homeowner to build their project.', 'invitation')
  `, [contractor_id]);

  return res.rows[0];
};

export const getProposalsForProject = async (projectId, ownerId) => {
  const check = await db.query(`SELECT id FROM projects WHERE id = $1 AND owner_id = $2`, [projectId, ownerId]);
  if (check.rows.length === 0) return null;

  const query = `
    SELECT 
      cp.*,
      c.name as contractor_name,
      c.company_name as contractor_company,
      c.email as contractor_email,
      c.phone as contractor_phone,
      c.is_verified as contractor_is_verified,
      (SELECT COUNT(*) FROM projects WHERE contractor_id = c.id) as contractor_active_projects,
      (SELECT COUNT(*) FROM projects WHERE contractor_id = c.id AND status = 'Completed') as contractor_completed_projects
    FROM contractor_proposals cp
    JOIN users c ON cp.contractor_id = c.id
    WHERE cp.project_id = $1
    ORDER BY cp.submitted_at DESC;
  `;
  const res = await db.query(query, [projectId]);
  return res.rows;
};

export const acceptProposal = async (proposalId, ownerId) => {
  const propRes = await db.query(`
    SELECT cp.*, p.owner_id 
    FROM contractor_proposals cp
    JOIN projects p ON cp.project_id = p.id
    WHERE cp.id = $1 AND p.owner_id = $2
  `, [proposalId, ownerId]);

  if (propRes.rows.length === 0) return null;
  const proposal = propRes.rows[0];

  await db.query(`UPDATE contractor_proposals SET status = 'accepted' WHERE id = $1`, [proposalId]);
  await db.query(`UPDATE contractor_proposals SET status = 'rejected' WHERE project_id = $1 AND id != $2`, [proposal.project_id, proposalId]);

  await db.query(`
    UPDATE projects 
    SET status = 'Planning', contractor_id = $1 
    WHERE id = $2
  `, [proposal.contractor_id, proposal.project_id]);

  await db.query(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES ($1, 'Proposal Accepted!', 'Congratulations! Your proposal for the construction project has been accepted.', 'proposal_accepted')
  `, [proposal.contractor_id]);

  return proposal;
};

export const rejectProposal = async (proposalId, ownerId) => {
  const propRes = await db.query(`
    SELECT cp.*, p.owner_id 
    FROM contractor_proposals cp
    JOIN projects p ON cp.project_id = p.id
    WHERE cp.id = $1 AND p.owner_id = $2
  `, [proposalId, ownerId]);

  if (propRes.rows.length === 0) return null;
  const proposal = propRes.rows[0];

  await db.query(`UPDATE contractor_proposals SET status = 'rejected' WHERE id = $1`, [proposalId]);

  await db.query(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES ($1, 'Proposal Update', 'Your proposal for the project was not selected.', 'proposal_rejected')
  `, [proposal.contractor_id]);

  return proposal;
};

export const getProjectProgress = async (projectId, ownerId) => {
  const verifyQuery = `SELECT id FROM projects WHERE id = $1 AND owner_id = $2`;
  const verifyResult = await db.query(verifyQuery, [projectId, ownerId]);
  if (verifyResult.rows.length === 0) return null;

  const query = `
    SELECT 
      pu.*,
      u.name as uploader_name
    FROM progress_updates pu
    JOIN users u ON pu.worker_id = u.id
    WHERE pu.project_id = $1
    ORDER BY pu.created_at DESC;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
};

export const getProjectExpenses = async (projectId, ownerId) => {
  const verifyQuery = `SELECT budget FROM projects WHERE id = $1 AND owner_id = $2`;
  const verifyResult = await db.query(verifyQuery, [projectId, ownerId]);
  if (verifyResult.rows.length === 0) return null;

  const budget = parseFloat(verifyResult.rows[0].budget);

  const query = `
    SELECT 
      e.*,
      u.name as logged_by_name
    FROM expenses e
    JOIN users u ON e.logged_by = u.id
    WHERE e.project_id = $1
    ORDER BY e.date DESC;
  `;
  const result = await db.query(query, [projectId]);
  
  const spent = result.rows.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  
  return {
    budget,
    spent,
    remaining: budget - spent,
    transactions: result.rows
  };
};

export const getProjectDocuments = async (projectId, ownerId) => {
  const verifyQuery = `SELECT id FROM projects WHERE id = $1 AND owner_id = $2`;
  const verifyResult = await db.query(verifyQuery, [projectId, ownerId]);
  if (verifyResult.rows.length === 0) return null;

  const query = `
    SELECT 
      d.*,
      u.name as uploader_name
    FROM documents d
    JOIN users u ON d.uploaded_by = u.id
    WHERE d.project_id = $1
    ORDER BY d.created_at DESC;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
};

export const getNotifications = async (ownerId, limit = 50, offset = 0) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const countQuery = `SELECT COUNT(*) FROM notifications WHERE user_id = $1`;
  const unreadQuery = `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`;

  const [data, count, unreadCount] = await Promise.all([
    db.query(query, [ownerId, limit, offset]),
    db.query(countQuery, [ownerId]),
    db.query(unreadQuery, [ownerId])
  ]);

  return {
    data: data.rows,
    total: parseInt(count.rows[0].count, 10),
    unread: parseInt(unreadCount.rows[0].count, 10)
  };
};

export const markNotificationRead = async (notificationId, ownerId) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [notificationId, ownerId]);
  return result.rows[0];
};
