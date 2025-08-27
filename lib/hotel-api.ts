const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Função para fazer requisições autenticadas
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("hotel_auth_token")

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erro desconhecido" }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export const hotelApi = {
  // ==================== AUTENTICAÇÃO ====================
  async login(email: string, password: string) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response.token) {
      localStorage.setItem("hotel_auth_token", response.token)
      localStorage.setItem("hotel_current_user", JSON.stringify(response.user))
    }

    return response
  },

  logout() {
    localStorage.removeItem("hotel_auth_token")
    localStorage.removeItem("hotel_current_user")
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("hotel_current_user")
    return userStr ? JSON.parse(userStr) : null
  },

  // ==================== QUARTOS ====================
  async getAllRooms() {
    return apiRequest("/rooms")
  },

  async createRoom(room: any) {
    return apiRequest("/rooms", {
      method: "POST",
      body: JSON.stringify(room),
    })
  },

  async updateRoom(id: string, updates: any) {
    return apiRequest(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  },

  async deleteRoom(id: string) {
    return apiRequest(`/rooms/${id}`, {
      method: "DELETE",
    })
  },

  // ==================== RESERVAS ====================
  async getFutureReservations() {
    return apiRequest("/reservations")
  },

  async createReservation(roomId: string, guest: any) {
    return apiRequest("/reservations", {
      method: "POST",
      body: JSON.stringify({ roomId, guest }),
    })
  },

  async cancelReservation(id: string) {
    return apiRequest(`/reservations/${id}`, {
      method: "DELETE",
    })
  },

  // ==================== HISTÓRICO ====================
  async getGuestHistory() {
    return apiRequest("/history")
  },

  async addToGuestHistory(historyData: any) {
    return apiRequest("/history", {
      method: "POST",
      body: JSON.stringify(historyData),
    })
  },

  async updateGuestHistoryStatus(id: string, status: string) {
    return apiRequest(`/history/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  },

  async deleteGuestHistory(id: string) {
    return apiRequest(`/history/${id}`, {
      method: "DELETE",
    })
  },

  // ==================== HEALTH CHECK ====================
  async healthCheck() {
    return apiRequest("/health")
  },
}
