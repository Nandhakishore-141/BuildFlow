import { v4 as uuidv4 } from 'uuid';
import * as userRepository from '../repositories/userRepository.js';
import * as tokenRepository from '../repositories/tokenRepository.js';
import { hashPassword, comparePassword } from '../utils/passwordHelper.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenHelper.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

/**
 * Register a new user and dispatch email verification link
 * @param {object} userData 
 */
export const register = async (userData) => {
  try {
    console.log(`[AUTH] Registration request received`);
    
    const {
      name,
      email,
      password,
      role,
      phone,
      companyName,
      // Worker specific optional parameters
      skill,
      experience,
      location,
      availability,
      expectedDailyWage,
      aboutMe,
      avatarUrl,
      portfolioUrl,
    } = userData;

    console.log('[AUTH] Validation successful');
    
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      console.log(`[AUTH] Registration failed: Email ${email} is already in use`);
      const error = new Error('Email address is already in use.');
      error.statusCode = 400;
      throw error;
    }

    const userId = uuidv4();
    const passwordHash = await hashPassword(password);
    console.log('[AUTH] Password hashed');
    
    const verificationToken = uuidv4();

    const userRecord = {
      id: userId,
      name,
      email,
      passwordHash,
      role,
      phone,
      companyName: role === 'Contractor' ? companyName : null,
      isVerified: false,
      verificationToken,
    };

    console.log('[AUTH] Inserting user into PostgreSQL...');
    const createdUser = await userRepository.create(userRecord);
    console.log('[AUTH] User created successfully');

    // If role is Worker, instantiate a worker profile
    if (role === 'Worker') {
      const workerProfile = {
        userId,
        skill: skill || 'General Labor',
        experience: experience || 'Entry level',
        location: location || 'Not Specified',
        availability: availability || 'Available',
        expectedDailyWage: expectedDailyWage ? parseFloat(expectedDailyWage) : null,
        aboutMe: aboutMe || null,
        avatarUrl: avatarUrl || null,
        portfolioUrl: portfolioUrl || null,
      };
      await userRepository.createWorkerProfile(workerProfile);
    }

    // Fire-and-forget verification email dispatch
    sendVerificationEmail(email, name, verificationToken)
      .catch((err) => console.error('Verification email dispatch failed during signup:', err.message));

    console.log('[AUTH] Registration completed');
    return createdUser;
  } catch (error) {
    console.error(`[AUTH] Registration failed: ${error.message}`);
    throw error;
  }
};

/**
 * Login user, verify credentials, and yield session tokens
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // Expiration set to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await tokenRepository.saveToken(user.id, refreshToken, expiresAt);

  const { password_hash: _, verification_token: __, reset_token: ___, reset_token_expires: ____, ...profile } = user;

  return {
    user: profile,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Rotate Refresh Token and yield new Access and Refresh tokens
 * @param {string} token 
 */
export const refreshToken = async (token) => {
  const tokenRecord = await tokenRepository.findToken(token);
  if (!tokenRecord) {
    const error = new Error('Invalid refresh token.');
    error.statusCode = 401;
    throw error;
  }

  if (tokenRecord.revoked_at) {
    const error = new Error('Refresh token has been revoked.');
    error.statusCode = 401;
    throw error;
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    const error = new Error('Refresh token has expired.');
    error.statusCode = 401;
    throw error;
  }

  const user = await userRepository.findById(tokenRecord.user_id);
  if (!user) {
    const error = new Error('User not found associated with this token.');
    error.statusCode = 401;
    throw error;
  }

  // Revoke the old token
  await tokenRepository.revokeToken(token);

  // Issue rotated credentials
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await tokenRepository.saveToken(user.id, newRefreshToken, expiresAt);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Revoke specific session refresh token
 * @param {string} token 
 */
export const logout = async (token) => {
  if (token) {
    await tokenRepository.revokeToken(token);
  }
};

/**
 * Request password reset token and dispatch email link
 * @param {string} email 
 */
export const requestPasswordReset = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Return success response to avoid email enumeration security warnings
    return { success: true };
  }

  const resetToken = uuidv4();
  const resetTokenExpires = new Date();
  resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Valid for 1 hour

  await userRepository.update(user.id, {
    reset_token: resetToken,
    reset_token_expires: resetTokenExpires,
  });

  // Fire-and-forget reset link dispatch
  sendPasswordResetEmail(user.email, user.name, resetToken)
    .catch((err) => console.error('Password reset email dispatch failed:', err.message));

  return { success: true };
};

/**
 * Reset user password with valid token
 * @param {string} token 
 * @param {string} newPassword 
 */
export const resetPassword = async (token, newPassword) => {
  const user = await userRepository.findByResetToken(token);
  if (!user) {
    const error = new Error('Invalid or expired reset token.');
    error.statusCode = 400;
    throw error;
  }

  if (new Date(user.reset_token_expires) < new Date()) {
    const error = new Error('Reset token has expired.');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await hashPassword(newPassword);

  await userRepository.update(user.id, {
    password_hash: passwordHash,
    reset_token: null,
    reset_token_expires: null,
  });

  // Wipes all user active sessions for security post-password-reset
  await tokenRepository.revokeAllUserTokens(user.id);

  return { success: true };
};

/**
 * Verify user email status using verification token
 * @param {string} token 
 */
export const verifyEmail = async (token) => {
  const user = await userRepository.findByVerificationToken(token);
  if (!user) {
    const error = new Error('Invalid or expired verification token.');
    error.statusCode = 400;
    throw error;
  }

  await userRepository.update(user.id, {
    is_verified: 1,
    verification_token: null,
  });

  return { success: true };
};
