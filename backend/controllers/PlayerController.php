<?php
/**
 * Player Controller
 * Blueprint Section 8
 */

require_once __DIR__ . '/../models/Player.php';
require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../middleware/RoleGuard.php';
require_once __DIR__ . '/../helpers/ResponseFormatter.php';
require_once __DIR__ . '/../helpers/Validator.php';
require_once __DIR__ . '/../helpers/FileUploader.php';

class PlayerController {
    public static function index() {
        RoleGuard::volunteerOrAdmin();

        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = max(1, (int)($_GET['limit'] ?? 25));
        $offset = ($page - 1) * $limit;

        $filters = [
            'game_id' => $_GET['game_id'] ?? null,
            'class_id' => $_GET['class_id'] ?? null,
            'status' => $_GET['status'] ?? null,
            'search' => $_GET['search'] ?? null,
        ];

        $players = Player::getAll($filters, $limit, $offset);
        $total = Player::count($filters);

        ResponseFormatter::success([
            'players' => $players,
            'pagination' => [
                'currentPage' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit)
            ]
        ], 'Player list retrieved successfully');
    }

    public static function store() {
        // Public or Admin registration
        $data = Validator::sanitize($_POST);
        $errors = Validator::validateRegistration($data);

        // Upload Profile Photo if present
        $imageUrl = null;
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imgUpload = FileUploader::upload($_FILES['image'], 'players');
            if ($imgUpload['success']) {
                $imageUrl = $imgUpload['url'];
            } else {
                $errors['image'] = $imgUpload['error'];
            }
        }

        // Upload Aadhaar document if present
        $aadhaarUrl = null;
        if (!empty($_FILES['aadhaar']) && $_FILES['aadhaar']['error'] === UPLOAD_ERR_OK) {
            $aadhaarUpload = FileUploader::upload($_FILES['aadhaar'], 'aadhaar');
            if ($aadhaarUpload['success']) {
                $aadhaarUrl = $aadhaarUpload['url'];
            } else {
                $errors['aadhaar_file'] = $aadhaarUpload['error'];
            }
        }

        if (!empty($errors)) {
            ResponseFormatter::validationError($errors, "Form validation failed on " . count($errors) . " fields");
        }

        $data['image_url'] = $imageUrl ?: ($data['image_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
        $data['aadhaar_url'] = $aadhaarUrl ?: ($data['aadhaar_url'] ?? null);

        $playerId = Player::create($data);

        ResponseFormatter::success([
            'playerId' => $playerId,
            'status' => 'Pending',
            'message' => 'Your registration has been submitted and is pending verification by field volunteers.'
        ], 'Player registered successfully', 201);
    }

    public static function approve(int $id) {
        RoleGuard::volunteerOrAdmin();

        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?: $_POST;
        $slotId = !empty($payload['slot_id']) ? (int)$payload['slot_id'] : null;

        $player = Player::findById($id);
        if (!$player) {
            ResponseFormatter::error('Player record not found', 404);
        }

        Player::approve($id, $slotId);

        $slotName = 'Main Scheduled Slot';
        if ($slotId) {
            // Find slot name
            $game = Game::findById((int)$player['game_id']);
            if ($game && !empty($game['slots'])) {
                foreach ($game['slots'] as $s) {
                    if ((int)$s['id'] === $slotId) {
                        $slotName = $s['slot_name'] . ' - ' . substr($s['start_time'], 0, 5);
                    }
                }
            }
        }

        ResponseFormatter::success([
            'playerId' => $id,
            'status' => 'Approved',
            'allocatedSlot' => $slotName
        ], 'Player registration approved successfully');
    }

    public static function reject(int $id) {
        RoleGuard::volunteerOrAdmin();

        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?: $_POST;
        $reason = trim($payload['rejection_reason'] ?? $payload['reason'] ?? '');

        if (empty($reason)) {
            ResponseFormatter::validationError([
                'rejection_reason' => 'Audit rationale / rejection reason is required'
            ], 'Validation failed');
        }

        $player = Player::findById($id);
        if (!$player) {
            ResponseFormatter::error('Player record not found', 404);
        }

        Player::reject($id, $reason);

        ResponseFormatter::success([
            'playerId' => $id,
            'status' => 'Rejected',
            'rejection_reason' => $reason
        ], 'Player registration rejected with audit rationale recorded');
    }

    public static function toggleCheckIn(int $id) {
        RoleGuard::volunteerOrAdmin();
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?: $_POST;
        $isPresent = (int)($payload['is_present'] ?? 1);

        Player::toggleAttendance($id, $isPresent);
        ResponseFormatter::success([
            'playerId' => $id,
            'isPresent' => $isPresent
        ], 'Player court presence updated');
    }
}
