import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'constructiq',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Immediately test query to confirm DB configuration validity
pool.query('SELECT 1')
  .then(() => {
    console.log('PostgreSQL Database pool established and active.');
  })
  .catch((err) => {
    console.error('CRITICAL: Failed to query PostgreSQL Database on startup:', err.message);
  });

export default pool;
