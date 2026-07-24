import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must contain at least 2 characters.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain one number.')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain one special character.'),
  body('role')
    .isIn(['Contractor', 'Homeowner', 'Worker', 'Admin'])
    .withMessage('Invalid role selected.'),
  body('phone')
    .trim()
    .matches(/^\+?[0-9\s-]{10,15}$/)
    .withMessage('Phone number must contain exactly 10 digits.'),
  
  // Conditional validations using express-validator's .if()
  body('companyName')
    .if((value, { req }) => req.body.role === 'Contractor')
    .trim()
    .notEmpty()
    .withMessage('Company name is required for contractors.'),
    
  body('skill')
    .if((value, { req }) => req.body.role === 'Worker')
    .trim()
    .notEmpty()
    .withMessage('Primary skill selection is required for workers.'),
    
  body('experience')
    .if((value, { req }) => req.body.role === 'Worker')
    .trim()
    .notEmpty()
    .withMessage('Years of experience is required for workers.'),
    
  body('location')
    .if((value, { req }) => req.body.role === 'Worker')
    .trim()
    .notEmpty()
    .withMessage('Location is required for workers.'),
    
  body('availability')
    .optional()
    .if((value, { req }) => req.body.role === 'Worker')
    .isIn(['Available', 'Busy', 'Unavailable'])
    .withMessage('Invalid availability status.'),

  body('dailyWage')
    .optional()
    .if((value, { req }) => req.body.role === 'Worker')
    .trim()
    .matches(/^[0-9]+$/)
    .withMessage('Daily wage must contain numbers only.'),
];

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain one number.')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain one special character.'),
];

export const verifyEmailValidator = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Verification token is required.'),
];
