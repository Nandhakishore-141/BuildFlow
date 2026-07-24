import db from '../config/db.js';

export const findByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

export const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
};

export const findByGoogleId = async (googleId) => {
  const { rows } = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return rows[0] || null;
};

export const create = async (user) => {
  const {
    id,
    name,
    email,
    passwordHash = null,
    role,
    phone,
    companyName = null,
    isVerified = false,
    verificationToken = null,
    provider = 'local',
    googleId = null,
    profilePhoto = null
  } = user;

  const sql = `
    INSERT INTO users (id, name, email, password_hash, role, phone, company_name, is_verified, verification_token, provider, google_id, profile_photo)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `;

  await db.query(sql, [
    id,
    name,
    email,
    passwordHash,
    role,
    phone,
    companyName,
    isVerified,
    verificationToken,
    provider,
    googleId,
    profilePhoto
  ]);

  return { id, name, email, role, phone, companyName, provider, profilePhoto };
};

export const update = async (id, updates) => {
  const keys = Object.keys(updates);
  if (keys.length === 0) return null;

  const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
  const values = Object.values(updates);
  values.push(id);

  const sql = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1}`;
  await db.query(sql, values);

  return findById(id);
};

export const findByVerificationToken = async (token) => {
  const { rows } = await db.query('SELECT * FROM users WHERE verification_token = $1', [token]);
  return rows[0] || null;
};

export const findByResetToken = async (token) => {
  const { rows } = await db.query('SELECT * FROM users WHERE reset_token = $1', [token]);
  return rows[0] || null;
};

export const createWorkerProfile = async (profile) => {
  const {
    userId,
    skill,
    experience,
    location,
    availability = 'Available',
    expectedDailyWage = null,
    aboutMe = null,
    avatarUrl = null,
    portfolioUrl = null,
  } = profile;

  const sql = `
    INSERT INTO worker_profiles (user_id, skill, experience, location, availability, expected_daily_wage, about_me, avatar_url, portfolio_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;

  await db.query(sql, [
    userId,
    skill,
    experience,
    location,
    availability,
    expectedDailyWage,
    aboutMe,
    avatarUrl,
    portfolioUrl,
  ]);
};

export const findWorkerProfileByUserId = async (userId) => {
  const { rows } = await db.query('SELECT * FROM worker_profiles WHERE user_id = $1', [userId]);
  return rows[0] || null;
};
