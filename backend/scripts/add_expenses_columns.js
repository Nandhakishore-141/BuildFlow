import db from '../src/config/db.js';

async function migrate() {
  const alterColumns = [
    "ALTER TABLE expenses ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Bank Transfer'",
    "ALTER TABLE expenses ADD COLUMN notes TEXT NULL"
  ];

  for (const sql of alterColumns) {
    try {
      await db.query(sql);
      console.log('Executed:', sql);
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('Column already exists');
      } else {
        console.error('Error altering expenses table:', err.message);
      }
    }
  }
  process.exit(0);
}

migrate();
