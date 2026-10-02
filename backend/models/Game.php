<?php
/**
 * Game DAO / Active Record Class
 * Blueprint Section 4.1, 6, 8
 */

require_once __DIR__ . '/../config/db.php';

class Game {
    public static function getAll(): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT g.*, 
                             (SELECT COUNT(*) FROM players p WHERE p.game_id = g.id AND p.status != 'Rejected') AS registered_count,
                             (SELECT COUNT(*) FROM game_slots s WHERE s.game_id = g.id) AS slots_count
                             FROM games g
                             ORDER BY g.date ASC, g.start_time ASC");
        $games = $stmt->fetchAll();

        // Attach slots to each game
        foreach ($games as &$game) {
            $slotStmt = $pdo->prepare("SELECT * FROM game_slots WHERE game_id = :gid ORDER BY start_time ASC");
            $slotStmt->execute(['gid' => $game['id']]);
            $game['slots'] = $slotStmt->fetchAll();
        }

        return $games;
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM games WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $game = $stmt->fetch();
        if ($game) {
            $slotStmt = $pdo->prepare("SELECT * FROM game_slots WHERE game_id = :gid ORDER BY start_time ASC");
            $slotStmt->execute(['gid' => $id]);
            $game['slots'] = $slotStmt->fetchAll();
        }
        return $game ?: null;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO games (name, category, venue, date, start_time, end_time, max_players, status)
                               VALUES (:name, :cat, :venue, :date, :stime, :etime, :max_p, 'active')");
        $stmt->execute([
            'name' => $data['name'],
            'cat' => $data['category'],
            'venue' => $data['venue'],
            'date' => $data['date'],
            'stime' => $data['start_time'],
            'etime' => $data['end_time'],
            'max_p' => $data['max_players'] ?? 50
        ]);
        $gameId = (int)$pdo->lastInsertId();

        // Auto-generate default slot per Section 8
        $slotName = 'Main Flight - ' . ($data['venue'] ?? 'Arena');
        $slotStmt = $pdo->prepare("INSERT INTO game_slots (game_id, slot_name, start_time, end_time, allocated_capacity, available_slots)
                                   VALUES (:gid, :sname, :stime, :etime, :cap, :cap)");
        $slotStmt->execute([
            'gid' => $gameId,
            'sname' => $slotName,
            'stime' => $data['start_time'],
            'etime' => $data['end_time'],
            'cap' => $data['max_players'] ?? 50
        ]);

        return $gameId;
    }

    public static function update(int $id, array $data): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE games SET name = :name, category = :cat, venue = :venue, date = :date, 
                               start_time = :stime, end_time = :etime, max_players = :max_p WHERE id = :id");
        return $stmt->execute([
            'name' => $data['name'],
            'cat' => $data['category'],
            'venue' => $data['venue'],
            'date' => $data['date'],
            'stime' => $data['start_time'],
            'etime' => $data['end_time'],
            'max_p' => $data['max_players'] ?? 50,
            'id' => $id
        ]);
    }

    public static function addSlot(int $gameId, array $slotData): int {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO game_slots (game_id, slot_name, start_time, end_time, allocated_capacity, available_slots)
                               VALUES (:gid, :sname, :stime, :etime, :cap, :avail)");
        $stmt->execute([
            'gid' => $gameId,
            'sname' => $slotData['slot_name'],
            'stime' => $slotData['start_time'],
            'etime' => $slotData['end_time'],
            'cap' => $slotData['allocated_capacity'] ?? 20,
            'avail' => $slotData['allocated_capacity'] ?? 20
        ]);
        return (int)$pdo->lastInsertId();
    }
}
