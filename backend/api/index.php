<?php

/**
 * RESTful API Route Dispatcher
 * Blueprint Section 1, 2, 8
 */

require_once __DIR__ . '/../config/cors.php';
handleCorsAndSecurityHeaders();

require_once __DIR__ . '/../helpers/ResponseFormatter.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/PlayerController.php';
require_once __DIR__ . '/../controllers/GameController.php';
require_once __DIR__ . '/../controllers/ClassController.php';
require_once __DIR__ . '/../controllers/WinnerController.php';
require_once __DIR__ . '/../controllers/VolunteerController.php';

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Parse path removing query string and base directory if any
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'] ?? '/';

// Normalize path to start from /api/
$apiIndex = strpos($path, '/api');
if ($apiIndex !== false) {
    $path = substr($path, $apiIndex);
}

// Route matching
try {
    // Auth routes
    if ($path === '/api/auth/login' && $requestMethod === 'POST') {
        AuthController::login();
        exit();
    }

    // Player routes
    if ($path === '/api/players') {
        if ($requestMethod === 'GET') {
            PlayerController::index();
        } elseif ($requestMethod === 'POST') {
            PlayerController::store();
        }
        exit();
    }

    if (preg_match('#^/api/players/(\d+)/approve$#', $path, $m) && $requestMethod === 'POST') {
        PlayerController::approve((int)$m[1]);
        exit();
    }

    if (preg_match('#^/api/players/(\d+)/reject$#', $path, $m) && $requestMethod === 'POST') {
        PlayerController::reject((int)$m[1]);
        exit();
    }

    if (preg_match('#^/api/players/(\d+)/checkin$#', $path, $m) && $requestMethod === 'POST') {
        PlayerController::toggleCheckIn((int)$m[1]);
        exit();
    }

    if (preg_match('#^/api/players/([0-9]+)/aadhaar$#', $path, $matches) && $requestMethod === 'GET') {
        PlayerController::getAadhaarUrl((int)$matches[1]);
        exit();
        }

    // Game routes
    if ($path === '/api/games') {
        if ($requestMethod === 'GET') {
            GameController::index();
        } elseif ($requestMethod === 'POST') {
            GameController::store();
        }
        exit();
    }

    if (preg_match('#^/api/games/(\d+)/slots$#', $path, $m) && $requestMethod === 'POST') {
        GameController::addSlot((int)$m[1]);
        exit();
    }

    // Class routes
    if ($path === '/api/classes') {
        if ($requestMethod === 'GET') {
            ClassController::index();
        } elseif ($requestMethod === 'POST') {
            ClassController::store();
        }
        exit();
    }

    // Winner routes
    if ($path === '/api/winners') {
        if ($requestMethod === 'GET') {
            WinnerController::index();
        } elseif ($requestMethod === 'POST') {
            WinnerController::store();
        }
        exit();
    }

    if (preg_match('#^/api/winners/(\d+)$#', $path, $m) && $requestMethod === 'DELETE') {
        WinnerController::destroy((int)$m[1]);
        exit();
    }

    // Volunteer routes
    if ($path === '/api/volunteers') {
        if ($requestMethod === 'GET') {
            VolunteerController::index();
        } elseif ($requestMethod === 'POST') {
            VolunteerController::store();
        }
        exit();
    }

    if (preg_match('#^/api/volunteers/(\d+)/status$#', $path, $m) && $requestMethod === 'POST') {
        VolunteerController::toggleStatus((int)$m[1]);
        exit();
    }

    if (preg_match('#^/api/volunteers/(\d+)/region$#', $path, $m) && $requestMethod === 'POST') {
        VolunteerController::updateRegion((int)$m[1]);
        exit();
    }

    // Health check endpoint
    if ($path === '/api/health' || $path === '/api') {
        ResponseFormatter::success([
            'status' => 'healthy',
            'system' => 'Sports Management System API',
            'version' => '1.0.0',
            'timestamp' => date('c')
        ]);
    }

    // Route not found
    ResponseFormatter::error("Endpoint not found: {$requestMethod} {$path}", 404);
} catch (Throwable $e) {
    ResponseFormatter::error("Internal Server Error: " . $e->getMessage(), 500);
}
