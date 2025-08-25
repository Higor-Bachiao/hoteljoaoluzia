import { supabase } from "./supabase"
import type { Room, Reservation, Guest } from "@/types/hotel"

// Interface para histórico de hóspedes
interface GuestHistory {
  id: string
  guest: Guest
  roomNumber: string
  roomType: string
  checkInDate: string
  checkOutDate: string
  totalPrice: number
  status: "active" | "completed" | "cancelled"
  createdAt: string
}

export class HotelServiceCloud {
  // ==================== ROOMS ====================
  static async getAllRooms(): Promise<Room[]> {
    try {
      const { data, error } = await supabase.from("rooms").select("*").order("number")

      if (error) throw error

      return data.map((row: any) => ({
        id: row.id,
        number: row.number,
        type: row.type,
        capacity: row.capacity,
        beds: row.beds,
        price: Number.parseFloat(row.price),
        amenities: row.amenities || [],
        status: row.status,
        guest: row.guest_data || undefined,
      }))
    } catch (error) {
      console.error("❌ Erro ao buscar quartos:", error)
      throw error
    }
  }

  static async createRoom(room: Omit<Room, "id">): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          number: room.number,
          type: room.type,
          capacity: room.capacity,
          beds: room.beds,
          price: room.price,
          amenities: room.amenities,
          status: room.status || "available",
          guest_data: room.guest || null,
        })
        .select()
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error("❌ Erro ao criar quarto:", error)
      throw error
    }
  }

  static async updateRoom(id: string, updates: Partial<Room>): Promise<void> {
    try {
      const updateData: any = {}

      if (updates.number) updateData.number = updates.number
      if (updates.type) updateData.type = updates.type
      if (updates.capacity) updateData.capacity = updates.capacity
      if (updates.beds) updateData.beds = updates.beds
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.amenities) updateData.amenities = updates.amenities
      if (updates.status) updateData.status = updates.status
      if (updates.guest !== undefined) updateData.guest_data = updates.guest

      const { error } = await supabase.from("rooms").update(updateData).eq("id", id)

      if (error) throw error
    } catch (error) {
      console.error("❌ Erro ao atualizar quarto:", error)
      throw error
    }
  }

  static async deleteRoom(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id)

      if (error) throw error
    } catch (error) {
      console.error("❌ Erro ao deletar quarto:", error)
      throw error
    }
  }

  // ==================== RESERVATIONS ====================
  static async getFutureReservations(): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false })

      if (error) throw error

      return data.map((row: any) => ({
        id: row.id,
        roomId: row.room_id,
        guest: row.guest_data,
        createdAt: row.created_at,
      }))
    } catch (error) {
      console.error("❌ Erro ao buscar reservas:", error)
      throw error
    }
  }

  static async createReservation(roomId: string, guest: Guest): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .insert({
          room_id: roomId,
          guest_data: guest,
        })
        .select()
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error("❌ Erro ao criar reserva:", error)
      throw error
    }
  }

  static async cancelReservation(reservationId: string): Promise<void> {
    try {
      const { error } = await supabase.from("reservations").delete().eq("id", reservationId)

      if (error) throw error
    } catch (error) {
      console.error("❌ Erro ao cancelar reserva:", error)
      throw error
    }
  }

  // ==================== GUEST HISTORY ====================
  static async getGuestHistory(): Promise<GuestHistory[]> {
    try {
      const { data, error } = await supabase.from("guest_history").select("*").order("created_at", { ascending: false })

      if (error) throw error

      return data.map((row: any) => ({
        id: row.id,
        guest: row.guest_data,
        roomNumber: row.room_number,
        roomType: row.room_type,
        checkInDate: row.check_in_date,
        checkOutDate: row.check_out_date,
        totalPrice: Number.parseFloat(row.total_price),
        status: row.status,
        createdAt: row.created_at,
      }))
    } catch (error) {
      console.error("❌ Erro ao buscar histórico:", error)
      throw error
    }
  }

  static async addToGuestHistory(history: Omit<GuestHistory, "id" | "createdAt">): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("guest_history")
        .insert({
          guest_data: history.guest,
          room_number: history.roomNumber,
          room_type: history.roomType,
          check_in_date: history.checkInDate,
          check_out_date: history.checkOutDate,
          total_price: history.totalPrice,
          status: history.status,
        })
        .select()
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error("❌ Erro ao adicionar histórico:", error)
      throw error
    }
  }

  static async updateGuestHistoryStatus(id: string, status: string): Promise<void> {
    try {
      const { error } = await supabase.from("guest_history").update({ status }).eq("id", id)

      if (error) throw error
    } catch (error) {
      console.error("❌ Erro ao atualizar status do histórico:", error)
      throw error
    }
  }

  static async deleteGuestHistory(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("guest_history").delete().eq("id", id)

      if (error) throw error
    } catch (error) {
      console.error("❌ Erro ao deletar histórico:", error)
      throw error
    }
  }

  // ==================== USERS ====================
  static async authenticateUser(email: string, password: string): Promise<any> {
    try {
      // Por simplicidade, vamos usar uma verificação básica
      // Em produção, use hash de senha adequado
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, phone")
        .eq("email", email)
        .single()

      if (error || !data) {
        throw new Error("Email ou senha incorretos")
      }

      // Verificação simples de senha (em produção, use bcrypt)
      const validPasswords: { [key: string]: string } = {
        "admin@hotel.com": "admin123",
        "staff@hotel.com": "staff123",
        "guest@hotel.com": "guest123",
      }

      if (validPasswords[email] !== password) {
        throw new Error("Email ou senha incorretos")
      }

      return data
    } catch (error) {
      console.error("❌ Erro na autenticação:", error)
      throw error
    }
  }

  static async createUser(userData: any): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("users")
        .insert({
          name: userData.name,
          email: userData.email,
          role: userData.role || "guest",
          phone: userData.phone,
          password_hash: "simple_hash", // Em produção, use bcrypt
        })
        .select()
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error)
      throw error
    }
  }

  // ==================== REAL-TIME SYNC ====================
  static subscribeToChanges(callback: () => void) {
    const channels = [
      supabase
        .channel("rooms-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, callback),

      supabase
        .channel("reservations-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, callback),

      supabase
        .channel("history-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "guest_history" }, callback),
    ]

    channels.forEach((channel) => channel.subscribe())

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel))
    }
  }
}
