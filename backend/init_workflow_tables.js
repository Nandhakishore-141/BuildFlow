import db from './src/config/db.js';

async function initWorkflowTables() {
  try {
    console.log('Updating contractor_id column nullability & workflow tables...');

    await db.query(`
      ALTER TABLE projects ALTER COLUMN contractor_id DROP NOT NULL;
      ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'info';
      ALTER TABLE projects ALTER COLUMN status TYPE VARCHAR(100);
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS project_type VARCHAR(100) DEFAULT 'House',
      ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium',
      ADD COLUMN IF NOT EXISTS postal_code VARCHAR(50);
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS contractor_invitations (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        homeowner_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        contractor_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT unique_project_contractor_invitation UNIQUE (project_id, contractor_id)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS contractor_proposals (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        contractor_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        estimated_budget NUMERIC(15, 2) NOT NULL,
        estimated_duration VARCHAR(100) NOT NULL,
        cover_message TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_project_contractor_proposal UNIQUE (project_id, contractor_id)
      );
    `);

    console.log('✅ projects.contractor_id nullability & workflow tables updated successfully!');
  } catch (err) {
    console.error('❌ Error updating workflow tables:', err);
  }
}

initWorkflowTables();
