<?php
/**
 * RoleGuard Middleware
 * Blueprint Section 3, 11
 */

require_once __DIR__ . '/AuthMiddleware.php';
require_once __DIR__ . '/../helpers/ResponseFormatter.php';

class RoleGuard {
    public static function authorize(array $allowedRoles): array {
        $user = AuthMiddleware::authenticate();
        $userRole = $user['role'] ?? '';

        if (!in_array($userRole, $allowedRoles)) {
            ResponseFormatter::error("Forbidden: Insufficient privileges for role '{$userRole}'", 403);
        }

        return $user;
    }

    public static function adminOnly(): array {
        return self::authorize(['admin']);
    }

    public static function volunteerOrAdmin(): array {
        return self::authorize(['admin', 'volunteer']);
    }

    public static function anyAuthenticated(): array {
        return AuthMiddleware::authenticate();
    }
}
