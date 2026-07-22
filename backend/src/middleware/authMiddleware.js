import { verifyAccessToken } from '../utils/tokenHelper.js';

/**
 * Middleware to require authentication via Bearer Token
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized. Access token is missing or malformed.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Bind decoded user metadata to req object
    next();
  } catch (error) {
    let message = 'Unauthorized. Invalid access token.';
    if (error.name === 'TokenExpiredError') {
      message = 'Unauthorized. Access token has expired.';
    }
    return res.status(401).json({
      status: 'error',
      message,
    });
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...string} allowedRoles 
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized. User context is missing.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden. You do not have permissions to perform this action.',
      });
    }

    next();
  };
};
