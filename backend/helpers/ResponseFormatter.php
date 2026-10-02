<?php
/**
 * Standard JSON Envelope & Error Schema
 * Blueprint Section 9
 */

class ResponseFormatter {
    public static function success($data = null, string $message = 'Operation successful', int $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => true,
            'statusCode' => $statusCode,
            'message' => $message,
            'data' => $data
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    public static function validationError(array $errors, string $message = 'Validation failed', int $statusCode = 422) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'statusCode' => $statusCode,
            'message' => $message,
            'errors' => $errors
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    public static function error(string $message = 'An error occurred', int $statusCode = 500, $extra = null) {
        http_response_code($statusCode);
        $payload = [
            'success' => false,
            'statusCode' => $statusCode,
            'message' => $message
        ];
        if ($extra !== null) {
            $payload['errors'] = $extra;
        }
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit();
    }
}
