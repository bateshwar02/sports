<?php
/**
 * Player DAO / Active Record Class
 * Blueprint Section 6, 7, 8
 */

require_once __DIR__ . '/../config/db.php';

class Player {
    public static function getAll(array $filters = [], int $limit = 25, int $offset = 0): array {
        $pdo = Database::getConnection();
        $sql = "SELECT p.*, g.name AS game_name, g.category AS game_category, c.class_name, c.class_code, s.slot_name, s.start_time AS slot_start_time
                FROM players p
                LEFT JOIN games g ON p.game_id = g.id
                LEFT JOIN classes c ON p.class_id = c.id
                LEFT JOIN game_slots s ON p.slot_id = s.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['game_id']) && $filters['game_id'] !== 'all') {
            $sql .= " AND p.game_id = :game_id";
            $params['game_id'] = $filters['game_id'];
        }

        if (!empty($filters['class_id']) && $filters['class_id'] !== 'all') {
            $sql .= " AND p.class_id = :class_id";
            $params['class_id'] = $filters['class_id'];
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $sql .= " AND p.status = :status";
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['search']) && $filters['search'] !== 'all') {
            $sql .= " AND (p.name LIKE :search OR p.village LIKE :search OR p.mobile LIKE :search OR p.father_name LIKE :search)";
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $sql .= " ORDER BY p.id DESC LIMIT :limit OFFSET :offset";

        $stmt = $pdo->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue(':' . $key, $val);
        }
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function count(array $filters = []): int {
        $pdo = Database::getConnection();
        $sql = "SELECT COUNT(*) as total FROM players p WHERE 1=1";
        $params = [];

        if (!empty($filters['game_id'])) {
            $sql .= " AND p.game_id = :game_id";
            $params['game_id'] = $filters['game_id'];
        }

        if (!empty($filters['class_id'])) {
            $sql .= " AND p.class_id = :class_id";
            $params['class_id'] = $filters['class_id'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND p.status = :status";
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (p.name LIKE :search OR p.village LIKE :search OR p.mobile LIKE :search)";
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $res = $stmt->fetch();
        return (int)($res['total'] ?? 0);
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT p.*, g.name AS game_name, c.class_name, s.slot_name
                               FROM players p
                               LEFT JOIN games g ON p.game_id = g.id
                               LEFT JOIN classes c ON p.class_id = c.id
                               LEFT JOIN game_slots s ON p.slot_id = s.id
                               WHERE p.id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function findByMobile(string $mobile): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT p.*, g.name AS game_name, c.class_name, s.slot_name
                               FROM players p
                               LEFT JOIN games g ON p.game_id = g.id
                               LEFT JOIN classes c ON p.class_id = c.id
                               LEFT JOIN game_slots s ON p.slot_id = s.id
                               WHERE p.mobile = :mobile LIMIT 1");
        $stmt->execute(['mobile' => $mobile]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        $sql = "INSERT INTO players (class_id, game_id, name, father_name, village, mobile, dob, gender, image_url, aadhaar_no, aadhaar_url, status)
                VALUES (:cid, :gid, :name, :fname, :village, :mobile, :dob, :gender, :img, :aadhaar, :aadhaar_url, 'Pending')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'cid' => $data['class_id'],
            'gid' => $data['game_id'],
            'name' => $data['name'],
            'fname' => $data['father_name'],
            'village' => $data['village'],
            'mobile' => $data['mobile'],
            'dob' => $data['dob'],
            'gender' => $data['gender'],
            'img' => $data['image_url'] ?? null,
            'aadhaar' => $data['aadhaar_no'],
            'aadhaar_url' => $data['aadhaar_url'] ?? null
        ]);
        return (int)$pdo->lastInsertId();
    }

    public static function approve(int $id, ?int $slotId = null): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE players SET status = 'Approved', slot_id = :sid, rejection_reason = NULL WHERE id = :id");
        return $stmt->execute(['sid' => $slotId, 'id' => $id]);
    }

    public static function reject(int $id, string $reason): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE players SET status = 'Rejected', rejection_reason = :reason, slot_id = NULL WHERE id = :id");
        return $stmt->execute(['reason' => $reason, 'id' => $id]);
    }

    public static function toggleAttendance(int $id, int $isPresent): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE players SET is_present = :p WHERE id = :id");
        return $stmt->execute(['p' => $isPresent, 'id' => $id]);
    }
}
