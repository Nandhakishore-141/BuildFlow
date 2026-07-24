import { validationResult } from 'express-validator';

/**
 * Middleware that checks for validation errors from express-validator
 * and responds with a formatted 400 Bad Request if errors exist.
 */
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const structuredErrors = {};
    errors.array().forEach((err) => {
      if (!structuredErrors[err.path]) {
        structuredErrors[err.path] = err.msg;
      }
    });

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed.',
      errors: structuredErrors,
    });
  }
  next();
};
