import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password using bcryptjs
 * @param {string} password 
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare plain text password against its hash
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>} Match status
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
