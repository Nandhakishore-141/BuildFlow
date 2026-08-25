import db from '../config/db.js';

export const getDashboardStats = async (contractorId) => {
  const projectsQuery = `
    SELECT 
      COUNT(*) as total_projects,
      COUNT(CASE WHEN status IN ('Active', 'In Progress') THEN 1 END) as active_projects,
      COUNT(CASE WHEN status = 'Planning' THEN 1 END) as planning_projects,
      COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_projects,
      COUNT(CASE WHEN status = 'On Hold' THEN 1 END) as on_hold_projects,
      COUNT(CASE WHEN status = 'Delayed' THEN 1 END) as delayed_projects,
      COALESCE(SUM(budget), 0) as total_budget,
      COALESCE(AVG(completion_percentage), 0) as avg_completion
    FROM projects
    WHERE contractor_id = $1;
  `;

  const workersQuery = `
    SELECT COUNT(DISTINCT pm.worker_id) as total_workers
    FROM project_members pm
    JOIN projects p ON pm.project_id = p.id
    WHERE p.contractor_id = $1;
  `;

  const pendingInvsQuery = `
    SELECT COUNT(*) as pending_invitations
    FROM worker_invitations wi
    JOIN projects p ON wi.project_id = p.id
    WHERE p.contractor_id = $1 AND wi.status = 'Pending';
  `;

  const tasksStatsQuery = `
    SELECT 
      COUNT(*) as total_tasks,
      COUNT(CASE WHEN t.status IN ('Todo', 'Not Started') THEN 1 END) as open_tasks,
      COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END) as in_progress_tasks,
      COUNT(CASE WHEN t.status IN ('Under Review', 'Waiting for Review') THEN 1 END) as under_review_tasks,
      COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) as completed_tasks,
      COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'Completed' THEN 1 END) as delayed_tasks
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE p.contractor_id = $1;
  `;

  const presentTodayQuery = `
    SELECT COUNT(DISTINCT a.worker_id) as workers_present
    FROM attendance a
    JOIN projects p ON a.project_id = p.id
    WHERE p.contractor_id = $1 AND DATE(a.clock_in) = CURRENT_DATE;
  `;

  const expensesQuery = `
    SELECT COALESCE(SUM(e.amount), 0) as total_expenses
    FROM expenses e
    JOIN projects p ON e.project_id = p.id
    WHERE p.contractor_id = $1;
  `;

  const pendingMaterialsQuery = `
    SELECT COUNT(*) as pending_materials
    FROM materials m
    JOIN projects p ON m.project_id = p.id
    WHERE p.contractor_id = $1 AND m.status IN ('Ordered', 'Pending', 'Requested');
  `;

  const pendingApprovalsQuery = `
    SELECT COUNT(*) as pending_approvals
    FROM progress_updates pu
    JOIN projects p ON pu.project_id = p.id
    WHERE p.contractor_id = $1 AND pu.approval_status = 'Pending';
  `;

  const upcomingMilestonesQuery = `
    SELECT COUNT(*) as upcoming_milestones
    FROM milestones m
    JOIN projects p ON m.project_id = p.id
    WHERE p.contractor_id = $1 AND m.status != 'Completed';
  `;

  const recentProjectsQuery = `
    SELECT p.*, o.name as owner_name,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE project_id = p.id) as spent
    FROM projects p
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE p.contractor_id = $1
    ORDER BY p.created_at DESC LIMIT 5;
  `;

  const recentProgressQuery = `
    SELECT pu.*, w.name as uploader_name, p.project_name
    FROM progress_updates pu
    JOIN projects p ON pu.project_id = p.id
    JOIN users w ON pu.worker_id = w.id
    WHERE p.contractor_id = $1
    ORDER BY pu.created_at DESC LIMIT 5;
  `;

  const [
    projectsRes, workersRes, pendingInvsRes, tasksStatsRes, presentRes, expensesRes,
    materialsRes, approvalsRes, milestonesRes, recentProjectsRes, recentProgressRes
  ] = await Promise.all([
    db.query(projectsQuery, [contractorId]),
    db.query(workersQuery, [contractorId]),
    db.query(pendingInvsQuery, [contractorId]),
    db.query(tasksStatsQuery, [contractorId]),
    db.query(presentTodayQuery, [contractorId]),
    db.query(expensesQuery, [contractorId]),
    db.query(pendingMaterialsQuery, [contractorId]),
    db.query(pendingApprovalsQuery, [contractorId]),
    db.query(upcomingMilestonesQuery, [contractorId]),
    db.query(recentProjectsQuery, [contractorId]),
    db.query(recentProgressQuery, [contractorId])
  ]);

  const totalBudget = parseFloat(projectsRes.rows[0].total_budget);
  const totalExpenses = parseFloat(expensesRes.rows[0].total_expenses);
  const totalWorkers = parseInt(workersRes.rows[0].total_workers, 10);
  const presentToday = parseInt(presentRes.rows[0].workers_present, 10);

  return {
    total_projects: parseInt(projectsRes.rows[0].total_projects, 10),
    active_projects: parseInt(projectsRes.rows[0].active_projects, 10),
    planning_projects: parseInt(projectsRes.rows[0].planning_projects, 10),
    completed_projects: parseInt(projectsRes.rows[0].completed_projects, 10),
    on_hold_projects: parseInt(projectsRes.rows[0].on_hold_projects, 10),
    delayed_projects: parseInt(projectsRes.rows[0].delayed_projects, 10),
    avg_completion: Math.round(parseFloat(projectsRes.rows[0].avg_completion || 0)),

    total_workers: totalWorkers,
    workers_present_today: presentToday,
    workers_absent_today: Math.max(0, totalWorkers - presentToday),
    pending_invitations: parseInt(pendingInvsRes.rows[0].pending_invitations, 10),

    open_tasks: parseInt(tasksStatsRes.rows[0].open_tasks, 10),
    in_progress_tasks: parseInt(tasksStatsRes.rows[0].in_progress_tasks, 10),
    under_review_tasks: parseInt(tasksStatsRes.rows[0].under_review_tasks, 10),
    completed_tasks: parseInt(tasksStatsRes.rows[0].completed_tasks, 10),
    delayed_tasks: parseInt(tasksStatsRes.rows[0].delayed_tasks, 10),

    total_budget: totalBudget,
    total_expenses: totalExpenses,
    remaining_budget: totalBudget - totalExpenses,
    pending_materials: parseInt(materialsRes.rows[0].pending_materials, 10),
    pending_approvals: parseInt(approvalsRes.rows[0].pending_approvals, 10),
    upcoming_milestones: parseInt(milestonesRes.rows[0].upcoming_milestones, 10),
    recent_projects: recentProjectsRes.rows,
    recent_progress: recentProgressRes.rows
  };
};

export const getContractorProjects = async (contractorId, filters = {}) => {
  const query = `
    SELECT 
      p.*, 
      o.name as owner_name,
      o.email as owner_email,
      COALESCE((SELECT SUM(amount) FROM expenses WHERE project_id = p.id), 0) as spent,
      (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as total_workers,
      (SELECT created_at FROM progress_updates WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1) as last_update_at
    FROM projects p
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE p.contractor_id = $1
    ORDER BY p.created_at DESC;
  `;
  const res = await db.query(query, [contractorId]);
  return res.rows.map(p => ({
    ...p,
    budget: parseFloat(p.budget || 0),
    spent: parseFloat(p.spent || 0),
    remaining: parseFloat(p.budget || 0) - parseFloat(p.spent || 0),
    total_workers: parseInt(p.total_workers, 10)
  }));
};

export const getContractorProjectWorkspace = async (contractorId, projectId) => {
  const projectQuery = `
    SELECT p.*, o.name as owner_name, o.email as owner_email, o.phone as owner_phone
    FROM projects p
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE p.id = $1 AND p.contractor_id = $2;
  `;

  const projectRes = await db.query(projectQuery, [projectId, contractorId]);
  if (projectRes.rows.length === 0) return null;
  const project = projectRes.rows[0];

  const workersQuery = `
    SELECT 
      u.id as worker_id, u.name as worker_name, u.email as worker_email, u.phone as worker_phone,
      pm.joined_at as assigned_date, wp.skill as trade, wp.experience, wp.avatar_url,
      (SELECT title FROM tasks WHERE project_id = $1 AND assigned_worker_id = u.id AND status != 'Completed' ORDER BY due_date ASC LIMIT 1) as current_task,
      (SELECT clock_in FROM attendance WHERE project_id = $1 AND worker_id = u.id AND DATE(clock_in) = CURRENT_DATE ORDER BY clock_in DESC LIMIT 1) as clock_in_today
    FROM project_members pm
    JOIN users u ON pm.worker_id = u.id
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    WHERE pm.project_id = $1
    ORDER BY pm.joined_at ASC;
  `;

  const pendingInvitationsQuery = `
    SELECT 
      wi.id as invitation_id, wi.project_id, wi.worker_id, wi.status, wi.message, wi.created_at as sent_at,
      u.name as worker_name, u.email as worker_email, u.phone as worker_phone,
      wp.skill as trade, wp.avatar_url
    FROM worker_invitations wi
    JOIN users u ON wi.worker_id = u.id
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    WHERE wi.project_id = $1 AND wi.status = 'Pending'
    ORDER BY wi.created_at DESC;
  `;

  const rejectedInvitationsQuery = `
    SELECT 
      wi.id as invitation_id, wi.project_id, wi.worker_id, wi.status, wi.message, wi.updated_at as rejected_at,
      u.name as worker_name, u.email as worker_email, u.phone as worker_phone,
      wp.skill as trade, wp.avatar_url
    FROM worker_invitations wi
    JOIN users u ON wi.worker_id = u.id
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    WHERE wi.project_id = $1 AND wi.status = 'Rejected'
    ORDER BY wi.updated_at DESC;
  `;

  const progressQuery = `
    SELECT pu.*, w.name as uploader_name, wp.skill as uploader_trade
    FROM progress_updates pu
    JOIN users w ON pu.worker_id = w.id
    LEFT JOIN worker_profiles wp ON w.id = wp.user_id
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

  const materialsQuery = `
    SELECT m.id, m.project_id, m.name as item_name, m.quantity, m.unit, m.cost_per_unit as estimated_cost, m.supplier, m.status, m.created_at
    FROM materials m
    WHERE m.project_id = $1
    ORDER BY m.created_at DESC;
  `;

  const docsQuery = `
    SELECT d.*, u.name as uploader_name
    FROM documents d
    LEFT JOIN users u ON d.uploaded_by = u.id
    WHERE d.project_id = $1
    ORDER BY d.created_at DESC;
  `;

  const [workersRes, pendingInvRes, rejectedInvRes, progressRes, tasksRes, expensesRes, materialsRes, docsRes] = await Promise.all([
    db.query(workersQuery, [projectId]),
    db.query(pendingInvitationsQuery, [projectId]),
    db.query(rejectedInvitationsQuery, [projectId]),
    db.query(progressQuery, [projectId]),
    db.query(tasksQuery, [projectId]),
    db.query(expensesQuery, [projectId]),
    db.query(materialsQuery, [projectId]),
    db.query(docsQuery, [projectId])
  ]);

  const budget = parseFloat(project.budget || 0);
  const totalSpent = expensesRes.rows.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return {
    project,
    team: {
      owner: { name: project.owner_name, email: project.owner_email, phone: project.owner_phone },
      workers: workersRes.rows.map(w => ({
        ...w,
        attendance_today: w.clock_in_today ? 'Present' : 'Absent'
      })),
      pending_invitations: pendingInvRes.rows,
      rejected_invitations: rejectedInvRes.rows
    },
    progress: progressRes.rows,
    tasks: tasksRes.rows,
    expenses: { budget, spent: totalSpent, remaining: budget - totalSpent, transactions: expensesRes.rows },
    materials: materialsRes.rows,
    documents: docsRes.rows
  };
};

export const getContractorWorkers = async (contractorId, search = '') => {
  let query = `
    SELECT 
      u.id, u.name, u.email, u.phone, u.created_at,
      wp.skill as trade, wp.experience, wp.location, wp.avatar_url, wp.availability,
      (
        SELECT p.project_name 
        FROM project_members pm 
        JOIN projects p ON pm.project_id = p.id 
        WHERE pm.worker_id = u.id AND p.contractor_id = $1 AND p.status IN ('In Progress', 'Planning')
        LIMIT 1
      ) as current_project_name,
      (
        SELECT p.id 
        FROM project_members pm 
        JOIN projects p ON pm.project_id = p.id 
        WHERE pm.worker_id = u.id AND p.contractor_id = $1 AND p.status IN ('In Progress', 'Planning')
        LIMIT 1
      ) as current_project_id,
      (
        SELECT JSON_ARRAYAGG(pm.project_id)
        FROM project_members pm
        WHERE pm.worker_id = u.id
      ) as assigned_project_ids,
      (
        SELECT clock_in FROM attendance 
        WHERE worker_id = u.id AND DATE(clock_in) = CURRENT_DATE 
        ORDER BY clock_in DESC LIMIT 1
      ) as clock_in_today
    FROM users u
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    WHERE u.role = 'Worker'
  `;
  const params = [contractorId];
  if (search) {
    query += ` AND (u.name LIKE $2 OR wp.skill LIKE $2 OR u.email LIKE $2)`;
    params.push(`%${search}%`);
  }
  query += ` ORDER BY u.name ASC;`;

  const res = await db.query(query, params);
  return res.rows.map(w => {
    let projectIds = [];
    if (Array.isArray(w.assigned_project_ids)) {
      projectIds = w.assigned_project_ids;
    } else if (typeof w.assigned_project_ids === 'string') {
      try { projectIds = JSON.parse(w.assigned_project_ids); } catch (e) { projectIds = []; }
    }
    return {
      ...w,
      assigned_project_ids: projectIds || [],
      attendance_today: w.clock_in_today ? 'Present' : 'Absent',
      status: w.clock_in_today ? 'On Site Today' : 'Active'
    };
  });
};

export const getAvailableWorkersForProject = async (contractorId, projectId, search = '') => {
  let query = `
    SELECT 
      u.id, u.name, u.email, u.phone,
      wp.skill as trade, wp.experience, wp.avatar_url, wp.location
    FROM users u
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    WHERE u.role = 'Worker'
      AND u.id NOT IN (
        SELECT worker_id FROM project_members WHERE project_id = $1
      )
      AND u.id NOT IN (
        SELECT worker_id FROM worker_invitations WHERE project_id = $1 AND status = 'Pending'
      )
  `;
  const params = [projectId];
  if (search) {
    query += ` AND (u.name LIKE $2 OR wp.skill LIKE $2 OR u.email LIKE $2)`;
    params.push(`%${search}%`);
  }
  query += ` ORDER BY u.name ASC;`;

  const res = await db.query(query, params);
  return res.rows;
};

export const inviteWorkerToProject = async (contractorId, projectId, workerId, message = null) => {
  const projRes = await db.query(
    `SELECT p.id, p.project_name, c.name as contractor_name, c.company_name as contractor_company 
     FROM projects p 
     JOIN users c ON p.contractor_id = c.id 
     WHERE p.id = $1 AND p.contractor_id = $2`, 
    [projectId, contractorId]
  );
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found or you do not have permission.');
    err.statusCode = 403;
    throw err;
  }
  const project = projRes.rows[0];

  const workerRes = await db.query(`SELECT id, name, role FROM users WHERE id = $1 AND role = 'Worker'`, [workerId]);
  if (workerRes.rows.length === 0) {
    const err = new Error('Worker not found.');
    err.statusCode = 404;
    throw err;
  }

  const memberCheck = await db.query(`SELECT id FROM project_members WHERE project_id = $1 AND worker_id = $2`, [projectId, workerId]);
  if (memberCheck.rows.length > 0) {
    const err = new Error('Worker is already an assigned member of this project.');
    err.statusCode = 400;
    throw err;
  }

  const invCheck = await db.query(`SELECT id, status FROM worker_invitations WHERE project_id = $1 AND worker_id = $2`, [projectId, workerId]);
  if (invCheck.rows.length > 0) {
    const existingStatus = invCheck.rows[0].status;
    if (existingStatus === 'Pending') {
      const err = new Error('Invitation is already pending for this worker.');
      err.statusCode = 400;
      throw err;
    }
    if (existingStatus === 'Accepted') {
      const err = new Error('Worker is already an assigned member of this project.');
      err.statusCode = 400;
      throw err;
    }

    const invId = invCheck.rows[0].id;
    const updateRes = await db.query(
      `UPDATE worker_invitations 
       SET status = 'Pending', message = COALESCE($1, message), created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *;`,
      [message, invId]
    );

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'New Project Invitation', CONCAT('You have been invited by ', $2, ' (', $3, ') to join building project "', $4, '".'), 'worker_invitation')`,
      [workerId, project.contractor_name, project.contractor_company || 'Contractor', project.project_name]
    );

    return updateRes.rows[0];
  }

  const { v4: uuidv4 } = await import('uuid');
  const invId = uuidv4();
  const insertRes = await db.query(
    `INSERT INTO worker_invitations (id, project_id, contractor_id, worker_id, status, message)
     VALUES ($1, $2, $3, $4, 'Pending', $5)`,
    [invId, projectId, contractorId, workerId, message || 'Invitation to join building project team.']
  );

  await db.query(
    `INSERT INTO notifications (user_id, title, message, type)
     VALUES ($1, 'New Project Invitation', CONCAT('You have been invited by ', $2, ' (', $3, ') to join building project "', $4, '".'), 'worker_invitation')`,
    [workerId, project.contractor_name, project.contractor_company || 'Contractor', project.project_name]
  );

  return insertRes.rows[0];
};

export const cancelWorkerInvitation = async (contractorId, invitationId) => {
  const invCheck = await db.query(
    `SELECT wi.* 
     FROM worker_invitations wi
     JOIN projects p ON wi.project_id = p.id
     WHERE wi.id = $1 AND p.contractor_id = $2 AND wi.status = 'Pending'`,
    [invitationId, contractorId]
  );
  if (invCheck.rows.length === 0) {
    const err = new Error('Pending invitation not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const res = await db.query(`DELETE FROM worker_invitations WHERE id = $1 RETURNING *;`, [invitationId]);
  return res.rows[0];
};

export const removeWorkerFromProject = async (contractorId, projectId, workerId) => {
  const check = await db.query(`SELECT id FROM projects WHERE id = $1 AND contractor_id = $2`, [projectId, contractorId]);
  if (check.rows.length === 0) return null;

  const query = `DELETE FROM project_members WHERE project_id = $1 AND worker_id = $2 RETURNING *;`;
  const res = await db.query(query, [projectId, workerId]);
  return res.rows[0];
};

export const getAttendance = async (contractorId, date = null, projectId = null) => {
  let query = `
    SELECT 
      a.*,
      w.name as worker_name,
      w.email as worker_email,
      wp.skill as trade,
      p.project_name
    FROM attendance a
    JOIN users w ON a.worker_id = w.id
    LEFT JOIN worker_profiles wp ON w.id = wp.user_id
    JOIN projects p ON a.project_id = p.id
    WHERE p.contractor_id = $1
  `;
  const params = [contractorId];
  let idx = 2;

  if (date) {
    query += ` AND DATE(a.clock_in) = $${idx}`;
    params.push(date);
    idx++;
  }
  if (projectId) {
    query += ` AND a.project_id = $${idx}`;
    params.push(projectId);
    idx++;
  }

  query += ` ORDER BY a.clock_in DESC;`;
  const res = await db.query(query, params);
  return res.rows;
};

export const markAttendance = async (contractorId, data) => {
  const { project_id, worker_id, status = 'Present', clock_in, clock_out } = data;
  const { v4: uuidv4 } = await import('uuid');

  // If contractor logs hours (Present / Half Day), status is set to 'Awaiting' until the worker accepts
  const isAbsent = status === 'Absent';
  const initialStatus = isAbsent ? 'Absent' : (status === 'Half Day' ? 'Half Day' : 'Awaiting');
  const initialAcceptance = isAbsent ? 'Reason Required' : 'Pending';

  // Check if an attendance record already exists for this worker on the given date and project
  const checkQuery = `
    SELECT id FROM attendance 
    WHERE worker_id = $1 AND project_id = $2 AND DATE(clock_in) = DATE(COALESCE($3, CURRENT_TIMESTAMP))
    LIMIT 1;
  `;
  const existing = await db.query(checkQuery, [worker_id, project_id, clock_in || null]);

  let targetId;
  if (existing.rows.length > 0) {
    targetId = existing.rows[0].id;
    const updateQuery = `
      UPDATE attendance
      SET status = $1, clock_in = COALESCE($2, clock_in), clock_out = $3, worker_acceptance = $4
      WHERE id = $5;
    `;
    await db.query(updateQuery, [initialStatus, clock_in || null, clock_out || null, initialAcceptance, targetId]);
  } else {
    targetId = uuidv4();
    const insertQuery = `
      INSERT INTO attendance (id, project_id, worker_id, status, clock_in, clock_out, worker_acceptance)
      VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP), $6, $7);
    `;
    await db.query(insertQuery, [targetId, project_id, worker_id, initialStatus, clock_in || null, clock_out || null, initialAcceptance]);
  }

  try {
    const proj = await db.query('SELECT project_name FROM projects WHERE id = $1', [project_id]);
    const pName = proj.rows[0]?.project_name || 'Project';
    const notifMsg = isAbsent
      ? `You were marked absent today for project "${pName}". Please submit a valid reason.`
      : `Shift timings logged for project "${pName}". Please review and accept timing to mark attendance Present.`;

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'attendance')`,
      [worker_id, isAbsent ? 'Marked Absent - Reason Required' : 'Shift Timings Logged', notifMsg]
    );
  } catch (e) {
    // Non-fatal notification logging
  }

  const result = await db.query('SELECT * FROM attendance WHERE id = $1', [targetId]);
  return result.rows[0];
};

export const markBatchAttendance = async (contractorId, records) => {
  if (!Array.isArray(records)) return [];
  const results = [];
  for (const rec of records) {
    const res = await markAttendance(contractorId, rec);
    results.push(res);
  }
  return results;
};

export const getMaterials = async (contractorId, projectId = null) => {
  let query = `
    SELECT 
      m.id, 
      m.project_id, 
      m.name,
      m.name as item_name, 
      m.category,
      m.specifications,
      m.quantity, 
      m.unit, 
      m.cost_per_unit,
      m.cost_per_unit as estimated_cost, 
      m.supplier, 
      m.status, 
      m.notes,
      m.created_at, 
      m.updated_at,
      p.project_name,
      p.project_code
    FROM materials m
    JOIN projects p ON m.project_id = p.id
    WHERE p.contractor_id = $1
  `;
  const params = [contractorId];
  if (projectId) {
    query += ` AND m.project_id = $2`;
    params.push(projectId);
  }
  query += ` ORDER BY m.created_at DESC;`;

  const res = await db.query(query, params);
  return res.rows;
};

export const createMaterial = async (contractorId, data) => {
  const { 
    project_id, 
    name, 
    item_name, 
    category = 'Structural', 
    specifications = '', 
    quantity = 0, 
    unit = 'Units', 
    cost_per_unit = 0, 
    estimated_cost, 
    supplier = 'Vendor', 
    status = 'Available', 
    notes = '' 
  } = data;
  
  const { v4: uuidv4 } = await import('uuid');
  const matId = uuidv4();
  const itemName = name || item_name || 'Material Item';
  const unitCost = cost_per_unit || estimated_cost || 0;

  // Verify project belongs to contractor
  const projCheck = await db.query('SELECT id FROM projects WHERE id = $1 AND contractor_id = $2', [project_id, contractorId]);
  if (projCheck.rows.length === 0) {
    const err = new Error('Project not found or unauthorized.');
    err.statusCode = 403;
    throw err;
  }

  const query = `
    INSERT INTO materials (id, project_id, name, category, specifications, quantity, unit, cost_per_unit, supplier, status, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
  `;
  await db.query(query, [
    matId,
    project_id,
    itemName,
    category || 'General',
    specifications || '',
    parseFloat(quantity) || 0,
    unit || 'Units',
    parseFloat(unitCost) || 0,
    supplier || 'Site Vendor',
    status || 'Available',
    notes || ''
  ]);

  const res = await db.query('SELECT * FROM materials WHERE id = $1', [matId]);
  return res.rows[0];
};

export const updateMaterial = async (contractorId, materialId, data) => {
  const { 
    name, 
    item_name, 
    category, 
    specifications, 
    quantity, 
    unit, 
    cost_per_unit, 
    estimated_cost, 
    supplier, 
    status, 
    notes 
  } = data;

  const matCheck = await db.query(
    `SELECT m.* 
     FROM materials m 
     JOIN projects p ON m.project_id = p.id 
     WHERE m.id = $1 AND p.contractor_id = $2`,
    [materialId, contractorId]
  );
  if (matCheck.rows.length === 0) {
    const err = new Error('Material not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const query = `
    UPDATE materials
    SET 
      name = COALESCE($1, name),
      category = COALESCE($2, category),
      specifications = COALESCE($3, specifications),
      quantity = COALESCE($4, quantity),
      unit = COALESCE($5, unit),
      cost_per_unit = COALESCE($6, cost_per_unit),
      supplier = COALESCE($7, supplier),
      status = COALESCE($8, status),
      notes = COALESCE($9, notes),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $10;
  `;

  await db.query(query, [
    name || item_name || null,
    category || null,
    specifications !== undefined ? specifications : null,
    quantity !== undefined ? parseFloat(quantity) : null,
    unit || null,
    (cost_per_unit !== undefined ? parseFloat(cost_per_unit) : (estimated_cost !== undefined ? parseFloat(estimated_cost) : null)),
    supplier || null,
    status || null,
    notes !== undefined ? notes : null,
    materialId
  ]);

  const res = await db.query('SELECT * FROM materials WHERE id = $1', [materialId]);
  return res.rows[0];
};

export const deleteMaterial = async (contractorId, materialId) => {
  const matCheck = await db.query(
    `SELECT m.* 
     FROM materials m 
     JOIN projects p ON m.project_id = p.id 
     WHERE m.id = $1 AND p.contractor_id = $2`,
    [materialId, contractorId]
  );
  if (matCheck.rows.length === 0) {
    const err = new Error('Material not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  await db.query('DELETE FROM materials WHERE id = $1', [materialId]);
  return { id: materialId, deleted: true };
};

export const getExpenses = async (contractorId, projectId = null) => {
  let query = `
    SELECT e.*, p.project_name, p.project_code, u.name as logged_by_name
    FROM expenses e
    JOIN projects p ON e.project_id = p.id
    LEFT JOIN users u ON e.logged_by = u.id
    WHERE p.contractor_id = $1
  `;
  const params = [contractorId];
  if (projectId) {
    query += ` AND e.project_id = $2`;
    params.push(projectId);
  }
  query += ` ORDER BY e.date DESC, e.created_at DESC;`;

  const res = await db.query(query, params);
  return res.rows;
};

export const createExpense = async (contractorId, data) => {
  const { project_id, title, category, amount, description, date, vendor, payment_method, receipt_url, notes } = data;

  if (!project_id) {
    const err = new Error('Building project selection is required.');
    err.statusCode = 400;
    throw err;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    const err = new Error('Expense amount must be a positive number greater than zero.');
    err.statusCode = 400;
    throw err;
  }

  // Verify project belongs to logged-in contractor
  const projRes = await db.query(`SELECT id, project_name, budget FROM projects WHERE id = $1 AND contractor_id = $2`, [project_id, contractorId]);
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found or you are not authorized to log expenses for this project.');
    err.statusCode = 403;
    throw err;
  }

  const { v4: uuidv4 } = await import('uuid');
  const expId = uuidv4();
  const project = projRes.rows[0];
  const validCategory = ['Labor', 'Materials', 'Equipment', 'Permits', 'Site Utilities', 'Transport', 'Other'].includes(category) ? category : (category || 'Other');
  const expenseTitle = title ? title.trim() : `${validCategory} Expense`;

  const query = `
    INSERT INTO expenses (id, project_id, logged_by, title, category, amount, description, date, vendor, payment_method, receipt_url, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, CURRENT_DATE), $9, $10, $11, $12);
  `;
  
  await db.query(query, [
    expId,
    project_id, 
    contractorId, 
    expenseTitle, 
    validCategory, 
    parsedAmount, 
    description || '', 
    date || null, 
    vendor || null, 
    payment_method || 'Bank Transfer',
    receipt_url || null,
    notes || null
  ]);

  const fetchRes = await db.query('SELECT * FROM expenses WHERE id = $1', [expId]);
  const createdExpense = fetchRes.rows[0];

  // Calculate updated financial summary for the project
  const spentRes = await db.query(`SELECT COALESCE(SUM(amount), 0) as total_spent FROM expenses WHERE project_id = $1`, [project_id]);
  const totalSpent = parseFloat(spentRes.rows[0].total_spent || 0);
  const totalBudget = parseFloat(project.budget || 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? parseFloat(((totalSpent / totalBudget) * 100).toFixed(1)) : 0;

  return {
    ...createdExpense,
    project_name: project.project_name,
    projectFinancials: {
      project_id,
      project_name: project.project_name,
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining_budget: remainingBudget,
      budget_utilization_percentage: budgetUtilization
    }
  };
};

export const updateExpense = async (contractorId, expenseId, data) => {
  const { title, category, amount, description, date, vendor, payment_method, receipt_url, notes } = data;

  const checkQuery = `
    SELECT e.id, e.project_id, p.budget, p.project_name
    FROM expenses e 
    JOIN projects p ON e.project_id = p.id 
    WHERE e.id = $1 AND p.contractor_id = $2;
  `;
  const checkRes = await db.query(checkQuery, [expenseId, contractorId]);
  if (checkRes.rows.length === 0) {
    const err = new Error('Expense record not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const current = checkRes.rows[0];
  const parsedAmount = amount !== undefined ? parseFloat(amount) : undefined;

  const updateQuery = `
    UPDATE expenses
    SET 
      title = COALESCE($1, title),
      category = COALESCE($2, category),
      amount = COALESCE($3, amount),
      description = COALESCE($4, description),
      date = COALESCE($5, date),
      vendor = COALESCE($6, vendor),
      payment_method = COALESCE($7, payment_method),
      receipt_url = COALESCE($8, receipt_url),
      notes = COALESCE($9, notes)
    WHERE id = $10;
  `;

  await db.query(updateQuery, [
    title || null,
    category || null,
    parsedAmount !== undefined ? parsedAmount : null,
    description !== undefined ? description : null,
    date || null,
    vendor !== undefined ? vendor : null,
    payment_method || null,
    receipt_url !== undefined ? receipt_url : null,
    notes !== undefined ? notes : null,
    expenseId
  ]);

  const res = await db.query('SELECT e.*, p.project_name, p.project_code FROM expenses e JOIN projects p ON e.project_id = p.id WHERE e.id = $1', [expenseId]);
  const updatedExpense = res.rows[0];

  const spentRes = await db.query(`SELECT COALESCE(SUM(amount), 0) as total_spent FROM expenses WHERE project_id = $1`, [current.project_id]);
  const totalSpent = parseFloat(spentRes.rows[0].total_spent || 0);
  const totalBudget = parseFloat(current.budget || 0);

  return {
    ...updatedExpense,
    projectFinancials: {
      project_id: current.project_id,
      project_name: current.project_name,
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining_budget: totalBudget - totalSpent,
      budget_utilization_percentage: totalBudget > 0 ? parseFloat(((totalSpent / totalBudget) * 100).toFixed(1)) : 0
    }
  };
};

export const deleteExpense = async (contractorId, expenseId) => {
  const checkQuery = `
    SELECT e.id, e.project_id 
    FROM expenses e 
    JOIN projects p ON e.project_id = p.id 
    WHERE e.id = $1 AND p.contractor_id = $2;
  `;
  const checkRes = await db.query(checkQuery, [expenseId, contractorId]);
  if (checkRes.rows.length === 0) {
    const err = new Error('Expense record not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const { project_id } = checkRes.rows[0];
  await db.query(`DELETE FROM expenses WHERE id = $1;`, [expenseId]);

  const spentRes = await db.query(`SELECT COALESCE(SUM(amount), 0) as total_spent FROM expenses WHERE project_id = $1`, [project_id]);
  const totalSpent = parseFloat(spentRes.rows[0]?.total_spent || 0);

  return {
    id: expenseId,
    deleted: true,
    project_id,
    new_total_spent: totalSpent
  };
};

export const getProgressUpdates = async (contractorId, projectId = null) => {
  let query = `
    SELECT pu.*, p.project_name, w.name as uploader_name, wp.skill as uploader_trade
    FROM progress_updates pu
    JOIN projects p ON pu.project_id = p.id
    JOIN users w ON pu.worker_id = w.id
    LEFT JOIN worker_profiles wp ON w.id = wp.user_id
    WHERE p.contractor_id = $1
  `;
  const params = [contractorId];
  if (projectId) {
    query += ` AND pu.project_id = $2`;
    params.push(projectId);
  }
  query += ` ORDER BY pu.created_at DESC;`;

  const res = await db.query(query, params);
  return res.rows;
};

export const approveProgressUpdate = async (contractorId, updateId, completionPercentage = null) => {
  const puRes = await db.query(`
    SELECT pu.*, p.contractor_id 
    FROM progress_updates pu
    JOIN projects p ON pu.project_id = p.id
    WHERE pu.id = $1 AND p.contractor_id = $2;
  `, [updateId, contractorId]);

  if (puRes.rows.length === 0) return null;
  const update = puRes.rows[0];

  const query = `
    UPDATE progress_updates 
    SET approval_status = 'Approved', approved_by = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2;
  `;
  await db.query(query, [contractorId, updateId]);

  if (completionPercentage !== null && !isNaN(parseFloat(completionPercentage))) {
    await db.query(`UPDATE projects SET completion_percentage = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [parseFloat(completionPercentage), update.project_id]);
  }

  const result = await db.query(`
    SELECT pu.*, p.project_name, w.name as uploader_name
    FROM progress_updates pu
    JOIN projects p ON pu.project_id = p.id
    JOIN users w ON pu.worker_id = w.id
    WHERE pu.id = $1;
  `, [updateId]);

  return result.rows[0] || { id: updateId, approval_status: 'Approved' };
};

export const getDocuments = async (contractorId, projectId = null) => {
  let query = `
    SELECT d.*, p.project_name, u.name as uploader_name
    FROM documents d
    JOIN projects p ON d.project_id = p.id
    LEFT JOIN users u ON d.uploaded_by = u.id
    WHERE p.contractor_id = $1
  `;
  const params = [contractorId];
  if (projectId) {
    query += ` AND d.project_id = $2`;
    params.push(projectId);
  }
  query += ` ORDER BY d.created_at DESC;`;

  const res = await db.query(query, params);
  return res.rows;
};

export const getNotifications = async (contractorId) => {
  const query = `
    SELECT * FROM notifications 
    WHERE user_id = $1 
    ORDER BY created_at DESC LIMIT 50;
  `;
  const res = await db.query(query, [contractorId]);
  return res.rows;
};

export const markNotificationRead = async (contractorId, notificationId) => {
  const query = `
    UPDATE notifications 
    SET is_read = true 
    WHERE id = $1 AND user_id = $2 
    RETURNING *;
  `;
  const res = await db.query(query, [notificationId, contractorId]);
  return res.rows[0];
};

// ==========================================
// TASK MANAGEMENT
// ==========================================
export const getProjectTasks = async (contractorId, projectId, filters = {}) => {
  const projCheck = await db.query(`SELECT id FROM projects WHERE id = $1 AND contractor_id = $2`, [projectId, contractorId]);
  if (projCheck.rows.length === 0) {
    const err = new Error('Project not found or unauthorized.');
    err.statusCode = 403;
    throw err;
  }

  let query = `
    SELECT 
      t.*,
      p.project_name,
      m.name as milestone_name,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'trade', wp.skill,
          'avatar_url', wp.avatar_url
        ))
        FROM task_assignees ta
        JOIN users u ON ta.worker_id = u.id
        LEFT JOIN worker_profiles wp ON u.id = wp.user_id
        WHERE ta.task_id = t.id
      ) as assigned_workers
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN milestones m ON t.milestone_id = m.id
    WHERE t.project_id = $1
  `;
  const params = [projectId];
  let pIdx = 2;

  if (filters.status) {
    query += ` AND t.status = $${pIdx++}`;
    params.push(filters.status);
  }
  if (filters.priority) {
    query += ` AND t.priority = $${pIdx++}`;
    params.push(filters.priority);
  }
  if (filters.search) {
    query += ` AND (t.title LIKE $${pIdx} OR t.description LIKE $${pIdx})`;
    params.push(`%${filters.search}%`);
    pIdx++;
  }

  query += ` ORDER BY t.due_date ASC, t.created_at DESC;`;

  const res = await db.query(query, params);
  return res.rows.map(t => ({
    ...t,
    assigned_workers: typeof t.assigned_workers === 'string' ? JSON.parse(t.assigned_workers) : (t.assigned_workers || [])
  }));
};

export const createTask = async (contractorId, taskData) => {
  const { v4: uuidv4 } = await import('uuid');
  const { project_id, title, description, priority = 'Medium', due_date, estimated_duration, attachments, milestone_id, assigned_worker_ids = [] } = taskData;

  // 1. Verify project ownership
  const projRes = await db.query(`SELECT id, project_name FROM projects WHERE id = $1 AND contractor_id = $2`, [project_id, contractorId]);
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found or unauthorized.');
    err.statusCode = 403;
    throw err;
  }
  const project = projRes.rows[0];

  // 2. Validate worker assignment (workers MUST be accepted members of project_members)
  let workerList = Array.isArray(assigned_worker_ids) ? assigned_worker_ids.filter(Boolean) : (assigned_worker_ids ? [assigned_worker_ids] : []);
  if (workerList.length > 0) {
    const placeholders = workerList.map((_, i) => `$${i + 2}`).join(', ');
    const memberCheck = await db.query(
      `SELECT worker_id FROM project_members WHERE project_id = $1 AND worker_id IN (${placeholders})`,
      [project_id, ...workerList]
    );
    if (memberCheck.rows.length < workerList.length) {
      const err = new Error('Tasks can only be assigned to workers who have accepted the project invitation.');
      err.statusCode = 400;
      throw err;
    }
  }

  const taskId = uuidv4();
  const primaryWorkerId = workerList.length > 0 ? workerList[0] : null;

  const query = `
    INSERT INTO tasks (id, project_id, assigned_worker_id, title, description, status, priority, due_date, estimated_duration, attachments, milestone_id)
    VALUES ($1, $2, $3, $4, $5, 'Todo', $6, $7, $8, $9, $10)
  `;
  await db.query(query, [taskId, project_id, primaryWorkerId, title, description || '', priority, due_date || null, estimated_duration || null, attachments || null, milestone_id || null]);

  // Insert into task_assignees
  for (const wId of workerList) {
    await db.query(`INSERT INTO task_assignees (task_id, worker_id) VALUES ($1, $2) ON DUPLICATE KEY UPDATE id=id`, [taskId, wId]);
    
    // Notify worker
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'New Task Assigned', CONCAT('You have been assigned task "', $2, '" for project "', $3, '".'), 'task_assigned')`,
      [wId, title, project.project_name]
    );
  }

  return await getTaskById(contractorId, taskId);
};

export const getTaskById = async (contractorId, taskId) => {
  const query = `
    SELECT 
      t.*,
      p.project_name, p.contractor_id,
      m.name as milestone_name,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'trade', wp.skill,
          'avatar_url', wp.avatar_url
        ))
        FROM task_assignees ta
        JOIN users u ON ta.worker_id = u.id
        LEFT JOIN worker_profiles wp ON u.id = wp.user_id
        WHERE ta.task_id = t.id
      ) as assigned_workers
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN milestones m ON t.milestone_id = m.id
    WHERE t.id = $1 AND p.contractor_id = $2;
  `;
  const res = await db.query(query, [taskId, contractorId]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    ...row,
    assigned_workers: typeof row.assigned_workers === 'string' ? JSON.parse(row.assigned_workers) : (row.assigned_workers || [])
  };
};

export const updateTask = async (contractorId, taskId, taskData) => {
  const existing = await getTaskById(contractorId, taskId);
  if (!existing) {
    const err = new Error('Task not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const { title, description, status, priority, due_date, estimated_duration, attachments, milestone_id, assigned_worker_ids } = taskData;

  // Validate workers if passed
  if (assigned_worker_ids !== undefined) {
    let workerList = Array.isArray(assigned_worker_ids) ? assigned_worker_ids.filter(Boolean) : (assigned_worker_ids ? [assigned_worker_ids] : []);
    if (workerList.length > 0) {
      const placeholders = workerList.map((_, i) => `$${i + 2}`).join(', ');
      const memberCheck = await db.query(
        `SELECT worker_id FROM project_members WHERE project_id = $1 AND worker_id IN (${placeholders})`,
        [existing.project_id, ...workerList]
      );
      if (memberCheck.rows.length < workerList.length) {
        const err = new Error('Tasks can only be assigned to workers who have accepted the project invitation.');
        err.statusCode = 400;
        throw err;
      }
    }

    // Replace assignees
    await db.query(`DELETE FROM task_assignees WHERE task_id = $1`, [taskId]);
    for (const wId of workerList) {
      await db.query(`INSERT INTO task_assignees (task_id, worker_id) VALUES ($1, $2) ON DUPLICATE KEY UPDATE id=id`, [taskId, wId]);
    }
  }

  const query = `
    UPDATE tasks 
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        due_date = COALESCE($5, due_date),
        estimated_duration = COALESCE($6, estimated_duration),
        attachments = COALESCE($7, attachments),
        milestone_id = COALESCE($8, milestone_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
  `;
  await db.query(query, [title, description, status, priority, due_date, estimated_duration, attachments, milestone_id, taskId]);

  return await getTaskById(contractorId, taskId);
};

export const deleteTask = async (contractorId, taskId) => {
  const existing = await getTaskById(contractorId, taskId);
  if (!existing) {
    const err = new Error('Task not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const res = await db.query(`DELETE FROM tasks WHERE id = $1 RETURNING *;`, [taskId]);
  return res.rows[0];
};

export const reviewTask = async (contractorId, taskId, { action, contractor_comments = '' }) => {
  const existing = await getTaskById(contractorId, taskId);
  if (!existing) {
    const err = new Error('Task not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  if (action === 'approve') {
    await db.query(
      `UPDATE tasks 
       SET status = 'Completed', review_status = 'Approved', contractor_comments = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [contractor_comments, taskId]
    );

    // Auto-calculate project completion
    await updateProjectProgress(contractorId, existing.project_id, { auto_calculate: true });

    // Check linked milestone
    if (existing.milestone_id) {
      const remainingTasks = await db.query(
        `SELECT COUNT(*) FROM tasks WHERE milestone_id = $1 AND status != 'Completed'`,
        [existing.milestone_id]
      );
      if (parseInt(remainingTasks.rows[0].count, 10) === 0) {
        await db.query(`UPDATE milestones SET status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [existing.milestone_id]);
      }
    }

    // Notify assigned workers
    for (const w of existing.assigned_workers) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, 'Task Approved!', 'Your task "' || $2 || '" has been approved by the contractor.', 'task_approved')`,
        [w.id, existing.title]
      );
    }
  } else {
    // Rejected / Changes Requested -> Return to In Progress
    await db.query(
      `UPDATE tasks 
       SET status = 'In Progress', review_status = 'Rejected', contractor_comments = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [contractor_comments, taskId]
    );

    for (const w of existing.assigned_workers) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, 'Task Revisions Requested', CONCAT('Task "', $2, '" requires revisions: ', $3), 'task_rejected')`,
        [w.id, existing.title, contractor_comments || 'Please revise work according to instructions.']
      );
    }
  }

  return await getTaskById(contractorId, taskId);
};

// ==========================================
// PROJECT STATUS & PROGRESS MANAGEMENT
// ==========================================
export const updateProjectStatus = async (contractorId, projectId, status) => {
  const projRes = await db.query(`SELECT * FROM projects WHERE id = $1 AND contractor_id = $2`, [projectId, contractorId]);
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found or unauthorized.');
    err.statusCode = 403;
    throw err;
  }
  const project = projRes.rows[0];

  await db.query(
    `UPDATE projects SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [status, projectId]
  );

  // Notify assigned workers
  const members = await db.query(`SELECT worker_id FROM project_members WHERE project_id = $1`, [projectId]);
  for (const m of members.rows) {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Project Status Changed', CONCAT('Building project "', $2, '" status is now "', $3, '".'), 'project_status')`,
      [m.worker_id, project.project_name, status]
    );
  }

  // Notify Homeowner
  if (project.owner_id) {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Project Status Changed', CONCAT('Your building project "', $2, '" status has been updated to "', $3, '".'), 'project_status')`,
      [project.owner_id, project.project_name, status]
    );
  }

  return updateRes.rows[0];
};

export const updateProjectProgress = async (contractorId, projectId, { completion_percentage, auto_calculate = false }) => {
  const projRes = await db.query(`SELECT * FROM projects WHERE id = $1 AND contractor_id = $2`, [projectId, contractorId]);
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found or unauthorized.');
    err.statusCode = 403;
    throw err;
  }

  let finalPct = parseFloat(completion_percentage || 0);

  if (auto_calculate) {
    const taskStats = await db.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed
       FROM tasks WHERE project_id = $1`,
      [projectId]
    );
    const total = parseInt(taskStats.rows[0].total, 10);
    const completed = parseInt(taskStats.rows[0].completed, 10);
    finalPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  const res = await db.query(
    `UPDATE projects SET completion_percentage = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;`,
    [finalPct, projectId]
  );
  return res.rows[0];
};

// ==========================================
// MILESTONES MANAGEMENT
// ==========================================
export const getProjectMilestones = async (projectId) => {
  const query = `
    SELECT 
      m.*,
      (SELECT COUNT(*) FROM tasks WHERE milestone_id = m.id) as total_tasks,
      (SELECT COUNT(*) FROM tasks WHERE milestone_id = m.id AND status = 'Completed') as completed_tasks
    FROM milestones m
    WHERE m.project_id = $1
    ORDER BY (m.due_date IS NULL), m.due_date ASC, m.created_at DESC;
  `;
  const res = await db.query(query, [projectId]);
  return res.rows;
};

export const createMilestone = async (contractorId, milestoneData) => {
  const { v4: uuidv4 } = await import('uuid');
  const { project_id, name, description, due_date } = milestoneData;

  const projRes = await db.query(`SELECT id FROM projects WHERE id = $1 AND contractor_id = $2`, [project_id, contractorId]);
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found or unauthorized.');
    err.statusCode = 403;
    throw err;
  }

  const milestoneId = uuidv4();
  const res = await db.query(
    `INSERT INTO milestones (id, project_id, name, description, due_date, status)
     VALUES ($1, $2, $3, $4, $5, 'Pending')
     RETURNING *;`,
    [milestoneId, project_id, name, description || '', due_date || null]
  );
  return res.rows[0];
};

export const updateMilestone = async (contractorId, milestoneId, data) => {
  const mRes = await db.query(
    `SELECT m.* FROM milestones m JOIN projects p ON m.project_id = p.id WHERE m.id = $1 AND p.contractor_id = $2`,
    [milestoneId, contractorId]
  );
  if (mRes.rows.length === 0) {
    const err = new Error('Milestone not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const { name, description, due_date, status } = data;
  const res = await db.query(
    `UPDATE milestones 
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         due_date = COALESCE($3, due_date),
         status = COALESCE($4, status),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *;`,
    [name, description, due_date, status, milestoneId]
  );
  return res.rows[0];
};

export const deleteMilestone = async (contractorId, milestoneId) => {
  const mRes = await db.query(
    `SELECT m.* FROM milestones m JOIN projects p ON m.project_id = p.id WHERE m.id = $1 AND p.contractor_id = $2`,
    [milestoneId, contractorId]
  );
  if (mRes.rows.length === 0) {
    const err = new Error('Milestone not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }

  const res = await db.query(`DELETE FROM milestones WHERE id = $1 RETURNING *;`, [milestoneId]);
  return res.rows[0];
};

// ==========================================
// DAILY WORK UPDATES MANAGEMENT
// ==========================================
export const getDailyWorkUpdates = async (projectId) => {
  const query = `
    SELECT 
      dwu.*,
      u.name as author_name, u.role as author_role
    FROM daily_work_updates dwu
    JOIN users u ON dwu.author_id = u.id
    WHERE dwu.project_id = $1
    ORDER BY dwu.created_at DESC;
  `;
  const res = await db.query(query, [projectId]);
  return res.rows;
};

export const createDailyWorkUpdate = async (contractorId, updateData) => {
  const { v4: uuidv4 } = await import('uuid');
  const { project_id, title, content, file_url, file_type } = updateData;

  const projRes = await db.query(`SELECT id, project_name, owner_id FROM projects WHERE id = $1 AND contractor_id = $2`, [project_id, contractorId]);
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found or unauthorized.');
    err.statusCode = 403;
    throw err;
  }
  const project = projRes.rows[0];

  const updateId = uuidv4();
  const res = await db.query(
    `INSERT INTO daily_work_updates (id, project_id, author_id, title, content, file_url, file_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *;`,
    [updateId, project_id, contractorId, title || 'Daily Site Progress', content, file_url || null, file_type || 'Photo']
  );

  // Notify Homeowner
  if (project.owner_id) {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Daily Work Update Posted', CONCAT('New site update posted for building "', $2, '".'), 'work_update')`,
      [project.owner_id, project.project_name]
    );
  }

  return res.rows[0];
};

// ==========================================
// CALENDAR & TIMELINE EVENTS
// ==========================================
export const getCalendarEvents = async (contractorId, startDate = null, endDate = null) => {
  const tasksQuery = `
    SELECT 
      t.id, t.title, t.due_date as date, 'task' as event_type, t.status, t.priority,
      p.project_name, p.id as project_id
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE p.contractor_id = $1 AND t.due_date IS NOT NULL
  `;
  const milestonesQuery = `
    SELECT 
      m.id, m.name as title, m.due_date as date, 'milestone' as event_type, m.status, 'Critical' as priority,
      p.project_name, p.id as project_id
    FROM milestones m
    JOIN projects p ON m.project_id = p.id
    WHERE p.contractor_id = $1 AND m.due_date IS NOT NULL
  `;

  const [tRes, mRes] = await Promise.all([
    db.query(tasksQuery, [contractorId]),
    db.query(milestonesQuery, [contractorId])
  ]);

  const events = [...tRes.rows, ...mRes.rows].sort((a, b) => new Date(a.date) - new Date(b.date));
  return events;
};

// ==========================================
// CONTRACTOR SETTINGS
// ==========================================
export const getSettings = async (contractorId) => {
  const res = await db.query(
    `SELECT id, name, email, phone, company_name, is_verified, profile_photo FROM users WHERE id = $1`,
    [contractorId]
  );
  return res.rows[0] || null;
};

export const updateSettings = async (contractorId, data) => {
  const { name, phone, company_name, profile_photo } = data;
  await db.query(
    `UPDATE users 
     SET name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         company_name = COALESCE($3, company_name),
         profile_photo = COALESCE($4, profile_photo),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5`,
    [name, phone, company_name, profile_photo, contractorId]
  );
  return await getSettings(contractorId);
};

// ==========================================
// OPPORTUNITIES & PROPOSALS
// ==========================================
export const getOpportunities = async (contractorId, filters = {}) => {
  let query = `
    SELECT p.*, o.name as owner_name, o.email as owner_email,
      (SELECT COUNT(*) FROM contractor_proposals WHERE project_id = p.id) as total_proposals,
      (SELECT id FROM contractor_proposals WHERE project_id = p.id AND contractor_id = $1 ORDER BY created_at DESC LIMIT 1) as my_proposal_id,
      (SELECT status FROM contractor_proposals WHERE project_id = p.id AND contractor_id = $1 ORDER BY created_at DESC LIMIT 1) as my_proposal_status,
      (SELECT estimated_budget FROM contractor_proposals WHERE project_id = p.id AND contractor_id = $1 ORDER BY created_at DESC LIMIT 1) as my_proposed_budget,
      (SELECT estimated_duration FROM contractor_proposals WHERE project_id = p.id AND contractor_id = $1 ORDER BY created_at DESC LIMIT 1) as my_proposed_duration,
      (SELECT cover_message FROM contractor_proposals WHERE project_id = p.id AND contractor_id = $1 ORDER BY created_at DESC LIMIT 1) as my_cover_message
    FROM projects p
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE (p.contractor_id IS NULL OR p.status = 'Planning' OR p.status = 'Looking for Contractor')
  `;
  const params = [contractorId];
  if (filters.search) {
    query += ` AND (p.project_name LIKE $2 OR p.city LIKE $2)`;
    params.push(`%${filters.search}%`);
  }
  query += ` ORDER BY p.created_at DESC;`;
  const res = await db.query(query, params);
  return res.rows;
};

export const submitProposal = async (proposalData) => {
  const { v4: uuidv4 } = await import('uuid');
  const { project_id, contractor_id, estimated_budget, estimated_duration, cover_message } = proposalData;
  const proposalId = proposalData.id || uuidv4();

  // Check if this contractor already has a proposal for this project
  const existing = await db.query(
    `SELECT id FROM contractor_proposals WHERE project_id = $1 AND contractor_id = $2`,
    [project_id, contractor_id]
  );

  if (existing.rows.length > 0) {
    await db.query(
      `UPDATE contractor_proposals 
       SET estimated_budget = $1, estimated_duration = $2, cover_message = $3, status = 'pending', updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [estimated_budget || 0, estimated_duration || '', cover_message || '', existing.rows[0].id]
    );
    return { ...proposalData, id: existing.rows[0].id, status: 'pending' };
  }

  await db.query(
    `INSERT INTO contractor_proposals (id, project_id, contractor_id, estimated_budget, estimated_duration, cover_message, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
    [proposalId, project_id, contractor_id, estimated_budget || 0, estimated_duration || '', cover_message || '']
  );

  // Notify homeowner
  const proj = await db.query(`SELECT project_name, owner_id FROM projects WHERE id = $1`, [project_id]);
  if (proj.rows.length > 0 && proj.rows[0].owner_id) {
    const contractor = await db.query(`SELECT name, company_name FROM users WHERE id = $1`, [contractor_id]);
    const contractorName = contractor.rows[0]?.company_name || contractor.rows[0]?.name || 'A Contractor';
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'New Proposal Received', CONCAT($2, ' submitted a proposal for "', $3, '".'), 'proposal_received')`,
      [proj.rows[0].owner_id, contractorName, proj.rows[0].project_name]
    );
  }

  return { ...proposalData, id: proposalId, status: 'pending' };
};

// ==========================================
// INVITATIONS MANAGEMENT
// ==========================================
export const getInvitations = async (contractorId) => {
  const query = `
    SELECT ci.*, p.project_name, p.project_code, p.budget, p.city, p.state, p.planned_start_date, p.planned_end_date,
           u.name as homeowner_name, u.email as homeowner_email, u.phone as homeowner_phone
    FROM contractor_invitations ci
    JOIN projects p ON ci.project_id = p.id
    JOIN users u ON ci.homeowner_id = u.id
    WHERE ci.contractor_id = $1
    ORDER BY ci.created_at DESC;
  `;
  const res = await db.query(query, [contractorId]);
  return res.rows;
};

export const respondToInvitation = async (invitationId, contractorId, status) => {
  const invRes = await db.query(
    `SELECT * FROM contractor_invitations WHERE id = $1 AND contractor_id = $2`,
    [invitationId, contractorId]
  );
  if (invRes.rows.length === 0) return null;
  const invitation = invRes.rows[0];

  await db.query(
    `UPDATE contractor_invitations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [status, invitationId]
  );

  if (status === 'accepted') {
    await db.query(
      `UPDATE projects SET contractor_id = $1, status = 'Planning', updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [contractorId, invitation.project_id]
    );
  }

  return { ...invitation, status };
};
