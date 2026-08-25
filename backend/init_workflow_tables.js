import db from './src/config/db.js';

async function initWorkflowTables() {
  try {
    console.log('Updating material_status enum & workflow tables...');

    await db.query(`
      ALTER TYPE material_status ADD VALUE IF NOT EXISTS 'Pending';
      ALTER TYPE material_status ADD VALUE IF NOT EXISTS 'Available';
      ALTER TYPE material_status ADD VALUE IF NOT EXISTS 'Requested';
      ALTER TYPE material_status ADD VALUE IF NOT EXISTS 'Low Stock';
      ALTER TABLE projects ALTER COLUMN contractor_id DROP NOT NULL;
      ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'info';
      ALTER TABLE projects ALTER COLUMN status TYPE VARCHAR(100);
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS project_type VARCHAR(100) DEFAULT 'House',
      ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium',
      ADD COLUMN IF NOT EXISTS postal_code VARCHAR(50);
    `);

    console.log('✅ material_status enum updated successfully!');
  } catch (err) {
    console.error('❌ Error updating workflow tables:', err);
  }
}

initWorkflowTables();
