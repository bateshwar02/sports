<?php
/**
 * Game Controller
 * Blueprint Section 8: GET /api/games, POST /api/games
 */

require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../middleware/RoleGuard.php';
require_once __DIR__ . '/../helpers/ResponseFormatter.php';
require_once __DIR__ . '/../helpers/Validator.php';

class GameController {
    public static function index() {
        // Public / All Roles
        $games = Game::getAll();
        ResponseFormatter::success($games, 'Active tournament games retrieved successfully');
    }

    public static function store() {
        RoleGuard::adminOnly();

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $data = Validator::sanitize($data);

        $errors = [];
        if (empty($data['name'])) $errors['name'] = 'Game name is required';
        if (empty($data['category'])) $errors['category'] = 'Division/Category is required';
        if (empty($data['venue'])) $errors['venue'] = 'Venue/Arena is required';
        if (empty($data['date'])) $errors['date'] = 'Event date is required';
        if (empty($data['start_time'])) $errors['start_time'] = 'Start time is required';
        if (empty($data['end_time'])) $errors['end_time'] = 'End time is required';

        if (!empty($errors)) {
            ResponseFormatter::validationError($errors, 'Game validation failed');
        }

        $gameId = Game::create($data);
        $newGame = Game::findById($gameId);

        ResponseFormatter::success($newGame, 'Competition entry created with generated default game slots', 201);
    }

    public static function addSlot(int $id) {
        RoleGuard::adminOnly();

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $data = Validator::sanitize($data);

        $slotId = Game::addSlot($id, $data);
        $updated = Game::findById($id);

        ResponseFormatter::success($updated, 'Game slot added successfully');
    }
}
