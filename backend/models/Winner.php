<?php
/**
 * Winner & Podium DAO
 * Blueprint Section 4.1, 6, 7, 8
 */

require_once __DIR__ . '/../config/db.php';

class Winner {
    public static function getAll(): array {
        $pdo = Database::getConnection();
        $sql = "SELECT w.*, g.name AS game_name, g.category AS game_category, g.venue,
                       p.name AS player_name, p.father_name, p.village, p.mobile, p.image_url,
                       c.class_name
                FROM winners w
                JOIN games g ON w.game_id = g.id
                JOIN players p ON w.player_id = p.id
                LEFT JOIN classes c ON p.class_id = c.id
                ORDER BY g.date ASC, g.id ASC, FIELD(w.position, '1st', '2nd', '3rd')";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll();
    }

    public static function getByGameId(int $gameId): array {
        $pdo = Database::getConnection();
        $sql = "SELECT w.*, p.name AS player_name, p.father_name, p.village, p.image_url
                FROM winners w
                JOIN players p ON w.player_id = p.id
                WHERE w.game_id = :gid
                ORDER BY FIELD(w.position, '1st', '2nd', '3rd')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['gid' => $gameId]);
        return $stmt->fetchAll();
    }

    public static function mapWinner(int $gameId, int $playerId, string $position, string $prizeTitle, string $remarks = ''): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO winners (game_id, player_id, position, prize_title, remarks, published_at)
                               VALUES (:gid, :pid, :pos, :prize, :rem, NOW())
                               ON DUPLICATE KEY UPDATE player_id = :pid2, prize_title = :prize2, remarks = :rem2, published_at = NOW()");
        return $stmt->execute([
            'gid' => $gameId,
            'pid' => $playerId,
            'pos' => $position,
            'prize' => $prizeTitle,
            'rem' => $remarks,
            'pid2' => $playerId,
            'prize2' => $prizeTitle,
            'rem2' => $remarks
        ]);
    }

    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM winners WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
