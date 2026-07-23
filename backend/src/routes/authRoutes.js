import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as authValidator from '../validators/authValidator.js';
import { checkValidation } from '../middleware/validationMiddleware.js';

const router = Router();

router.post(
  '/register',
  authValidator.registerValidator,
  checkValidation,
  authController.register
);

router.post(
  '/login',
  authValidator.loginValidator,
  checkValidation,
  authController.login
);

router.post(
  '/refresh',
  authController.refresh
);

router.post(
  '/logout',
  authController.logout
);

router.post(
  '/verify-email',
  authValidator.verifyEmailValidator,
  checkValidation,
  authController.verifyEmail
);

router.post(
  '/forgot-password',
  authValidator.forgotPasswordValidator,
  checkValidation,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authValidator.resetPasswordValidator,
  checkValidation,
  authController.resetPassword
);

import { requireAuth } from '../middleware/authMiddleware.js';

router.get(
  '/me',
  requireAuth,
  authController.getMe
);

export default router;
