import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'constructiq'
});

async function runSchema() {
  try {
    const sql = fs.readFileSync('schema.sql', 'utf8');
    await pool.query(sql);
    console.log('Schema executed successfully.');
  } catch (error) {
    console.error('Error executing schema:', error);
  } finally {
    pool.end();
  }
}

runSchema();
