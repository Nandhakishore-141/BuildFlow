-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: constructiq
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Normal',
  `target_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Everyone',
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'Site Safety & Mandatory Hard Hat PPE Compliance','All contractors and workers must wear hard hats, steel-toed safety boots, and high-visibility reflective vests on all active construction sites at all times.','Urgent','Everyone','2026-08-25 13:14:18',NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),(2,'Monsoon Protection & Storage Guidelines for Raw Materials','Contractors are instructed to keep cement bags on wooden pallets and steel rebar covered under heavy-duty waterproof tarpaulins during rain alerts.','High','Contractor','2026-08-25 13:14:18',NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),(3,'Real-Time Worker Attendance & GPS Clock-In Feature','Workers can now view their daily clocked hours and calculate monthly wage disbursements directly through their mobile web portal.','Normal','Worker','2026-08-25 13:14:18',NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),(4,'Homeowner Milestone Walkthrough Bookings','Homeowners can schedule structural milestone walkthroughs and structural engineer site inspections directly via their project dashboard.','Normal','Homeowner','2026-08-25 13:14:18',NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),(5,'Scheduled Platform Maintenance Notice','ConstructIQ infrastructure maintenance is scheduled on Sunday between 02:00 AM - 04:00 AM IST. API services will undergo seamless rolling updates.','Normal','Everyone','2026-08-25 13:14:18',NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `worker_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Present',
  `clock_in` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clock_out` timestamp NULL DEFAULT NULL,
  `latitude_in` decimal(10,8) DEFAULT '0.00000000',
  `longitude_in` decimal(11,8) DEFAULT '0.00000000',
  `latitude_out` decimal(10,8) DEFAULT NULL,
  `longitude_out` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `worker_acceptance` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `absence_reason` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_attendance_project` (`project_id`),
  KEY `idx_attendance_worker_project` (`worker_id`,`project_id`),
  KEY `idx_attendance_clock_in` (`clock_in`),
  CONSTRAINT `fk_attendance_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attendance_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES ('34ec846a-4c12-440b-8d86-c387b33c0bae','usr-work-0000000000000000000000002','prj-00000000000000000000000000000001','Absent','2026-08-24 18:30:00',NULL,0.00000000,0.00000000,NULL,NULL,'2026-08-25 14:05:29','Reason Submitted','Medical Leave - High fever and doctor consultation.'),('att-00000000000000000000000000000001','usr-work-0000000000000000000000001','prj-00000000000000000000000000000001','Present','2024-08-25 03:00:00','2024-08-25 12:00:00',12.97160000,77.59460000,12.97160000,77.59460000,'2026-08-25 13:14:18','Pending',NULL),('att-00000000000000000000000000000002','usr-work-0000000000000000000000004','prj-00000000000000000000000000000001','Present','2024-08-25 03:15:00','2024-08-25 12:05:00',12.97161000,77.59461000,12.97161000,77.59461000,'2026-08-25 13:14:18','Pending',NULL),('att-00000000000000000000000000000003','usr-work-0000000000000000000000007','prj-00000000000000000000000000000001','Present','2024-08-25 03:30:00','2024-08-25 12:30:00',12.97162000,77.59462000,12.97162000,77.59462000,'2026-08-25 13:14:18','Pending',NULL),('att-00000000000000000000000000000004','usr-work-0000000000000000000000010','prj-00000000000000000000000000000001','Present','2024-08-25 03:05:00','2024-08-25 12:10:00',12.97163000,77.59463000,12.97163000,77.59463000,'2026-08-25 13:14:18','Pending',NULL),('att-00000000000000000000000000000005','usr-work-0000000000000000000000002','prj-00000000000000000000000000000002','Present','2024-08-25 02:45:00','2024-08-25 11:45:00',19.07600000,72.87770000,19.07600000,72.87770000,'2026-08-25 13:14:18','Pending',NULL),('att-00000000000000000000000000000006','usr-work-0000000000000000000000009','prj-00000000000000000000000000000002','Present','2024-08-25 03:10:00','2024-08-25 12:15:00',19.07601000,72.87771000,19.07601000,72.87771000,'2026-08-25 13:14:18','Pending',NULL),('att-00000000000000000000000000000007','usr-work-0000000000000000000000012','prj-00000000000000000000000000000002','Present','2024-08-25 03:20:00','2024-08-25 12:20:00',19.07602000,72.87772000,19.07602000,72.87772000,'2026-08-25 13:14:18','Pending',NULL),('d650e2fc-7038-40af-92cc-69b9d123e296','usr-work-0000000000000000000000001','prj-00000000000000000000000000000001','Present','2026-08-25 03:30:00','2026-08-25 12:00:00',0.00000000,0.00000000,NULL,NULL,'2026-08-25 13:58:26','Accepted',NULL);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_action` (`action`),
  KEY `idx_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'usr-admin-0000000000000000000000001','ADMIN_LOGIN','System Admin logged in via Web Portal','127.0.0.1','2026-08-25 13:14:18'),(2,'usr-cont-0000000000000000000000001','PROJECT_INITIALIZED','Green Valley Villas project initialized with code PRJ-GVV-001','192.168.1.10','2026-08-25 13:14:18'),(3,'usr-cont-0000000000000000000000001','WORKER_INVITED','Invited Arjun Sharma to project team','192.168.1.10','2026-08-25 13:14:18'),(4,'usr-work-0000000000000000000000001','ATTENDANCE_CLOCK_IN','Worker clocked in via GPS at 12.9716, 77.5946','192.168.1.55','2026-08-25 13:14:18'),(5,'usr-cont-0000000000000000000000001','EXPENSE_RECORDED','Bulk cement procurement expense voucher logged ($348,500)','192.168.1.10','2026-08-25 13:14:18'),(6,'usr-admin-0000000000000000000000001','USER_IMPERSONATION_STARTED','Admin \"admin@constructiq.com\" (id: usr-admin-0000000000000000000000001) started impersonating user \"Alex Turner\" (id: usr-cont-0000000000000000000000001, role: Contractor)','::1','2026-08-25 13:30:04'),(7,'usr-admin-0000000000000000000000001','USER_IMPERSONATION_STARTED','Admin \"admin@constructiq.com\" (id: usr-admin-0000000000000000000000001) started impersonating user \"Alex Turner\" (id: usr-cont-0000000000000000000000001, role: Contractor)','::1','2026-08-25 15:22:09'),(8,'usr-admin-0000000000000000000000001','USER_IMPERSONATION_STOPPED','Admin \"admin@constructiq.com\" (id: usr-admin-0000000000000000000000001) stopped impersonating user context (id: usr-cont-0000000000000000000000001)','::1','2026-08-25 15:23:17'),(9,'usr-admin-0000000000000000000000001','USER_IMPERSONATION_STARTED','Admin \"admin@constructiq.com\" (id: usr-admin-0000000000000000000000001) started impersonating user \"Robert Taylor\" (id: usr-home-0000000000000000000000001, role: Homeowner)','::1','2026-08-25 15:23:26'),(10,'usr-admin-0000000000000000000000001','USER_IMPERSONATION_STOPPED','Admin \"admin@constructiq.com\" (id: usr-admin-0000000000000000000000001) stopped impersonating user context (id: usr-home-0000000000000000000000001)','::1','2026-08-25 15:25:28'),(11,'usr-admin-0000000000000000000000001','USER_IMPERSONATION_STARTED','Admin \"admin@constructiq.com\" (id: usr-admin-0000000000000000000000001) started impersonating user \"Arjun Sharma\" (id: usr-work-0000000000000000000000001, role: Worker)','::1','2026-08-25 15:25:39');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contractor_invitations`
--

DROP TABLE IF EXISTS `contractor_invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contractor_invitations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `homeowner_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractor_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ci_project_contractor` (`project_id`,`contractor_id`),
  KEY `fk_ci_homeowner` (`homeowner_id`),
  KEY `fk_ci_contractor` (`contractor_id`),
  CONSTRAINT `fk_ci_contractor` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ci_homeowner` FOREIGN KEY (`homeowner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ci_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contractor_invitations`
--

LOCK TABLES `contractor_invitations` WRITE;
/*!40000 ALTER TABLE `contractor_invitations` DISABLE KEYS */;
INSERT INTO `contractor_invitations` VALUES ('inv-c-000000000000000000000000000001','prj-00000000000000000000000000000001','usr-home-0000000000000000000000001','usr-cont-0000000000000000000000001','accepted','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-c-000000000000000000000000000002','prj-00000000000000000000000000000002','usr-home-0000000000000000000000002','usr-cont-0000000000000000000000002','accepted','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-c-000000000000000000000000000003','prj-00000000000000000000000000000005','usr-home-0000000000000000000000005','usr-cont-0000000000000000000000005','pending','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-c-000000000000000000000000000004','prj-00000000000000000000000000000010','usr-home-0000000000000000000000010','usr-cont-0000000000000000000000004','pending','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `contractor_invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contractor_proposals`
--

DROP TABLE IF EXISTS `contractor_proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contractor_proposals` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractor_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimated_budget` decimal(15,2) NOT NULL DEFAULT '0.00',
  `estimated_duration` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_message` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cp_project` (`project_id`),
  KEY `idx_cp_contractor` (`contractor_id`),
  CONSTRAINT `fk_cp_contractor` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cp_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contractor_proposals`
--

LOCK TABLES `contractor_proposals` WRITE;
/*!40000 ALTER TABLE `contractor_proposals` DISABLE KEYS */;
INSERT INTO `contractor_proposals` VALUES ('a2db50ba-1ef7-4c92-88ce-d1cb84f240f0','prj-00000000000000000000000000000005','usr-cont-0000000000000000000000001',14500000.00,'8 Months','Updated proposal with revised timelines.','pending','2026-08-25 13:39:05','2026-08-25 13:39:05','2026-08-25 13:41:51'),('b87e8494-1eb6-459f-add7-83b813aa2224','prj-00000000000000000000000000000005','usr-cont-0000000000000000000000001',20000000.00,'8 Months','i am here','pending','2026-08-25 13:38:55','2026-08-25 13:38:55','2026-08-25 13:38:55'),('e4292a5c-1625-4456-972d-dd6bb92e21d7','prj-00000000000000000000000000000012','usr-cont-0000000000000000000000001',300000000.00,'6 Months','dumb','pending','2026-08-25 13:47:44','2026-08-25 13:47:44','2026-08-25 13:47:44'),('prp-00000000000000000000000000000001','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001',45000000.00,'10 Months','Complete turnkey construction with premium materials and certified supervisors.','accepted','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18'),('prp-00000000000000000000000000000002','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000002',48000000.00,'12 Months','High quality villa building proposal with warranty on waterproofing.','rejected','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18'),('prp-00000000000000000000000000000003','prj-00000000000000000000000000000005','usr-cont-0000000000000000000000003',215000000.00,'18 Months','LEED certified green building construction with pre-engineered structural steel.','pending','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18'),('prp-00000000000000000000000000000004','prj-00000000000000000000000000000010','usr-cont-0000000000000000000000005',76000000.00,'14 Months','Specialized suburban villa construction with landscape architecture integration.','pending','2026-08-25 13:14:18','2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `contractor_proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_work_updates`
--

DROP TABLE IF EXISTS `daily_work_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_work_updates` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Daily Site Progress',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Photo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_dwu_author` (`author_id`),
  KEY `idx_dwu_project` (`project_id`),
  CONSTRAINT `fk_dwu_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dwu_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_work_updates`
--

LOCK TABLES `daily_work_updates` WRITE;
/*!40000 ALTER TABLE `daily_work_updates` DISABLE KEYS */;
INSERT INTO `daily_work_updates` VALUES ('dwu-00000000000000000000000000000001','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','Daily Progress: Column Shuttering & Conduit Piping','Full workforce of 12 workers on site today. Completed 1st floor electrical ceiling piping and started external wall masonry layout.','https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800','Photo','2026-08-25 13:14:18','2026-08-25 13:14:18'),('dwu-00000000000000000000000000000002','prj-00000000000000000000000000000002','usr-cont-0000000000000000000000002','Daily Progress: Tower Slab 14 Concrete Pouring','Completed pouring 45 cubic meters of M35 concrete on floor 14. 100% curing water spray active on floors 12 and 13.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800','Photo','2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `daily_work_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_by` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_documents_uploader` (`uploaded_by`),
  KEY `idx_documents_project` (`project_id`),
  CONSTRAINT `fk_documents_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_documents_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES ('doc-00000000000000000000000000000001','prj-00000000000000000000000000000001','Master Construction Contract Agreement.pdf','https://constructiq.io/docs/contracts/master-contract-gvv.pdf','Contract','usr-cont-0000000000000000000000001','2026-08-25 13:14:18'),('doc-00000000000000000000000000000002','prj-00000000000000000000000000000001','Architectural Floor Plan Blueprint Rev 3.pdf','https://constructiq.io/docs/blueprints/floorplan-rev3.pdf','Blueprint','usr-cont-0000000000000000000000001','2026-08-25 13:14:18'),('doc-00000000000000000000000000000003','prj-00000000000000000000000000000001','Municipal Building Sanction & Fire NOC.pdf','https://constructiq.io/docs/permits/bbmp-fire-noc.pdf','Permit','usr-cont-0000000000000000000000001','2026-08-25 13:14:18'),('doc-00000000000000000000000000000004','prj-00000000000000000000000000000001','Structural Soil Test & Geotechnical Report.pdf','https://constructiq.io/docs/reports/soil-test-report.pdf','Safety Report','usr-cont-0000000000000000000000001','2026-08-25 13:14:18'),('doc-00000000000000000000000000000005','prj-00000000000000000000000000000002','High-Rise Structural Engineering Blueprint Rev 5.pdf','https://constructiq.io/docs/blueprints/sky-heights-r5.pdf','Blueprint','usr-cont-0000000000000000000000002','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logged_by` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Other',
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` date NOT NULL,
  `vendor` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Bank Transfer',
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_expenses_logger` (`logged_by`),
  KEY `idx_expenses_project` (`project_id`),
  KEY `idx_expenses_date` (`date`),
  CONSTRAINT `fk_expenses_logger` FOREIGN KEY (`logged_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_expenses_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES ('exp-00000000000000000000000000000001','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','Bulk Cement Procurement Phase 1','Materials',348500.00,'850 bags of UltraTech 53 grade cement for foundation and column casting.','2024-02-10','UltraTech Direct Depot','https://constructiq.io/receipts/inv-8812.pdf','2026-08-25 13:14:18','Bank Transfer',NULL),('exp-00000000000000000000000000000002','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','Fe500D TMT Steel Rebar Supply','Materials',1462500.00,'25 metric tons of 16mm & 12mm TMT steel for structural framing.','2024-02-18','Jindal Steel & Power','https://constructiq.io/receipts/inv-8819.pdf','2026-08-25 13:14:18','Bank Transfer',NULL),('exp-00000000000000000000000000000003','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','Weekly Mason & Rebar Labor Wages','Labor',98000.00,'Weekly wage payout for 6 master masons and 4 steel fixers.','2024-08-18','Site Labor Registry',NULL,'2026-08-25 13:14:18','Bank Transfer',NULL),('exp-00000000000000000000000000000004','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','JCB Excavator & Dump Truck Hire','Equipment',125000.00,'Monthly rental and diesel charges for earthmoving excavator.','2024-03-01','Apex Heavy Equipment','https://constructiq.io/receipts/jcb-339.pdf','2026-08-25 13:14:18','Bank Transfer',NULL),('exp-00000000000000000000000000000005','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','Municipal Plan Sanction Fee','Permits',65000.00,'BBMP building plan approval and commencement certificate fee.','2024-01-20','Municipal Corporation','https://constructiq.io/receipts/bbmp-sanction.pdf','2026-08-25 13:14:18','Bank Transfer',NULL),('exp-00000000000000000000000000000006','prj-00000000000000000000000000000002','usr-cont-0000000000000000000000002','Tower Crane Monthly Lease','Equipment',280000.00,'Tower crane operation, certified crane operator and maintenance.','2024-04-15','Potain Cranes India','https://constructiq.io/receipts/crane-441.pdf','2026-08-25 13:14:18','Bank Transfer',NULL),('exp-00000000000000000000000000000007','prj-00000000000000000000000000000002','usr-cont-0000000000000000000000002','RMC Concrete Pouring Slab 12','Materials',820000.00,'M35 ready mix concrete delivery with boom placer pump.','2024-07-22','ACC Concrete Ltd','https://constructiq.io/receipts/rmc-889.pdf','2026-08-25 13:14:18','Bank Transfer',NULL);
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Units',
  `cost_per_unit` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ordered',
  `supplier` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `specifications` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_materials_project` (`project_id`),
  CONSTRAINT `fk_materials_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES ('7055a198-f641-483e-ac78-4f54b8e54fa5','prj-00000000000000000000000000000001','gtehs',54.00,'Bags',5448.00,'Available','hdhsthsrt','2026-08-25 14:13:51','2026-08-25 14:13:51','htrh','Structural','stthr'),('mat-00000000000000000000000000000001','prj-00000000000000000000000000000001','UltraTech 53 Grade Portland Cement',850.00,'Bags',410.00,'Delivered','UltraTech Direct Depot','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000002','prj-00000000000000000000000000000001','TMT Steel Rebar (16mm Fe500D)',25.00,'Tons',58500.00,'Delivered','Jindal Steel & Power','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000003','prj-00000000000000000000000000000001','AAC Lightweight Blocks (600x200x150)',4500.00,'Pieces',64.00,'Available','Magicrete Building Solutions','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000004','prj-00000000000000000000000000000001','Filtered River Sand (Class A)',1200.00,'Cu.Ft',68.00,'Consumed','South Rivers Sand Co','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000005','prj-00000000000000000000000000000001','Finolex FRLS Copper Wire (2.5 sq mm)',40.00,'Rolls',2650.00,'Ordered','Finolex Regional Depot','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000006','prj-00000000000000000000000000000001','Supreme Schedule 80 CPVC Pipes (1 inch)',180.00,'Meters',210.00,'Ordered','Supreme Industries Ltd','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000007','prj-00000000000000000000000000000002','Ready Mix Concrete M35 Grade',450.00,'Cu.M',4600.00,'Delivered','ACC Concrete Plants','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000008','prj-00000000000000000000000000000002','High Tensile Structural Rebar (25mm)',65.00,'Tons',61000.00,'Delivered','Tata Tiscon Steel','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL),('mat-00000000000000000000000000000009','prj-00000000000000000000000000000002','Vitrified Double Charge Floor Tiles (4x2)',1500.00,'Boxes',1250.00,'Ordered','Kajaria Ceramics Ltd','2026-08-25 13:14:18','2026-08-25 13:14:18',NULL,NULL,NULL);
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `milestones`
--

DROP TABLE IF EXISTS `milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `milestones` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `due_date` date DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_milestones_project` (`project_id`),
  CONSTRAINT `fk_milestones_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `milestones`
--

LOCK TABLES `milestones` WRITE;
/*!40000 ALTER TABLE `milestones` DISABLE KEYS */;
INSERT INTO `milestones` VALUES ('mls-00000000000000000000000000000001','prj-00000000000000000000000000000001','Foundation & Substructure','Site excavation, PCC leveling, footing rebar and foundation casting.','2024-03-31','Completed','2026-08-25 13:14:18','2026-08-25 13:14:18'),('mls-00000000000000000000000000000002','prj-00000000000000000000000000000001','RCC Superstructure Frame','Ground & First floor column casting, beam shuttering and roof slab pouring.','2024-06-30','Completed','2026-08-25 13:14:18','2026-08-25 13:14:18'),('mls-00000000000000000000000000000003','prj-00000000000000000000000000000001','Brickwork & MEP Rough-In','Exterior/interior AAC block masonry, electrical conduits and plumbing risers.','2024-08-31','In Progress','2026-08-25 13:14:18','2026-08-25 13:14:18'),('mls-00000000000000000000000000000004','prj-00000000000000000000000000000001','Finishes & Handover','Plastering, flooring tiles, internal painting, fixtures and occupancy certification.','2024-11-30','Pending','2026-08-25 13:14:18','2026-08-25 13:14:18'),('mls-00000000000000000000000000000005','prj-00000000000000000000000000000002','Basement & Retaining Wall','2-level basement excavation and RCC retaining diaphragm wall.','2023-12-31','Completed','2026-08-25 13:14:18','2026-08-25 13:14:18'),('mls-00000000000000000000000000000006','prj-00000000000000000000000000000002','Tower RCC Slabs (1 to 18)','High rise structural casting of floor slabs and shear core walls.','2024-08-31','In Progress','2026-08-25 13:14:18','2026-08-25 13:14:18'),('mls-00000000000000000000000000000007','prj-00000000000000000000000000000002','Facade Glass & Elevation','Double glazed facade installation and exterior architectural lighting.','2024-11-15','Pending','2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'usr-admin-0000000000000000000000001','System Report Generated','Monthly enterprise platform analytics report is now available.','system',0,'2026-08-25 13:14:18'),(2,'usr-cont-0000000000000000000000001','Worker Joined Team','Arjun Sharma (Mason) accepted the invitation for Green Valley Villas.','worker_invitation',1,'2026-08-25 13:14:18'),(3,'usr-cont-0000000000000000000000001','Proposal Accepted!','Your proposal for Green Valley Villas has been accepted by the homeowner.','proposal_accepted',1,'2026-08-25 13:14:18'),(4,'usr-home-0000000000000000000000001','Milestone Completed','Foundation & Substructure milestone completed on your project.','milestone',0,'2026-08-25 13:14:18'),(5,'usr-home-0000000000000000000000001','Daily Site Log Uploaded','Alex Turner posted a daily site update with photo attachments.','work_update',0,'2026-08-25 13:14:18'),(6,'usr-work-0000000000000000000000001','New Task Assigned','You have been assigned task \"Site Layout & Foundation Excavation\".','task_assigned',1,'2026-08-25 13:14:18'),(7,'usr-work-0000000000000000000000007','Task Approved!','Your work on \"Main Electrical Conduit Piping\" has been verified and approved.','task_approved',0,'2026-08-25 13:14:18'),(8,'usr-home-0000000000000000000000002','New Proposal Received','ABC Constructions Ltd submitted a proposal for \"Grand Horizon Convention Center\".','proposal_received',0,'2026-08-25 13:47:44'),(9,'usr-work-0000000000000000000000001','Attendance & Shift Logged','Contractor logged your attendance as Present for project \"Green Valley Villas\". Please review and accept your hours.','attendance',0,'2026-08-25 13:58:26'),(10,'usr-work-0000000000000000000000001','Attendance & Shift Logged','Contractor logged your attendance as Present for project \"Green Valley Villas\". Please review and accept your hours.','attendance',0,'2026-08-25 13:59:06'),(11,'usr-work-0000000000000000000000001','Shift Timings Logged','Shift timings logged for project \"Green Valley Villas\". Please review and accept timing to mark attendance Present.','attendance',0,'2026-08-25 14:05:28'),(12,'usr-work-0000000000000000000000002','Marked Absent - Reason Required','You were marked absent today for project \"Green Valley Villas\". Please submit a valid reason.','attendance',0,'2026-08-25 14:05:29'),(13,'usr-cont-0000000000000000000000001','Absence Reason Submitted','Bhavesh Patel provided an absence reason for project \"Green Valley Villas\": \"Medical Leave - High fever and doctor consultation.\".','attendance',0,'2026-08-25 14:05:29');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_updates`
--

DROP TABLE IF EXISTS `progress_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_updates` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `worker_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Photo',
  `approval_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `approved_by` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_progress_worker` (`worker_id`),
  KEY `fk_progress_approver` (`approved_by`),
  KEY `idx_progress_project` (`project_id`),
  CONSTRAINT `fk_progress_approver` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_progress_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_progress_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_updates`
--

LOCK TABLES `progress_updates` WRITE;
/*!40000 ALTER TABLE `progress_updates` DISABLE KEYS */;
INSERT INTO `progress_updates` VALUES ('006b080e-0f03-4766-a238-3e25c929eb00','prj-00000000000000000000000000000001','usr-work-0000000000000000000000001','ljhvjlh','https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800','Photo','Pending',NULL,NULL,'2026-08-25 15:30:50','2026-08-25 15:30:50'),('prg-00000000000000000000000000000001','prj-00000000000000000000000000000001','usr-work-0000000000000000000000001','Completed ground floor column rebar casting and formwork removal.','https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800','Photo','Approved','usr-cont-0000000000000000000000001','2024-05-12 06:00:00','2026-08-25 13:14:18','2026-08-25 14:17:43'),('prg-00000000000000000000000000000002','prj-00000000000000000000000000000001','usr-work-0000000000000000000000007','Fitted electrical PVC conduit pipes across south corridor ceiling.','https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800','Photo','Approved','usr-cont-0000000000000000000000001','2024-08-15 08:30:00','2026-08-25 13:14:18','2026-08-25 13:14:18'),('prg-00000000000000000000000000000003','prj-00000000000000000000000000000001','usr-work-0000000000000000000000010','Plumbing riser pressure test completed up to 10 bar without leakage.','https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800','Photo','Approved','usr-cont-0000000000000000000000001',NULL,'2026-08-25 13:14:18','2026-08-25 14:14:38'),('prg-00000000000000000000000000000004','prj-00000000000000000000000000000002','usr-work-0000000000000000000000002','14th floor shear wall steel reinforcement completed.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800','Photo','Approved','usr-cont-0000000000000000000000002','2024-08-20 11:15:00','2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `progress_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_members`
--

DROP TABLE IF EXISTS `project_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `worker_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_worker` (`project_id`,`worker_id`),
  KEY `fk_pm_worker` (`worker_id`),
  CONSTRAINT `fk_pm_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pm_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_members`
--

LOCK TABLES `project_members` WRITE;
/*!40000 ALTER TABLE `project_members` DISABLE KEYS */;
INSERT INTO `project_members` VALUES (1,'prj-00000000000000000000000000000001','usr-work-0000000000000000000000001','2026-08-25 13:14:18'),(2,'prj-00000000000000000000000000000001','usr-work-0000000000000000000000004','2026-08-25 13:14:18'),(3,'prj-00000000000000000000000000000001','usr-work-0000000000000000000000007','2026-08-25 13:14:18'),(4,'prj-00000000000000000000000000000001','usr-work-0000000000000000000000010','2026-08-25 13:14:18'),(5,'prj-00000000000000000000000000000001','usr-work-0000000000000000000000018','2026-08-25 13:14:18'),(6,'prj-00000000000000000000000000000001','usr-work-0000000000000000000000023','2026-08-25 13:14:18'),(7,'prj-00000000000000000000000000000002','usr-work-0000000000000000000000002','2026-08-25 13:14:18'),(8,'prj-00000000000000000000000000000002','usr-work-0000000000000000000000005','2026-08-25 13:14:18'),(9,'prj-00000000000000000000000000000002','usr-work-0000000000000000000000009','2026-08-25 13:14:18'),(10,'prj-00000000000000000000000000000002','usr-work-0000000000000000000000012','2026-08-25 13:14:18'),(11,'prj-00000000000000000000000000000002','usr-work-0000000000000000000000016','2026-08-25 13:14:18'),(12,'prj-00000000000000000000000000000002','usr-work-0000000000000000000000021','2026-08-25 13:14:18'),(13,'prj-00000000000000000000000000000003','usr-work-0000000000000000000000003','2026-08-25 13:14:18'),(14,'prj-00000000000000000000000000000003','usr-work-0000000000000000000000006','2026-08-25 13:14:18'),(15,'prj-00000000000000000000000000000003','usr-work-0000000000000000000000013','2026-08-25 13:14:18'),(16,'prj-00000000000000000000000000000003','usr-work-0000000000000000000000024','2026-08-25 13:14:18'),(17,'prj-00000000000000000000000000000004','usr-work-0000000000000000000000008','2026-08-25 13:14:18'),(18,'prj-00000000000000000000000000000004','usr-work-0000000000000000000000011','2026-08-25 13:14:18'),(19,'prj-00000000000000000000000000000004','usr-work-0000000000000000000000017','2026-08-25 13:14:18'),(20,'prj-00000000000000000000000000000004','usr-work-0000000000000000000000019','2026-08-25 13:14:18'),(21,'prj-00000000000000000000000000000006','usr-work-0000000000000000000000001','2026-08-25 13:14:18'),(22,'prj-00000000000000000000000000000006','usr-work-0000000000000000000000007','2026-08-25 13:14:18'),(23,'prj-00000000000000000000000000000006','usr-work-0000000000000000000000014','2026-08-25 13:14:18'),(24,'prj-00000000000000000000000000000006','usr-work-0000000000000000000000022','2026-08-25 13:14:18'),(25,'prj-00000000000000000000000000000008','usr-work-0000000000000000000000002','2026-08-25 13:14:18'),(26,'prj-00000000000000000000000000000008','usr-work-0000000000000000000000010','2026-08-25 13:14:18'),(27,'prj-00000000000000000000000000000008','usr-work-0000000000000000000000015','2026-08-25 13:14:18'),(28,'prj-00000000000000000000000000000008','usr-work-0000000000000000000000025','2026-08-25 13:14:18'),(29,'prj-00000000000000000000000000000011','usr-work-0000000000000000000000004','2026-08-25 13:14:18'),(30,'prj-00000000000000000000000000000011','usr-work-0000000000000000000000016','2026-08-25 13:14:18'),(31,'prj-00000000000000000000000000000011','usr-work-0000000000000000000000018','2026-08-25 13:14:18'),(32,'prj-00000000000000000000000000000013','usr-work-0000000000000000000000005','2026-08-25 13:14:18'),(33,'prj-00000000000000000000000000000013','usr-work-0000000000000000000000020','2026-08-25 13:14:18'),(34,'prj-00000000000000000000000000000013','usr-work-0000000000000000000000021','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `project_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `project_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'House',
  `priority` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Medium',
  `owner_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contractor_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Planning',
  `planned_start_date` date DEFAULT NULL,
  `planned_end_date` date DEFAULT NULL,
  `actual_start_date` date DEFAULT NULL,
  `actual_end_date` date DEFAULT NULL,
  `budget` decimal(15,2) NOT NULL DEFAULT '0.00',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'India',
  `postal_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `completion_percentage` decimal(5,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_code` (`project_code`),
  KEY `idx_projects_contractor` (`contractor_id`),
  KEY `idx_projects_owner` (`owner_id`),
  KEY `idx_projects_status` (`status`),
  CONSTRAINT `fk_prj_contractor` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_prj_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('c02dead0-fc22-4844-ba04-85fa0f3649f3','bkhvl','BLD-301052',',bjh','House','Medium','usr-home-0000000000000000000000001',NULL,'Looking for Contractor','2026-08-28','2026-09-05',NULL,NULL,35468.00,'vk','ku','kj','Indiajgcg','kj',NULL,NULL,0.00,'2026-08-25 15:24:28','2026-08-25 15:24:28'),('prj-00000000000000000000000000000001','Green Valley Villas','PRJ-GVV-001','Luxury 4BHK gated community villas with solar amenities and clubhouse.','Villa','High','usr-home-0000000000000000000000001','usr-cont-0000000000000000000000001','In Progress','2024-01-15','2024-11-30',NULL,NULL,45000000.00,'Plot 42, Green Valley Enclave','Bangalore','Karnataka','India',NULL,12.97160000,77.59460000,65.00,'2026-08-25 13:14:18','2026-08-25 14:17:43'),('prj-00000000000000000000000000000002','Sky Heights Apartments','PRJ-SHA-002','Modern 18-storey residential tower with underground parking and sky lounge.','Apartment','High','usr-home-0000000000000000000000002','usr-cont-0000000000000000000000002','In Progress','2023-09-01','2024-12-15',NULL,NULL,120000000.00,'Sector 15, Sea Breeze Road','Mumbai','Maharashtra','India',NULL,19.07600000,72.87770000,68.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000003','Sunrise Residency','PRJ-SRR-003','Affordable urban housing complex with 120 2BHK apartments.','Apartment','Medium','usr-home-0000000000000000000000003','usr-cont-0000000000000000000000003','Completed','2023-03-10','2024-04-20',NULL,NULL,85000000.00,'Kothrud Bypass Road','Pune','Maharashtra','India',NULL,18.52040000,73.85670000,100.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000004','Metro Mall Extension','PRJ-MME-004','Commercial retail extension featuring multiplex theaters and food court.','Commercial','High','usr-home-0000000000000000000000004','usr-cont-0000000000000000000000004','In Progress','2024-02-01','2025-03-31',NULL,NULL,150000000.00,'Ring Road Hub','Delhi','Delhi','India',NULL,28.70410000,77.10250000,30.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000005','Tech Park Phase II','PRJ-TPP-005','State-of-the-art IT park building with LEED Gold certification.','Commercial','Medium','usr-home-0000000000000000000000005','usr-cont-0000000000000000000000005','Planning','2024-09-01','2026-02-28',NULL,NULL,220000000.00,'Hitec City Phase 2','Hyderabad','Telangana','India',NULL,17.38500000,78.48670000,5.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000006','City Hospital Expansion','PRJ-CHE-006','New 200-bed super specialty wing with ICUs and modular operation theaters.','Hospital','High','usr-home-0000000000000000000000006','usr-cont-0000000000000000000000001','In Progress','2023-11-15','2025-01-30',NULL,NULL,185000000.00,'OMR IT Highway','Chennai','Tamil Nadu','India',NULL,13.08270000,80.27070000,52.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000007','Riverfront Towers','PRJ-RFT-007','Waterfront twin residential towers with private marina and infinity pool.','Apartment','Low','usr-home-0000000000000000000000007','usr-cont-0000000000000000000000002','Suspended','2023-10-01','2025-05-15',NULL,NULL,90000000.00,'Hooghly Embankment Way','Kolkata','West Bengal','India',NULL,22.57260000,88.36390000,25.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000008','Lakeside Enclave','PRJ-LSE-008','Premium eco-friendly duplex homes overlooking Kankaria lake.','House','Medium','usr-home-0000000000000000000000008','usr-cont-0000000000000000000000003','In Progress','2023-08-01','2024-10-15',NULL,NULL,62000000.00,'Lakeside Promenade','Ahmedabad','Gujarat','India',NULL,23.02250000,72.57140000,75.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000009','Pinnacle Commercial Hub','PRJ-PCH-009','Grade-A office space complex with smart building automation.','Commercial','High','usr-home-0000000000000000000000009','usr-cont-0000000000000000000000004','Completed','2023-01-15','2024-02-28',NULL,NULL,140000000.00,'Golf Course Extension','Gurgaon','Haryana','India',NULL,28.45950000,77.02660000,100.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000010','Oakwood Estates','PRJ-OWE-010','Luxury suburban gated community with private garden plots.','Villa','Medium','usr-home-0000000000000000000000010','usr-cont-0000000000000000000000005','Planning','2024-08-15','2025-09-30',NULL,NULL,78000000.00,'Tonk Road Corridor','Jaipur','Rajasthan','India',NULL,26.91240000,75.78730000,10.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000011','Central Elevated Flyover','PRJ-CFB-011','4-lane elevated city corridor overpass to ease traffic congestion.','Infrastructure','High','usr-home-0000000000000000000000001','usr-cont-0000000000000000000000001','In Progress','2023-12-01','2025-06-30',NULL,NULL,250000000.00,'Hazratganj Main Junction','Lucknow','Uttar Pradesh','India',NULL,26.84670000,80.94620000,40.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000012','Grand Horizon Convention Center','PRJ-GCC-012','5,000 capacity international exhibition center and auditorium.','Commercial','Medium','usr-home-0000000000000000000000002','usr-cont-0000000000000000000000002','Planning','2024-10-01','2026-08-31',NULL,NULL,300000000.00,'Expressway Sector 128','Noida','Uttar Pradesh','India',NULL,28.53550000,77.39100000,0.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000013','Royal Palms Gated Community','PRJ-RPG-013','Exclusive 40-villa community with underground electrical lines and STP.','Villa','High','usr-home-0000000000000000000000003','usr-cont-0000000000000000000000003','In Progress','2023-05-01','2024-09-30',NULL,NULL,110000000.00,'Dumas Road','Surat','Gujarat','India',NULL,21.17020000,72.83110000,82.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000014','Urban Square Retail Hub','PRJ-USR-014','Open-air pedestrian shopping plaza and food street.','Commercial','Medium','usr-home-0000000000000000000000004','usr-cont-0000000000000000000000004','Completed','2022-11-01','2023-12-15',NULL,NULL,165000000.00,'Sector 17 Plaza','Chandigarh','Punjab','India',NULL,30.73330000,76.77940000,100.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('prj-00000000000000000000000000000015','Heritage Manor Restoration','PRJ-HMR-015','Restoration and structural strengthening of a 100-year-old heritage mansion.','Heritage','Medium','usr-home-0000000000000000000000005','usr-cont-0000000000000000000000005','Suspended','2023-07-15','2024-11-15',NULL,NULL,55000000.00,'Fort Kochi Heritage Zone','Kochi','Kerala','India',NULL,9.93120000,76.26730000,35.00,'2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `revoked_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_tokens_user` (`user_id`),
  CONSTRAINT `fk_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,'usr-admin-0000000000000000000000001','70b39629cd60fd317d1c2703e4f81fc2523e44c0373ca5d79d42528e72958a9ccd78b5ddb4d0afa4','2026-09-01 13:28:05','2026-08-25 13:28:04',NULL),(2,'usr-cont-0000000000000000000000001','0889720883c9e30168e21ccecd0794da3efe10eee1fafa64288a265178e221062928074f7705ff09','2026-09-01 13:28:11','2026-08-25 13:28:11',NULL),(3,'usr-home-0000000000000000000000001','1734a37f6e38f1d53110258c812a31e073f2202bcc5d1957ff790326e2874b15c8bf8a8baf39bcd3','2026-09-01 13:28:11','2026-08-25 13:28:11',NULL),(4,'usr-work-0000000000000000000000001','83f416fd64f17cc7dcd3750890bdf1e8d118491cacd994282613209ac1788f5dc08dd2bd06717118','2026-09-01 13:28:12','2026-08-25 13:28:11',NULL),(5,'usr-admin-0000000000000000000000001','f19ba2fc84ff23fc8dede07cd2a68fa71be41ca7773be8b3d25cef353bfab87afd713fde892ba83b','2026-09-01 13:29:06','2026-08-25 13:29:06',NULL),(6,'usr-cont-0000000000000000000000001','337ea576f604543b335ffd89644aad95cc5b74c62724d24520a16c98109cb67be3f2115718672ef6','2026-09-01 13:35:19','2026-08-25 13:35:19',NULL),(7,'usr-home-0000000000000000000000001','8b1c455e7823b59d1ee6c64aab6d6f54aef9cfb1e140f71efcdd849a51909cc6bf6c28533fbb43e0','2026-09-01 13:35:20','2026-08-25 13:35:19',NULL),(8,'usr-work-0000000000000000000000001','59a976e0655ec60d7b984520752695ce31c3670481fa6b04d35b92c0c92044aad811c74ec737e6e5','2026-09-01 13:35:20','2026-08-25 13:35:19',NULL),(9,'usr-admin-0000000000000000000000001','a33db8c0b3365a9069c4ec3638453a97f169dc26caf35735de56bdfd1d53cd725391dba93b1c54ed','2026-09-01 13:35:20','2026-08-25 13:35:19',NULL),(10,'usr-cont-0000000000000000000000001','8c3db1fb137307ec4351d6364abdf4c72317c4809ed688c3ae8542d21000b7cfc5ab3bce17c1b55f','2026-09-01 13:36:29','2026-08-25 13:36:28',NULL),(11,'usr-home-0000000000000000000000001','2d0b4b53e077d458c1e862d9094144f7d512756e41f069f902748eecf0244125d53508fe7cf1d15e','2026-09-01 13:36:29','2026-08-25 13:36:28',NULL),(12,'usr-work-0000000000000000000000001','1654d32603dcd73eef277da637fc995cf864517c0f67bbdd8537728ee0d0331222546f6bdf15df6c','2026-09-01 13:36:29','2026-08-25 13:36:28',NULL),(13,'usr-admin-0000000000000000000000001','82d7b2c41dd1f4af013efea036fb2f77091a4ecb0720fe6f77a739eb598473d553ad4b141618e8c8','2026-09-01 13:36:29','2026-08-25 13:36:29',NULL),(14,'usr-cont-0000000000000000000000001','f1c3465705018594b6f69fba7ccda38b1ec1c3bd465aac6ad04be51856a526070bf9140a7e919bbe','2026-09-01 13:37:24','2026-08-25 13:37:24',NULL),(15,'usr-home-0000000000000000000000001','29f46b3119a6a3031d0d5a3da8bdf0a5b28fad08c682a50fa258ef11634702c7b07f707863a193f8','2026-09-01 13:37:24','2026-08-25 13:37:24',NULL),(16,'usr-work-0000000000000000000000001','43a198bc2235f6edac110b19dbeba28617e3deb6bc35a231ced8e686e2c5da4287bc43e1a982d3a3','2026-09-01 13:37:24','2026-08-25 13:37:24',NULL),(17,'usr-admin-0000000000000000000000001','fa5120c950eacd4c58368b31f153d27b325ef2f11b9e1c6701e9f8860e7dd649410ba618da769780','2026-09-01 13:37:25','2026-08-25 13:37:24',NULL),(18,'usr-cont-0000000000000000000000001','77c886ed5c5661a8f1a8538ab015d0ce45be57e498b3e64ae1e9f4ef6f9d32cedcca06ae96646c0c','2026-09-01 13:41:51','2026-08-25 13:41:51',NULL),(19,'usr-cont-0000000000000000000000001','80f96a3d070cd711221dd1f6a264234ee8246a1c223d14c710f00ef3db96ed028e6991f49ab95492','2026-09-01 13:46:54','2026-08-25 13:46:54',NULL),(20,'usr-home-0000000000000000000000001','6a0683ca3f3863ab88c83942cc279d8c6511998c65257a8b4a1b819f173361f83ff08cc998caaf55','2026-09-01 13:46:55','2026-08-25 13:46:54',NULL),(21,'usr-work-0000000000000000000000001','b336f68f63aa525ad046efaa5f7800064af72b7d47f89ed7e634fb9ff76713ae1f4a9f9e9580c05d','2026-09-01 13:46:55','2026-08-25 13:46:54',NULL),(22,'usr-admin-0000000000000000000000001','87a7519e0af9799e60d090da87f6d4388d1ef929fc15dd89b3687e1d59b56826f237bce08e515d05','2026-09-01 13:46:55','2026-08-25 13:46:54',NULL),(23,'usr-cont-0000000000000000000000001','a59d622871a5a8896ee0086f752479dee1ff5e6d375a02c441c43f04d8538dbef9821d34f588a1a6','2026-09-01 13:51:36','2026-08-25 13:51:36',NULL),(24,'usr-home-0000000000000000000000001','88b75235ae240134d020ee2c123a44cd678f746d1b086fd3d52ea95fc076f4d44717250ac099b0e2','2026-09-01 13:51:37','2026-08-25 13:51:36',NULL),(25,'usr-work-0000000000000000000000001','bc72e9f7eb5efda86c5f30e587b8be03b952161e771cd5b16c2575d9aa0eccd302ab8a44dfdb06ce','2026-09-01 13:51:37','2026-08-25 13:51:36',NULL),(26,'usr-admin-0000000000000000000000001','545dd2d8f3590d39074535c6d6647e37f538ab861a49498ac64acf7904150d94915446cea4740607','2026-09-01 13:51:37','2026-08-25 13:51:36',NULL),(27,'usr-cont-0000000000000000000000001','410b4c50b71265d09e103cd3e621791f49b88f80f348d606f410082212045606786c910a6249504a','2026-09-01 13:58:07','2026-08-25 13:58:07',NULL),(28,'usr-work-0000000000000000000000001','69c5a2d5eeb9d68318e7c2c69ccb87c41fe228f9e3e1b64a320c4957ef7e2362cdb8b533f8accc1d','2026-09-01 13:58:07','2026-08-25 13:58:07',NULL),(29,'usr-cont-0000000000000000000000001','a2f7e1e1790e4fe6ba64baa761b2c9283bc0b149765fb540777ecc57603d33ec60720dfd7e88f61b','2026-09-01 13:58:27','2026-08-25 13:58:26',NULL),(30,'usr-work-0000000000000000000000001','c9eaab03e9ab5a681a125e5bb839d5ab5b9e409cdc89584af06da24c5352b374ce888aa51388b0b7','2026-09-01 13:58:27','2026-08-25 13:58:27',NULL),(31,'usr-cont-0000000000000000000000001','0c11f0e77ac30540d0e7e0dbb5e193ac1a5ce8e1463d7f676c28c6f35635e009d9e2155e09ae7fef','2026-09-01 13:59:07','2026-08-25 13:59:06',NULL),(32,'usr-work-0000000000000000000000001','3be195d901f074ae748bb88dd7f49b63fe6d4bda4ea3d996ec56bc9fad0abec336df5452b6d34ab1','2026-09-01 13:59:07','2026-08-25 13:59:07',NULL),(33,'usr-cont-0000000000000000000000001','cc08d70b1e72b568983306ed6257052b2d54c9bc0c1f073d985171b164fb1e1a19dffa80637a6ba3','2026-09-01 13:59:11','2026-08-25 13:59:11',NULL),(34,'usr-home-0000000000000000000000001','01ded138387b4425c2dea3410712700b822faf00b81ab8298244dd1d6cbcae028245bfd7237c6514','2026-09-01 13:59:12','2026-08-25 13:59:11',NULL),(35,'usr-work-0000000000000000000000001','a49f684cf38e9b491d1ed8a3b5e76a0b0c2760a9c75080aa7c290634bee213208a77780e90a56ca3','2026-09-01 13:59:12','2026-08-25 13:59:11',NULL),(36,'usr-admin-0000000000000000000000001','efbe30a821b015e849a216f3889918cd5a063b988260e7811d3b023ab1919dcce5a9f030a4df82fe','2026-09-01 13:59:12','2026-08-25 13:59:11',NULL),(37,'usr-cont-0000000000000000000000001','3156d1285122dcfa7beb0ed2f8968355d7a4da62802888a4dc5f7c56b8dd956f21f357525dc3a2dd','2026-09-01 14:05:29','2026-08-25 14:05:28',NULL),(38,'usr-work-0000000000000000000000001','04a368acb342fb3ab3340eadf503d79b759d9dfed3db0cbe74b19e69c0c44e5d476f55eeead8f601','2026-09-01 14:05:29','2026-08-25 14:05:28',NULL),(39,'usr-work-0000000000000000000000002','10e367f2a2f9325d9edac60425bff80549070c9be087c2d5c643248a424252c02d75e3bb074df950','2026-09-01 14:05:29','2026-08-25 14:05:29',NULL),(40,'usr-cont-0000000000000000000000001','df67f68bc273d0542af52b308932dd5cebebd8f55a85cb1909fbc17cb1ac6b347e87a5ea511e2c72','2026-09-01 14:05:36','2026-08-25 14:05:35',NULL),(41,'usr-home-0000000000000000000000001','1846ee4f26088515c0945e1c9159da0c50f410f2339b6bcfce09e4848ad16b11da657741043412e7','2026-09-01 14:05:36','2026-08-25 14:05:36',NULL),(42,'usr-work-0000000000000000000000001','127f334e8f63f82d3600bc558474b3f031d14663e230d3914103281c9bb341f109d0bc9ad38ce1f1','2026-09-01 14:05:36','2026-08-25 14:05:36',NULL),(43,'usr-admin-0000000000000000000000001','f0b2e2fedd84844e0ed0b06b1619356facf95b895592e30b3fa3adfba6c3d639fcda5ef1720d653c','2026-09-01 14:05:36','2026-08-25 14:05:36',NULL),(44,'usr-cont-0000000000000000000000001','098355277c3e601f0947183ecfec549678c4a7c31c3b5b24709332c5c678c4b3c7487ad681db5bd6','2026-09-01 14:09:52','2026-08-25 14:09:51',NULL),(45,'usr-cont-0000000000000000000000001','c644bd42d2a3d565d2a4fd6aa42dc6ac7b911c10a7d24cdbfc8430ea1573d501ef028f871dc86c42','2026-09-01 14:09:57','2026-08-25 14:09:56',NULL),(46,'usr-home-0000000000000000000000001','49b06369625d51a9b385fc5d9ffabe4abf649995f512761d6383664956e917bed0e3e60ec458e427','2026-09-01 14:09:57','2026-08-25 14:09:56',NULL),(47,'usr-work-0000000000000000000000001','f9b5ecf53bb5827de0b98fe385dada7cf22ec64ff711e83c7e1ad441a14f86450bd8f23e53bea98d','2026-09-01 14:09:57','2026-08-25 14:09:56',NULL),(48,'usr-admin-0000000000000000000000001','52e554e265b93636ad8c802c84985a92bb48a7574e5e80a28424367d94c51b8bfedbf352091da891','2026-09-01 14:09:57','2026-08-25 14:09:56',NULL),(49,'usr-cont-0000000000000000000000001','e6405e9a3b3e8559dd679e59845c8ce2cf913535bbeee101ad1802eb7f960dd22443ba9bc0060122','2026-09-01 14:11:50','2026-08-25 14:11:50',NULL),(50,'usr-home-0000000000000000000000001','407592fedfa0f8cd9f116b20e10e30f3699b55f21c5948bdbac00cd8b2a4ba76ca2a6d2422e1337e','2026-09-01 14:11:50','2026-08-25 14:11:50',NULL),(51,'usr-work-0000000000000000000000001','3eacfca4e29e221a011cdc2847d1b45b05cf88ddefb6643f88cc3ecd6de1a464c4e8389c96a8d9af','2026-09-01 14:11:50','2026-08-25 14:11:50',NULL),(52,'usr-admin-0000000000000000000000001','f541d6c40de1fc72ef5b1efe54fca90386904c81fab5a273eb6e328c95e74cb0e159a1de7b5f5fda','2026-09-01 14:11:50','2026-08-25 14:11:50',NULL),(53,'usr-cont-0000000000000000000000001','97eb522a136513fc0a7dca315ab547321ff9e9dfc861abe6200d635d7b4c8218c273aee197737ffc','2026-09-01 14:16:34','2026-08-25 14:16:33',NULL),(54,'usr-cont-0000000000000000000000001','216a0793806f9d4eac616e49b357514f6f95b5d761742cc02b90d36779a2399d32e3d5ca8725771d','2026-09-01 14:16:37','2026-08-25 14:16:36',NULL),(55,'usr-home-0000000000000000000000001','e8b0e02ecfdbc448eea3985ceb6f85213974098cdfba7b504583721c78c49808eae0b69c8a3fa76c','2026-09-01 14:16:37','2026-08-25 14:16:37',NULL),(56,'usr-work-0000000000000000000000001','584c432a0340da095e955e31a4020cae0c0a315518341e4bb84f57327343db14497f8d85b3105ba8','2026-09-01 14:16:37','2026-08-25 14:16:37',NULL),(57,'usr-admin-0000000000000000000000001','afc642ba8900486f033577cfbdc98701726d44012d96a8e4c3c8c9ec7f9acb93cbf38468aef31e54','2026-09-01 14:16:37','2026-08-25 14:16:37',NULL),(58,'usr-cont-0000000000000000000000001','ffc9f020e51233106961a53623c722044bf9c4c38f84d3d8feb191244a4ba42a23961257f6e1255e','2026-09-01 14:17:44','2026-08-25 14:17:43',NULL),(59,'usr-cont-0000000000000000000000001','d521f316a57a03c961774b5b8bb751add29cee38de28554bcf758c6dc24c9abec77680380e5ebc28','2026-09-01 14:17:49','2026-08-25 14:17:49',NULL),(60,'usr-home-0000000000000000000000001','11db31de8d070697146ce55ffbe01af527a71db44bf1cc7c9b6481261b246af8808591077d7704d0','2026-09-01 14:17:50','2026-08-25 14:17:49',NULL),(61,'usr-work-0000000000000000000000001','649d64abbccad8bd151951d2cd1dd5f5300f0c2577cc01485cd87872ca93b960c0248a100b3e630d','2026-09-01 14:17:50','2026-08-25 14:17:49',NULL),(62,'usr-admin-0000000000000000000000001','40deeb8358b1390a9c6b3ca2b2ade4115eef6f5e9e6969f2fe7e2441061383ef2b35b27e53338663','2026-09-01 14:17:50','2026-08-25 14:17:49',NULL),(63,'usr-cont-0000000000000000000000001','cee2e971fe8f9df59a7b0dc36f8ca0f7d211eae39889dffc38ea2b38121956c0aaa94a963f3da110','2026-09-01 14:22:40','2026-08-25 14:22:40',NULL),(64,'usr-home-0000000000000000000000001','68c8edfb2dbfdd3be58c288d5dfc1d8748d78332e28e9aa118d24b2f37a6a6a739ee41a413606627','2026-09-01 14:22:40','2026-08-25 14:22:40',NULL),(65,'usr-work-0000000000000000000000001','029b0763b7843401f14618950f1502ad03080112b015bc592fc9e73bc5e1bf60b2bbaac81837e679','2026-09-01 14:22:40','2026-08-25 14:22:40',NULL),(66,'usr-admin-0000000000000000000000001','2b82ea28bc733bfe4f9e0bbd7e2a93f699c0d7351cb5b16d1228391aa8acd624f387bd9a67104998','2026-09-01 14:22:40','2026-08-25 14:22:40',NULL),(67,'usr-admin-0000000000000000000000001','0101e7ede4d09c76fdf77ec1764acf9955d8a048042fe44307d6b4712894ae4aff1182717f08f336','2026-09-01 15:22:02','2026-08-25 15:22:02',NULL),(68,'usr-cont-0000000000000000000000001','92c140aef2c3c3592fcd34286b5da586ce079fb3018611ae688298cce22624ee1c5210957820c324','2026-09-01 15:23:35','2026-08-25 15:23:35',NULL),(69,'usr-home-0000000000000000000000001','c627532dfd00c9de5d937acc73cc1e644c8d0b4c3a49318058bbeae6589bcf657fd3020d9e75a43e','2026-09-01 15:23:35','2026-08-25 15:23:35',NULL),(70,'usr-work-0000000000000000000000001','ed28a7ade1c05bbf1ae827f6b21307e3fc268db8f12e1744ed79ee65fcf885b9d1db7718df0636a5','2026-09-01 15:23:35','2026-08-25 15:23:35',NULL),(71,'usr-admin-0000000000000000000000001','5ec0ff38775953e51215dabe25aa327bdb635abbfc853ed537b3fa55323b3d37bed522e1ad66138e','2026-09-01 15:23:35','2026-08-25 15:23:35',NULL),(72,'usr-cont-0000000000000000000000001','8aaefad23a94ef929d762794670e7cf8e492cd046e71ef2bbf4702e2e18c333314a9813cd829e583','2026-09-01 15:26:22','2026-08-25 15:26:21',NULL),(73,'usr-home-0000000000000000000000001','7a2b5db3e6e65a7cff399c6a274e3dd2bd6b3fa068e5dda737181dc61237907250c1822b5b76520b','2026-09-01 15:26:22','2026-08-25 15:26:21',NULL),(74,'usr-work-0000000000000000000000001','303e7ceaa38868211e2c00f0a306050b2ac56676a70231f4e208b8ebc8490d6927924a085ce66b4b','2026-09-01 15:26:22','2026-08-25 15:26:22',NULL),(75,'usr-admin-0000000000000000000000001','b1da60bd230f0649d435e7e64f650963dd8e7af806a164161d7cfe935708e7b866ce1c3e1f5cb652','2026-09-01 15:26:22','2026-08-25 15:26:22',NULL),(76,'usr-work-0000000000000000000000001','4ac31c1e5398a99525b48ef8ed815002b388370a42cdfe84e50ceaff822da06a5975594fbd5ba4f0','2026-09-01 15:26:47','2026-08-25 15:26:47',NULL),(77,'usr-cont-0000000000000000000000001','4c816e4343afa65bfb86ba93472c8a892cd19b71574fffd7848e598c74d80248fec8e2d4dd7efa21','2026-09-01 15:29:39','2026-08-25 15:29:38',NULL),(78,'usr-home-0000000000000000000000001','bb92671d1a30b2f006b60ae2666f99b981afd98029853b25f2359d617231a330717824a589326fca','2026-09-01 15:29:39','2026-08-25 15:29:38',NULL),(79,'usr-work-0000000000000000000000001','c01730e9ba7c94183686ecc6415ded3a79579a4bd29534ab572ba95178643f638c4b6642361b5471','2026-09-01 15:29:39','2026-08-25 15:29:38',NULL),(80,'usr-admin-0000000000000000000000001','21cc311badd8f51e21562a97980fb3cc7b34755d2c09959bcb666810469c4a2f2bbb3f5f2c74665f','2026-09-01 15:29:39','2026-08-25 15:29:38',NULL);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_assignees`
--

DROP TABLE IF EXISTS `task_assignees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_assignees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `worker_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_task_worker` (`task_id`,`worker_id`),
  KEY `fk_ta_worker` (`worker_id`),
  CONSTRAINT `fk_ta_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ta_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_assignees`
--

LOCK TABLES `task_assignees` WRITE;
/*!40000 ALTER TABLE `task_assignees` DISABLE KEYS */;
INSERT INTO `task_assignees` VALUES (1,'tsk-00000000000000000000000000000001','usr-work-0000000000000000000000001','2026-08-25 13:14:18'),(2,'tsk-00000000000000000000000000000002','usr-work-0000000000000000000000018','2026-08-25 13:14:18'),(3,'tsk-00000000000000000000000000000003','usr-work-0000000000000000000000004','2026-08-25 13:14:18'),(4,'tsk-00000000000000000000000000000004','usr-work-0000000000000000000000007','2026-08-25 13:14:18'),(5,'tsk-00000000000000000000000000000005','usr-work-0000000000000000000000010','2026-08-25 13:14:18'),(6,'tsk-00000000000000000000000000000006','usr-work-0000000000000000000000001','2026-08-25 13:14:18'),(7,'tsk-00000000000000000000000000000007','usr-work-0000000000000000000000004','2026-08-25 13:14:18'),(8,'tsk-00000000000000000000000000000008','usr-work-0000000000000000000000002','2026-08-25 13:14:18'),(9,'tsk-00000000000000000000000000000009','usr-work-0000000000000000000000009','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `task_assignees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigned_worker_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Todo',
  `priority` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Medium',
  `due_date` date DEFAULT NULL,
  `estimated_duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachments` text COLLATE utf8mb4_unicode_ci,
  `milestone_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `review_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contractor_comments` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_tasks_milestone` (`milestone_id`),
  KEY `idx_tasks_project` (`project_id`),
  KEY `idx_tasks_worker` (`assigned_worker_id`),
  CONSTRAINT `fk_tasks_milestone` FOREIGN KEY (`milestone_id`) REFERENCES `milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tasks_worker` FOREIGN KEY (`assigned_worker_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('tsk-00000000000000000000000000000001','prj-00000000000000000000000000000001','usr-work-0000000000000000000000001','Site Layout & Foundation Excavation','Mark boundaries with theodolite and excavate footing trenches to 2.5m depth.','Completed','High','2024-02-15','20 Days',NULL,'mls-00000000000000000000000000000001',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000002','prj-00000000000000000000000000000001','usr-work-0000000000000000000000018','Foundation Rebar & Footing Casting','Tie 16mm/12mm Fe500D rebar cages and pour M25 ready-mix concrete.','Completed','High','2024-03-25','18 Days',NULL,'mls-00000000000000000000000000000001',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000003','prj-00000000000000000000000000000001','usr-work-0000000000000000000000004','Ground Floor Column Shuttering & Casting','Set ply formwork shuttering with props and cast 12 structural columns.','Completed','High','2024-05-10','15 Days',NULL,'mls-00000000000000000000000000000002',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000004','prj-00000000000000000000000000000001','usr-work-0000000000000000000000007','Main Electrical Conduit Piping','Install heavy duty FRLS conduit pipes and junction boxes inside wall chases.','In Progress','Medium','2024-08-20','10 Days',NULL,'mls-00000000000000000000000000000003',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000005','prj-00000000000000000000000000000001','usr-work-0000000000000000000000010','Plumbing Riser Pipe Connections','Run CPVC water supply lines and UPVC drainage soil pipes to overhead tank.','In Progress','High','2024-08-28','12 Days',NULL,'mls-00000000000000000000000000000003',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000006','prj-00000000000000000000000000000001','usr-work-0000000000000000000000001','Exterior Brick Masonry Block A','Lay AAC blocks with high tensile polymer mortar up to roof slab height.','Todo','Medium','2024-09-15','14 Days',NULL,'mls-00000000000000000000000000000003',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000007','prj-00000000000000000000000000000001','usr-work-0000000000000000000000004','Door Frame & Window Shutter Fixing','Fix teak wood door frames and aluminum window sub-frames.','Todo','Medium','2024-10-10','10 Days',NULL,'mls-00000000000000000000000000000004',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000008','prj-00000000000000000000000000000002','usr-work-0000000000000000000000002','14th Floor Slab Rebar Reinforcement','Lay slab bottom mesh and tie stirrups for main structural transfer girders.','In Progress','High','2024-08-25','8 Days',NULL,'mls-00000000000000000000000000000006',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('tsk-00000000000000000000000000000009','prj-00000000000000000000000000000002','usr-work-0000000000000000000000009','3-Phase Busbar Trunking Installation','Install copper busbar riser in main electrical shaft from LT panel.','In Progress','High','2024-09-05','14 Days',NULL,'mls-00000000000000000000000000000006',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '1',
  `verification_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL,
  `provider` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'local',
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('usr-admin-0000000000000000000000001','System Admin','admin@constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Admin','+91-9876543210','ConstructIQ Headquarters',1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-cont-0000000000000000000000001','Alex Turner','contact@abcconstructions.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Contractor','+91-9880011221','ABC Constructions Ltd',1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-cont-0000000000000000000000002','Marcus Vance','contact@skylinebuilders.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Contractor','+91-9880011222','Skyline Builders & Developers',1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-cont-0000000000000000000000003','Elena Rostova','contact@greenstone.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Contractor','+91-9880011223','GreenStone Infra Corp',1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-cont-0000000000000000000000004','Rajesh Verma','contact@primeinfra.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Contractor','+91-9880011224','Prime Infrastructure Projects',1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-cont-0000000000000000000000005','Vikramaditya Rao','contact@elitestructures.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Contractor','+91-9880011225','Elite Structures & Civil Eng',1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000001','Robert Taylor','robert.taylor@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022331',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000002','Sarah Jenkins','sarah.jenkins@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022332',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000003','David Miller','david.miller@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022333',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000004','Emily Clark','emily.clark@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022334',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000005','James Wilson','james.wilson@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022335',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000006','Amanda Martinez','amanda.martinez@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022336',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000007','Thomas Anderson','thomas.anderson@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022337',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000008','Laura White','laura.white@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022338',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000009','Daniel Harris','daniel.harris@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022339',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-home-0000000000000000000000010','Sophia Martin','sophia.martin@example.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Homeowner','+91-9770022340',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000001','Arjun Sharma','arjun.sharma@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033401',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000002','Bhavesh Patel','bhavesh.patel@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033402',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000003','Chirag Verma','chirag.verma@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033403',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000004','Dinesh Kumar','dinesh.kumar@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033404',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000005','Eashwar Reddy','eashwar.reddy@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033405',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000006','Farhan Khan','farhan.khan@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033406',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000007','Girish Nair','girish.nair@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033407',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000008','Harish Rao','harish.rao@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033408',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000009','Imran Shaikh','imran.shaikh@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033409',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000010','Jatin Joshi','jatin.joshi@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033410',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000011','Karthik Sundaram','karthik.sundaram@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033411',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000012','Lokesh Yadav','lokesh.yadav@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033412',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000013','Manish Gupta','manish.gupta@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033413',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000014','Naveen Kumar','naveen.kumar@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033414',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000015','Omkar Patil','omkar.patil@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033415',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000016','Pankaj Singh','pankaj.singh@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033416',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000017','Qasim Ali','qasim.ali@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033417',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000018','Ramesh Choudhary','ramesh.choudhary@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033418',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000019','Suresh Gowda','suresh.gowda@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033419',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000020','Tufail Ahmed','tufail.ahmed@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033420',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000021','Umesh Solanki','umesh.solanki@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033421',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000022','Vikram Deshmukh','vikram.deshmukh@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033422',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000023','Wasim Akram','wasim.akram@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033423',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000024','Yogesh Thanvi','yogesh.thanvi@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033424',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000025','Zubair Hussain','zubair.hussain@worker.constructiq.com','$2a$10$uFoNRBb3VS.d4VuOdhPl6OSISDeUBWCjSR6ObJolX0cWRH3yqOX8m','Worker','+91-9660033425',NULL,1,NULL,NULL,NULL,'local',NULL,NULL,'2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worker_invitations`
--

DROP TABLE IF EXISTS `worker_invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worker_invitations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractor_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `worker_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_wi_contractor` (`contractor_id`),
  KEY `idx_wi_worker` (`worker_id`),
  KEY `idx_wi_project` (`project_id`),
  CONSTRAINT `fk_wi_contractor` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wi_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wi_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker_invitations`
--

LOCK TABLES `worker_invitations` WRITE;
/*!40000 ALTER TABLE `worker_invitations` DISABLE KEYS */;
INSERT INTO `worker_invitations` VALUES ('inv-w-000000000000000000000000000001','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','usr-work-0000000000000000000000001','Accepted','Invitation to join Green Valley Villas construction team.','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-w-000000000000000000000000000002','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','usr-work-0000000000000000000000004','Accepted','Invitation to join Green Valley Villas construction team.','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-w-000000000000000000000000000003','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','usr-work-0000000000000000000000007','Accepted','Invitation to join Green Valley Villas construction team.','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-w-000000000000000000000000000004','prj-00000000000000000000000000000001','usr-cont-0000000000000000000000001','usr-work-0000000000000000000000015','Pending','Urgent requirement for painting specialist on site.','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-w-000000000000000000000000000005','prj-00000000000000000000000000000002','usr-cont-0000000000000000000000002','usr-work-0000000000000000000000002','Accepted','High-rise residential masonry work team invitation.','2026-08-25 13:14:18','2026-08-25 13:14:18'),('inv-w-000000000000000000000000000006','prj-00000000000000000000000000000002','usr-cont-0000000000000000000000002','usr-work-0000000000000000000000017','Pending','Welding and structural truss joining invitation.','2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `worker_invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worker_profiles`
--

DROP TABLE IF EXISTS `worker_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worker_profiles` (
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skill` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `availability` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Available',
  `expected_daily_wage` decimal(10,2) DEFAULT NULL,
  `about_me` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portfolio_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_wp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker_profiles`
--

LOCK TABLES `worker_profiles` WRITE;
/*!40000 ALTER TABLE `worker_profiles` DISABLE KEYS */;
INSERT INTO `worker_profiles` VALUES ('usr-work-0000000000000000000000001','Mason','8 Years','Mumbai','Available',950.00,'Specialist in brickwork, AAC block masonry, and structural concrete casting.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',NULL,4.90,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000002','Mason','12 Years','Ahmedabad','Busy',1100.00,'Master mason for structural columns, arch building, and decorative stone facades.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',NULL,4.80,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000003','Mason','5 Years','Delhi','Available',850.00,'Experienced in wall plastering, cement screed, and block masonry.','https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',NULL,4.70,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000004','Carpenter','7 Years','Bangalore','Available',1000.00,'Skilled in shuttering, formwork, and interior wooden framing.','https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',NULL,4.85,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000005','Carpenter','10 Years','Hyderabad','Busy',1200.00,'Expert carpenter for roof trusses, modular cabinetry, and doors.','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',NULL,4.95,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000006','Carpenter','4 Years','Pune','Available',800.00,'Specialize in concrete formwork shuttering and scaffolding erection.','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',NULL,4.60,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000007','Electrician','9 Years','Kochi','Available',1150.00,'Licensed industrial electrician for 3-phase wiring and DB panel setup.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',NULL,4.90,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000008','Electrician','6 Years','Chennai','Busy',950.00,'Residential and commercial conduit piping and light fixture fitting.','https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',NULL,4.75,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000009','Electrician','11 Years','Mumbai','Available',1300.00,'High-voltage wiring, earthing pits, and solar inverter installations.','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',NULL,5.00,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000010','Plumber','8 Years','Delhi','Available',1050.00,'Sanitary fittings, CPVC/UPVC pipe laying, and drainage systems.','https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150',NULL,4.80,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000011','Plumber','5 Years','Bangalore','Available',900.00,'Bathroom plumbing, overhead tank connections, and leak repairs.','https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',NULL,4.65,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000012','Plumber','14 Years','Jaipur','Busy',1250.00,'Master plumber for high-rise residential plumbing networks.','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',NULL,4.95,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000013','Painter','6 Years','Kolkata','Available',850.00,'Interior texture painting, primer coats, and putty applications.','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',NULL,4.70,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000014','Painter','9 Years','Hyderabad','Available',950.00,'Exterior weather-proof coating, spray painting, and waterproofing.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',NULL,4.85,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000015','Painter','4 Years','Pune','Available',750.00,'Wall sanding, wood polishing, and enamel painting coats.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',NULL,4.50,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000016','Welder','8 Years','Nagpur','Busy',1100.00,'ARC and MIG welding for structural steel beams and trusses.','https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',NULL,4.80,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000017','Welder','10 Years','Lucknow','Available',1200.00,'Certified welder for pressure pipes and heavy steel frame fabrications.','https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',NULL,4.90,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000018','Steel Fixer','7 Years','Indore','Available',950.00,'Rebar bending, column cage tying, and slab mesh reinforcement.','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',NULL,4.75,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000019','Steel Fixer','11 Years','Bangalore','Available',1150.00,'Beam rebar fabrication and heavy structural steel binding.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',NULL,4.92,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000020','Steel Fixer','5 Years','Surat','Busy',900.00,'Foundation rebar placement and footing rebar binding.','https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',NULL,4.60,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000021','Tile Worker','8 Years','Ahmedabad','Available',1050.00,'Vitrified tile laying, marble flooring, and wall tile cladding.','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',NULL,4.85,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000022','Tile Worker','6 Years','Mumbai','Available',950.00,'Granite counter fitting, precision tile cutting, and grouting.','https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150',NULL,4.70,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000023','Helper','3 Years','Kanpur','Available',650.00,'General site assistance, material handling, and site cleanup.','https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',NULL,4.55,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000024','Helper','4 Years','Jodhpur','Available',700.00,'Concrete mixing assistance, brick carrying, and excavation support.','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',NULL,4.65,'2026-08-25 13:14:18','2026-08-25 13:14:18'),('usr-work-0000000000000000000000025','Helper','2 Years','Bhopal','Available',600.00,'Helper for plumbing, electrical conduit pulling, and loading.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',NULL,4.50,'2026-08-25 13:14:18','2026-08-25 13:14:18');
/*!40000 ALTER TABLE `worker_profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-31 21:09:08
