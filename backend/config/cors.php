<?php
/**
 * CORS and Security Headers Configuration
 */

function handleCorsAndSecurityHeaders() {

    $allowedOrigins = [
        // Local development
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5176',
        'http://127.0.0.1:5176',

        // Production
        'https://www.aravmzpsports.online',
        'http://www.aravmzpsports.online',
        'https://aravmzpsports.online',
        'http://aravmzpsports.online',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    /*
     * CORS
     */
    if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {

        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

        // Important when Access-Control-Allow-Origin is dynamic
        header("Vary: Origin");

    } elseif ($origin !== '') {

        // Reject unknown origins
        http_response_code(403);

        header("Content-Type: application/json; charset=UTF-8");

        echo json_encode([
            'success' => false,
            'message' => 'CORS origin not allowed'
        ]);

        exit();
    }

    /*
     * Handle preflight OPTIONS request
     */
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit();
    }

    /*
     * Security Headers
     */
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("Referrer-Policy: strict-origin-when-cross-origin");

    /*
     * JSON response
     */
    header("Content-Type: application/json; charset=UTF-8");
}