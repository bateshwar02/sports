<?php
/**
 * Class Controller
 * Blueprint Section 8: GET /api/classes
 */

require_once __DIR__ . '/../models/ClassModel.php';
require_once __DIR__ . '/../middleware/RoleGuard.php';
require_once __DIR__ . '/../helpers/ResponseFormatter.php';
require_once __DIR__ . '/../helpers/Validator.php';

class ClassController {
    public static function index() {
        // Public / All Roles
        $classes = ClassModel::getAll();
        ResponseFormatter::success($classes, 'Active class divisions retrieved');
    }

    public static function store() {
        RoleGuard::volunteerOrAdmin();

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $data = Validator::sanitize($data);

        if (empty($data['class_name']) || empty($data['class_code'])) {
            ResponseFormatter::validationError([
                'class_name' => empty($data['class_name']) ? 'Class name required' : null,
                'class_code' => empty($data['class_code']) ? 'Class code required' : null
            ], 'Validation error');
        }

        $id = ClassModel::create($data);
        ResponseFormatter::success(['id' => $id], 'Class created successfully', 201);
    }
}
