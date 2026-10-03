/**
 * Local Data Store & Mock Database Provider
 * Mirrors MySQL 8.0 schema and seed data from Blueprint Section 6
 * Automatically synchronizes with localStorage for instant reactivity and persistence.
 */

const STORAGE_KEY = 'sms_database_v2'

const initialData = {
  // roles: [
  //   { id: 1, role_name: 'admin', description: 'System Administrator' },
  //   { id: 2, role_name: 'volunteer', description: 'Field Volunteer' },
  //   { id: 3, role_name: 'player', description: 'Registered Athlete' }
  // ],
  // users: [
  //   { id: 1, role_id: 1, username: 'admin', role: 'admin', name: 'मुख्य समन्वयक (System Admin)', status: 'active' },
  //   { id: 2, role_id: 2, username: 'volunteer', role: 'volunteer', name: 'अमित कुमार यादव (Volunteer Lead)', status: 'active' },
  //   { id: 3, role_id: 3, username: '9876543210', role: 'player', name: 'रोहित कुमार (Athlete)', status: 'active' }
  // ],
  // classes: [
  //   { id: 1, class_name: 'प्राथमिक वर्ग (कक्षा 1 से 5)', class_code: 'CLS_PRIMARY', description: 'Age 6-10 years, Primary division', status: 'active' },
  //   { id: 2, class_name: 'माध्यमिक वर्ग (कक्षा 6 से 8)', class_code: 'CLS_MIDDLE', description: 'Age 11-13 years, Middle school division', status: 'active' },
  //   { id: 3, class_name: 'उच्च प्राथमिक वर्ग (कक्षा 9 व 10)', class_code: 'CLS_HIGH', description: 'Age 14-16 years, High school division', status: 'active' },
  //   { id: 4, class_name: 'सीनियर सेकेंडरी वर्ग (कक्षा 11 व 12)', class_code: 'CLS_SR_SEC', description: 'Age 17-18 years, Senior division', status: 'active' },
  //   { id: 5, class_name: 'खुला वर्ग (ओपन कैटेगरी)', class_code: 'CLS_OPEN', description: 'No age restriction, Open for all community members', status: 'active' }
  // ],
  // games: [
  //   {
  //     id: 1,
  //     name: '1600 मीटर दौड़ (1600m Race)',
  //     category: 'बालक - ब्लॉक स्तर',
  //     venue: 'मुख्य खेल मैदान, ग्राम सभा सारीपट्टी',
  //     date: '2026-11-06',
  //     start_time: '09:00',
  //     end_time: '10:30',
  //     max_players: 40,
  //     status: 'active',
  //     slots: [
  //       { id: 101, slot_name: 'Heat 1 - Court A', start_time: '09:00', end_time: '09:40', allocated_capacity: 20, available_slots: 18 },
  //       { id: 102, slot_name: 'Heat 2 - Court A', start_time: '09:45', end_time: '10:25', allocated_capacity: 20, available_slots: 20 }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: '1000 मीटर दौड़ (1000m Race)',
  //     category: 'बालिका - कक्षा 6 से ऊपर',
  //     venue: 'मुख्य खेल मैदान, ग्राम सभा सारीपट्टी',
  //     date: '2026-11-06',
  //     start_time: '09:15',
  //     end_time: '10:45',
  //     max_players: 30,
  //     status: 'active',
  //     slots: [
  //       { id: 201, slot_name: 'Heat 1 - Court B', start_time: '09:15', end_time: '10:00', allocated_capacity: 15, available_slots: 14 }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'लंबी कूद (Long Jump)',
  //     category: 'बालक - कक्षा 10 तथा ऊपर',
  //     venue: 'कूद पिट कोर्ट A',
  //     date: '2026-11-06',
  //     start_time: '10:00',
  //     end_time: '12:00',
  //     max_players: 25,
  //     status: 'active',
  //     slots: [
  //       { id: 301, slot_name: 'Flight A - Sand Pit 1', start_time: '10:00', end_time: '11:00', allocated_capacity: 12, available_slots: 11 }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'ऊंची कूद (High Jump)',
  //     category: 'बालक - कक्षा 10 तथा ऊपर',
  //     venue: 'कूद कोर्ट B',
  //     date: '2026-11-06',
  //     start_time: '10:30',
  //     end_time: '12:30',
  //     max_players: 20,
  //     status: 'active',
  //     slots: [
  //       { id: 401, slot_name: 'Heat 1 - High Jump Pit', start_time: '10:30', end_time: '12:00', allocated_capacity: 20, available_slots: 20 }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     name: 'बोरी दौड़ (Sack Race)',
  //     category: 'बालक/बालिका - कक्षा 6 से 8',
  //     venue: 'प्रांगण ट्रैक',
  //     date: '2026-11-06',
  //     start_time: '11:00',
  //     end_time: '12:30',
  //     max_players: 35,
  //     status: 'active',
  //     slots: [
  //       { id: 501, slot_name: 'Batch 1 - Track A', start_time: '11:00', end_time: '11:40', allocated_capacity: 20, available_slots: 20 }
  //     ]
  //   },
  //   {
  //     id: 6,
  //     name: 'लिखित सामान्य ज्ञान परीक्षा (GK Quiz)',
  //     category: 'सभी वर्ग - Open',
  //     venue: 'केंद्रीय परीक्षा हॉल, सारीपट्टी',
  //     date: '2026-11-06',
  //     start_time: '16:00',
  //     end_time: '17:30',
  //     max_players: 100,
  //     status: 'active',
  //     slots: [
  //       { id: 601, slot_name: 'Hall A - Seat 1-50', start_time: '16:00', end_time: '17:30', allocated_capacity: 50, available_slots: 48 }
  //     ]
  //   },
  //   {
  //     id: 7,
  //     name: 'शतरंज (Chess Championship)',
  //     category: 'सभी वर्ग - Open',
  //     venue: 'कम्युनिटी क्लब हॉल',
  //     date: '2026-11-06',
  //     start_time: '17:00',
  //     end_time: '19:00',
  //     max_players: 32,
  //     status: 'active',
  //     slots: [
  //       { id: 701, slot_name: 'Round 1 Boards 1-16', start_time: '17:00', end_time: '18:00', allocated_capacity: 16, available_slots: 15 }
  //     ]
  //   },
  //   {
  //     id: 8,
  //     name: 'कला एवं चित्रकला (Art Contest)',
  //     category: 'बालक/बालिका - कक्षा 1 से 5',
  //     venue: 'कला दीर्घा परिसर',
  //     date: '2026-11-06',
  //     start_time: '18:00',
  //     end_time: '19:30',
  //     max_players: 50,
  //     status: 'active',
  //     slots: [
  //       { id: 801, slot_name: 'Gallery A - Desk 1-30', start_time: '18:00', end_time: '19:30', allocated_capacity: 30, available_slots: 29 }
  //     ]
  //   }
  // ],
  // volunteers: [
  //   {
  //     id: 1,
  //     user_id: 2,
  //     name: 'अमित कुमार यादव (Amit Kumar)',
  //     mobile: '9876500001',
  //     email: 'amit.sports@saripatti.org',
  //     village: 'सारीपट्टी (Saripatti)',
  //     district: 'आजमगढ़ (Azamgarh)',
  //     status: 'active'
  //   },
  //   {
  //     id: 2,
  //     user_id: 2,
  //     name: 'सुनील सिंह (Sunil Singh)',
  //     mobile: '9876500002',
  //     email: 'sunil.v@saripatti.org',
  //     village: 'बटेश्वर (Bateshwar)',
  //     district: 'आजमगढ़ (Azamgarh)',
  //     status: 'active'
  //   },
  //   {
  //     id: 3,
  //     user_id: 2,
  //     name: 'पूजा मौर्या (Pooja Maurya)',
  //     mobile: '9876500003',
  //     email: 'pooja.m@saripatti.org',
  //     village: 'मऊ खास (Mau Khas)',
  //     district: 'मऊ (Mau)',
  //     status: 'active'
  //   }
  // ],
  // players: [
  //   {
  //     id: 1,
  //     user_id: 3,
  //     class_id: 3,
  //     game_id: 1,
  //     slot_id: 101,
  //     name: 'रोहित कुमार (Rohit Kumar)',
  //     father_name: 'राजेन्द्र कुमार',
  //     village: 'सारीपट्टी',
  //     mobile: '9876543210',
  //     dob: '2008-05-14',
  //     gender: 'Male',
  //     image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  //     aadhaar_no: '458912347890',
  //     aadhaar_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  //     status: 'Approved',
  //     rejection_reason: null,
  //     is_present: true,
  //     created_at: '2026-10-01 10:30:00'
  //   },
  //   {
  //     id: 2,
  //     user_id: null,
  //     class_id: 2,
  //     game_id: 2,
  //     slot_id: 201,
  //     name: 'अंजलि शर्मा (Anjali Sharma)',
  //     father_name: 'विनोद शर्मा',
  //     village: 'बटेश्वर',
  //     mobile: '9876543211',
  //     dob: '2010-08-22',
  //     gender: 'Female',
  //     image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  //     aadhaar_no: '654321890123',
  //     aadhaar_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  //     status: 'Approved',
  //     rejection_reason: null,
  //     is_present: true,
  //     created_at: '2026-10-01 11:15:00'
  //   },
  //   {
  //     id: 3,
  //     user_id: null,
  //     class_id: 4,
  //     game_id: 3,
  //     slot_id: 301,
  //     name: 'विकास वर्मा (Vikas Verma)',
  //     father_name: 'रामसूरत वर्मा',
  //     village: 'रानी की सराय',
  //     mobile: '9876543212',
  //     dob: '2007-02-10',
  //     gender: 'Male',
  //     image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  //     aadhaar_no: '789012345678',
  //     aadhaar_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  //     status: 'Approved',
  //     rejection_reason: null,
  //     is_present: false,
  //     created_at: '2026-10-01 12:45:00'
  //   },
  //   {
  //     id: 4,
  //     user_id: null,
  //     class_id: 3,
  //     game_id: 1,
  //     slot_id: 101,
  //     name: 'दीपक चौहान (Deepak Chauhan)',
  //     father_name: 'सुरेश चौहान',
  //     village: 'बेलईसा',
  //     mobile: '9876543213',
  //     dob: '2008-11-19',
  //     gender: 'Male',
  //     image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  //     aadhaar_no: '901234567890',
  //     aadhaar_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  //     status: 'Pending',
  //     rejection_reason: null,
  //     is_present: false,
  //     created_at: '2026-10-01 14:20:00'
  //   },
  //   {
  //     id: 5,
  //     user_id: null,
  //     class_id: 1,
  //     game_id: 8,
  //     slot_id: null,
  //     name: 'प्रिया यादव (Priya Yadav)',
  //     father_name: 'अखिलेश यादव',
  //     village: 'सारीपट्टी',
  //     mobile: '9876543214',
  //     dob: '2015-04-12',
  //     gender: 'Female',
  //     image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  //     aadhaar_no: '234567890123',
  //     aadhaar_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  //     status: 'Pending',
  //     rejection_reason: null,
  //     is_present: false,
  //     created_at: '2026-10-01 15:10:00'
  //   },
  //   {
  //     id: 6,
  //     user_id: null,
  //     class_id: 3,
  //     game_id: 1,
  //     slot_id: null,
  //     name: 'मनोज कुमार (Manoj Kumar)',
  //     father_name: 'दिनेश कुमार',
  //     village: 'खरिहानी',
  //     mobile: '9876543215',
  //     dob: '2006-03-01',
  //     gender: 'Male',
  //     image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  //     aadhaar_no: '112233445566',
  //     aadhaar_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  //     status: 'Rejected',
  //     rejection_reason: 'आधार कार्ड अस्पष्ट एवं जन्मतिथि मेल नहीं खा रही है (Blurry Aadhaar ID copy)',
  //     is_present: false,
  //     created_at: '2026-10-01 16:00:00'
  //   }
  // ],
  // winners: [
  //   {
  //     id: 1,
  //     game_id: 1,
  //     player_id: 1,
  //     position: '1st',
  //     prize_title: 'स्वर्ण पदक एवं ₹5,100 नकद (Gold Trophy + Cash Award)',
  //     remarks: 'शानदार समय रिकॉर्ड 4:32 मिनट',
  //     published_at: '2026-10-01 18:00:00'
  //   },
  //   {
  //     id: 2,
  //     game_id: 2,
  //     player_id: 2,
  //     position: '1st',
  //     prize_title: 'स्वर्ण पदक एवं ₹3,100 नकद (Gold Medal + Award)',
  //     remarks: 'उत्कृष्ट गति एवं अनुशासन',
  //     published_at: '2026-10-01 18:30:00'
  //   },
  //   {
  //     id: 3,
  //     game_id: 3,
  //     player_id: 3,
  //     position: '2nd',
  //     prize_title: 'रजत पदक एवं ₹2,100 नकद (Silver Medal + Trophy)',
  //     remarks: '5.85 मीटर की उत्कृष्ट छलांग',
  //     published_at: '2026-10-01 19:00:00'
  //   }
  // ]
}

export const getStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
      return JSON.parse(JSON.stringify(initialData))
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading localStorage store, resetting', err)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
    return JSON.parse(JSON.stringify(initialData))
  }
}

export const saveStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Error writing to localStorage store', err)
  }
}

export const resetStore = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
  return JSON.parse(JSON.stringify(initialData))
}
