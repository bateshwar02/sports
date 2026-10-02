<?php
/**
 * Volunteer Controller
 * Blueprint Section 4.1 & 7
 */

require_once __DIR__ . '/../models/Volunteer.php';
require_once __DIR__ . '/../middleware/RoleGuard.php';
require_once __DIR__ . '/../helpers/ResponseFormatter.php';
require_once __DIR__ . '/../helpers/Validator.php';

class VolunteerController {
    public static function index() {
        RoleGuard::adminOnly();
        $volunteers = Volunteer::getAll();
        ResponseFormatter::success($volunteers, 'Volunteer personnel roster retrieved');
    }

    public static function store() {
        RoleGuard::adminOnly();

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $data = Validator::sanitize($data);

        $errors = [];
        if (empty($data['name'])) $errors['name'] = 'Volunteer full name is required';
        if (empty($data['mobile'])) $errors['mobile'] = 'Mobile number is required';
        if (empty($data['village'])) $errors['village'] = 'Assigned village is required';

        if (!empty($errors)) {
            ResponseFormatter::validationError($errors, 'Volunteer validation failed');
        }

        $id = Volunteer::create($data);
        ResponseFormatter::success(['id' => $id], 'Volunteer registered and credentials provisioned', 201);
    }

    public static function toggleStatus(int $id) {
        RoleGuard::adminOnly();
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $status = ($data['status'] ?? 'active') === 'active' ? 'active' : 'inactive';

        Volunteer::toggleStatus($id, $status);
        ResponseFormatter::success(['id' => $id, 'status' => $status], 'Volunteer status updated');
    }

    public static function updateRegion(int $id) {
        RoleGuard::adminOnly();
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $village = trim($data['village'] ?? '');
        $district = trim($data['district'] ?? '');

        Volunteer::updateRegion($id, $village, $district);
        ResponseFormatter::success(['id' => $id], 'Volunteer region reassigned');
    }
}
