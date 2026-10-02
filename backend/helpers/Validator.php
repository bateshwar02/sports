<?php
/**
 * Server-Side Payload Sanitization & Validation Engine
 * Blueprint Section 1, 9, 11
 */

class Validator {
    public static function sanitize($input) {
        if (is_array($input)) {
            return array_map([self::class, 'sanitize'], $input);
        }
        if (is_string($input)) {
            return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
        }
        return $input;
    }

    public static function validateRegistration(array $data): array {
        $errors = [];

        if (empty($data['name'])) {
            $errors['name'] = 'Full Name is required';
        }

        if (empty($data['father_name'])) {
            $errors['father_name'] = "Father's Name is required";
        }

        if (empty($data['game_id']) || !is_numeric($data['game_id'])) {
            $errors['game_id'] = 'A valid Game ID must be selected';
        }

        if (empty($data['class_id']) || !is_numeric($data['class_id'])) {
            $errors['class_id'] = 'A valid Class ID must be selected';
        }

        if (empty($data['village'])) {
            $errors['village'] = 'Village is required';
        }

        if (empty($data['mobile']) || !preg_match('/^[6-9]\d{9}$/', preg_replace('/[^\d]/', '', $data['mobile']))) {
            $errors['mobile'] = 'A valid 10-digit Indian mobile number is required';
        }

        if (empty($data['dob'])) {
            $errors['dob'] = 'Date of birth is required';
        }

        if (empty($data['gender']) || !in_array($data['gender'], ['Male', 'Female', 'Other'])) {
            $errors['gender'] = 'Gender must be Male, Female, or Other';
        }

        // Aadhaar validation: exactly 12 digits
        $cleanAadhaar = preg_replace('/[^\d]/', '', $data['aadhaar_no'] ?? '');
        if (strlen($cleanAadhaar) !== 12) {
            $errors['aadhaar_number'] = 'Aadhaar must be exactly 12 digits';
        }

        return $errors;
    }
}
