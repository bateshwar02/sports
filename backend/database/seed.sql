-- ==============================================================================
-- SPORTS MANAGEMENT SYSTEM - SEED DATA
-- Default Credentials:
-- Admin: admin / admin123
-- Volunteer: volunteer / vol123
-- Player: 9876543210 / player123
-- ==============================================================================

-- 1. Roles
INSERT INTO roles (id, role_name, description, permissions) VALUES
(1, 'admin', 'Root Administrator with full CRUD privileges', '["all"]'),
(2, 'volunteer', 'Field Supervisor for Verification & Attendance', '["players.verify", "players.view", "classes.manage", "slots.inspect"]'),
(3, 'player', 'Registered Athlete for self-service dashboard', '["profile.view", "results.view"]');

-- 2. Users (passwords hashed using bcrypt; fallback supported for testing)
INSERT INTO users (id, role_id, username, password_hash, role, status) VALUES
(1, 1, 'admin', '$2y$12$LP6GgW2lYx8Zp0y8uHqKveE0Zg4x7A9Uv2h1j5l7K3p5o9Q1r3t8u', 'admin', 'active'),
(2, 2, 'volunteer', '$2y$12$LP6GgW2lYx8Zp0y8uHqKveE0Zg4x7A9Uv2h1j5l7K3p5o9Q1r3t8u', 'volunteer', 'active'),
(3, 3, '9876543210', '$2y$12$LP6GgW2lYx8Zp0y8uHqKveE0Zg4x7A9Uv2h1j5l7K3p5o9Q1r3t8u', 'player', 'active');

-- 3. Classes
INSERT INTO classes (id, class_name, class_code, description, status) VALUES
(1, 'प्राथमिक वर्ग (कक्षा 1 से 5)', 'CLS_PRIMARY', 'Age 6-10 years, Primary division', 'active'),
(2, 'माध्यमिक वर्ग (कक्षा 6 से 8)', 'CLS_MIDDLE', 'Age 11-13 years, Middle school division', 'active'),
(3, 'उच्च प्राथमिक वर्ग (कक्षा 9 व 10)', 'CLS_HIGH', 'Age 14-16 years, High school division', 'active'),
(4, 'सीनियर सेकेंडरी वर्ग (कक्षा 11 व 12)', 'CLS_SR_SEC', 'Age 17-18 years, Senior division', 'active'),
(5, 'खुला वर्ग (ओपन कैटेगरी)', 'CLS_OPEN', 'No age restriction, Open for all community members', 'active');

-- 4. Games
INSERT INTO games (id, name, category, venue, date, start_time, end_time, max_players, status) VALUES
(1, '1600 मीटर दौड़ (1600m Race)', 'बालक - ब्लॉक स्तर', 'मुख्य खेल मैदान, ग्राम सभा सारीपट्टी', '2026-11-06', '09:00:00', '10:30:00', 40, 'active'),
(2, '1000 मीटर दौड़ (1000m Race)', 'बालिका - कक्षा 6 से ऊपर', 'मुख्य खेल मैदान, ग्राम सभा सारीपट्टी', '2026-11-06', '09:15:00', '10:45:00', 30, 'active'),
(3, 'लंबी कूद (Long Jump)', 'बालक - कक्षा 10 तथा ऊपर', 'कूद पिट कोर्ट A', '2026-11-06', '10:00:00', '12:00:00', 25, 'active'),
(4, 'ऊंची कूद (High Jump)', 'बालक - कक्षा 10 तथा ऊपर', 'कूद कोर्ट B', '2026-11-06', '10:30:00', '12:30:00', 20, 'active'),
(5, 'बोरी दौड़ (Sack Race)', 'बालक/बालिका - कक्षा 6 से 8', 'प्रांगण ट्रैक', '2026-11-06', '11:00:00', '12:30:00', 35, 'active'),
(6, 'लिखित सामान्य ज्ञान परीक्षा (GK Quiz)', 'सभी वर्ग - Open', 'केंद्रीय परीक्षा हॉल, सारीपट्टी', '2026-11-06', '16:00:00', '17:30:00', 100, 'active'),
(7, 'शतरंज (Chess Championship)', 'सभी वर्ग - Open', 'कम्युनिटी क्लब हॉल', '2026-11-06', '17:00:00', '19:00:00', 32, 'active'),
(8, 'कला एवं चित्रकला (Art Contest)', 'बालक/बालिका - कक्षा 1 से 5', 'कला दीर्घा परिसर', '2026-11-06', '18:00:00', '19:30:00', 50, 'active'),
(9, 'शू-सॉक्स रेस (Shoe-Socks Race)', 'कक्षा 2 से 5', 'बाल क्रीड़ा प्रांगण', '2026-11-07', '07:00:00', '08:00:00', 30, 'active'),
(10, 'नींबू-चम्मच रेस (Lemon-Spoon Race)', 'कक्षा 2 से 5', 'बाल क्रीड़ा प्रांगण', '2026-11-07', '07:20:00', '08:30:00', 40, 'active'),
(11, 'साइकिल स्लो रेस (Cycle Slow Race)', 'बालिका - खुला वर्ग', 'दक्षिणी रिंग रोड', '2026-11-07', '08:00:00', '09:00:00', 25, 'active'),
(12, 'म्यूजिकल चेयर (Musical Chair)', 'बालिका - खुला वर्ग', 'मुख्य मंच प्रांगण', '2026-11-07', '08:30:00', '09:30:00', 50, 'active');

-- 5. Game Slots
INSERT INTO game_slots (id, game_id, slot_name, start_time, end_time, allocated_capacity, available_slots) VALUES
(1, 1, 'Heat 1 - Court A', '09:00:00', '09:40:00', 20, 18),
(2, 1, 'Heat 2 - Court A', '09:45:00', '10:25:00', 20, 20),
(3, 2, 'Heat 1 - Court B', '09:15:00', '10:00:00', 15, 14),
(4, 3, 'Flight A - Sand Pit 1', '10:00:00', '11:00:00', 12, 11),
(5, 6, 'Hall A - Seat 1-50', '16:00:00', '17:30:00', 50, 48),
(6, 7, 'Round 1 Boards 1-16', '17:00:00', '18:00:00', 16, 15);

-- 6. Volunteers
INSERT INTO volunteers (id, user_id, name, mobile, email, village, district, status) VALUES
(1, 2, 'अमित कुमार यादव (Amit Kumar)', '9876500001', 'amit.sports@saripatti.org', 'सारीपट्टी (Saripatti)', 'आजमगढ़ (Azamgarh)', 'active'),
(2, 2, 'सुनील सिंह (Sunil Singh)', '9876500002', 'sunil.v@saripatti.org', 'बटेश्वर (Bateshwar)', 'आजमगढ़ (Azamgarh)', 'active'),
(3, 2, 'पूजा मौर्या (Pooja Maurya)', '9876500003', 'pooja.m@saripatti.org', 'मऊ खास (Mau Khas)', 'मऊ (Mau)', 'active');

-- 7. Players
INSERT INTO players (id, user_id, class_id, game_id, slot_id, name, father_name, village, mobile, dob, gender, image_url, aadhaar_no, aadhaar_url, status, rejection_reason, is_present) VALUES
(1, 3, 3, 1, 1, 'रोहित कुमार (Rohit Kumar)', 'राजेन्द्र कुमार', 'सारीपट्टी', '9876543210', '2008-05-14', 'Male', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', '458912347890', '/uploads/aadhaar/sample_aadhaar_1.jpg', 'Approved', NULL, 1),
(2, NULL, 2, 2, 3, 'अंजलि शर्मा (Anjali Sharma)', 'विनोद शर्मा', 'बटेश्वर', '9876543211', '2010-08-22', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', '654321890123', '/uploads/aadhaar/sample_aadhaar_2.jpg', 'Approved', NULL, 1),
(3, NULL, 4, 3, 4, 'विकास वर्मा (Vikas Verma)', 'रामसूरत वर्मा', 'रानी की सराय', '9876543212', '2007-02-10', 'Male', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', '789012345678', '/uploads/aadhaar/sample_aadhaar_3.jpg', 'Approved', NULL, 0),
(4, NULL, 3, 1, 1, 'दीपक चौहान (Deepak Chauhan)', 'सुरेश चौहान', 'बेलईसा', '9876543213', '2008-11-19', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', '901234567890', '/uploads/aadhaar/sample_aadhaar_4.jpg', 'Pending', NULL, 0),
(5, NULL, 1, 8, NULL, 'प्रिया यादव (Priya Yadav)', 'अखिलेश यादव', 'सारीपट्टी', '9876543214', '2015-04-12', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', '234567890123', '/uploads/aadhaar/sample_aadhaar_5.jpg', 'Pending', NULL, 0),
(6, NULL, 3, 1, NULL, 'मनोज कुमार (Manoj Kumar)', 'दिनेश कुमार', 'खरिहानी', '9876543215', '2006-03-01', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', '112233445566', '/uploads/aadhaar/sample_aadhaar_6.jpg', 'Rejected', 'आधार कार्ड अस्पष्ट एवं जन्मतिथि मेल नहीं खा रही है (Blurry Aadhaar ID copy)', 0);

-- 8. Winners (Official Winner Mapping)
INSERT INTO winners (id, game_id, player_id, position, prize_title, remarks, published_at) VALUES
(1, 1, 1, '1st', 'स्वर्ण पदक एवं ₹5,100 नकद (Gold Trophy + Cash Award)', 'शानदार समय रिकॉर्ड 4:32 मिनट', NOW()),
(2, 2, 2, '1st', 'स्वर्ण पदक एवं ₹3,100 नकद (Gold Medal + Award)', 'उत्कृष्ट गति एवं अनुशासन', NOW()),
(3, 3, 3, '2nd', 'रजत पदक एवं ₹2,100 नकद (Silver Medal + Trophy)', '5.85 मीटर की उत्कृष्ट छलांग', NOW());
