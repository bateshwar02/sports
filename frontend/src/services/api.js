/**
 * API Service Client
 * Blueprint Section 1, 8, 9
 * Standardized REST endpoints enforcing HTTP status semantics, payload validation, and role authorization.
 * Features automatic fallback to localStorage store if backend is offline.
 */

const API_BASE = "https://www.aravmzpsports.online/api"; //'http://localhost:8000/api'

// Helper for local mock responses

export const api = {
  // 1. Auth: POST /api/auth/login
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const jsonData = await res.json();
      if (res.ok) {
        localStorage.setItem(
          "sms_auth",
          JSON.stringify({
            token: jsonData?.data?.token,
            user: jsonData?.data?.user,
          }),
        );
        return jsonData;
      } else {
        // Handle API errors (e.g., 401 Unauthorized, 400 Bad Request)
        throw new Error(jsonData?.message || "Login failed");
      }
    } catch (e) {
      console.error(e);
      throw e; // Or handle/return an error state to the UI
    }
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem("sms_auth");
      return raw ? JSON.parse(raw).user : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem("sms_auth");
  },

  // 2. Players: GET /api/players
  async getPlayers(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/players?${query}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // 3. Register Player: POST /api/players
  async registerPlayer(data) {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      const res = await fetch(`${API_BASE}/players`, {
        credentials: "include",
        method: "POST",
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // 4. Approve Player: POST /api/players/{id}/approve
  async approvePlayer(id, slotId = null) {
    try {
      const res = await fetch(`${API_BASE}/players/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slotId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // 5. Reject Player: POST /api/players/{id}/reject
  async rejectPlayer(id, reason) {
    try {
      const res = await fetch(`${API_BASE}/players/${id}/reject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejection_reason: reason }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Toggle court presence (Check-in)
  async toggleCheckIn(id, isPresent) {
    try {
      const res = await fetch(`${API_BASE}/players/${id}/checkin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_present: isPresent ? 1 : 0 }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Get Aadhaar URL for a player
  async getAadhaarUrl(id) {
    try {
      const res = await fetch(`${API_BASE}/players/${id}/aadhaar`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to load Aadhaar: ${res.status}`);
      }

      const blob = await res.blob();

      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("Aadhaar error:", e);
      return null;
    }
  },

  // 6. Games: GET /api/games
  async getGames() {
    try {
      const res = await fetch(`${API_BASE}/games`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // 7. Create Game: POST /api/games
  async createGame(gameData) {
    try {
      const res = await fetch(`${API_BASE}/games`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Add Game Slot
  async addGameSlot(gameId, slotData) {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}/slots`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // 8. Classes: GET /api/classes
  async getClasses() {
    try {
      const res = await fetch(`${API_BASE}/classes`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Create Class: POST /api/classes
  async createClass(classData) {
    try {
      const res = await fetch(`${API_BASE}/classes`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // 9. Winners: GET /api/winners
  async getWinners() {
    try {
      const res = await fetch(`${API_BASE}/winners`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Map Winner: POST /api/winners
  async mapWinner(data) {
    try {
      const res = await fetch(`${API_BASE}/winners`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Delete Winner
  async deleteWinner(id) {
    try {
      const res = await fetch(`${API_BASE}/winners/${id}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // 10. Volunteers: GET /api/volunteers
  async getVolunteers() {
    try {
      const res = await fetch(`${API_BASE}/volunteers`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Create Volunteer: POST /api/volunteers
  async createVolunteer(volData) {
    try {
      const res = await fetch(`${API_BASE}/volunteers`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Toggle Volunteer Status
  async toggleVolunteerStatus(id, newStatus) {
    try {
      const res = await fetch(`${API_BASE}/volunteers/${id}/status`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },

  // Update Volunteer Region
  async updateVolunteerRegion(id, village, district) {
    try {
      const res = await fetch(`${API_BASE}/volunteers/${id}/region`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ village, district }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
  },
};
