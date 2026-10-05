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
require_once __DIR__ . '/../helpers/ImageUrlHelper.php';

class PlayerController
{
    public static function index()
    {
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

        // ----------------------------------------
        // Add image URL
        // ----------------------------------------
        foreach ($players as &$player) {
            $player['image_url'] = getPlayerImageUrl(
                $player['image_url'] ?? null
            );
        }

        unset($player);
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

    // public static function store()
    // {
    //     $data = Validator::sanitize($_POST);
    //     $errors = Validator::validateRegistration($data);

    //     // ----------------------------------------------------
    //     // 1. Process Profile Image
    //     // ----------------------------------------------------
    //     $imageUrl = null;
    //     if (!empty($_FILES['image_url']) && $_FILES['image_url']['error'] === UPLOAD_ERR_OK) {
    //         // Binary upload via $_FILES
    //         $imgUpload = FileUploader::upload($_FILES['image_url'], 'players');
    //         if ($imgUpload['success']) {
    //             $imageUrl = $imgUpload['url'];
    //         } else {
    //             $errors['image'] = $imgUpload['error'];
    //         }
    //     } elseif (!empty($_POST['image_url']) && str_starts_with($_POST['image_url'], 'data:image/')) {
    //         // Base64 payload via $_POST
    //         $imgUpload = FileUploader::uploadBase64($_POST['image_url'], 'players');
    //         if ($imgUpload['success']) {
    //             $imageUrl = $imgUpload['url'];
    //         } else {
    //             $errors['image'] = $imgUpload['error'];
    //         }
    //     }

    //     // ----------------------------------------------------
    //     // 2. Process Document Image
    //     // ----------------------------------------------------
    //     $aadhaarUrl = null;
    //     if (!empty($_FILES['aadhaar_url']) && $_FILES['aadhaar_url']['error'] === UPLOAD_ERR_OK) {
    //         // Binary upload via $_FILES
    //         $docUpload = FileUploader::upload($_FILES['aadhaar_url'], 'aadhaar');
    //         if ($docUpload['success']) {
    //             $aadhaarUrl = $docUpload['url'];
    //         } else {
    //             $errors['aadhaar_file'] = $docUpload['error'];
    //         }
    //     } elseif (!empty($_POST['aadhaar_url']) && str_starts_with($_POST['aadhaar_url'], 'data:image/')) {
    //         // Base64 payload via $_POST
    //         $docUpload = FileUploader::uploadBase64($_POST['aadhaar_url'], 'aadhaar');
    //         if ($docUpload['success']) {
    //             $aadhaarUrl = $docUpload['url'];
    //         } else {
    //             $errors['aadhaar_file'] = $docUpload['error'];
    //         }
    //     }

    //     if (!empty($errors)) {
    //         ResponseFormatter::validationError($errors, "Form validation failed on " . count($errors) . " fields");
    //     }

    //     // Assign saved relative file paths (e.g., /uploads/players/abc123.jpg)
    //     $data['image_url']   = $imageUrl ?? ($data['image_url'] ?? null);
    //     $data['aadhaar_url'] = $aadhaarUrl ?? ($data['aadhaar_url'] ?? null);

    //     $playerId = Player::create($data);

    //     ResponseFormatter::success([
    //         'playerId' => $playerId,
    //         'status'   => 'Pending',
    //         'message'  => 'Your registration has been submitted and is pending verification by field volunteers.'
    //     ], 'Player registered successfully', 201);
    // }

    public static function destroy(int $user_id)
    {
        RoleGuard::volunteerOrAdmin();

        $player = Player::findByUserId($user_id);
        if (!$player) {
            ResponseFormatter::error('Player record not found', 404);
        }

        Player::softDelete($user_id);

        ResponseFormatter::success([
            'playerId' => $user_id,
            'status' => 'Deleted'
        ], 'Player deleted successfully');
    }

    public static function approve(int $id)
    {
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

    public static function reject(int $id)
    {
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

    public static function toggleCheckIn(int $id)
    {
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

    public static function getAadhaarUrl(int $user_id)
    {
        RoleGuard::volunteerOrAdmin();
        $player = Player::findByUserId($user_id);
        if (!$player) {
            ResponseFormatter::error('Player record not found', 404);
        }

        if (!$player['aadhaar_url']) {
            ResponseFormatter::error('Aadhaar document not found for this player', 404);
        }

        $filename = basename($player['aadhaar_url']);
        $file = __DIR__ . '/../uploads/aadhaar/' . $filename;
        if (!file_exists($file) || !is_file($file)) {
            ResponseFormatter::error('Aadhaar document file not found on server', 404);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file);

        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($file));
        header('Content-Disposition: inline; filename="' . basename($file) . '"');
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('X-Content-Type-Options: nosniff');

        readfile($file);
        exit;
    }

    public static function store()
    {
        $data = Validator::sanitize($_POST);

        // ----------------------------------------------------
        // 1. Validate Registration Data
        // ----------------------------------------------------
        $errors = Validator::validateRegistration($data);

        // ----------------------------------------------------
        // 2. Process Multiple Game IDs
        // ----------------------------------------------------
        $gameIds = $data['game_ids'] ?? $data['game_id'] ?? [];

        // If game IDs are received as "1,2,4"
        if (is_string($gameIds)) {
            $gameIds = explode(',', $gameIds);
        }

        // Make sure it is an array
        if (!is_array($gameIds)) {
            $gameIds = [$gameIds];
        }

        // Clean values
        $gameIds = array_map('trim', $gameIds);

        // Remove empty values
        $gameIds = array_filter($gameIds, function ($gameId) {
            return $gameId !== '';
        });

        // Remove duplicate game IDs
        $gameIds = array_unique($gameIds);

        // Validate each Game ID
        foreach ($gameIds as $gameId) {

            if (
                !ctype_digit((string)$gameId) ||
                (int)$gameId <= 0
            ) {
                $errors['game_ids'] = 'All selected Game IDs must be valid.';
                break;
            }
        }

        // Convert to integers
        $gameIds = array_map('intval', $gameIds);

        // Re-index array
        $gameIds = array_values($gameIds);

        // Make sure at least one game is selected
        if (empty($gameIds)) {
            $errors['game_ids'] = 'At least one game must be selected.';
        }

        // ----------------------------------------------------
        // 3. Process Profile Image
        // ----------------------------------------------------
        $imageUrl = null;

        if (
            !empty($_FILES['image_url']) &&
            $_FILES['image_url']['error'] === UPLOAD_ERR_OK
        ) {

            // Binary upload
            $imgUpload = FileUploader::upload(
                $_FILES['image_url'],
                'players'
            );

            if ($imgUpload['success']) {
                $imageUrl = $imgUpload['url'];
            } else {
                $errors['image'] = $imgUpload['error'];
            }
        } elseif (
            !empty($_POST['image_url']) &&
            str_starts_with($_POST['image_url'], 'data:image/')
        ) {

            // Base64 upload
            $imgUpload = FileUploader::uploadBase64(
                $_POST['image_url'],
                'players'
            );

            if ($imgUpload['success']) {
                $imageUrl = $imgUpload['url'];
            } else {
                $errors['image'] = $imgUpload['error'];
            }
        }

        // ----------------------------------------------------
        // 4. Process Aadhaar Document
        // ----------------------------------------------------
        $aadhaarUrl = null;

        if (
            !empty($_FILES['aadhaar_url']) &&
            $_FILES['aadhaar_url']['error'] === UPLOAD_ERR_OK
        ) {

            // Binary upload
            $docUpload = FileUploader::upload(
                $_FILES['aadhaar_url'],
                'aadhaar'
            );

            if ($docUpload['success']) {
                $aadhaarUrl = $docUpload['url'];
            } else {
                $errors['aadhaar_file'] = $docUpload['error'];
            }
        } elseif (
            !empty($_POST['aadhaar_url']) &&
            str_starts_with($_POST['aadhaar_url'], 'data:image/')
        ) {

            // Base64 upload
            $docUpload = FileUploader::uploadBase64(
                $_POST['aadhaar_url'],
                'aadhaar'
            );

            if ($docUpload['success']) {
                $aadhaarUrl = $docUpload['url'];
            } else {
                $errors['aadhaar_file'] = $docUpload['error'];
            }
        }

        // ----------------------------------------------------
        // 5. Stop if validation/upload errors exist
        // ----------------------------------------------------
        if (!empty($errors)) {

            ResponseFormatter::validationError(
                $errors,
                "Form validation failed on " . count($errors) . " fields"
            );

            return;
        }

        // ----------------------------------------------------
        // 6. Prepare Common Player Data
        // ----------------------------------------------------
        $data['image_url'] = $imageUrl ?? ($data['image_url'] ?? null);

        $data['aadhaar_url'] = $aadhaarUrl ?? ($data['aadhaar_url'] ?? null);

        // ----------------------------------------------------
        // 7. Generate New User ID
        // ----------------------------------------------------
        /*
     * Generate ONE user ID for this registration.
     *
     * Example:
     *
     * Existing:
     * user_id = 1
     * user_id = 2
     * user_id = 3
     *
     * New registration:
     * user_id = 4
     *
     * If no user_id exists:
     * user_id = 1
     */

        $userId = Player::getNextUserId();

        // ----------------------------------------------------
        // 8. Remove game fields from common data
        // ----------------------------------------------------
        unset($data['game_id']);
        unset($data['game_ids']);

        // ----------------------------------------------------
        // 9. Create Player Record For Each Game
        // ----------------------------------------------------
        $playerIds = [];

        try {

            foreach ($gameIds as $gameId) {

                // Copy common player information
                $playerData = $data;

                // Same user ID for every selected game
                $playerData['user_id'] = $userId;

                // Current game
                $playerData['game_id'] = $gameId;

                // Slot will be assigned later
                $playerData['slot_id'] = null;

                error_log(
                    "Received registration data: " .
                        json_encode($playerData)
                );

                // Create player
                $playerId = Player::create($playerData);

                $playerIds[] = $playerId;
            }
        } catch (Throwable $e) {

            error_log(
                "Player registration failed: " .
                    $e->getMessage()
            );

            ResponseFormatter::error(
                'Player registration failed: ' . $e->getMessage(),
                500
            );

            return;
        }

        // ----------------------------------------------------
        // 10. Success Response
        // ----------------------------------------------------
        ResponseFormatter::success(
            [
                'userId'    => $userId,
                'playerIds' => $playerIds,
                'gameIds'   => $gameIds,
                'gameCount' => count($gameIds),
                'status'    => 'Pending',
                'message'   => 'Your registration has been submitted and is pending verification by field volunteers.'
            ],
            'Player registered successfully',
            201
        );
    }
}
