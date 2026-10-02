/**
 * API Service Client
 * Blueprint Section 1, 8, 9
 * Standardized REST endpoints enforcing HTTP status semantics, payload validation, and role authorization.
 * Features automatic fallback to localStorage store if backend is offline.
 */

import { getStore, saveStore } from './store'

const API_BASE = 'http://localhost:8000/api'

// Helper for local mock responses
const mockDelay = (ms = 120) => new Promise(res => setTimeout(res, ms))

export const api = {
  // 1. Auth: POST /api/auth/login
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // Backend offline, fallback to mock store
    }

    await mockDelay()
    const store = getStore()
    const cleanUser = username.trim().toLowerCase()

    // 1-Click demo logins or matches
    if (cleanUser === 'admin' || cleanUser === 'administrator') {
      if (password === 'admin123' || password === 'admin') {
        const token = 'mock_jwt_token_admin_' + Date.now()
        const user = { id: 1, username: 'admin', role: 'admin', name: 'मुख्य समन्वयक (System Admin)' }
        localStorage.setItem('sms_auth', JSON.stringify({ token, user }))
        return { success: true, statusCode: 200, message: 'Authentication successful', data: { token, user } }
      }
    }

    if (cleanUser === 'volunteer' || cleanUser === 'vol') {
      if (password === 'vol123' || password === 'volunteer') {
        const token = 'mock_jwt_token_volunteer_' + Date.now()
        const user = { id: 2, username: 'volunteer', role: 'volunteer', name: 'अमित कुमार यादव (Volunteer Lead)' }
        localStorage.setItem('sms_auth', JSON.stringify({ token, user }))
        return { success: true, statusCode: 200, message: 'Authentication successful', data: { token, user } }
      }
    }

    // Check player login by mobile
    const player = store.players.find(p => p.mobile === username.trim())
    if (player) {
      if (password === 'player123' || password === '123456' || password === player.mobile.slice(-4)) {
        const token = 'mock_jwt_token_player_' + Date.now()
        const user = { id: player.id, username: player.mobile, role: 'player', name: player.name, playerId: player.id }
        localStorage.setItem('sms_auth', JSON.stringify({ token, user }))
        return { success: true, statusCode: 200, message: 'Authentication successful', data: { token, user } }
      }
    }

    // Default player fallback for testing
    if (cleanUser === '9876543210' && (password === 'player123' || password === 'player')) {
      const token = 'mock_jwt_token_player_' + Date.now()
      const user = { id: 1, username: '9876543210', role: 'player', name: 'रोहित कुमार (Athlete)', playerId: 1 }
      localStorage.setItem('sms_auth', JSON.stringify({ token, user }))
      return { success: true, statusCode: 200, message: 'Authentication successful', data: { token, user } }
    }

    return {
      success: false,
      statusCode: 401,
      message: 'अमान्य क्रेडेंशियल्स (Invalid username or password). कृपया सही विवरण दर्ज करें।'
    }
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem('sms_auth')
      return raw ? JSON.parse(raw).user : null
    } catch {
      return null
    }
  },

  logout() {
    localStorage.removeItem('sms_auth')
  },

  // 2. Players: GET /api/players
  async getPlayers(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString()
      const res = await fetch(`${API_BASE}/players?${query}`, { 
        method: 'GET', 
        credentials: 'include',
         headers: {
          Accept: 'application/json'
        } 
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    let list = store.players.map(p => {
      const game = store.games.find(g => g.id === Number(p.game_id))
      const cls = store.classes.find(c => c.id === Number(p.class_id))
      const slot = game?.slots?.find(s => s.id === Number(p.slot_id))
      return {
        ...p,
        game_name: game ? game.name : 'Unknown Game',
        game_category: game ? game.category : '',
        class_name: cls ? cls.class_name : 'Unknown Class',
        slot_name: slot ? `${slot.slot_name} (${slot.start_time})` : 'Not Assigned'
      }
    })

    if (filters.game_id && filters.game_id !== 'all') {
      list = list.filter(p => String(p.game_id) === String(filters.game_id))
    }
    if (filters.class_id && filters.class_id !== 'all') {
      list = list.filter(p => String(p.class_id) === String(filters.class_id))
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(p => p.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const s = filters.search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.father_name.toLowerCase().includes(s) ||
        p.village.toLowerCase().includes(s) ||
        p.mobile.includes(s) ||
        (p.aadhaar_no && p.aadhaar_no.includes(s))
      )
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Player list retrieved successfully',
      data: {
        players: list,
        pagination: {
          total: list.length,
          currentPage: 1,
          limit: 100,
          totalPages: 1
        }
      }
    }
  },

  // 3. Register Player: POST /api/players
  async registerPlayer(data) {
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => formData.append(key, data[key]))
      const res = await fetch(`${API_BASE}/players`, {
        credentials: 'include',
        method: 'POST',
        body: formData
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    // Local validation per Section 9
    const errors = {}
    if (!data.name?.trim()) errors.name = 'खिलाड़ी का नाम आवश्यक है (Player Name required)'
    if (!data.father_name?.trim()) errors.father_name = 'पिता का नाम आवश्यक है (Father Name required)'
    if (!data.game_id) errors.game_id = 'प्रतियोगिता का चयन करें (Game selection required)'
    if (!data.class_id) errors.class_id = 'वर्ग का चयन करें (Class selection required)'
    if (!data.village?.trim()) errors.village = 'ग्राम / पता आवश्यक है (Village required)'
    if (!data.mobile?.trim() || !/^\d{10}$/.test(data.mobile.replace(/\D/g, ''))) {
      errors.mobile = '10 अंकों का वैध मोबाइल नंबर दर्ज करें (Valid 10-digit mobile required)'
    }
    const cleanAadhaar = (data.aadhaar_no || '').replace(/\D/g, '')
    if (cleanAadhaar.length !== 12) {
      errors.aadhaar_number = 'Aadhaar must be exactly 12 digits (आधार 12 अंकों का होना चाहिए)'
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        statusCode: 422,
        message: `Form validation failed on ${Object.keys(errors).length} fields`,
        errors
      }
    }

    const store = getStore()
    const newId = store.players.length > 0 ? Math.max(...store.players.map(p => p.id)) + 1 : 1
    const newPlayer = {
      id: newId,
      user_id: null,
      class_id: Number(data.class_id),
      game_id: Number(data.game_id),
      slot_id: null,
      name: data.name.trim(),
      father_name: data.father_name.trim(),
      village: data.village.trim(),
      mobile: data.mobile.trim(),
      dob: data.dob || '2008-01-01',
      gender: data.gender || 'Male',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      aadhaar_no: cleanAadhaar,
      aadhaar_url: data.aadhaar_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      status: 'Pending',
      rejection_reason: null,
      is_present: false,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }

    store.players.unshift(newPlayer)
    saveStore(store)

    return {
      success: true,
      statusCode: 201,
      message: 'पंजीकरण सफलतापूर्वक दर्ज किया गया (Registration submitted successfully)',
      data: {
        playerId: newId,
        status: 'Pending',
        message: 'आवेदन सत्यापन के लिए लंबित है (Awaiting Volunteer Document Inspection).'
      }
    }
  },

  // 4. Approve Player: POST /api/players/{id}/approve
  async approvePlayer(id, slotId = null) {
    try {
      const res = await fetch(`${API_BASE}/players/${id}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: slotId })
      })
      if (res.ok) return await res.json()
    } catch(e) {
      console.error(e)
  }

    await mockDelay()
    const store = getStore()
    const p = store.players.find(x => x.id === Number(id))
    if (!p) {
      return { success: false, statusCode: 404, message: 'Player not found' }
    }

    p.status = 'Approved'
    p.rejection_reason = null
    if (slotId) {
      p.slot_id = Number(slotId)
    } else if (!p.slot_id) {
      // Auto-assign first available slot for game
      const game = store.games.find(g => g.id === p.game_id)
      if (game?.slots?.length > 0) {
        p.slot_id = game.slots[0].id
      }
    }

    saveStore(store)
    return {
      success: true,
      statusCode: 200,
      message: 'Player registration approved successfully',
      data: {
        playerId: id,
        status: 'Approved',
        allocatedSlot: p.slot_id ? 'Assigned Slot #' + p.slot_id : 'Scheduled Flight'
      }
    }
  },

  // 5. Reject Player: POST /api/players/{id}/reject
  async rejectPlayer(id, reason) {
    try {
      const res = await fetch(`${API_BASE}/players/${id}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason: reason })
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    if (!reason || !reason.trim()) {
      return {
        success: false,
        statusCode: 422,
        message: 'Rejection reason is required',
        errors: { rejection_reason: 'Audit rationale is mandatory' }
      }
    }

    const store = getStore()
    const p = store.players.find(x => x.id === Number(id))
    if (!p) return { success: false, statusCode: 404, message: 'Player not found' }

    p.status = 'Rejected'
    p.rejection_reason = reason.trim()
    p.slot_id = null
    saveStore(store)

    return {
      success: true,
      statusCode: 200,
      message: 'Player application rejected with audit rationale recorded',
      data: { playerId: id, status: 'Rejected', rejection_reason: reason }
    }
  },

  // Toggle court presence (Check-in)
  async toggleCheckIn(id, isPresent) {
    try {
      const res = await fetch(`${API_BASE}/players/${id}/checkin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_present: isPresent ? 1 : 0 })
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const p = store.players.find(x => x.id === Number(id))
    if (p) {
      p.is_present = Boolean(isPresent)
      saveStore(store)
    }
    return { success: true, statusCode: 200, data: { playerId: id, is_present: isPresent } }
  },

  // 6. Games: GET /api/games
  async getGames() {
    try {
      const res = await fetch(`${API_BASE}/games`, { 
        method: 'GET', 
        credentials: 'include',
         headers: {
          Accept: 'application/json'
        } 
      } )
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const games = store.games.map(g => {
      const registeredCount = store.players.filter(p => p.game_id === g.id && p.status !== 'Rejected').length
      return {
        ...g,
        registered_count: registeredCount,
        slots_count: g.slots ? g.slots.length : 0
      }
    })
    return { success: true, statusCode: 200, data: games }
  },

  // 7. Create Game: POST /api/games
  async createGame(gameData) {
    try {
      const res = await fetch(`${API_BASE}/games`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const newId = store.games.length > 0 ? Math.max(...store.games.map(g => g.id)) + 1 : 1
    const newGame = {
      id: newId,
      name: gameData.name,
      category: gameData.category,
      venue: gameData.venue,
      date: gameData.date,
      start_time: gameData.start_time,
      end_time: gameData.end_time,
      max_players: Number(gameData.max_players) || 50,
      status: 'active',
      slots: [
        {
          id: newId * 100 + 1,
          slot_name: 'Main Flight - ' + gameData.venue,
          start_time: gameData.start_time,
          end_time: gameData.end_time,
          allocated_capacity: Number(gameData.max_players) || 50,
          available_slots: Number(gameData.max_players) || 50
        }
      ]
    }
    store.games.push(newGame)
    saveStore(store)
    return { success: true, statusCode: 201, message: 'Game created successfully', data: newGame }
  },

  // Add Game Slot
  async addGameSlot(gameId, slotData) {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}/slots`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData)
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const game = store.games.find(g => g.id === Number(gameId))
    if (!game) return { success: false, statusCode: 404, message: 'Game not found' }

    if (!game.slots) game.slots = []
    const slotId = Date.now()
    game.slots.push({
      id: slotId,
      slot_name: slotData.slot_name,
      start_time: slotData.start_time,
      end_time: slotData.end_time,
      allocated_capacity: Number(slotData.allocated_capacity) || 20,
      available_slots: Number(slotData.allocated_capacity) || 20
    })
    saveStore(store)
    return { success: true, statusCode: 200, message: 'Slot added', data: game }
  },

  // 8. Classes: GET /api/classes
  async getClasses() {
    try {
      const res = await fetch(`${API_BASE}/classes`,{ 
        method: 'GET', 
        credentials: 'include',
         headers: {
          Accept: 'application/json'
        } 
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    return { success: true, statusCode: 200, data: store.classes }
  },

  // Create Class: POST /api/classes
  async createClass(classData) {
    try {
      const res = await fetch(`${API_BASE}/classes`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData)
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const newId = store.classes.length > 0 ? Math.max(...store.classes.map(c => c.id)) + 1 : 1
    const newClass = {
      id: newId,
      class_name: classData.class_name,
      class_code: (classData.class_code || 'CLS_' + newId).toUpperCase(),
      description: classData.description || '',
      status: 'active'
    }
    store.classes.push(newClass)
    saveStore(store)
    return { success: true, statusCode: 201, message: 'Class division created', data: newClass }
  },

  // 9. Winners: GET /api/winners
  async getWinners() {
    try {
      const res = await fetch(`${API_BASE}/winners`, {
        method: 'GET', 
        credentials: 'include',
         headers: {
          Accept: 'application/json'
        } 
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const winners = store.winners.map(w => {
      const game = store.games.find(g => g.id === Number(w.game_id))
      const player = store.players.find(p => p.id === Number(w.player_id))
      return {
        ...w,
        game_name: game ? game.name : 'Unknown Game',
        game_category: game ? game.category : '',
        venue: game ? game.venue : '',
        player_name: player ? player.name : 'Unknown Player',
        father_name: player ? player.father_name : '',
        village: player ? player.village : '',
        mobile: player ? player.mobile : '',
        image_url: player ? player.image_url : null
      }
    })
    return { success: true, statusCode: 200, data: winners }
  },

  // Map Winner: POST /api/winners
  async mapWinner(data) {
    try {
      const res = await fetch(`${API_BASE}/winners`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const gameId = Number(data.game_id)
    const playerId = Number(data.player_id)
    const position = data.position

    // Check if player is Approved
    const player = store.players.find(p => p.id === playerId)
    if (!player || player.status !== 'Approved') {
      return { success: false, statusCode: 422, message: 'Only verified (Approved) athletes can be mapped to podium' }
    }

    // Replace if already mapped for this game & position
    const existingIndex = store.winners.findIndex(w => w.game_id === gameId && w.position === position)
    const newEntry = {
      id: existingIndex >= 0 ? store.winners[existingIndex].id : Date.now(),
      game_id: gameId,
      player_id: playerId,
      position: position,
      prize_title: data.prize_title || 'Medal & Certificate',
      remarks: data.remarks || '',
      published_at: new Date().toISOString()
    }

    if (existingIndex >= 0) {
      store.winners[existingIndex] = newEntry
    } else {
      store.winners.push(newEntry)
    }

    saveStore(store)
    return { success: true, statusCode: 200, message: 'Winner podium entry saved', data: newEntry }
  },

  // Delete Winner
  async deleteWinner(id) {
    try {
      const res = await fetch(`${API_BASE}/winners/${id}`, {  credentials: 'include', method: 'DELETE' })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    store.winners = store.winners.filter(w => w.id !== Number(id))
    saveStore(store)
    return { success: true, statusCode: 200, message: 'Winner mapping removed' }
  },

  // 10. Volunteers: GET /api/volunteers
  async getVolunteers() {
    try {
      const res = await fetch(`${API_BASE}/volunteers`, { 
        method: 'GET', 
        credentials: 'include',
         headers: {
          Accept: 'application/json'
        } 
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    return { success: true, statusCode: 200, data: store.volunteers }
  },

  // Create Volunteer: POST /api/volunteers
  async createVolunteer(volData) {
    try {
      const res = await fetch(`${API_BASE}/volunteers`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volData)
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const newId = store.volunteers.length > 0 ? Math.max(...store.volunteers.map(v => v.id)) + 1 : 1
    const newVol = {
      id: newId,
      user_id: 2,
      name: volData.name,
      mobile: volData.mobile,
      email: volData.email || `${volData.mobile}@saripatti.org`,
      village: volData.village,
      district: volData.district || 'आजमगढ़ (Azamgarh)',
      status: 'active'
    }
    store.volunteers.push(newVol)
    saveStore(store)
    return { success: true, statusCode: 201, message: 'Volunteer registered', data: newVol }
  },

  // Toggle Volunteer Status
  async toggleVolunteerStatus(id, newStatus) {
    try {
      const res = await fetch(`${API_BASE}/volunteers/${id}/status`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const vol = store.volunteers.find(v => v.id === Number(id))
    if (vol) {
      vol.status = newStatus
      saveStore(store)
    }
    return { success: true, statusCode: 200, data: { id, status: newStatus } }
  },

  // Update Volunteer Region
  async updateVolunteerRegion(id, village, district) {
    try {
      const res = await fetch(`${API_BASE}/volunteers/${id}/region`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ village, district })
      })
      if (res.ok) return await res.json()
    } catch (e){
      console.error(e)
    }

    await mockDelay()
    const store = getStore()
    const vol = store.volunteers.find(v => v.id === Number(id))
    if (vol) {
      vol.village = village
      if (district) vol.district = district
      saveStore(store)
    }
    return { success: true, statusCode: 200, message: 'Region updated', data: vol }
  }
}
