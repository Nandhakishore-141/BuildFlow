import db from '../src/config/db.js';

async function migrate() {
  try {
    await db.query("ALTER TABLE attendance ADD COLUMN worker_acceptance VARCHAR(50) DEFAULT 'Pending'");
    console.log('Successfully added worker_acceptance to attendance table');
  } catch (err) {
    if (err.message.includes('Duplicate column')) {
      console.log('worker_acceptance column already exists');
    } else {
      console.error('Migration error:', err.message);
    }
  }
  process.exit(0);
}

migrate();
