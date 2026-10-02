<?php
/**
 * Secure File Upload Architecture
 * Blueprint Section 10
 */

class FileUploader {
    const MAX_FILE_SIZE = 2097152; // 2MB in bytes
    const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'application/pdf' => 'pdf'
    ];

    public static function upload(array $file, string $subfolder): array {
        if (!isset($file['error']) || is_array($file['error'])) {
            return ['success' => false, 'error' => 'Invalid upload parameters'];
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['success' => false, 'error' => 'Upload error code: ' . $file['error']];
        }

        // Hard ceiling of 2MB
        if ($file['size'] > self::MAX_FILE_SIZE) {
            return ['success' => false, 'error' => 'File exceeds maximum size limit of 2 MB'];
        }

        // MIME validation via finfo_file
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, self::ALLOWED_MIME_TYPES)) {
            return ['success' => false, 'error' => 'Unsupported file format. Only JPG, PNG, WEBP, and PDF are allowed.'];
        }

        $extension = self::ALLOWED_MIME_TYPES[$mime];

        // Cryptographically secure random UUID-style filename
        $randomHash = bin2hex(random_bytes(16));
        $filename = $randomHash . '.' . $extension;

        $targetDir = __DIR__ . '/../uploads/' . trim($subfolder, '/');
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $destination = $targetDir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            return ['success' => false, 'error' => 'Failed to persist uploaded file to disk'];
        }

        return [
            'success' => true,
            'filename' => $filename,
            'url' => '/uploads/' . trim($subfolder, '/') . '/' . $filename
        ];
    }
}
