-- ConstructIQ Database Schema
-- Compatible with PostgreSQL

-- Drop tables if they exist to allow clean recreation
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS progress_updates CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS worker_invitations CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS worker_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS availability_status CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS invitation_status CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS material_status CASCADE;
DROP TYPE IF EXISTS expense_category CASCADE;
DROP TYPE IF EXISTS file_type_enum CASCADE;
DROP TYPE IF EXISTS approval_status_enum CASCADE;

-- Trigger function for automatic updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enums
CREATE TYPE user_role AS ENUM ('Contractor', 'Homeowner', 'Worker', 'Admin');
CREATE TYPE availability_status AS ENUM ('Available', 'Busy', 'Unavailable');
CREATE TYPE project_status AS ENUM ('Planning', 'In Progress', 'Suspended', 'Completed');
CREATE TYPE invitation_status AS ENUM ('Pending', 'Accepted', 'Rejected', 'Withdrawn');
CREATE TYPE task_status AS ENUM ('Todo', 'In Progress', 'Under Review', 'Completed');
CREATE TYPE material_status AS ENUM ('Ordered', 'Delivered', 'Consumed');
CREATE TYPE expense_category AS ENUM ('Labor', 'Materials', 'Equipment', 'Permits', 'Other');
CREATE TYPE file_type_enum AS ENUM ('Photo', 'Video');
CREATE TYPE approval_status_enum AS ENUM ('Pending', 'Approved', 'Rejected');

-- 1. Users Table
CREATE TABLE users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company_name VARCHAR(150) NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_token VARCHAR(255) NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 2. Worker Profiles Table
CREATE TABLE worker_profiles (
  user_id VARCHAR(36) NOT NULL PRIMARY KEY,
  skill VARCHAR(100) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  location VARCHAR(150) NOT NULL,
  availability availability_status NOT NULL DEFAULT 'Available',
  expected_daily_wage DECIMAL(10,2) NULL,
  about_me TEXT NULL,
  avatar_url VARCHAR(255) NULL,
  portfolio_url VARCHAR(255) NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_worker_profiles_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER set_timestamp_worker_profiles
BEFORE UPDATE ON worker_profiles
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 3. Projects Table
CREATE TABLE projects (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  contractor_id VARCHAR(36) NOT NULL,
  homeowner_id VARCHAR(36) NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  location VARCHAR(255) NOT NULL,
  status project_status NOT NULL DEFAULT 'Planning',
  start_date DATE NULL,
  end_date DATE NULL,
  budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_contractor FOREIGN KEY (contractor_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_projects_homeowner FOREIGN KEY (homeowner_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX idx_projects_contractor ON projects(contractor_id);
CREATE INDEX idx_projects_homeowner ON projects(homeowner_id);

CREATE TRIGGER set_timestamp_projects
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 4. Project Members Table
CREATE TABLE project_members (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  worker_id VARCHAR(36) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (project_id, worker_id),
  CONSTRAINT fk_project_members_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_project_members_worker FOREIGN KEY (worker_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Worker Invitations Table
CREATE TABLE worker_invitations (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  contractor_id VARCHAR(36) NOT NULL,
  worker_id VARCHAR(36) NOT NULL,
  status invitation_status NOT NULL DEFAULT 'Pending',
  message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_invitations_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_invitations_contractor FOREIGN KEY (contractor_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_invitations_worker FOREIGN KEY (worker_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_invitations_worker ON worker_invitations(worker_id);
CREATE INDEX idx_invitations_project ON worker_invitations(project_id);

CREATE TRIGGER set_timestamp_worker_invitations
BEFORE UPDATE ON worker_invitations
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 6. Tasks Table
CREATE TABLE tasks (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  assigned_worker_id VARCHAR(36) NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  status task_status NOT NULL DEFAULT 'Todo',
  due_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_worker FOREIGN KEY (assigned_worker_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_worker ON tasks(assigned_worker_id);

CREATE TRIGGER set_timestamp_tasks
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 7. Attendance Table
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  worker_id VARCHAR(36) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  clock_in TIMESTAMP NOT NULL,
  clock_out TIMESTAMP NULL,
  latitude_in DECIMAL(10,8) NOT NULL,
  longitude_in DECIMAL(11,8) NOT NULL,
  latitude_out DECIMAL(10,8) NULL,
  longitude_out DECIMAL(11,8) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_worker FOREIGN KEY (worker_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_attendance_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_attendance_worker_project ON attendance(worker_id, project_id);

-- 8. Materials Table
CREATE TABLE materials (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  name VARCHAR(150) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(20) NOT NULL,
  cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status material_status NOT NULL DEFAULT 'Ordered',
  supplier VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_materials_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_materials_project ON materials(project_id);

CREATE TRIGGER set_timestamp_materials
BEFORE UPDATE ON materials
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 9. Expenses Table
CREATE TABLE expenses (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  category expense_category NOT NULL,
  amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  logged_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_expenses_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_expenses_logger FOREIGN KEY (logged_by) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX idx_expenses_project ON expenses(project_id);

-- 10. Documents Table
CREATE TABLE documents (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_documents_uploader FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX idx_documents_project ON documents(project_id);

-- 11. Progress Updates Table
CREATE TABLE progress_updates (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  worker_id VARCHAR(36) NOT NULL,
  description TEXT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type file_type_enum NOT NULL DEFAULT 'Photo',
  approval_status approval_status_enum NOT NULL DEFAULT 'Pending',
  approved_by VARCHAR(36) NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_progress_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_worker FOREIGN KEY (worker_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_approver FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX idx_progress_project ON progress_updates(project_id);

CREATE TRIGGER set_timestamp_progress_updates
BEFORE UPDATE ON progress_updates
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 12. Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- 13. Refresh Tokens Table
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_tokens_user ON refresh_tokens(user_id);
