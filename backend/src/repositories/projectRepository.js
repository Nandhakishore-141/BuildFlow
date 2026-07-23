import db from '../config/db.js';

export const createProject = async (projectData) => {
  const {
    id,
    project_name,
    project_code,
    description,
    owner_id,
    contractor_id,
    status,
    planned_start_date,
    planned_end_date,
    budget,
    address,
    city,
    state,
    country,
    latitude,
    longitude
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

export const findProjectsByContractor = async (contractorId) => {
  const query = `
    SELECT p.*, o.name as owner_name 
    FROM projects p
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE p.contractor_id = $1
    ORDER BY p.created_at DESC;
  `;
  const result = await db.query(query, [contractorId]);
  return result.rows;
};

export const findProjectsByOwner = async (ownerId) => {
  const query = `
    SELECT p.*, c.name as contractor_name, c.company_name as contractor_company 
    FROM projects p
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE p.owner_id = $1
    ORDER BY p.created_at DESC;
  `;
  const result = await db.query(query, [ownerId]);
  return result.rows;
};

export const findProjectsByWorker = async (workerId) => {
  const query = `
    SELECT p.*, c.name as contractor_name, c.company_name as contractor_company
    FROM projects p
    JOIN project_members pm ON p.id = pm.project_id
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE pm.worker_id = $1
    ORDER BY p.created_at DESC;
  `;
  const result = await db.query(query, [workerId]);
  return result.rows;
};
