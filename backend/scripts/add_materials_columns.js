import db from '../src/config/db.js';

async function migrate() {
  const alterColumns = [
    "ALTER TABLE materials ADD COLUMN specifications TEXT NULL",
    "ALTER TABLE materials ADD COLUMN category VARCHAR(100) NULL",
    "ALTER TABLE materials ADD COLUMN notes TEXT NULL"
  ];

  for (const sql of alterColumns) {
    try {
      await db.query(sql);
      console.log('Executed:', sql);
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('Column already exists');
      } else {
        console.error('Error altering materials table:', err.message);
      }
    }
  }
  process.exit(0);
}

migrate();
