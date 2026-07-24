import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, 'migrations', 'auth_2_0.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running Auth 2.0 migration...');
    await db.query(sql);
    console.log('Migration successful.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
