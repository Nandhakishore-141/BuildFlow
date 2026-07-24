import db from '../config/db.js';

export const updateProfile = async (userId, updateData) => {
  const { name, phone, profilePhoto } = updateData;
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (name !== undefined) {
    setClauses.push(`name = $${paramIndex}`);
    values.push(name);
    paramIndex++;
  }
  
  if (phone !== undefined) {
    setClauses.push(`phone = $${paramIndex}`);
    values.push(phone);
    paramIndex++;
  }
  
  if (profilePhoto !== undefined) {
    setClauses.push(`profile_photo = $${paramIndex}`);
    values.push(profilePhoto);
    paramIndex++;
  }

  if (setClauses.length === 0) {
    const query = `SELECT id, name, email, role, phone, company_name, is_verified, provider, profile_photo FROM users WHERE id = $1`;
    const res = await db.query(query, [userId]);
    return res.rows[0];
  }

  values.push(userId);
  const query = `
    UPDATE users
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, email, role, phone, company_name, is_verified, provider, profile_photo;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};
