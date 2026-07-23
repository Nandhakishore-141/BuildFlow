import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Account registered successfully. Please verify your email.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const session = await authService.login(email, password);
    res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required.',
      });
    }

    const rotatedSession = await authService.refreshToken(refreshToken);
    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed successfully.',
      data: rotatedSession,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(200).json({
      status: 'success',
      message: 'Logout successful. Session token revoked.',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.status(200).json({
      status: 'success',
      message: 'If the email matches a registered account, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You may now login with your new credentials.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    await authService.verifyEmail(token);
    res.status(200).json({
      status: 'success',
      message: 'Email address verified successfully. Account activated.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // We could fetch from repository directly or create a service method
    // authService.getUserProfile(userId) would be better architecture.
    // For now, let's use the service.
    const userProfile = await authService.getUserProfile(userId);
    res.status(200).json({
      status: 'success',
      data: {
        user: userProfile,
      }
    });
  } catch (error) {
    next(error);
  }
};
