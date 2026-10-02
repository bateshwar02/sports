<?php
/**
 * Authentication Middleware
 * Blueprint Section 1, 11
 */

require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../helpers/ResponseFormatter.php';

class AuthMiddleware {
    public static function authenticate(): array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        } elseif (isset($_COOKIE['sms_jwt_token'])) {
            $token = $_COOKIE['sms_jwt_token'];
        }

        if (!$token) {
            ResponseFormatter::error('Authentication required. Missing token.', 401);
        }

        $decoded = JWTHandler::verifyToken($token);
        if (!$decoded) {
            ResponseFormatter::error('Invalid or expired authentication token', 401);
        }

        return $decoded;
    }
}
