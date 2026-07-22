import db from '../config/db.js';

/**
 * Save a new refresh token to the database
 * @param {string} userId 
 * @param {string} token 
 * @param {Date} expiresAt 
 */
export const saveToken = async (userId, token, expiresAt) => {
  const sql = `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
  `;
  await db.query(sql, [userId, token, expiresAt]);
  return { userId, token, expiresAt };
};

/**
 * Find refresh token details
 * @param {string} token 
 */
export const findToken = async (token) => {
  const sql = `
    SELECT * FROM refresh_tokens 
    WHERE token = $1
  `;
  const { rows } = await db.query(sql, [token]);
  return rows[0] || null;
};

/**
 * Revoke specific refresh token (used on logout or token rotation)
 * @param {string} token 
 */
export const revokeToken = async (token) => {
  const sql = `
    UPDATE refresh_tokens 
    SET revoked_at = NOW() 
    WHERE token = $1
  `;
  await db.query(sql, [token]);
};

/**
 * Revoke all active refresh tokens for a user (security wipe)
 * @param {string} userId 
 */
export const revokeAllUserTokens = async (userId) => {
  const sql = `
    UPDATE refresh_tokens 
    SET revoked_at = NOW() 
    WHERE user_id = $1 AND revoked_at IS NULL
  `;
  await db.query(sql, [userId]);
};
