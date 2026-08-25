import db from '../config/db.js';

export const getDashboardStats = async (workerId) => {
  const projectsCountQuery = `
    SELECT COUNT(DISTINCT project_id) as total_assigned
    FROM project_members
    WHERE worker_id = $1;
  `;

  const activeProjectQuery = `
    SELECT p.*, c.name as contractor_name, c.company_name as contractor_company
    FROM projects p
    JOIN project_members pm ON p.id = pm.project_id
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE pm.worker_id = $1
    ORDER BY (CASE WHEN p.status = 'In Progress' THEN 1 ELSE 2 END), p.created_at DESC
    LIMIT 1;
  `;

  const todayAttendanceQuery = `
    SELECT a.*, p.project_name
    FROM attendance a
    JOIN projects p ON a.project_id = p.id
    WHERE a.worker_id = $1 AND DATE(a.clock_in) = CURRENT_DATE
    ORDER BY a.clock_in DESC
    LIMIT 1;
  `;

  const monthlyAttendanceQuery = `
    SELECT COUNT(DISTINCT DATE(clock_in)) as total_days
    FROM attendance
    WHERE worker_id = $1 
      AND MONTH(clock_in) = MONTH(CURRENT_DATE)
      AND YEAR(clock_in) = YEAR(CURRENT_DATE);
  `;

  const tasksStatsQuery = `
    SELECT 
      COUNT(CASE WHEN status != 'Completed' THEN 1 END) as pending_tasks,
      COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_tasks
    FROM tasks
    WHERE assigned_worker_id = $1;
  `;

  const recentAnnouncementsQuery = `
    SELECT *
    FROM announcements
    WHERE target_role IN ('Worker', 'Everyone')
    ORDER BY publish_date DESC, created_at DESC
    LIMIT 5;
  `;

  const latestWorkUpdatesQuery = `
    SELECT pu.*, p.project_name, w.name as uploader_name
    FROM progress_updates pu
    JOIN projects p ON pu.project_id = p.id
    JOIN users w ON pu.worker_id = w.id
    WHERE pu.project_id IN (SELECT project_id FROM project_members WHERE worker_id = $1)
    ORDER BY pu.created_at DESC
    LIMIT 5;
  `;

  const [
    projectsCountRes,
    activeProjectRes,
    todayAttRes,
    monthlyAttRes,
    tasksStatsRes,
    announcementsRes,
    workUpdatesRes
  ] = await Promise.all([
    db.query(projectsCountQuery, [workerId]),
    db.query(activeProjectQuery, [workerId]),
    db.query(todayAttendanceQuery, [workerId]),
    db.query(monthlyAttendanceQuery, [workerId]),
    db.query(tasksStatsQuery, [workerId]),
    db.query(recentAnnouncementsQuery),
    db.query(latestWorkUpdatesQuery, [workerId])
  ]);

  const todayAtt = todayAttRes.rows[0] || null;
  let todayStatus = 'Not Checked In';
  if (todayAtt) {
    if (todayAtt.clock_out) {
      todayStatus = 'Checked Out';
    } else {
      todayStatus = 'Checked In';
    }
  }

  return {
    assignedProjects: parseInt(projectsCountRes.rows[0]?.total_assigned || 0, 10),
    activeProject: activeProjectRes.rows[0] || null,
    todayAttendance: {
      status: todayStatus,
      record: todayAtt
    },
    monthlyAttendanceCount: parseInt(monthlyAttRes.rows[0]?.total_days || 0, 10),
    pendingTasks: parseInt(tasksStatsRes.rows[0]?.pending_tasks || 0, 10),
    completedTasks: parseInt(tasksStatsRes.rows[0]?.completed_tasks || 0, 10),
    recentAnnouncements: announcementsRes.rows,
    latestWorkUpdates: workUpdatesRes.rows
  };
};

export const getWorkerTasks = async (workerId) => {
  const query = `
    SELECT 
      t.*, 
      p.project_name, p.project_code, p.contractor_id,
      c.name as contractor_name, c.company_name as contractor_company
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users c ON p.contractor_id = c.id
    WHERE t.assigned_worker_id = $1 
       OR t.id IN (SELECT task_id FROM task_assignees WHERE worker_id = $1)
    ORDER BY (CASE WHEN t.status = 'Completed' THEN 2 ELSE 1 END), t.due_date ASC, t.created_at DESC;
  `;
  const res = await db.query(query, [workerId]);
  return res.rows;
};

export const updateTaskStatus = async (workerId, taskId, updateData) => {
  const status = typeof updateData === 'string' ? updateData : updateData.status;
  const notes = typeof updateData === 'object' ? (updateData.notes || updateData.completion_notes || '') : '';
  const fileUrl = typeof updateData === 'object' ? (updateData.file_url || updateData.completion_file_url || null) : null;

  // Check task assignment
  const taskRes = await db.query(
    `SELECT t.*, p.contractor_id, p.project_name, u.name as worker_name
     FROM tasks t
     JOIN projects p ON t.project_id = p.id
     JOIN users u ON u.id = $1
     WHERE t.id = $2 AND (t.assigned_worker_id = $1 OR t.id IN (SELECT task_id FROM task_assignees WHERE worker_id = $1))`,
    [workerId, taskId]
  );

  if (taskRes.rows.length === 0) {
    const err = new Error('Task not found or you are not assigned to this task.');
    err.statusCode = 404;
    throw err;
  }
  const task = taskRes.rows[0];

  let targetStatus = status;
  let reviewStatus = task.review_status || 'Pending';

  // If worker marks task as 'Completed' or 'Waiting for Review' or 'Under Review'
  if (['Completed', 'Waiting for Review', 'Under Review'].includes(status)) {
    targetStatus = 'Under Review';
    reviewStatus = 'Pending';

    // Notify contractor
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Task Submitted for Review', CONCAT($2, ' submitted task "', $3, '" for review.'), 'task_review')`,
      [task.contractor_id, task.worker_name, task.title]
    );
  } else if (status === 'In Progress') {
    targetStatus = 'In Progress';
  } else if (status === 'Not Started' || status === 'Todo') {
    targetStatus = 'Todo';
  }

  const query = `
    UPDATE tasks
    SET status = $1, review_status = $2, completion_notes = COALESCE($3, completion_notes), completion_file_url = COALESCE($4, completion_file_url), updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *;
  `;
  const res = await db.query(query, [targetStatus, reviewStatus, notes || null, fileUrl || null, taskId]);
  return res.rows[0];
};

export const getWorkerAttendance = async (workerId) => {
  const query = `
    SELECT a.*, p.project_name, p.project_code
    FROM attendance a
    JOIN projects p ON a.project_id = p.id
    WHERE a.worker_id = $1
    ORDER BY a.clock_in DESC;
  `;
  const res = await db.query(query, [workerId]);
  return res.rows;
};

export const findTodayActiveClockIn = async (workerId) => {
  const query = `
    SELECT a.*, p.project_name
    FROM attendance a
    JOIN projects p ON a.project_id = p.id
    WHERE a.worker_id = $1 AND DATE(a.clock_in) = CURRENT_DATE
    ORDER BY a.clock_in DESC
    LIMIT 1;
  `;
  const res = await db.query(query, [workerId]);
  return res.rows[0] || null;
};

export const clockIn = async (workerId, data) => {
  const { project_id, latitude = 0, longitude = 0 } = data;
  const query = `
    INSERT INTO attendance (worker_id, project_id, clock_in, latitude_in, longitude_in)
    VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
    RETURNING *;
  `;
  const res = await db.query(query, [workerId, project_id, latitude, longitude]);
  return res.rows[0];
};

export const clockOut = async (attendanceId, data) => {
  const { latitude = 0, longitude = 0 } = data;
  const query = `
    UPDATE attendance
    SET clock_out = CURRENT_TIMESTAMP, latitude_out = $1, longitude_out = $2
    WHERE id = $3
    RETURNING *;
  `;
  const res = await db.query(query, [latitude, longitude, attendanceId]);
  return res.rows[0];
};

export const acceptAttendanceTiming = async (workerId, attendanceId) => {
  const check = await db.query('SELECT * FROM attendance WHERE id = $1 AND worker_id = $2', [attendanceId, workerId]);
  if (check.rows.length === 0) {
    const err = new Error('Attendance log not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }
  const current = check.rows[0];
  const targetStatus = current.status === 'Half Day' ? 'Half Day' : 'Present';

  const query = `
    UPDATE attendance
    SET status = $1, worker_acceptance = 'Accepted'
    WHERE id = $2 AND worker_id = $3;
  `;
  await db.query(query, [targetStatus, attendanceId, workerId]);
  const res = await db.query('SELECT * FROM attendance WHERE id = $1', [attendanceId]);
  return res.rows[0];
};

export const submitAbsenceReason = async (workerId, attendanceId, reason) => {
  if (!reason || !reason.trim()) {
    const err = new Error('Please provide a valid reason for absence.');
    err.statusCode = 400;
    throw err;
  }
  const check = await db.query(
    `SELECT a.*, p.contractor_id, p.project_name, u.name as worker_name
     FROM attendance a
     JOIN projects p ON a.project_id = p.id
     JOIN users u ON a.worker_id = u.id
     WHERE a.id = $1 AND a.worker_id = $2`,
    [attendanceId, workerId]
  );
  if (check.rows.length === 0) {
    const err = new Error('Attendance record not found or unauthorized.');
    err.statusCode = 404;
    throw err;
  }
  const att = check.rows[0];
  const query = `
    UPDATE attendance
    SET status = 'Absent', absence_reason = $1, worker_acceptance = 'Reason Submitted'
    WHERE id = $2 AND worker_id = $3;
  `;
  await db.query(query, [reason.trim(), attendanceId, workerId]);

  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Absence Reason Submitted', CONCAT($2, ' provided an absence reason for project "', $3, '": "', $4, '".'), 'attendance')`,
      [att.contractor_id, att.worker_name, att.project_name, reason.trim()]
    );
  } catch (e) {
    // Non-fatal notification
  }

  const res = await db.query('SELECT * FROM attendance WHERE id = $1', [attendanceId]);
  return res.rows[0];
};

export const getWorkerAnnouncements = async () => {
  const query = `
    SELECT *
    FROM announcements
    WHERE target_role IN ('Worker', 'Everyone')
    ORDER BY publish_date DESC, created_at DESC;
  `;
  const res = await db.query(query);
  return res.rows;
};

export const getWorkerProfile = async (workerId) => {
  const query = `
    SELECT 
      u.id, u.name, u.email, u.phone, u.role, u.company_name, u.created_at,
      wp.skill, wp.experience, wp.location as address, wp.avatar_url, wp.about_me, 
      wp.expected_daily_wage, wp.availability, wp.rating,
      (
        SELECT c.name
        FROM project_members pm
        JOIN projects p ON pm.project_id = p.id
        JOIN users c ON p.contractor_id = c.id
        WHERE pm.worker_id = u.id
        LIMIT 1
      ) as assigned_contractor_name
    FROM users u
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    WHERE u.id = $1 AND u.role = 'Worker';
  `;
  const res = await db.query(query, [workerId]);
  return res.rows[0];
};

export const updateWorkerProfile = async (workerId, updateData) => {
  const { phone, name, address, skill, experience, about_me, avatar_url } = updateData;

  // 1. Update user fields
  if (phone !== undefined || name !== undefined) {
    const userSets = [];
    const userVals = [];
    let pIdx = 1;
    if (phone !== undefined) {
      userSets.push(`phone = $${pIdx++}`);
      userVals.push(phone);
    }
    if (name !== undefined) {
      userSets.push(`name = $${pIdx++}`);
      userVals.push(name);
    }
    userVals.push(workerId);
    await db.query(
      `UPDATE users SET ${userSets.join(', ')} WHERE id = $${pIdx}`,
      userVals
    );
  }

  // 2. Update or insert worker_profiles
  const profileCheck = await db.query(`SELECT user_id FROM worker_profiles WHERE user_id = $1`, [workerId]);
  if (profileCheck.rows.length === 0) {
    await db.query(
      `INSERT INTO worker_profiles (user_id, skill, experience, location, about_me, avatar_url)
       VALUES ($1, COALESCE($2, 'General Worker'), COALESCE($3, '1 Year'), COALESCE($4, ''), $5, $6)`,
      [workerId, skill || null, experience || null, address || null, about_me || null, avatar_url || null]
    );
  } else {
    const profSets = [];
    const profVals = [];
    let pIdx = 1;

    if (address !== undefined) {
      profSets.push(`location = $${pIdx++}`);
      profVals.push(address);
    }
    if (skill !== undefined) {
      profSets.push(`skill = $${pIdx++}`);
      profVals.push(skill);
    }
    if (experience !== undefined) {
      profSets.push(`experience = $${pIdx++}`);
      profVals.push(experience);
    }
    if (about_me !== undefined) {
      profSets.push(`about_me = $${pIdx++}`);
      profVals.push(about_me);
    }
    if (avatar_url !== undefined) {
      profSets.push(`avatar_url = $${pIdx++}`);
      profVals.push(avatar_url);
    }

    if (profSets.length > 0) {
      profVals.push(workerId);
      await db.query(
        `UPDATE worker_profiles SET ${profSets.join(', ')} WHERE user_id = $${pIdx}`,
        profVals
      );
    }
  }

  return await getWorkerProfile(workerId);
};

export const getWorkerNotifications = async (workerId) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 50;
  `;
  const res = await db.query(query, [workerId]);
  return res.rows;
};

export const markNotificationRead = async (workerId, notificationId) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const res = await db.query(query, [notificationId, workerId]);
  return res.rows[0];
};

export const createProgressUpdate = async (workerId, data) => {
  const { id, project_id, description, file_url, file_type = 'Photo' } = data;
  const query = `
    INSERT INTO progress_updates (id, project_id, worker_id, description, file_url, file_type, approval_status)
    VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
    RETURNING *;
  `;
  const res = await db.query(query, [id, project_id, workerId, description, file_url, file_type]);
  return res.rows[0];
};

export const getWorkerInvitations = async (workerId) => {
  const query = `
    SELECT 
      wi.id as invitation_id, wi.project_id, wi.contractor_id, wi.status, wi.message, wi.created_at as sent_at, wi.updated_at,
      p.project_name, p.project_code, p.city, p.address, p.description,
      c.name as contractor_name, c.company_name as contractor_company, c.email as contractor_email, c.phone as contractor_phone
    FROM worker_invitations wi
    JOIN projects p ON wi.project_id = p.id
    JOIN users c ON wi.contractor_id = c.id
    WHERE wi.worker_id = $1
    ORDER BY (CASE WHEN wi.status = 'Pending' THEN 1 ELSE 2 END), wi.created_at DESC;
  `;
  const res = await db.query(query, [workerId]);
  return res.rows;
};

export const respondToWorkerInvitation = async (workerId, invitationId, statusResponse) => {
  const invRes = await db.query(
    `SELECT wi.*, p.project_name, c.id as contractor_id, u.name as worker_name, wp.skill as worker_trade
     FROM worker_invitations wi
     JOIN projects p ON wi.project_id = p.id
     JOIN users c ON wi.contractor_id = c.id
     JOIN users u ON wi.worker_id = u.id
     LEFT JOIN worker_profiles wp ON u.id = wp.user_id
     WHERE wi.id = $1 AND wi.worker_id = $2`,
    [invitationId, workerId]
  );

  if (invRes.rows.length === 0) {
    const err = new Error('Invitation not found.');
    err.statusCode = 404;
    throw err;
  }

  const inv = invRes.rows[0];
  if (inv.status !== 'Pending') {
    const err = new Error(`Invitation has already been responded to (${inv.status}).`);
    err.statusCode = 400;
    throw err;
  }

  const targetStatus = (statusResponse === 'accept' || statusResponse === 'Accepted') ? 'Accepted' : 'Rejected';

  const updateRes = await db.query(
    `UPDATE worker_invitations 
     SET status = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 AND worker_id = $3 
     RETURNING *;`,
    [targetStatus, invitationId, workerId]
  );

  if (targetStatus === 'Accepted') {
    await db.query(
      `INSERT INTO project_members (project_id, worker_id)
       VALUES ($1, $2)
       ON DUPLICATE KEY UPDATE id=id;`,
      [inv.project_id, workerId]
    );

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Invitation Accepted!', CONCAT($2, ' (', COALESCE($3, 'Worker'), ') accepted your invitation to join building project "', $4, '".'), 'invitation_accepted')`,
      [inv.contractor_id, inv.worker_name, inv.worker_trade, inv.project_name]
    );
  } else {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Invitation Declined', CONCAT($2, ' (', COALESCE($3, 'Worker'), ') declined your invitation to join building project "', $4, '".'), 'invitation_declined')`,
      [inv.contractor_id, inv.worker_name, inv.worker_trade, inv.project_name]
    );
  }

  return updateRes.rows[0];
};
