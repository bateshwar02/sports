<?php
/**
 * User DAO / Active Record Class
 * Blueprint Section 2, 6, 11
 */

require_once __DIR__ . '/../config/db.php';

class User {
    public static function findByUsername(string $username): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, role_id, username, role, status, created_at FROM users WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function create(string $username, string $password, string $role, int $roleId = 3): int {
        $pdo = Database::getConnection();
        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role, role_id, status) VALUES (:u, :p, :r, :rid, 'active')");
        $stmt->execute([
            'u' => $username,
            'p' => $hash,
            'r' => $role,
            'rid' => $roleId
        ]);
        return (int)$pdo->lastInsertId();
    }
}
