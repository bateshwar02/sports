-- ==============================================================================
-- SPORTS MANAGEMENT SYSTEM (SMS) - RELATIONAL DATABASE SCHEMA
-- Target Engine: MySQL 8.0+ / MariaDB 10.5+
-- Specification: Full-Stack Technical Blueprint Section 6
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS winners;
DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS game_slots;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- Table 1: roles
-- ------------------------------------------------------------------------------
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    permissions JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: users
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'volunteer', 'player') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- ------------------------------------------------------------------------------
-- Table 3: classes
-- ------------------------------------------------------------------------------
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    class_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_classes_status ON classes(status);

-- ------------------------------------------------------------------------------
-- Table 4: games
-- ------------------------------------------------------------------------------
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL COMMENT 'Age/Class category e.g. U-14, Open, Class 6-8',
    venue VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_players INT NOT NULL DEFAULT 50,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_games_date ON games(date);

-- ------------------------------------------------------------------------------
-- Table 5: game_slots
-- ------------------------------------------------------------------------------
CREATE TABLE game_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    slot_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    allocated_capacity INT NOT NULL DEFAULT 20,
    available_slots INT NOT NULL DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_slots_game ON game_slots(game_id);

-- ------------------------------------------------------------------------------
-- Table 6: players
-- ------------------------------------------------------------------------------
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    class_id INT NOT NULL,
    game_id INT NOT NULL,
    slot_id INT NULL,
    name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150) NOT NULL,
    village VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    image_url VARCHAR(255) NULL,
    aadhaar_no VARCHAR(20) NOT NULL,
    aadhaar_url VARCHAR(255) NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    rejection_reason TEXT NULL,
    is_present TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE RESTRICT,
    FOREIGN KEY (slot_id) REFERENCES game_slots(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_players_game ON players(game_id);
CREATE INDEX idx_players_class ON players(class_id);
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_players_mobile ON players(mobile);

-- ------------------------------------------------------------------------------
-- Table 7: volunteers
-- ------------------------------------------------------------------------------
CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_volunteers_user ON volunteers(user_id);

-- ------------------------------------------------------------------------------
-- Table 8: winners
-- ------------------------------------------------------------------------------
CREATE TABLE winners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    player_id INT NOT NULL,
    position ENUM('1st', '2nd', '3rd') NOT NULL,
    prize_title VARCHAR(150) NOT NULL,
    remarks TEXT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE KEY unique_game_position (game_id, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_winners_game ON winners(game_id);
CREATE INDEX idx_winners_player ON winners(player_id);
