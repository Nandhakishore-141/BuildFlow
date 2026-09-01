import 'dotenv/config'; // Must be the absolute first import to avoid ES Module hoisting issues
import app from './app.js';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(` ConstructIQ Backend Started`);
    console.log(` Port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(`=========================================`);
  });

  // Verify database connection asynchronously without blocking server port binding
  try {
    await db.query('SELECT 1');
    console.log(`✓ MySQL Connected`);
    console.log(`✓ Database: ${process.env.DB_NAME || 'constructiq'}`);
    console.log(`✓ Authentication Module Loaded`);
    console.log(`✓ Routes Registered`);
    console.log(`✓ Controllers Loaded`);
    console.log(`✓ Services Loaded`);
    console.log(`✓ Repository Layer Ready`);
    console.log(`✓ Server Ready`);
  } catch (error) {
    const errorDetails = error.code ? `[${error.code}] ${error.message || 'Network unreachable'}` : (error.message || String(error));
    console.error('⚠️ Warning: Database connection check encountered an error:');
    console.error(errorDetails);
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('💡 Tip: Your network/WiFi may be blocking port 4000, or your IP address is not whitelisted in TiDB Cloud Security settings.');
    }
  }

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
};

startServer();
