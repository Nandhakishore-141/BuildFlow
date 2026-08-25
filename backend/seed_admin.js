import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'constructiq',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function seedAdmin() {
  try {
    const id = uuidv4();
    const name = 'System Admin';
    const email = 'admin@constructiq.com';
    const password_hash = await bcrypt.hash('pass', 10);
    const role = 'Admin';
    const phone = '0000000000';
    const is_verified = true;

    // Check if admin already exists
    const checkQuery = `SELECT * FROM users WHERE email = $1`;
    const res = await pool.query(checkQuery, [email]);
    if (res.rows.length > 0) {
      console.log('Admin user already exists:', email);
      process.exit(0);
    }

    const insertQuery = `
      INSERT INTO users (id, name, email, password_hash, role, phone, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(insertQuery, [id, name, email, password_hash, role, phone, is_verified]);
    
    console.log('Successfully seeded admin user:');
    console.log(`Email: ${email}`);
    console.log(`Password: pass`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    pool.end();
  }
}

seedAdmin();
