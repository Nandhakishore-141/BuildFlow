import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import * as userRepository from '../repositories/userRepository.js';
import * as tokenRepository from '../repositories/tokenRepository.js';
import { hashPassword, comparePassword } from '../utils/passwordHelper.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenHelper.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

export const verifyGoogleToken = async (token) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || 'dummy-client-id';
    
    console.log("GOOGLE_CLIENT_ID:", clientId);
    console.log("Credential Exists:", !!token);
    console.log("Credential Length:", token ? token.length : 0);
    
    const googleClient = new OAuth2Client(clientId);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    
    const payload = ticket.getPayload();
    
    console.log("payload.aud:", payload.aud);
    console.log("payload.azp:", payload.azp);
    console.log("payload.email:", payload.email);

    return payload;
  } catch (error) {
    console.error("Google Verification Error Message:", error.message);
    console.error("Google Verification Error Stack:", error.stack);
    const err = new Error(error.message);
    err.statusCode = 401;
    throw err;
  }
};

export const googleLogin = async (token) => {
  const payload = await verifyGoogleToken(token);
  const email = payload.email;

  // Try to find by Google ID or Email
  let user = await userRepository.findByGoogleId(payload.sub);
  if (!user) {
    user = await userRepository.findByEmail(email);
  }

  // If user doesn't exist at all, return a signal for onboarding
  if (!user) {
    return {
      requires_onboarding: true,
      googleProfile: {
        google_id: payload.sub,
        email: payload.email,
        name: payload.name,
        profile_photo: payload.picture
      }
    };
  }

  // If user exists but hasn't linked Google, link it now
  if (!user.google_id) {
    await userRepository.update(user.id, {
      google_id: payload.sub,
      provider: 'google',
      profile_photo: payload.picture,
      is_verified: true // Google emails are verified
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await tokenRepository.saveToken(user.id, refreshToken, expiresAt);

  const { password_hash: _, verification_token: __, reset_token: ___, reset_token_expires: ____, ...profile } = await userRepository.findById(user.id);

  return {
    requires_onboarding: false,
    user: profile,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const googleRegister = async (token, onboardingData) => {
  const payload = await verifyGoogleToken(token);
  const email = payload.email;

  let existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const err = new Error('User with this email already exists.');
    err.statusCode = 400;
    throw err;
  }

  const {
    role,
    phone,
    companyName,
    skill,
    experience,
    location,
    availability,
    expectedDailyWage,
    aboutMe,
    avatarUrl,
    portfolioUrl,
  } = onboardingData;

  const userId = uuidv4();
  
  const userRecord = {
    id: userId,
    name: payload.name,
    email: payload.email,
    passwordHash: null,
    role,
    phone,
    companyName: role === 'Contractor' ? companyName : null,
    isVerified: true,
    verificationToken: null,
    provider: 'google',
    googleId: payload.sub,
    profilePhoto: payload.picture
  };

  const createdUser = await userRepository.create(userRecord);

  if (role === 'Worker') {
    const workerProfile = {
      userId,
      skill: skill || 'General Labor',
      experience: experience || 'Entry level',
      location: location || 'Not Specified',
      availability: availability || 'Available',
      expectedDailyWage: expectedDailyWage ? parseFloat(expectedDailyWage) : null,
      aboutMe: aboutMe || null,
      avatarUrl: avatarUrl || payload.picture,
      portfolioUrl: portfolioUrl || null,
    };
    await userRepository.createWorkerProfile(workerProfile);
  }

  const accessToken = generateAccessToken(userRecord);
  const refreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await tokenRepository.saveToken(userId, refreshToken, expiresAt);

  const { password_hash: _, verification_token: __, reset_token: ___, reset_token_expires: ____, ...profile } = await userRepository.findById(userId);

  return {
    user: profile,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};


/**
 * Register a new user and dispatch email verification link
 */
export const register = async (userData) => {
  try {
    const {
      name, email, password, role, phone, companyName,
      skill, experience, location, availability, expectedDailyWage, aboutMe, avatarUrl, portfolioUrl,
    } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email address is already in use.');
      error.statusCode = 400;
      throw error;
    }

    const userId = uuidv4();
    const passwordHash = await hashPassword(password);
    const verificationToken = uuidv4();

    const userRecord = {
      id: userId,
      name,
      email,
      passwordHash,
      role,
      phone,
      companyName: role === 'Contractor' ? companyName : null,
      isVerified: true,
      verificationToken,
      provider: 'local'
    };

    const createdUser = await userRepository.create(userRecord);

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

    sendVerificationEmail(email, name, verificationToken)
      .catch((err) => console.error('Verification email dispatch failed during signup:', err.message));

    return createdUser;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user, verify credentials, and yield session tokens
 */
export const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.password_hash) {
    const error = new Error('Please login with your social provider.');
    error.statusCode = 400;
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
  await tokenRepository.revokeToken(token);
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

export const logout = async (token) => {
  if (token) {
    await tokenRepository.revokeToken(token);
  }
};

export const requestPasswordReset = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) return { success: true };
  const resetToken = uuidv4();
  const resetTokenExpires = new Date();
  resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);
  await userRepository.update(user.id, {
    reset_token: resetToken,
    reset_token_expires: resetTokenExpires,
  });
  sendPasswordResetEmail(user.email, user.name, resetToken)
    .catch((err) => console.error('Password reset email dispatch failed:', err.message));
  return { success: true };
};

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
  await tokenRepository.revokeAllUserTokens(user.id);
  return { success: true };
};

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

export const getUserProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  const { password_hash: _, verification_token: __, reset_token: ___, reset_token_expires: ____, ...profile } = user;
  return profile;
};
