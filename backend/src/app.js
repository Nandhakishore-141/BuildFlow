import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

import adminRoutes from './routes/adminRoutes.js';
import homeownerRoutes from './routes/homeownerRoutes.js';
import contractorRoutes from './routes/contractorRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

const app = express();

// Standard Security & Utilities Middleware
app.use(helmet());

// Flexible CORS configuration supporting Vercel deployments, custom domains, and local dev
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000,http://localhost:4173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Http logger (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ConstructIQ API backend is active and healthy.',
    timestamp: new Date().toISOString()
  });
});

// App Router Declarations
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/homeowner', homeownerRoutes);
app.use('/api/contractor', contractorRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/profile', profileRoutes);

// Unhandled Endpoint Route Catch (404)
app.use((req, res, next) => {
  const error = new Error(`Cannot find ${req.method} ${req.path} on this server.`);
  error.statusCode = 404;
  next(error);
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
