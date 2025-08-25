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
      console.log("🔍 Buscando quartos do Supabase...")

      const { data, error } = await supabase.from("rooms").select("*").order("number")

      if (error) {
        console.error("❌ Erro Supabase:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      if (!data || !Array.isArray(data)) {
        console.warn("⚠️ Dados inválidos do Supabase")
        return []
      }

      const rooms = data.map((row: any) => ({
        id: row.id,
        number: row.number,
        type: row.type,
        capacity: row.capacity,
        beds: row.beds,
        price: Number.parseFloat(row.price) || 0,
        amenities: Array.isArray(row.amenities) ? row.amenities : [],
        status: row.status || "available",
        guest: row.guest_data || undefined,
      }))

      console.log(`✅ ${rooms.length} quartos carregados do Supabase`)
      return rooms
    } catch (error: any) {
      console.error("❌ Erro ao buscar quartos:", error)
      throw new Error(`Falha na conexão: ${error.message}`)
    }
  }

  static async createRoom(room: Omit<Room, "id">): Promise<string> {
    try {
      console.log("🏨 Criando quarto no Supabase:", room.number)

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

      if (error) {
        console.error("❌ Erro ao criar quarto:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Quarto criado:", data.id)
      return data.id
    } catch (error: any) {
      console.error("❌ Erro ao criar quarto:", error)
      throw error
    }
  }

  static async updateRoom(id: string, updates: Partial<Room>): Promise<void> {
    try {
      console.log("🔄 Atualizando quarto:", id, updates)

      const updateData: any = {}

      if (updates.number) updateData.number = updates.number
      if (updates.type) updateData.type = updates.type
      if (updates.capacity !== undefined) updateData.capacity = updates.capacity
      if (updates.beds !== undefined) updateData.beds = updates.beds
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.amenities) updateData.amenities = updates.amenities
      if (updates.status) updateData.status = updates.status
      if (updates.guest !== undefined) updateData.guest_data = updates.guest

      const { error } = await supabase.from("rooms").update(updateData).eq("id", id)

      if (error) {
        console.error("❌ Erro ao atualizar quarto:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Quarto atualizado")
    } catch (error: any) {
      console.error("❌ Erro ao atualizar quarto:", error)
      throw error
    }
  }

  static async deleteRoom(id: string): Promise<void> {
    try {
      console.log("🗑️ Deletando quarto:", id)

      const { error } = await supabase.from("rooms").delete().eq("id", id)

      if (error) {
        console.error("❌ Erro ao deletar quarto:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Quarto deletado")
    } catch (error: any) {
      console.error("❌ Erro ao deletar quarto:", error)
      throw error
    }
  }

  // ==================== RESERVATIONS ====================
  static async getFutureReservations(): Promise<Reservation[]> {
    try {
      console.log("📅 Buscando reservas futuras...")

      const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Erro ao buscar reservas:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      if (!data || !Array.isArray(data)) {
        return []
      }

      const reservations = data.map((row: any) => ({
        id: row.id,
        roomId: row.room_id,
        guest: row.guest_data,
        createdAt: row.created_at,
      }))

      console.log(`✅ ${reservations.length} reservas carregadas`)
      return reservations
    } catch (error: any) {
      console.error("❌ Erro ao buscar reservas:", error)
      throw error
    }
  }

  static async createReservation(roomId: string, guest: Guest): Promise<string> {
    try {
      console.log("📅 Criando reserva:", guest.name)

      const { data, error } = await supabase
        .from("reservations")
        .insert({
          room_id: roomId,
          guest_data: guest,
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Erro ao criar reserva:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Reserva criada:", data.id)
      return data.id
    } catch (error: any) {
      console.error("❌ Erro ao criar reserva:", error)
      throw error
    }
  }

  static async cancelReservation(reservationId: string): Promise<void> {
    try {
      console.log("❌ Cancelando reserva:", reservationId)

      const { error } = await supabase.from("reservations").delete().eq("id", reservationId)

      if (error) {
        console.error("❌ Erro ao cancelar reserva:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Reserva cancelada")
    } catch (error: any) {
      console.error("❌ Erro ao cancelar reserva:", error)
      throw error
    }
  }

  // ==================== GUEST HISTORY ====================
  static async getGuestHistory(): Promise<GuestHistory[]> {
    try {
      console.log("📚 Buscando histórico...")

      const { data, error } = await supabase.from("guest_history").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Erro ao buscar histórico:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      if (!data || !Array.isArray(data)) {
        return []
      }

      const history = data.map((row: any) => ({
        id: row.id,
        guest: row.guest_data,
        roomNumber: row.room_number,
        roomType: row.room_type,
        checkInDate: row.check_in_date,
        checkOutDate: row.check_out_date,
        totalPrice: Number.parseFloat(row.total_price) || 0,
        status: row.status,
        createdAt: row.created_at,
      }))

      console.log(`✅ ${history.length} registros de histórico carregados`)
      return history
    } catch (error: any) {
      console.error("❌ Erro ao buscar histórico:", error)
      throw error
    }
  }

  static async addToGuestHistory(history: Omit<GuestHistory, "id" | "createdAt">): Promise<string> {
    try {
      console.log("📝 Adicionando ao histórico:", history.guest.name)

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

      if (error) {
        console.error("❌ Erro ao adicionar histórico:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Histórico adicionado:", data.id)
      return data.id
    } catch (error: any) {
      console.error("❌ Erro ao adicionar histórico:", error)
      throw error
    }
  }

  static async updateGuestHistoryStatus(id: string, status: string): Promise<void> {
    try {
      console.log("🔄 Atualizando status do histórico:", id, status)

      const { error } = await supabase.from("guest_history").update({ status }).eq("id", id)

      if (error) {
        console.error("❌ Erro ao atualizar status:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Status do histórico atualizado")
    } catch (error: any) {
      console.error("❌ Erro ao atualizar status do histórico:", error)
      throw error
    }
  }

  static async deleteGuestHistory(id: string): Promise<void> {
    try {
      console.log("🗑️ Deletando histórico:", id)

      const { error } = await supabase.from("guest_history").delete().eq("id", id)

      if (error) {
        console.error("❌ Erro ao deletar histórico:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Histórico deletado")
    } catch (error: any) {
      console.error("❌ Erro ao deletar histórico:", error)
      throw error
    }
  }

  // ==================== USERS ====================
  static async authenticateUser(email: string, password: string): Promise<any> {
    try {
      console.log("🔐 Autenticando usuário:", email)

      // Verificação simples de senha (em produção, use bcrypt)
      const validPasswords: { [key: string]: string } = {
        "admin@hotel.com": "admin123",
        "staff@hotel.com": "staff123",
        "guest@hotel.com": "guest123",
      }

      if (validPasswords[email] !== password) {
        throw new Error("Email ou senha incorretos")
      }

      // Buscar dados do usuário
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, phone")
        .eq("email", email)
        .single()

      if (error || !data) {
        // Se não encontrar no Supabase, criar usuário padrão
        const defaultUsers: { [key: string]: any } = {
          "admin@hotel.com": {
            id: "admin_1",
            name: "Administrador",
            email: "admin@hotel.com",
            role: "admin",
            phone: "(11) 99999-9999",
          },
          "staff@hotel.com": {
            id: "staff_1",
            name: "Funcionário",
            email: "staff@hotel.com",
            role: "staff",
            phone: "(11) 88888-8888",
          },
          "guest@hotel.com": {
            id: "guest_1",
            name: "Hóspede",
            email: "guest@hotel.com",
            role: "guest",
            phone: "(11) 77777-7777",
          },
        }

        const userData = defaultUsers[email]
        if (userData) {
          console.log("✅ Usuário autenticado (padrão):", userData.email)
          return userData
        }
      }

      console.log("✅ Usuário autenticado:", data.email)
      return data
    } catch (error: any) {
      console.error("❌ Erro na autenticação:", error)
      throw error
    }
  }

  static async createUser(userData: any): Promise<string> {
    try {
      console.log("👤 Criando usuário:", userData.email)

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

      if (error) {
        console.error("❌ Erro ao criar usuário:", error)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      console.log("✅ Usuário criado:", data.id)
      return data.id
    } catch (error: any) {
      console.error("❌ Erro ao criar usuário:", error)
      throw error
    }
  }

  // ==================== REAL-TIME SYNC ====================
  static subscribeToChanges(callback: () => void) {
    console.log("🔴 Configurando Real-time subscriptions")

    const channels = [
      supabase.channel("rooms-changes").on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => {
        console.log("🔴 Mudança detectada em rooms")
        callback()
      }),

      supabase
        .channel("reservations-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => {
          console.log("🔴 Mudança detectada em reservations")
          callback()
        }),

      supabase
        .channel("history-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "guest_history" }, () => {
          console.log("🔴 Mudança detectada em guest_history")
          callback()
        }),
    ]

    channels.forEach((channel) => channel.subscribe())

    return () => {
      console.log("🔴 Removendo Real-time subscriptions")
      channels.forEach((channel) => supabase.removeChannel(channel))
    }
  }

  // ==================== HEALTH CHECK ====================
  static async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from("rooms").select("count").limit(1)

      return !error
    } catch (error) {
      console.error("❌ Health check falhou:", error)
      return false
    }
  }
}
