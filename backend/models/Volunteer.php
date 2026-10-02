<?php
/**
 * Volunteer DAO
 * Blueprint Section 4.1, 6, 7
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/User.php';

class Volunteer {
    public static function getAll(): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT v.*, u.username, u.status as account_status 
                             FROM volunteers v
                             LEFT JOIN users u ON v.user_id = u.id
                             ORDER BY v.id DESC");
        return $stmt->fetchAll();
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        // Create user account first
        $username = $data['username'] ?? ('vol_' . preg_replace('/[^\d]/', '', $data['mobile']));
        $password = $data['password'] ?? 'vol123';
        $userId = User::create($username, $password, 'volunteer', 2);

        $stmt = $pdo->prepare("INSERT INTO volunteers (user_id, name, mobile, email, village, district, status)
                               VALUES (:uid, :name, :mobile, :email, :village, :district, 'active')");
        $stmt->execute([
            'uid' => $userId,
            'name' => $data['name'],
            'mobile' => $data['mobile'],
            'email' => $data['email'] ?? '',
            'village' => $data['village'],
            'district' => $data['district'] ?? 'Azamgarh'
        ]);
        return (int)$pdo->lastInsertId();
    }

    public static function toggleStatus(int $id, string $status): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE volunteers SET status = :s WHERE id = :id");
        return $stmt->execute(['s' => $status, 'id' => $id]);
    }

    public static function updateRegion(int $id, string $village, string $district): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE volunteers SET village = :v, district = :d WHERE id = :id");
        return $stmt->execute(['v' => $village, 'd' => $district, 'id' => $id]);
    }
}
