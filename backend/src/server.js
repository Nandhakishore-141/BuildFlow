import 'dotenv/config'; // Must be the absolute first import to avoid ES Module hoisting issues
import app from './app.js';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.query('SELECT 1');
    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` ConstructIQ Backend Started`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Local URL: http://localhost:${PORT}`);
      console.log(`=========================================`);
      console.log('');
      console.log(`✓ MySQL Connected`);
      console.log(`✓ Database: ${process.env.DB_NAME || 'constructiq'}`);
      console.log(`✓ Authentication Module Loaded`);
      console.log(`✓ Routes Registered`);
      console.log(`✓ Controllers Loaded`);
      console.log(`✓ Services Loaded`);
      console.log(`✓ Repository Layer Ready`);
      console.log(`✓ Server Ready`);
    });

    // Unhandled Promise Rejections & Uncaught Exceptions Handler
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! Shutting down server...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION! Shutting down server...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful Termination
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  } catch (error) {
    console.error('CRITICAL: Failed to start server - Database connection failed');
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
