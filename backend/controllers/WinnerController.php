<?php
/**
 * Winner Controller
 * Blueprint Section 8: POST /api/winners, GET /api/winners
 */

require_once __DIR__ . '/../models/Winner.php';
require_once __DIR__ . '/../models/Player.php';
require_once __DIR__ . '/../middleware/RoleGuard.php';
require_once __DIR__ . '/../helpers/ResponseFormatter.php';
require_once __DIR__ . '/../helpers/Validator.php';

class WinnerController {
    public static function index() {
        // Public / All Roles
        $winners = Winner::getAll();
        ResponseFormatter::success($winners, 'Official podium results retrieved successfully');
    }

    public static function store() {
        RoleGuard::adminOnly();

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $data = Validator::sanitize($data);

        $gameId = (int)($data['game_id'] ?? 0);
        $playerId = (int)($data['player_id'] ?? 0);
        $position = trim($data['position'] ?? '');
        $prizeTitle = trim($data['prize_title'] ?? '');
        $remarks = trim($data['remarks'] ?? '');

        $errors = [];
        if (!$gameId) $errors['game_id'] = 'Valid game ID is required';
        if (!$playerId) $errors['player_id'] = 'Valid verified player ID is required';
        if (!in_array($position, ['1st', '2nd', '3rd'])) $errors['position'] = 'Position must be 1st, 2nd, or 3rd';
        if (empty($prizeTitle)) $errors['prize_title'] = 'Prize title or trophy description is required';

        if (!empty($errors)) {
            ResponseFormatter::validationError($errors, 'Winner mapping validation failed');
        }

        // Verify player is Approved
        $player = Player::findById($playerId);
        if (!$player) {
            ResponseFormatter::error('Selected player record not found', 404);
        }
        if ($player['status'] !== 'Approved') {
            ResponseFormatter::error('Only verified (Approved) athletes can be mapped to podium finishes', 422);
        }

        Winner::mapWinner($gameId, $playerId, $position, $prizeTitle, $remarks);

        ResponseFormatter::success([
            'game_id' => $gameId,
            'player_id' => $playerId,
            'position' => $position,
            'prize_title' => $prizeTitle
        ], 'Podium winner mapped successfully');
    }

    public static function destroy(int $id) {
        RoleGuard::adminOnly();
        Winner::delete($id);
        ResponseFormatter::success(null, 'Podium mapping removed');
    }
}
