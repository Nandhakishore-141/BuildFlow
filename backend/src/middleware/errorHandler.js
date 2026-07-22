/**
 * Centralized global error handling middleware for Express
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[API ERROR] ${req.method} ${req.path}:`, err);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }), // include stack details under development environment
  });
};
