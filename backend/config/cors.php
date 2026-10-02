<?php
/**
 * CORS and Security Headers Configuration
 * Blueprint Section 11: Enterprise Security Baseline
 */

function handleCorsAndSecurityHeaders() {
    $allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5176',
        'https://www.aravmzpsports.online/'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowedOrigins) || empty($origin)) {
        header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
    } else {
        header("Access-Control-Allow-Origin: *");
    }

    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
    
    // Enterprise Security Headers
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
