import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate a short-lived Access Token containing user metadata
 * @param {object} user 
 * @returns {string} Signed JWT Access Token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'super_secret_access_key_12345',
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

/**
 * Generate a cryptographically secure random Refresh Token string
 * @returns {string} Secure hexadecimal string
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Verify Access Token validity
 * @param {string} token 
 * @returns {object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'super_secret_access_key_12345');
};
