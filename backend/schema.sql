-- ============================================================================
-- ConstructIQ - Complete Database Schema & Seed Data
-- Compatible with MySQL Workbench (MySQL 8.0+) & PostgreSQL
-- Password for all accounts: pass (Bcrypt Hash: $2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m)
-- ============================================================================

-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS constructiq;
USE constructiq;

-- Disable foreign key checks for clean teardown and recreation
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop existing tables if they exist
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS daily_work_updates;
DROP TABLE IF EXISTS progress_updates;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS task_assignees;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS milestones;
DROP TABLE IF EXISTS contractor_proposals;
DROP TABLE IF EXISTS contractor_invitations;
DROP TABLE IF EXISTS worker_invitations;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS worker_profiles;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- TABLE CREATION (20 Professional Tables)
-- ============================================================================

-- 1. Users Table
CREATE TABLE users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company_name VARCHAR(150) NULL,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  verification_token VARCHAR(255) NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires TIMESTAMP NULL,
  provider VARCHAR(50) DEFAULT 'local',
  google_id VARCHAR(255) UNIQUE NULL,
  profile_photo VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Worker Profiles Table
CREATE TABLE worker_profiles (
  user_id VARCHAR(36) NOT NULL PRIMARY KEY,
  skill VARCHAR(100) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  location VARCHAR(150) NOT NULL,
  availability VARCHAR(50) NOT NULL DEFAULT 'Available',
  expected_daily_wage DECIMAL(10,2) NULL,
  about_me TEXT NULL,
  avatar_url VARCHAR(255) NULL,
  portfolio_url VARCHAR(255) NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Projects Table
CREATE TABLE projects (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_name VARCHAR(150) NOT NULL,
  project_code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NULL,
  project_type VARCHAR(100) DEFAULT 'House',
  priority VARCHAR(50) DEFAULT 'Medium',
  owner_id VARCHAR(36) NULL,
  contractor_id VARCHAR(36) NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'Planning',
  planned_start_date DATE NULL,
  planned_end_date DATE NULL,
  actual_start_date DATE NULL,
  actual_end_date DATE NULL,
  budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  address VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(50) NULL,
  latitude DECIMAL(10,8) NULL,
  longitude DECIMAL(11,8) NULL,
  completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prj_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_prj_contractor FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_projects_contractor (contractor_id),
  INDEX idx_projects_owner (owner_id),
  INDEX idx_projects_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Project Members Table
CREATE TABLE project_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  worker_id VARCHAR(36) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_project_worker (project_id, worker_id),
  CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pm_worker FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Worker Invitations Table
CREATE TABLE worker_invitations (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  contractor_id VARCHAR(36) NOT NULL,
  worker_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wi_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wi_contractor FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wi_worker FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_wi_worker (worker_id),
  INDEX idx_wi_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Contractor Invitations Table
CREATE TABLE contractor_invitations (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  homeowner_id VARCHAR(36) NOT NULL,
  contractor_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ci_project_contractor (project_id, contractor_id),
  CONSTRAINT fk_ci_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ci_homeowner FOREIGN KEY (homeowner_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ci_contractor FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Contractor Proposals Table
CREATE TABLE contractor_proposals (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  contractor_id VARCHAR(36) NOT NULL,
  estimated_budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  estimated_duration VARCHAR(100) NULL,
  cover_message TEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cp_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cp_contractor FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_cp_project (project_id),
  INDEX idx_cp_contractor (contractor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Milestones Table
CREATE TABLE milestones (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  due_date DATE NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_milestones_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_milestones_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tasks Table
CREATE TABLE tasks (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  assigned_worker_id VARCHAR(36) NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Todo',
  priority VARCHAR(50) DEFAULT 'Medium',
  due_date DATE NULL,
  estimated_duration VARCHAR(50) NULL,
  attachments TEXT NULL,
  milestone_id VARCHAR(36) NULL,
  review_status VARCHAR(50) NULL,
  contractor_comments TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_worker FOREIGN KEY (assigned_worker_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_tasks_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_tasks_project (project_id),
  INDEX idx_tasks_worker (assigned_worker_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Task Assignees Table
CREATE TABLE task_assignees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id VARCHAR(36) NOT NULL,
  worker_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_task_worker (task_id, worker_id),
  CONSTRAINT fk_ta_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ta_worker FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Attendance Table
CREATE TABLE attendance (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  worker_id VARCHAR(36) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'Present',
  clock_in TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  clock_out TIMESTAMP NULL,
  worker_acceptance VARCHAR(50) DEFAULT 'Pending',
  absence_reason TEXT NULL,
  latitude_in DECIMAL(10,8) DEFAULT 0.00,
  longitude_in DECIMAL(11,8) DEFAULT 0.00,
  latitude_out DECIMAL(10,8) NULL,
  longitude_out DECIMAL(11,8) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_worker FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_attendance_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_attendance_worker_project (worker_id, project_id),
  INDEX idx_attendance_clock_in (clock_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Materials Table
CREATE TABLE materials (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NULL,
  specifications TEXT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(20) NOT NULL DEFAULT 'Units',
  cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) NOT NULL DEFAULT 'Ordered',
  supplier VARCHAR(150) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_materials_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_materials_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Expenses Table
CREATE TABLE expenses (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  logged_by VARCHAR(36) NOT NULL,
  title VARCHAR(150) NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Other',
  amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  description TEXT NULL,
  date DATE NOT NULL,
  vendor VARCHAR(150) NULL,
  payment_method VARCHAR(50) DEFAULT 'Bank Transfer',
  receipt_url VARCHAR(255) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_expenses_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_expenses_logger FOREIGN KEY (logged_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_expenses_project (project_id),
  INDEX idx_expenses_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Documents Table
CREATE TABLE documents (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_documents_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_documents_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Progress Updates Table
CREATE TABLE progress_updates (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  worker_id VARCHAR(36) NOT NULL,
  description TEXT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL DEFAULT 'Photo',
  approval_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  approved_by VARCHAR(36) NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_progress_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_worker FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_approver FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_progress_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Daily Work Updates Table
CREATE TABLE daily_work_updates (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  author_id VARCHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL DEFAULT 'Daily Site Progress',
  content TEXT NOT NULL,
  file_url VARCHAR(255) NULL,
  file_type VARCHAR(50) DEFAULT 'Photo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dwu_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dwu_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_dwu_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Notifications Table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_notifications_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Refresh Tokens Table
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_tokens_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Announcements Table
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'Normal',
  target_role VARCHAR(50) NOT NULL DEFAULT 'Everyone',
  publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Audit Logs Table
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NULL,
  action VARCHAR(150) NOT NULL,
  details TEXT NULL,
  ip_address VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_audit_action (action),
  INDEX idx_audit_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SEED DATA (Comprehensive & Realistic Data for ConstructIQ)
-- Common Password for ALL users: 'pass'
-- Bcrypt Hash: $2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Users (Admin, Contractors, Homeowners, Workers)
-- ----------------------------------------------------------------------------

-- Admin (1)
INSERT INTO users (id, name, email, password_hash, role, phone, company_name, is_verified) VALUES
('usr-admin-0000000000000000000000001', 'System Admin', 'admin@constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Admin', '+91-9876543210', 'ConstructIQ Headquarters', true);

-- Contractors (5)
INSERT INTO users (id, name, email, password_hash, role, phone, company_name, is_verified) VALUES
('usr-cont-0000000000000000000000001', 'Alex Turner', 'contact@abcconstructions.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Contractor', '+91-9880011221', 'ABC Constructions Ltd', true),
('usr-cont-0000000000000000000000002', 'Marcus Vance', 'contact@skylinebuilders.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Contractor', '+91-9880011222', 'Skyline Builders & Developers', true),
('usr-cont-0000000000000000000000003', 'Elena Rostova', 'contact@greenstone.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Contractor', '+91-9880011223', 'GreenStone Infra Corp', true),
('usr-cont-0000000000000000000000004', 'Rajesh Verma', 'contact@primeinfra.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Contractor', '+91-9880011224', 'Prime Infrastructure Projects', true),
('usr-cont-0000000000000000000000005', 'Vikramaditya Rao', 'contact@elitestructures.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Contractor', '+91-9880011225', 'Elite Structures & Civil Eng', true);

-- Homeowners (10)
INSERT INTO users (id, name, email, password_hash, role, phone, company_name, is_verified) VALUES
('usr-home-0000000000000000000000001', 'Robert Taylor', 'robert.taylor@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022331', NULL, true),
('usr-home-0000000000000000000000002', 'Sarah Jenkins', 'sarah.jenkins@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022332', NULL, true),
('usr-home-0000000000000000000000003', 'David Miller', 'david.miller@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022333', NULL, true),
('usr-home-0000000000000000000000004', 'Emily Clark', 'emily.clark@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022334', NULL, true),
('usr-home-0000000000000000000000005', 'James Wilson', 'james.wilson@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022335', NULL, true),
('usr-home-0000000000000000000000006', 'Amanda Martinez', 'amanda.martinez@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022336', NULL, true),
('usr-home-0000000000000000000000007', 'Thomas Anderson', 'thomas.anderson@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022337', NULL, true),
('usr-home-0000000000000000000000008', 'Laura White', 'laura.white@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022338', NULL, true),
('usr-home-0000000000000000000000009', 'Daniel Harris', 'daniel.harris@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022339', NULL, true),
('usr-home-0000000000000000000000010', 'Sophia Martin', 'sophia.martin@example.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Homeowner', '+91-9770022340', NULL, true);

-- Workers (25)
INSERT INTO users (id, name, email, password_hash, role, phone, company_name, is_verified) VALUES
('usr-work-0000000000000000000000001', 'Arjun Sharma', 'arjun.sharma@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033401', NULL, true),
('usr-work-0000000000000000000000002', 'Bhavesh Patel', 'bhavesh.patel@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033402', NULL, true),
('usr-work-0000000000000000000000003', 'Chirag Verma', 'chirag.verma@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033403', NULL, true),
('usr-work-0000000000000000000000004', 'Dinesh Kumar', 'dinesh.kumar@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033404', NULL, true),
('usr-work-0000000000000000000000005', 'Eashwar Reddy', 'eashwar.reddy@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033405', NULL, true),
('usr-work-0000000000000000000000006', 'Farhan Khan', 'farhan.khan@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033406', NULL, true),
('usr-work-0000000000000000000000007', 'Girish Nair', 'girish.nair@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033407', NULL, true),
('usr-work-0000000000000000000000008', 'Harish Rao', 'harish.rao@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033408', NULL, true),
('usr-work-0000000000000000000000009', 'Imran Shaikh', 'imran.shaikh@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033409', NULL, true),
('usr-work-0000000000000000000000010', 'Jatin Joshi', 'jatin.joshi@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033410', NULL, true),
('usr-work-0000000000000000000000011', 'Karthik Sundaram', 'karthik.sundaram@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033411', NULL, true),
('usr-work-0000000000000000000000012', 'Lokesh Yadav', 'lokesh.yadav@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033412', NULL, true),
('usr-work-0000000000000000000000013', 'Manish Gupta', 'manish.gupta@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033413', NULL, true),
('usr-work-0000000000000000000000014', 'Naveen Kumar', 'naveen.kumar@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033414', NULL, true),
('usr-work-0000000000000000000000015', 'Omkar Patil', 'omkar.patil@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033415', NULL, true),
('usr-work-0000000000000000000000016', 'Pankaj Singh', 'pankaj.singh@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033416', NULL, true),
('usr-work-0000000000000000000000017', 'Qasim Ali', 'qasim.ali@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033417', NULL, true),
('usr-work-0000000000000000000000018', 'Ramesh Choudhary', 'ramesh.choudhary@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033418', NULL, true),
('usr-work-0000000000000000000000019', 'Suresh Gowda', 'suresh.gowda@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033419', NULL, true),
('usr-work-0000000000000000000000020', 'Tufail Ahmed', 'tufail.ahmed@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033420', NULL, true),
('usr-work-0000000000000000000000021', 'Umesh Solanki', 'umesh.solanki@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033421', NULL, true),
('usr-work-0000000000000000000000022', 'Vikram Deshmukh', 'vikram.deshmukh@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033422', NULL, true),
('usr-work-0000000000000000000000023', 'Wasim Akram', 'wasim.akram@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033423', NULL, true),
('usr-work-0000000000000000000000024', 'Yogesh Thanvi', 'yogesh.thanvi@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033424', NULL, true),
('usr-work-0000000000000000000000025', 'Zubair Hussain', 'zubair.hussain@worker.constructiq.com', '$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m', 'Worker', '+91-9660033425', NULL, true);

-- ----------------------------------------------------------------------------
-- 2. Worker Profiles (25 Profiles)
-- ----------------------------------------------------------------------------
INSERT INTO worker_profiles (user_id, skill, experience, location, availability, expected_daily_wage, about_me, avatar_url, rating) VALUES
('usr-work-0000000000000000000000001', 'Mason', '8 Years', 'Mumbai', 'Available', 950.00, 'Specialist in brickwork, AAC block masonry, and structural concrete casting.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 4.90),
('usr-work-0000000000000000000000002', 'Mason', '12 Years', 'Ahmedabad', 'Busy', 1100.00, 'Master mason for structural columns, arch building, and decorative stone facades.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 4.80),
('usr-work-0000000000000000000000003', 'Mason', '5 Years', 'Delhi', 'Available', 850.00, 'Experienced in wall plastering, cement screed, and block masonry.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 4.70),
('usr-work-0000000000000000000000004', 'Carpenter', '7 Years', 'Bangalore', 'Available', 1000.00, 'Skilled in shuttering, formwork, and interior wooden framing.', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 4.85),
('usr-work-0000000000000000000000005', 'Carpenter', '10 Years', 'Hyderabad', 'Busy', 1200.00, 'Expert carpenter for roof trusses, modular cabinetry, and doors.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 4.95),
('usr-work-0000000000000000000000006', 'Carpenter', '4 Years', 'Pune', 'Available', 800.00, 'Specialize in concrete formwork shuttering and scaffolding erection.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 4.60),
('usr-work-0000000000000000000000007', 'Electrician', '9 Years', 'Kochi', 'Available', 1150.00, 'Licensed industrial electrician for 3-phase wiring and DB panel setup.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 4.90),
('usr-work-0000000000000000000000008', 'Electrician', '6 Years', 'Chennai', 'Busy', 950.00, 'Residential and commercial conduit piping and light fixture fitting.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 4.75),
('usr-work-0000000000000000000000009', 'Electrician', '11 Years', 'Mumbai', 'Available', 1300.00, 'High-voltage wiring, earthing pits, and solar inverter installations.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 5.00),
('usr-work-0000000000000000000000010', 'Plumber', '8 Years', 'Delhi', 'Available', 1050.00, 'Sanitary fittings, CPVC/UPVC pipe laying, and drainage systems.', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150', 4.80),
('usr-work-0000000000000000000000011', 'Plumber', '5 Years', 'Bangalore', 'Available', 900.00, 'Bathroom plumbing, overhead tank connections, and leak repairs.', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', 4.65),
('usr-work-0000000000000000000000012', 'Plumber', '14 Years', 'Jaipur', 'Busy', 1250.00, 'Master plumber for high-rise residential plumbing networks.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 4.95),
('usr-work-0000000000000000000000013', 'Painter', '6 Years', 'Kolkata', 'Available', 850.00, 'Interior texture painting, primer coats, and putty applications.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 4.70),
('usr-work-0000000000000000000000014', 'Painter', '9 Years', 'Hyderabad', 'Available', 950.00, 'Exterior weather-proof coating, spray painting, and waterproofing.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 4.85),
('usr-work-0000000000000000000000015', 'Painter', '4 Years', 'Pune', 'Available', 750.00, 'Wall sanding, wood polishing, and enamel painting coats.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 4.50),
('usr-work-0000000000000000000000016', 'Welder', '8 Years', 'Nagpur', 'Busy', 1100.00, 'ARC and MIG welding for structural steel beams and trusses.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 4.80),
('usr-work-0000000000000000000000017', 'Welder', '10 Years', 'Lucknow', 'Available', 1200.00, 'Certified welder for pressure pipes and heavy steel frame fabrications.', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 4.90),
('usr-work-0000000000000000000000018', 'Steel Fixer', '7 Years', 'Indore', 'Available', 950.00, 'Rebar bending, column cage tying, and slab mesh reinforcement.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 4.75),
('usr-work-0000000000000000000000019', 'Steel Fixer', '11 Years', 'Bangalore', 'Available', 1150.00, 'Beam rebar fabrication and heavy structural steel binding.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 4.92),
('usr-work-0000000000000000000000020', 'Steel Fixer', '5 Years', 'Surat', 'Busy', 900.00, 'Foundation rebar placement and footing rebar binding.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 4.60),
('usr-work-0000000000000000000000021', 'Tile Worker', '8 Years', 'Ahmedabad', 'Available', 1050.00, 'Vitrified tile laying, marble flooring, and wall tile cladding.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 4.85),
('usr-work-0000000000000000000000022', 'Tile Worker', '6 Years', 'Mumbai', 'Available', 950.00, 'Granite counter fitting, precision tile cutting, and grouting.', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150', 4.70),
('usr-work-0000000000000000000000023', 'Helper', '3 Years', 'Kanpur', 'Available', 650.00, 'General site assistance, material handling, and site cleanup.', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', 4.55),
('usr-work-0000000000000000000000024', 'Helper', '4 Years', 'Jodhpur', 'Available', 700.00, 'Concrete mixing assistance, brick carrying, and excavation support.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 4.65),
('usr-work-0000000000000000000000025', 'Helper', '2 Years', 'Bhopal', 'Available', 600.00, 'Helper for plumbing, electrical conduit pulling, and loading.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 4.50);

-- ----------------------------------------------------------------------------
-- 3. Projects (15 Diverse Projects)
-- ----------------------------------------------------------------------------
INSERT INTO projects (
  id, project_name, project_code, description, project_type, priority, owner_id, contractor_id, 
  status, planned_start_date, planned_end_date, budget, address, city, state, country, 
  latitude, longitude, completion_percentage
) VALUES
('prj-00000000000000000000000000000001', 'Green Valley Villas', 'PRJ-GVV-001', 'Luxury 4BHK gated community villas with solar amenities and clubhouse.', 'Villa', 'High', 'usr-home-0000000000000000000000001', 'usr-cont-0000000000000000000000001', 'In Progress', '2024-01-15', '2024-11-30', 45000000.00, 'Plot 42, Green Valley Enclave', 'Bangalore', 'Karnataka', 'India', 12.97160000, 77.59460000, 45.00),
('prj-00000000000000000000000000000002', 'Sky Heights Apartments', 'PRJ-SHA-002', 'Modern 18-storey residential tower with underground parking and sky lounge.', 'Apartment', 'High', 'usr-home-0000000000000000000000002', 'usr-cont-0000000000000000000000002', 'In Progress', '2023-09-01', '2024-12-15', 120000000.00, 'Sector 15, Sea Breeze Road', 'Mumbai', 'Maharashtra', 'India', 19.07600000, 72.87770000, 68.00),
('prj-00000000000000000000000000000003', 'Sunrise Residency', 'PRJ-SRR-003', 'Affordable urban housing complex with 120 2BHK apartments.', 'Apartment', 'Medium', 'usr-home-0000000000000000000000003', 'usr-cont-0000000000000000000000003', 'Completed', '2023-03-10', '2024-04-20', 85000000.00, 'Kothrud Bypass Road', 'Pune', 'Maharashtra', 'India', 18.52040000, 73.85670000, 100.00),
('prj-00000000000000000000000000000004', 'Metro Mall Extension', 'PRJ-MME-004', 'Commercial retail extension featuring multiplex theaters and food court.', 'Commercial', 'High', 'usr-home-0000000000000000000000004', 'usr-cont-0000000000000000000000004', 'In Progress', '2024-02-01', '2025-03-31', 150000000.00, 'Ring Road Hub', 'Delhi', 'Delhi', 'India', 28.70410000, 77.10250000, 30.00),
('prj-00000000000000000000000000000005', 'Tech Park Phase II', 'PRJ-TPP-005', 'State-of-the-art IT park building with LEED Gold certification.', 'Commercial', 'Medium', 'usr-home-0000000000000000000000005', 'usr-cont-0000000000000000000000005', 'Planning', '2024-09-01', '2026-02-28', 220000000.00, 'Hitec City Phase 2', 'Hyderabad', 'Telangana', 'India', 17.38500000, 78.48670000, 5.00),
('prj-00000000000000000000000000000006', 'City Hospital Expansion', 'PRJ-CHE-006', 'New 200-bed super specialty wing with ICUs and modular operation theaters.', 'Hospital', 'High', 'usr-home-0000000000000000000000006', 'usr-cont-0000000000000000000000001', 'In Progress', '2023-11-15', '2025-01-30', 185000000.00, 'OMR IT Highway', 'Chennai', 'Tamil Nadu', 'India', 13.08270000, 80.27070000, 52.00),
('prj-00000000000000000000000000000007', 'Riverfront Towers', 'PRJ-RFT-007', 'Waterfront twin residential towers with private marina and infinity pool.', 'Apartment', 'Low', 'usr-home-0000000000000000000000007', 'usr-cont-0000000000000000000000002', 'Suspended', '2023-10-01', '2025-05-15', 90000000.00, 'Hooghly Embankment Way', 'Kolkata', 'West Bengal', 'India', 22.57260000, 88.36390000, 25.00),
('prj-00000000000000000000000000000008', 'Lakeside Enclave', 'PRJ-LSE-008', 'Premium eco-friendly duplex homes overlooking Kankaria lake.', 'House', 'Medium', 'usr-home-0000000000000000000000008', 'usr-cont-0000000000000000000000003', 'In Progress', '2023-08-01', '2024-10-15', 62000000.00, 'Lakeside Promenade', 'Ahmedabad', 'Gujarat', 'India', 23.02250000, 72.57140000, 75.00),
('prj-00000000000000000000000000000009', 'Pinnacle Commercial Hub', 'PRJ-PCH-009', 'Grade-A office space complex with smart building automation.', 'Commercial', 'High', 'usr-home-0000000000000000000000009', 'usr-cont-0000000000000000000000004', 'Completed', '2023-01-15', '2024-02-28', 140000000.00, 'Golf Course Extension', 'Gurgaon', 'Haryana', 'India', 28.45950000, 77.02660000, 100.00),
('prj-00000000000000000000000000000010', 'Oakwood Estates', 'PRJ-OWE-010', 'Luxury suburban gated community with private garden plots.', 'Villa', 'Medium', 'usr-home-0000000000000000000000010', 'usr-cont-0000000000000000000000005', 'Planning', '2024-08-15', '2025-09-30', 78000000.00, 'Tonk Road Corridor', 'Jaipur', 'Rajasthan', 'India', 26.91240000, 75.78730000, 10.00),
('prj-00000000000000000000000000000011', 'Central Elevated Flyover', 'PRJ-CFB-011', '4-lane elevated city corridor overpass to ease traffic congestion.', 'Infrastructure', 'High', 'usr-home-0000000000000000000000001', 'usr-cont-0000000000000000000000001', 'In Progress', '2023-12-01', '2025-06-30', 250000000.00, 'Hazratganj Main Junction', 'Lucknow', 'Uttar Pradesh', 'India', 26.84670000, 80.94620000, 40.00),
('prj-00000000000000000000000000000012', 'Grand Horizon Convention Center', 'PRJ-GCC-012', '5,000 capacity international exhibition center and auditorium.', 'Commercial', 'Medium', 'usr-home-0000000000000000000000002', 'usr-cont-0000000000000000000000002', 'Planning', '2024-10-01', '2026-08-31', 300000000.00, 'Expressway Sector 128', 'Noida', 'Uttar Pradesh', 'India', 28.53550000, 77.39100000, 0.00),
('prj-00000000000000000000000000000013', 'Royal Palms Gated Community', 'PRJ-RPG-013', 'Exclusive 40-villa community with underground electrical lines and STP.', 'Villa', 'High', 'usr-home-0000000000000000000000003', 'usr-cont-0000000000000000000000003', 'In Progress', '2023-05-01', '2024-09-30', 110000000.00, 'Dumas Road', 'Surat', 'Gujarat', 'India', 21.17020000, 72.83110000, 82.00),
('prj-00000000000000000000000000000014', 'Urban Square Retail Hub', 'PRJ-USR-014', 'Open-air pedestrian shopping plaza and food street.', 'Commercial', 'Medium', 'usr-home-0000000000000000000000004', 'usr-cont-0000000000000000000000004', 'Completed', '2022-11-01', '2023-12-15', 165000000.00, 'Sector 17 Plaza', 'Chandigarh', 'Punjab', 'India', 30.73330000, 76.77940000, 100.00),
('prj-00000000000000000000000000000015', 'Heritage Manor Restoration', 'PRJ-HMR-015', 'Restoration and structural strengthening of a 100-year-old heritage mansion.', 'Heritage', 'Medium', 'usr-home-0000000000000000000000005', 'usr-cont-0000000000000000000000005', 'Suspended', '2023-07-15', '2024-11-15', 55000000.00, 'Fort Kochi Heritage Zone', 'Kochi', 'Kerala', 'India', 9.93120000, 76.26730000, 35.00);

-- ----------------------------------------------------------------------------
-- 4. Project Members (Assigning Workers to Projects)
-- ----------------------------------------------------------------------------
INSERT INTO project_members (project_id, worker_id) VALUES
('prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000001'),
('prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000004'),
('prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000007'),
('prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000010'),
('prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000018'),
('prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000023'),

('prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000002'),
('prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000005'),
('prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000009'),
('prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000012'),
('prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000016'),
('prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000021'),

('prj-00000000000000000000000000000003', 'usr-work-0000000000000000000000003'),
('prj-00000000000000000000000000000003', 'usr-work-0000000000000000000000006'),
('prj-00000000000000000000000000000003', 'usr-work-0000000000000000000000013'),
('prj-00000000000000000000000000000003', 'usr-work-0000000000000000000000024'),

('prj-00000000000000000000000000000004', 'usr-work-0000000000000000000000008'),
('prj-00000000000000000000000000000004', 'usr-work-0000000000000000000000011'),
('prj-00000000000000000000000000000004', 'usr-work-0000000000000000000000017'),
('prj-00000000000000000000000000000004', 'usr-work-0000000000000000000000019'),

('prj-00000000000000000000000000000006', 'usr-work-0000000000000000000000001'),
('prj-00000000000000000000000000000006', 'usr-work-0000000000000000000000007'),
('prj-00000000000000000000000000000006', 'usr-work-0000000000000000000000014'),
('prj-00000000000000000000000000000006', 'usr-work-0000000000000000000000022'),

('prj-00000000000000000000000000000008', 'usr-work-0000000000000000000000002'),
('prj-00000000000000000000000000000008', 'usr-work-0000000000000000000000010'),
('prj-00000000000000000000000000000008', 'usr-work-0000000000000000000000015'),
('prj-00000000000000000000000000000008', 'usr-work-0000000000000000000000025'),

('prj-00000000000000000000000000000011', 'usr-work-0000000000000000000000004'),
('prj-00000000000000000000000000000011', 'usr-work-0000000000000000000000016'),
('prj-00000000000000000000000000000011', 'usr-work-0000000000000000000000018'),

('prj-00000000000000000000000000000013', 'usr-work-0000000000000000000000005'),
('prj-00000000000000000000000000000013', 'usr-work-0000000000000000000000020'),
('prj-00000000000000000000000000000013', 'usr-work-0000000000000000000000021');

-- ----------------------------------------------------------------------------
-- 5. Worker Invitations
-- ----------------------------------------------------------------------------
INSERT INTO worker_invitations (id, project_id, contractor_id, worker_id, status, message) VALUES
('inv-w-000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'usr-work-0000000000000000000000001', 'Accepted', 'Invitation to join Green Valley Villas construction team.'),
('inv-w-000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'usr-work-0000000000000000000000004', 'Accepted', 'Invitation to join Green Valley Villas construction team.'),
('inv-w-000000000000000000000000000003', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'usr-work-0000000000000000000000007', 'Accepted', 'Invitation to join Green Valley Villas construction team.'),
('inv-w-000000000000000000000000000004', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'usr-work-0000000000000000000000015', 'Pending', 'Urgent requirement for painting specialist on site.'),
('inv-w-000000000000000000000000000005', 'prj-00000000000000000000000000000002', 'usr-cont-0000000000000000000000002', 'usr-work-0000000000000000000000002', 'Accepted', 'High-rise residential masonry work team invitation.'),
('inv-w-000000000000000000000000000006', 'prj-00000000000000000000000000000002', 'usr-cont-0000000000000000000000002', 'usr-work-0000000000000000000000017', 'Pending', 'Welding and structural truss joining invitation.');

-- ----------------------------------------------------------------------------
-- 6. Contractor Invitations
-- ----------------------------------------------------------------------------
INSERT INTO contractor_invitations (id, project_id, homeowner_id, contractor_id, status) VALUES
('inv-c-000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'usr-home-0000000000000000000000001', 'usr-cont-0000000000000000000000001', 'accepted'),
('inv-c-000000000000000000000000000002', 'prj-00000000000000000000000000000002', 'usr-home-0000000000000000000000002', 'usr-cont-0000000000000000000000002', 'accepted'),
('inv-c-000000000000000000000000000003', 'prj-00000000000000000000000000000005', 'usr-home-0000000000000000000000005', 'usr-cont-0000000000000000000000005', 'pending'),
('inv-c-000000000000000000000000000004', 'prj-00000000000000000000000000000010', 'usr-home-0000000000000000000000010', 'usr-cont-0000000000000000000000004', 'pending');

-- ----------------------------------------------------------------------------
-- 7. Contractor Proposals
-- ----------------------------------------------------------------------------
INSERT INTO contractor_proposals (id, project_id, contractor_id, estimated_budget, estimated_duration, cover_message, status) VALUES
('prp-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 45000000.00, '10 Months', 'Complete turnkey construction with premium materials and certified supervisors.', 'accepted'),
('prp-00000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000002', 48000000.00, '12 Months', 'High quality villa building proposal with warranty on waterproofing.', 'rejected'),
('prp-00000000000000000000000000000003', 'prj-00000000000000000000000000000005', 'usr-cont-0000000000000000000000003', 215000000.00, '18 Months', 'LEED certified green building construction with pre-engineered structural steel.', 'pending'),
('prp-00000000000000000000000000000004', 'prj-00000000000000000000000000000010', 'usr-cont-0000000000000000000000005', 76000000.00, '14 Months', 'Specialized suburban villa construction with landscape architecture integration.', 'pending');

-- ----------------------------------------------------------------------------
-- 8. Milestones
-- ----------------------------------------------------------------------------
INSERT INTO milestones (id, project_id, name, description, due_date, status) VALUES
('mls-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'Foundation & Substructure', 'Site excavation, PCC leveling, footing rebar and foundation casting.', '2024-03-31', 'Completed'),
('mls-00000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'RCC Superstructure Frame', 'Ground & First floor column casting, beam shuttering and roof slab pouring.', '2024-06-30', 'Completed'),
('mls-00000000000000000000000000000003', 'prj-00000000000000000000000000000001', 'Brickwork & MEP Rough-In', 'Exterior/interior AAC block masonry, electrical conduits and plumbing risers.', '2024-08-31', 'In Progress'),
('mls-00000000000000000000000000000004', 'prj-00000000000000000000000000000001', 'Finishes & Handover', 'Plastering, flooring tiles, internal painting, fixtures and occupancy certification.', '2024-11-30', 'Pending'),
('mls-00000000000000000000000000000005', 'prj-00000000000000000000000000000002', 'Basement & Retaining Wall', '2-level basement excavation and RCC retaining diaphragm wall.', '2023-12-31', 'Completed'),
('mls-00000000000000000000000000000006', 'prj-00000000000000000000000000000002', 'Tower RCC Slabs (1 to 18)', 'High rise structural casting of floor slabs and shear core walls.', '2024-08-31', 'In Progress'),
('mls-00000000000000000000000000000007', 'prj-00000000000000000000000000000002', 'Facade Glass & Elevation', 'Double glazed facade installation and exterior architectural lighting.', '2024-11-15', 'Pending');

-- ----------------------------------------------------------------------------
-- 9. Tasks
-- ----------------------------------------------------------------------------
INSERT INTO tasks (
  id, project_id, assigned_worker_id, title, description, status, priority, due_date, 
  estimated_duration, attachments, milestone_id
) VALUES
('tsk-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000001', 'Site Layout & Foundation Excavation', 'Mark boundaries with theodolite and excavate footing trenches to 2.5m depth.', 'Completed', 'High', '2024-02-15', '20 Days', NULL, 'mls-00000000000000000000000000000001'),
('tsk-00000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000018', 'Foundation Rebar & Footing Casting', 'Tie 16mm/12mm Fe500D rebar cages and pour M25 ready-mix concrete.', 'Completed', 'High', '2024-03-25', '18 Days', NULL, 'mls-00000000000000000000000000000001'),
('tsk-00000000000000000000000000000003', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000004', 'Ground Floor Column Shuttering & Casting', 'Set ply formwork shuttering with props and cast 12 structural columns.', 'Completed', 'High', '2024-05-10', '15 Days', NULL, 'mls-00000000000000000000000000000002'),
('tsk-00000000000000000000000000000004', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000007', 'Main Electrical Conduit Piping', 'Install heavy duty FRLS conduit pipes and junction boxes inside wall chases.', 'In Progress', 'Medium', '2024-08-20', '10 Days', NULL, 'mls-00000000000000000000000000000003'),
('tsk-00000000000000000000000000000005', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000010', 'Plumbing Riser Pipe Connections', 'Run CPVC water supply lines and UPVC drainage soil pipes to overhead tank.', 'In Progress', 'High', '2024-08-28', '12 Days', NULL, 'mls-00000000000000000000000000000003'),
('tsk-00000000000000000000000000000006', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000001', 'Exterior Brick Masonry Block A', 'Lay AAC blocks with high tensile polymer mortar up to roof slab height.', 'Todo', 'Medium', '2024-09-15', '14 Days', NULL, 'mls-00000000000000000000000000000003'),
('tsk-00000000000000000000000000000007', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000004', 'Door Frame & Window Shutter Fixing', 'Fix teak wood door frames and aluminum window sub-frames.', 'Todo', 'Medium', '2024-10-10', '10 Days', NULL, 'mls-00000000000000000000000000000004'),
('tsk-00000000000000000000000000000008', 'prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000002', '14th Floor Slab Rebar Reinforcement', 'Lay slab bottom mesh and tie stirrups for main structural transfer girders.', 'In Progress', 'High', '2024-08-25', '8 Days', NULL, 'mls-00000000000000000000000000000006'),
('tsk-00000000000000000000000000000009', 'prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000009', '3-Phase Busbar Trunking Installation', 'Install copper busbar riser in main electrical shaft from LT panel.', 'In Progress', 'High', '2024-09-05', '14 Days', NULL, 'mls-00000000000000000000000000000006');

-- ----------------------------------------------------------------------------
-- 10. Task Assignees
-- ----------------------------------------------------------------------------
INSERT INTO task_assignees (task_id, worker_id) VALUES
('tsk-00000000000000000000000000000001', 'usr-work-0000000000000000000000001'),
('tsk-00000000000000000000000000000002', 'usr-work-0000000000000000000000018'),
('tsk-00000000000000000000000000000003', 'usr-work-0000000000000000000000004'),
('tsk-00000000000000000000000000000004', 'usr-work-0000000000000000000000007'),
('tsk-00000000000000000000000000000005', 'usr-work-0000000000000000000000010'),
('tsk-00000000000000000000000000000006', 'usr-work-0000000000000000000000001'),
('tsk-00000000000000000000000000000007', 'usr-work-0000000000000000000000004'),
('tsk-00000000000000000000000000000008', 'usr-work-0000000000000000000000002'),
('tsk-00000000000000000000000000000009', 'usr-work-0000000000000000000000009');

-- ----------------------------------------------------------------------------
-- 11. Attendance
-- ----------------------------------------------------------------------------
INSERT INTO attendance (
  id, worker_id, project_id, status, clock_in, clock_out, latitude_in, longitude_in, latitude_out, longitude_out
) VALUES
('att-00000000000000000000000000000001', 'usr-work-0000000000000000000000001', 'prj-00000000000000000000000000000001', 'Present', '2024-08-25 08:30:00', '2024-08-25 17:30:00', 12.97160000, 77.59460000, 12.97160000, 77.59460000),
('att-00000000000000000000000000000002', 'usr-work-0000000000000000000000004', 'prj-00000000000000000000000000000001', 'Present', '2024-08-25 08:45:00', '2024-08-25 17:35:00', 12.97161000, 77.59461000, 12.97161000, 77.59461000),
('att-00000000000000000000000000000003', 'usr-work-0000000000000000000000007', 'prj-00000000000000000000000000000001', 'Present', '2024-08-25 09:00:00', '2024-08-25 18:00:00', 12.97162000, 77.59462000, 12.97162000, 77.59462000),
('att-00000000000000000000000000000004', 'usr-work-0000000000000000000000010', 'prj-00000000000000000000000000000001', 'Present', '2024-08-25 08:35:00', '2024-08-25 17:40:00', 12.97163000, 77.59463000, 12.97163000, 77.59463000),
('att-00000000000000000000000000000005', 'usr-work-0000000000000000000000002', 'prj-00000000000000000000000000000002', 'Present', '2024-08-25 08:15:00', '2024-08-25 17:15:00', 19.07600000, 72.87770000, 19.07600000, 72.87770000),
('att-00000000000000000000000000000006', 'usr-work-0000000000000000000000009', 'prj-00000000000000000000000000000002', 'Present', '2024-08-25 08:40:00', '2024-08-25 17:45:00', 19.07601000, 72.87771000, 19.07601000, 72.87771000),
('att-00000000000000000000000000000007', 'usr-work-0000000000000000000000012', 'prj-00000000000000000000000000000002', 'Present', '2024-08-25 08:50:00', '2024-08-25 17:50:00', 19.07602000, 72.87772000, 19.07602000, 72.87772000);

-- ----------------------------------------------------------------------------
-- 12. Materials (Inventory & Procurement)
-- ----------------------------------------------------------------------------
INSERT INTO materials (id, project_id, name, quantity, unit, cost_per_unit, status, supplier) VALUES
('mat-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'UltraTech 53 Grade Portland Cement', 850.00, 'Bags', 410.00, 'Delivered', 'UltraTech Direct Depot'),
('mat-00000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'TMT Steel Rebar (16mm Fe500D)', 25.00, 'Tons', 58500.00, 'Delivered', 'Jindal Steel & Power'),
('mat-00000000000000000000000000000003', 'prj-00000000000000000000000000000001', 'AAC Lightweight Blocks (600x200x150)', 4500.00, 'Pieces', 64.00, 'Available', 'Magicrete Building Solutions'),
('mat-00000000000000000000000000000004', 'prj-00000000000000000000000000000001', 'Filtered River Sand (Class A)', 1200.00, 'Cu.Ft', 68.00, 'Consumed', 'South Rivers Sand Co'),
('mat-00000000000000000000000000000005', 'prj-00000000000000000000000000000001', 'Finolex FRLS Copper Wire (2.5 sq mm)', 40.00, 'Rolls', 2650.00, 'Ordered', 'Finolex Regional Depot'),
('mat-00000000000000000000000000000006', 'prj-00000000000000000000000000000001', 'Supreme Schedule 80 CPVC Pipes (1 inch)', 180.00, 'Meters', 210.00, 'Ordered', 'Supreme Industries Ltd'),
('mat-00000000000000000000000000000007', 'prj-00000000000000000000000000000002', 'Ready Mix Concrete M35 Grade', 450.00, 'Cu.M', 4600.00, 'Delivered', 'ACC Concrete Plants'),
('mat-00000000000000000000000000000008', 'prj-00000000000000000000000000000002', 'High Tensile Structural Rebar (25mm)', 65.00, 'Tons', 61000.00, 'Delivered', 'Tata Tiscon Steel'),
('mat-00000000000000000000000000000009', 'prj-00000000000000000000000000000002', 'Vitrified Double Charge Floor Tiles (4x2)', 1500.00, 'Boxes', 1250.00, 'Ordered', 'Kajaria Ceramics Ltd');

-- ----------------------------------------------------------------------------
-- 13. Expenses
-- ----------------------------------------------------------------------------
INSERT INTO expenses (
  id, project_id, logged_by, title, category, amount, description, date, vendor, receipt_url
) VALUES
('exp-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'Bulk Cement Procurement Phase 1', 'Materials', 348500.00, '850 bags of UltraTech 53 grade cement for foundation and column casting.', '2024-02-10', 'UltraTech Direct Depot', 'https://constructiq.io/receipts/inv-8812.pdf'),
('exp-00000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'Fe500D TMT Steel Rebar Supply', 'Materials', 1462500.00, '25 metric tons of 16mm & 12mm TMT steel for structural framing.', '2024-02-18', 'Jindal Steel & Power', 'https://constructiq.io/receipts/inv-8819.pdf'),
('exp-00000000000000000000000000000003', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'Weekly Mason & Rebar Labor Wages', 'Labor', 98000.00, 'Weekly wage payout for 6 master masons and 4 steel fixers.', '2024-08-18', 'Site Labor Registry', NULL),
('exp-00000000000000000000000000000004', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'JCB Excavator & Dump Truck Hire', 'Equipment', 125000.00, 'Monthly rental and diesel charges for earthmoving excavator.', '2024-03-01', 'Apex Heavy Equipment', 'https://constructiq.io/receipts/jcb-339.pdf'),
('exp-00000000000000000000000000000005', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'Municipal Plan Sanction Fee', 'Permits', 65000.00, 'BBMP building plan approval and commencement certificate fee.', '2024-01-20', 'Municipal Corporation', 'https://constructiq.io/receipts/bbmp-sanction.pdf'),
('exp-00000000000000000000000000000006', 'prj-00000000000000000000000000000002', 'usr-cont-0000000000000000000000002', 'Tower Crane Monthly Lease', 'Equipment', 280000.00, 'Tower crane operation, certified crane operator and maintenance.', '2024-04-15', 'Potain Cranes India', 'https://constructiq.io/receipts/crane-441.pdf'),
('exp-00000000000000000000000000000007', 'prj-00000000000000000000000000000002', 'usr-cont-0000000000000000000000002', 'RMC Concrete Pouring Slab 12', 'Materials', 820000.00, 'M35 ready mix concrete delivery with boom placer pump.', '2024-07-22', 'ACC Concrete Ltd', 'https://constructiq.io/receipts/rmc-889.pdf');

-- ----------------------------------------------------------------------------
-- 14. Documents (Contracts, Blueprints, Permits, Invoices)
-- ----------------------------------------------------------------------------
INSERT INTO documents (id, project_id, title, file_url, file_type, uploaded_by) VALUES
('doc-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'Master Construction Contract Agreement.pdf', 'https://constructiq.io/docs/contracts/master-contract-gvv.pdf', 'Contract', 'usr-cont-0000000000000000000000001'),
('doc-00000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'Architectural Floor Plan Blueprint Rev 3.pdf', 'https://constructiq.io/docs/blueprints/floorplan-rev3.pdf', 'Blueprint', 'usr-cont-0000000000000000000000001'),
('doc-00000000000000000000000000000003', 'prj-00000000000000000000000000000001', 'Municipal Building Sanction & Fire NOC.pdf', 'https://constructiq.io/docs/permits/bbmp-fire-noc.pdf', 'Permit', 'usr-cont-0000000000000000000000001'),
('doc-00000000000000000000000000000004', 'prj-00000000000000000000000000000001', 'Structural Soil Test & Geotechnical Report.pdf', 'https://constructiq.io/docs/reports/soil-test-report.pdf', 'Safety Report', 'usr-cont-0000000000000000000000001'),
('doc-00000000000000000000000000000005', 'prj-00000000000000000000000000000002', 'High-Rise Structural Engineering Blueprint Rev 5.pdf', 'https://constructiq.io/docs/blueprints/sky-heights-r5.pdf', 'Blueprint', 'usr-cont-0000000000000000000000002');

-- ----------------------------------------------------------------------------
-- 15. Progress Updates
-- ----------------------------------------------------------------------------
INSERT INTO progress_updates (
  id, project_id, worker_id, description, file_url, file_type, approval_status, approved_by, approved_at
) VALUES
('prg-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000001', 'Completed ground floor column rebar casting and formwork removal.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800', 'Photo', 'Approved', 'usr-cont-0000000000000000000000001', '2024-05-12 11:30:00'),
('prg-00000000000000000000000000000002', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000007', 'Fitted electrical PVC conduit pipes across south corridor ceiling.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 'Photo', 'Approved', 'usr-cont-0000000000000000000000001', '2024-08-15 14:00:00'),
('prg-00000000000000000000000000000003', 'prj-00000000000000000000000000000001', 'usr-work-0000000000000000000000010', 'Plumbing riser pressure test completed up to 10 bar without leakage.', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', 'Photo', 'Pending', NULL, NULL),
('prg-00000000000000000000000000000004', 'prj-00000000000000000000000000000002', 'usr-work-0000000000000000000000002', '14th floor shear wall steel reinforcement completed.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', 'Photo', 'Approved', 'usr-cont-0000000000000000000000002', '2024-08-20 16:45:00');

-- ----------------------------------------------------------------------------
-- 16. Daily Work Updates
-- ----------------------------------------------------------------------------
INSERT INTO daily_work_updates (id, project_id, author_id, title, content, file_url, file_type) VALUES
('dwu-00000000000000000000000000000001', 'prj-00000000000000000000000000000001', 'usr-cont-0000000000000000000000001', 'Daily Progress: Column Shuttering & Conduit Piping', 'Full workforce of 12 workers on site today. Completed 1st floor electrical ceiling piping and started external wall masonry layout.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800', 'Photo'),
('dwu-00000000000000000000000000000002', 'prj-00000000000000000000000000000002', 'usr-cont-0000000000000000000000002', 'Daily Progress: Tower Slab 14 Concrete Pouring', 'Completed pouring 45 cubic meters of M35 concrete on floor 14. 100% curing water spray active on floors 12 and 13.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', 'Photo');

-- ----------------------------------------------------------------------------
-- 17. Notifications
-- ----------------------------------------------------------------------------
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
('usr-admin-0000000000000000000000001', 'System Report Generated', 'Monthly enterprise platform analytics report is now available.', 'system', false),
('usr-cont-0000000000000000000000001', 'Worker Joined Team', 'Arjun Sharma (Mason) accepted the invitation for Green Valley Villas.', 'worker_invitation', true),
('usr-cont-0000000000000000000000001', 'Proposal Accepted!', 'Your proposal for Green Valley Villas has been accepted by the homeowner.', 'proposal_accepted', true),
('usr-home-0000000000000000000000001', 'Milestone Completed', 'Foundation & Substructure milestone completed on your project.', 'milestone', false),
('usr-home-0000000000000000000000001', 'Daily Site Log Uploaded', 'Alex Turner posted a daily site update with photo attachments.', 'work_update', false),
('usr-work-0000000000000000000000001', 'New Task Assigned', 'You have been assigned task "Site Layout & Foundation Excavation".', 'task_assigned', true),
('usr-work-0000000000000000000000007', 'Task Approved!', 'Your work on "Main Electrical Conduit Piping" has been verified and approved.', 'task_approved', false);

-- ----------------------------------------------------------------------------
-- 18. Announcements
-- ----------------------------------------------------------------------------
INSERT INTO announcements (title, description, priority, target_role, publish_date) VALUES
('Site Safety & Mandatory Hard Hat PPE Compliance', 'All contractors and workers must wear hard hats, steel-toed safety boots, and high-visibility reflective vests on all active construction sites at all times.', 'Urgent', 'Everyone', CURRENT_TIMESTAMP),
('Monsoon Protection & Storage Guidelines for Raw Materials', 'Contractors are instructed to keep cement bags on wooden pallets and steel rebar covered under heavy-duty waterproof tarpaulins during rain alerts.', 'High', 'Contractor', CURRENT_TIMESTAMP),
('Real-Time Worker Attendance & GPS Clock-In Feature', 'Workers can now view their daily clocked hours and calculate monthly wage disbursements directly through their mobile web portal.', 'Normal', 'Worker', CURRENT_TIMESTAMP),
('Homeowner Milestone Walkthrough Bookings', 'Homeowners can schedule structural milestone walkthroughs and structural engineer site inspections directly via their project dashboard.', 'Normal', 'Homeowner', CURRENT_TIMESTAMP),
('Scheduled Platform Maintenance Notice', 'ConstructIQ infrastructure maintenance is scheduled on Sunday between 02:00 AM - 04:00 AM IST. API services will undergo seamless rolling updates.', 'Normal', 'Everyone', CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------------------
-- 19. Audit Logs
-- ----------------------------------------------------------------------------
INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES
('usr-admin-0000000000000000000000001', 'ADMIN_LOGIN', 'System Admin logged in via Web Portal', '127.0.0.1'),
('usr-cont-0000000000000000000000001', 'PROJECT_INITIALIZED', 'Green Valley Villas project initialized with code PRJ-GVV-001', '192.168.1.10'),
('usr-cont-0000000000000000000000001', 'WORKER_INVITED', 'Invited Arjun Sharma to project team', '192.168.1.10'),
('usr-work-0000000000000000000000001', 'ATTENDANCE_CLOCK_IN', 'Worker clocked in via GPS at 12.9716, 77.5946', '192.168.1.55'),
('usr-cont-0000000000000000000000001', 'EXPENSE_RECORDED', 'Bulk cement procurement expense voucher logged ($348,500)', '192.168.1.10');

-- ============================================================================
-- VERIFICATION QUERIES (Optional Check)
-- ============================================================================
SELECT 'Users' AS Entity, COUNT(*) AS TotalCount FROM users
UNION ALL
SELECT 'Worker Profiles', COUNT(*) FROM worker_profiles
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Project Members', COUNT(*) FROM project_members
UNION ALL
SELECT 'Milestones', COUNT(*) FROM milestones
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Attendance', COUNT(*) FROM attendance
UNION ALL
SELECT 'Materials', COUNT(*) FROM materials
UNION ALL
SELECT 'Expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'Documents', COUNT(*) FROM documents
UNION ALL
SELECT 'Progress Updates', COUNT(*) FROM progress_updates
UNION ALL
SELECT 'Daily Work Updates', COUNT(*) FROM daily_work_updates
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Announcements', COUNT(*) FROM announcements
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs;

-- All demo credentials:
-- Password: pass
-- Admin:        admin@constructiq.com
-- Contractor:   contact@abcconstructions.com
-- Homeowner:    robert.taylor@example.com
-- Worker:       arjun.sharma@worker.constructiq.com
