// Nova camada de API para conectar frontend com backend
export class HotelAPI {
  private static baseUrl = "/api"

  static async getAllRooms() {
    const response = await fetch(`${this.baseUrl}/rooms`)
    if (!response.ok) throw new Error("Erro ao buscar quartos")
    return response.json()
  }

  static async createReservation(reservation: any) {
    const response = await fetch(`${this.baseUrl}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    })
    if (!response.ok) throw new Error("Erro ao criar reserva")
    return response.json()
  }

  static async updateRoomStatus(roomId: string, status: string, guest?: any) {
    const response = await fetch(`${this.baseUrl}/rooms/${roomId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, guest }),
    })
    if (!response.ok) throw new Error("Erro ao atualizar quarto")
    return response.json()
  }

  static async addExpense(guestId: string, expense: any) {
    const response = await fetch(`${this.baseUrl}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId, ...expense }),
    })
    if (!response.ok) throw new Error("Erro ao adicionar despesa")
    return response.json()
  }

  static async getFutureReservations() {
    const response = await fetch(`${this.baseUrl}/reservations`)
    if (!response.ok) throw new Error("Erro ao buscar reservas futuras")
    return response.json()
  }

  static async cancelReservation(reservationId: string) {
    const response = await fetch(`${this.baseUrl}/reservations/${reservationId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Erro ao cancelar reserva")
    return response.json()
  }

  static async createRoom(room: any) {
    const response = await fetch(`${this.baseUrl}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    })
    if (!response.ok) throw new Error("Erro ao criar quarto")
    return response.json()
  }

  static async updateRoom(roomId: string, updates: any) {
    const response = await fetch(`${this.baseUrl}/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Erro ao atualizar quarto")
    return response.json()
  }

  static async deleteRoom(roomId: string) {
    const response = await fetch(`${this.baseUrl}/rooms/${roomId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Erro ao deletar quarto")
    return response.json()
  }
}
