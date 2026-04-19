-- ============================
-- Rakshak Database Schema
-- ============================

CREATE DATABASE IF NOT EXISTS rakshak_db;
USE rakshak_db;

-- ── Users ──
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  phone      VARCHAR(20) DEFAULT NULL,
  role       ENUM('citizen','responder','admin') DEFAULT 'citizen',
  avatar_url VARCHAR(500) DEFAULT NULL,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
);

-- ── Incidents ──
CREATE TABLE IF NOT EXISTS incidents (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  type         ENUM('fire','accident','medical','flood','other') NOT NULL,
  description  TEXT,
  severity     ENUM('low','medium','high','critical') DEFAULT 'medium',
  status       ENUM('pending','assigned','in_progress','resolved') DEFAULT 'pending',
  latitude     DECIMAL(10,7) DEFAULT NULL,
  longitude    DECIMAL(10,7) DEFAULT NULL,
  address      VARCHAR(500) DEFAULT NULL,
  image_url    VARCHAR(500) DEFAULT NULL,
  reported_by  INT DEFAULT NULL,
  assigned_to  INT DEFAULT NULL,
  source       VARCHAR(50) DEFAULT 'app',
  resolved_at  TIMESTAMP NULL DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_incidents_status (status),
  INDEX idx_incidents_severity (severity),
  INDEX idx_incidents_type (type),
  INDEX idx_incidents_created (created_at)
);

-- ── Incident Logs (audit trail) ──
CREATE TABLE IF NOT EXISTS incident_logs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  incident_id   INT NOT NULL,
  action        VARCHAR(255) NOT NULL,
  performed_by  INT DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_logs_incident (incident_id)
);

-- ── Notifications ──
CREATE TABLE IF NOT EXISTS notifications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  message     TEXT,
  type        ENUM('incident','status_update','assignment','system') DEFAULT 'system',
  ref_id      INT DEFAULT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (user_id),
  INDEX idx_notif_read (is_read)
);

-- ── Responder Live Locations ──
CREATE TABLE IF NOT EXISTS responder_locations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL UNIQUE,
  latitude    DECIMAL(10,7) NOT NULL,
  longitude   DECIMAL(10,7) NOT NULL,
  heading     FLOAT DEFAULT NULL,
  speed       FLOAT DEFAULT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_resp_loc_user (user_id)
);
