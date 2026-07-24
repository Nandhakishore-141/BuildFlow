import db from '../config/db.js';

export const createProject = async (projectData) => {
  const {
    id, project_name, project_code, description, owner_id, contractor_id, 
    status, planned_start_date, planned_end_date, budget, address, city, 
    state, country, latitude, longitude
  } = projectData;

  const query = `
    INSERT INTO projects (
      id, project_name, project_code, description, owner_id, contractor_id, 
      status, planned_start_date, planned_end_date, budget, address, city, 
      state, country, latitude, longitude
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *;
  `;

  const values = [
    id, project_name, project_code, description, owner_id, contractor_id,
    status, planned_start_date, planned_end_date, budget, address, city,
    state, country, latitude, longitude
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

export const findProjectById = async (id) => {
  const query = `
    SELECT p.*, 
      c.name as contractor_name, c.company_name as contractor_company,
      o.name as owner_name, o.email as owner_email
    FROM projects p
    LEFT JOIN users c ON p.contractor_id = c.id
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE p.id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const findProjectByCode = async (projectCode) => {
  const query = `SELECT * FROM projects WHERE project_code = $1;`;
  const result = await db.query(query, [projectCode]);
  return result.rows[0];
};

export const updateProject = async (id, updateData) => {
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      setClauses.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) return await findProjectById(id);

  values.push(id);
  const query = `
    UPDATE projects
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

export const deleteProject = async (id) => {
  const query = `DELETE FROM projects WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const updateProjectStatus = async (id, status) => {
  const query = `
    UPDATE projects
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [status, id]);
  return result.rows[0];
};

export const updateProjectProgress = async (id, completionPercentage) => {
  const query = `
    UPDATE projects
    SET completion_percentage = $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [completionPercentage, id]);
  return result.rows[0];
};

// --- Paginated & Filtered Queries ---

const buildListQuery = (baseQuery, baseParams, filters) => {
  let conditions = '';
  let params = [...baseParams];
  let paramIndex = params.length + 1;

  if (filters.status) {
    conditions += ` AND p.status = $${paramIndex}`;
    params.push(filters.status);
    paramIndex++;
  }

  if (filters.search) {
    conditions += ` AND (p.project_name ILIKE $${paramIndex} OR p.project_code ILIKE $${paramIndex})`;
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  const queryWithFilters = baseQuery + conditions;
  const countQuery = `SELECT COUNT(*) FROM (${queryWithFilters}) AS count_query;`;
  
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const paginatedQuery = `
    ${queryWithFilters}
    ORDER BY p.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
  `;
  
  params.push(limit, offset);

  return { paginatedQuery, countQuery, params, countParams: params.slice(0, paramIndex - 1), page, limit };
};

export const findProjectsByContractor = async (contractorId, filters = {}) => {
  const baseQuery = `
    SELECT p.*, o.name as owner_name 
    FROM projects p
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE p.contractor_id = $1
  `;
  const { paginatedQuery, countQuery, params, countParams, page, limit } = buildListQuery(baseQuery, [contractorId], filters);
  const [data, count] = await Promise.all([db.query(paginatedQuery, params), db.query(countQuery, countParams)]);
  return { data: data.rows, total: parseInt(count.rows[0].count, 10), page, limit };
};

export const findProjectsByOwner = async (ownerId, filters = {}) => {
  const baseQuery = `
    SELECT p.*, c.name as contractor_name, c.company_name as contractor_company 
    FROM projects p
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE p.owner_id = $1
  `;
  const { paginatedQuery, countQuery, params, countParams, page, limit } = buildListQuery(baseQuery, [ownerId], filters);
  const [data, count] = await Promise.all([db.query(paginatedQuery, params), db.query(countQuery, countParams)]);
  return { data: data.rows, total: parseInt(count.rows[0].count, 10), page, limit };
};

export const findProjectsByWorker = async (workerId, filters = {}) => {
  const baseQuery = `
    SELECT p.*, c.name as contractor_name, c.company_name as contractor_company
    FROM projects p
    JOIN project_members pm ON p.id = pm.project_id
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE pm.worker_id = $1
  `;
  const { paginatedQuery, countQuery, params, countParams, page, limit } = buildListQuery(baseQuery, [workerId], filters);
  const [data, count] = await Promise.all([db.query(paginatedQuery, params), db.query(countQuery, countParams)]);
  return { data: data.rows, total: parseInt(count.rows[0].count, 10), page, limit };
};

export const findAllProjects = async (filters = {}) => {
  const baseQuery = `
    SELECT p.*, c.name as contractor_name, o.name as owner_name
    FROM projects p
    LEFT JOIN users c ON p.contractor_id = c.id
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE 1=1
  `;
  const { paginatedQuery, countQuery, params, countParams, page, limit } = buildListQuery(baseQuery, [], filters);
  const [data, count] = await Promise.all([db.query(paginatedQuery, params), db.query(countQuery, countParams)]);
  return { data: data.rows, total: parseInt(count.rows[0].count, 10), page, limit };
};

// --- Project Members ---

export const assignWorker = async (projectId, workerId) => {
  const query = `
    INSERT INTO project_members (project_id, worker_id)
    VALUES ($1, $2)
    ON CONFLICT (project_id, worker_id) DO NOTHING
    RETURNING *;
  `;
  const result = await db.query(query, [projectId, workerId]);
  return result.rows[0];
};

export const removeWorker = async (projectId, workerId) => {
  const query = `
    DELETE FROM project_members
    WHERE project_id = $1 AND worker_id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [projectId, workerId]);
  return result.rows[0];
};

export const getProjectWorkers = async (projectId) => {
  const query = `
    SELECT u.id, u.name, u.email, u.phone, u.role, pm.joined_at
    FROM project_members pm
    JOIN users u ON pm.worker_id = u.id
    WHERE pm.project_id = $1
    ORDER BY pm.joined_at DESC;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
};

export const getWorkerBuildingWorkspace = async (workerId, projectId) => {
  const checkQuery = `
    SELECT p.*, 
      c.id as contractor_id, c.name as contractor_name, c.company_name as contractor_company, c.email as contractor_email, c.phone as contractor_phone,
      o.name as owner_name, o.email as owner_email
    FROM projects p
    JOIN project_members pm ON p.id = pm.project_id
    LEFT JOIN users c ON p.contractor_id = c.id
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE pm.worker_id = $1 AND p.id = $2;
  `;
  const checkRes = await db.query(checkQuery, [workerId, projectId]);
  if (checkRes.rows.length === 0) return null;
  const project = checkRes.rows[0];

  const workersQuery = `
    SELECT 
      u.id as worker_id,
      u.name as worker_name,
      u.email as worker_email,
      u.phone as worker_phone,
      pm.joined_at as assigned_date,
      wp.skill as trade,
      wp.experience,
      wp.avatar_url,
      (
        SELECT title FROM tasks 
        WHERE project_id = $1 AND assigned_worker_id = u.id AND status != 'Completed'
        ORDER BY due_date ASC LIMIT 1
      ) as current_task,
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

  const docsQuery = `
    SELECT d.*, u.name as uploader_name
    FROM documents d
    LEFT JOIN users u ON d.uploaded_by = u.id
    WHERE d.project_id = $1
    ORDER BY d.created_at DESC;
  `;

  const [workersRes, progressRes, tasksRes, docsRes] = await Promise.all([
    db.query(workersQuery, [projectId]),
    db.query(progressQuery, [projectId]),
    db.query(tasksQuery, [projectId]),
    db.query(docsQuery, [projectId])
  ]);

  return {
    project,
    team: {
      contractor: {
        id: project.contractor_id,
        name: project.contractor_name,
        company_name: project.contractor_company,
        email: project.contractor_email,
        phone: project.contractor_phone
      },
      site_engineer: {
        name: project.contractor_name ? `${project.contractor_name} (Lead Engineer)` : 'Assigned Supervisor',
        company: project.contractor_company
      },
      workers: workersRes.rows.map(w => ({
        ...w,
        status: w.clock_in_today ? 'On Site Today' : 'Active',
        attendance_today: w.clock_in_today ? 'Present' : 'Absent'
      }))
    },
    progress: progressRes.rows,
    tasks: tasksRes.rows,
    documents: docsRes.rows
  };
};
