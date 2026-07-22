import { validationResult } from 'express-validator';

/**
 * Middleware that checks for validation errors from express-validator
 * and responds with a formatted 400 Bad Request if errors exist.
 */
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed.',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};
