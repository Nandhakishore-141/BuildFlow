import db from '../config/db.js';

export const getOpportunities = async (contractorId, filters = {}) => {
  let query = `
    SELECT 
      p.*,
      o.name as owner_name,
      o.email as owner_email,
      (
        SELECT COUNT(*) FROM contractor_proposals WHERE project_id = p.id
      ) as total_proposals,
      (
        SELECT status FROM contractor_proposals WHERE project_id = p.id AND contractor_id = $1
      ) as my_proposal_status
    FROM projects p
    LEFT JOIN users o ON p.owner_id = o.id
    WHERE p.status = 'Looking for Contractor'
  `;
  const params = [contractorId];
  let paramIdx = 2;

  if (filters.search) {
    query += ` AND (p.project_name ILIKE $${paramIdx} OR p.project_code ILIKE $${paramIdx} OR p.city ILIKE $${paramIdx})`;
    params.push(`%${filters.search}%`);
    paramIdx++;
  }

  query += ` ORDER BY p.created_at DESC;`;

  const res = await db.query(query, params);
  return res.rows;
};

export const submitProposal = async (proposalData) => {
  const { id, project_id, contractor_id, estimated_budget, estimated_duration, cover_message } = proposalData;

  // Verify project status is 'Looking for Contractor'
  const projRes = await db.query(`SELECT owner_id, project_name, status FROM projects WHERE id = $1`, [project_id]);
  if (projRes.rows.length === 0) {
    const err = new Error('Project not found');
    err.statusCode = 404;
    throw err;
  }
  const project = projRes.rows[0];

  const query = `
    INSERT INTO contractor_proposals (id, project_id, contractor_id, estimated_budget, estimated_duration, cover_message, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    ON CONFLICT (project_id, contractor_id) DO UPDATE 
    SET estimated_budget = EXCLUDED.estimated_budget, estimated_duration = EXCLUDED.estimated_duration, cover_message = EXCLUDED.cover_message, submitted_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const res = await db.query(query, [id, project_id, contractor_id, estimated_budget, estimated_duration, cover_message]);

  // Insert notification for homeowner
  await db.query(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES ($1, 'New Proposal Received', 'A verified contractor submitted a proposal for building "' || $2 || '".', 'proposal')
  `, [project.owner_id, project.project_name]);

  return res.rows[0];
};

export const getInvitations = async (contractorId) => {
  const query = `
    SELECT 
      ci.*,
      p.project_name,
      p.project_code,
      p.description,
      p.project_type,
      p.budget,
      p.planned_start_date,
      p.planned_end_date,
      p.city,
      p.address,
      o.name as owner_name,
      o.email as owner_email,
      o.phone as owner_phone
    FROM contractor_invitations ci
    JOIN projects p ON ci.project_id = p.id
    JOIN users o ON ci.homeowner_id = o.id
    WHERE ci.contractor_id = $1
    ORDER BY ci.sent_at DESC;
  `;
  const res = await db.query(query, [contractorId]);
  return res.rows;
};

export const respondToInvitation = async (invitationId, contractorId, responseStatus) => {
  const invRes = await db.query(`
    SELECT ci.*, p.project_name, p.owner_id 
    FROM contractor_invitations ci
    JOIN projects p ON ci.project_id = p.id
    WHERE ci.id = $1 AND ci.contractor_id = $2
  `, [invitationId, contractorId]);

  if (invRes.rows.length === 0) return null;
  const inv = invRes.rows[0];

  const query = `
    UPDATE contractor_invitations 
    SET status = $1, responded_at = CURRENT_TIMESTAMP 
    WHERE id = $2 
    RETURNING *;
  `;
  const res = await db.query(query, [responseStatus, invitationId]);

  if (responseStatus === 'accepted') {
    // Update project status to 'Planning' and contractor_id = contractorId
    await db.query(`
      UPDATE projects 
      SET status = 'Planning', contractor_id = $1 
      WHERE id = $2
    `, [contractorId, inv.project_id]);

    await db.query(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ($1, 'Invitation Accepted!', 'The contractor accepted your invitation to build "' || $2 || '".', 'invitation_accepted')
    `, [inv.owner_id, inv.project_name]);
  } else if (responseStatus === 'declined') {
    await db.query(`
      UPDATE projects 
      SET status = 'Looking for Contractor', contractor_id = NULL 
      WHERE id = $1
    `, [inv.project_id]);

    await db.query(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ($1, 'Invitation Declined', 'The contractor declined your invitation for "' || $2 || '". You can invite another contractor or open public proposals.', 'invitation_declined')
    `, [inv.owner_id, inv.project_name]);
  }

  return res.rows[0];
};
