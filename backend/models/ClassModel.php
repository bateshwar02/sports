<?php
/**
 * Class & Division DAO
 * Blueprint Section 4.2, 6, 8
 */

require_once __DIR__ . '/../config/db.php';

class ClassModel {
    public static function getAll(): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT * FROM classes WHERE status = 'active' ORDER BY id ASC");
        return $stmt->fetchAll();
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO classes (class_name, class_code, description, status) 
                               VALUES (:name, :code, :desc, :status)");
        $stmt->execute([
            'name' => $data['class_name'],
            'code' => strtoupper($data['class_code']),
            'desc' => $data['description'] ?? '',
            'status' => $data['status'] ?? 'active'
        ]);
        return (int)$pdo->lastInsertId();
    }
}
