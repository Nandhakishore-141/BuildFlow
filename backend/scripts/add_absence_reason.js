import db from '../src/config/db.js';

async function migrate() {
  try {
    await db.query("ALTER TABLE attendance ADD COLUMN absence_reason TEXT NULL");
    console.log('Successfully added absence_reason column to attendance table');
  } catch (err) {
    if (err.message.includes('Duplicate column')) {
      console.log('absence_reason column already exists');
    } else {
      console.error('Migration error:', err.message);
    }
  }
  process.exit(0);
}

migrate();
