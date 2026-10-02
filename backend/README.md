# Sports Management System - Backend Deployment Guide

Production-Ready PHP 7.4+ REST API with PDO, MySQL 8.0+, JWT Authentication, and Secure Multipart File Processing.

---

## 1. Requirements
- PHP 7.4 or PHP 8.0+ with extensions: `pdo_mysql`, `fileinfo`, `json`, `mbstring`
- MySQL 8.0+ or MariaDB 10.5+
- Apache with `mod_rewrite` enabled OR Nginx with PHP-FPM

---

## 2. Database Initialization
```bash
# Log in to MySQL and create the database
mysql -u root -p -e "CREATE DATABASE sports_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import the schema (Section 6)
mysql -u root -p sports_db < backend/database/schema.sql

# Import seed records (Default Admins, Volunteers, Athletes, Games & Slots)
mysql -u root -p sports_db < backend/database/seed.sql
```

---

## 3. Environment Configuration
1. Copy `config/db.example.php` to `config/db.php`:
   ```bash
   cp backend/config/db.example.php backend/config/db.php
   ```
2. Set your database credentials (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`) and a secure `JWT_SECRET`.

---

## 4. Running Locally with PHP Built-in Server
To run the decoupled API server on port 8000:
```bash
cd backend
php -S localhost:8000 api/index.php
```

---

## 5. Apache VirtualHost Configuration
```apache
<VirtualHost *:80>
    ServerName sports-api.local
    DocumentRoot "d:/Bateswar/sports/backend"

    <Directory "d:/Bateswar/sports/backend">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

---

## 6. Default Seed Credentials
| Role | Portal / Username | Password | Actions |
|------|-------------------|----------|---------|
| **Admin** | `admin` | `admin123` | Full CRUD on games, volunteers, classes, winners |
| **Volunteer** | `volunteer` | `vol123` | Verify athlete documents, approve/reject, inspect slots |
| **Player** | `9876543210` | `player123` | Self-service status, assigned slot, certificate |
