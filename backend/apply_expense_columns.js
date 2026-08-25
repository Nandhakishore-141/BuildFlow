import db from './src/config/db.js';

async function applyExpenseColumns() {
  try {
    console.log('Adding missing columns to expenses table...');
    
    await db.query(`
      ALTER TABLE expenses 
      ADD COLUMN IF NOT EXISTS title VARCHAR(150) NULL,
      ADD COLUMN IF NOT EXISTS vendor VARCHAR(150) NULL,
      ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(255) NULL;
    `);

    console.log('✅ Expenses table columns updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update expenses table columns:', err);
    process.exit(1);
  }
}

applyExpenseColumns();
