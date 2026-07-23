import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Standard Security & Utilities Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
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

// Unhandled Endpoint Route Catch (404)
app.use((req, res, next) => {
  const error = new Error(`Cannot find ${req.method} ${req.path} on this server.`);
  error.statusCode = 404;
  next(error);
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
