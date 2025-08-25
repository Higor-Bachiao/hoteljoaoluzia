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
      console.log("🔍 Buscando quartos no Supabase...")
      const { data, error } = await supabase.from("rooms").select("*").order("number")

      if (error) {
        console.error("❌ Erro Supabase ao buscar quartos:", error)
        throw error
      }

      if (!data || data.length === 0) {
        console.warn("⚠️ Nenhum quarto encontrado no Supabase")
        return []
      }

      const rooms = data.map((row: any) => ({
        id: row.id,
        number: row.number.toString(),
        type: row.type,
        capacity: Number.parseInt(row.capacity),
        beds: Number.parseInt(row.beds),
        price: Number.parseFloat(row.price),
        amenities: Array.isArray(row.amenities) ? row.amenities : [],
        status: row.status,
        guest: row.guest_data || undefined,
      }))

      console.log(`✅ ${rooms.length} quartos carregados do Supabase`)
      return rooms
    } catch (error) {
      console.error("❌ Erro ao buscar quartos:", error)
      throw error
    }
  }

  static async createRoom(room: Omit<Room, "id">): Promise<string> {
    try {
      console.log("➕ Criando quarto no Supabase:", room)
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
        throw error
      }

      console.log("✅ Quarto criado com sucesso:", data.id)
      return data.id
    } catch (error) {
      console.error("❌ Erro ao criar quarto:", error)
      throw error
    }
  }

  static async updateRoom(id: string, updates: Partial<Room>): Promise<void> {
    try {
      console.log("🔄 Atualizando quarto no Supabase:", id, updates)
      const updateData: any = {}

      if (updates.number !== undefined) updateData.number = updates.number
      if (updates.type !== undefined) updateData.type = updates.type
      if (updates.capacity !== undefined) updateData.capacity = updates.capacity
      if (updates.beds !== undefined) updateData.beds = updates.beds
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.amenities !== undefined) updateData.amenities = updates.amenities
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.guest !== undefined) updateData.guest_data = updates.guest

      const { error } = await supabase.from("rooms").update(updateData).eq("id", id)

      if (error) {
        console.error("❌ Erro ao atualizar quarto:", error)
        throw error
      }

      console.log("✅ Quarto atualizado com sucesso")
    } catch (error) {
      console.error("❌ Erro ao atualizar quarto:", error)
      throw error
    }
  }

  static async deleteRoom(id: string): Promise<void> {
    try {
      console.log("🗑️ Deletando quarto no Supabase:", id)
      const { error } = await supabase.from("rooms").delete().eq("id", id)

      if (error) {
        console.error("❌ Erro ao deletar quarto:", error)
        throw error
      }

      console.log("✅ Quarto deletado com sucesso")
    } catch (error) {
      console.error("❌ Erro ao deletar quarto:", error)
      throw error
    }
  }

  // ==================== RESERVATIONS ====================
  static async getFutureReservations(): Promise<Reservation[]> {
    try {
      console.log("🔍 Buscando reservas no Supabase...")
      const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Erro ao buscar reservas:", error)
        throw error
      }

      if (!data) {
        console.warn("⚠️ Nenhuma reserva encontrada")
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
    } catch (error) {
      console.error("❌ Erro ao buscar reservas:", error)
      throw error
    }
  }

  static async createReservation(roomId: string, guest: Guest): Promise<string> {
    try {
      console.log("➕ Criando reserva no Supabase:", { roomId, guest })
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
        throw error
      }

      console.log("✅ Reserva criada com sucesso:", data.id)
      return data.id
    } catch (error) {
      console.error("❌ Erro ao criar reserva:", error)
      throw error
    }
  }

  static async cancelReservation(reservationId: string): Promise<void> {
    try {
      console.log("❌ Cancelando reserva no Supabase:", reservationId)
      const { error } = await supabase.from("reservations").delete().eq("id", reservationId)

      if (error) {
        console.error("❌ Erro ao cancelar reserva:", error)
        throw error
      }

      console.log("✅ Reserva cancelada com sucesso")
    } catch (error) {
      console.error("❌ Erro ao cancelar reserva:", error)
      throw error
    }
  }

  // ==================== GUEST HISTORY ====================
  static async getGuestHistory(): Promise<GuestHistory[]> {
    try {
      console.log("🔍 Buscando histórico no Supabase...")
      const { data, error } = await supabase.from("guest_history").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Erro ao buscar histórico:", error)
        throw error
      }

      if (!data) {
        console.warn("⚠️ Nenhum histórico encontrado")
        return []
      }

      const history = data.map((row: any) => ({
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

      console.log(`✅ ${history.length} entradas de histórico carregadas`)
      return history
    } catch (error) {
      console.error("❌ Erro ao buscar histórico:", error)
      throw error
    }
  }

  static async addToGuestHistory(history: Omit<GuestHistory, "id" | "createdAt">): Promise<string> {
    try {
      console.log("➕ Adicionando ao histórico no Supabase:", history)
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
        throw error
      }

      console.log("✅ Histórico adicionado com sucesso:", data.id)
      return data.id
    } catch (error) {
      console.error("❌ Erro ao adicionar histórico:", error)
      throw error
    }
  }

  static async updateGuestHistoryStatus(id: string, status: string): Promise<void> {
    try {
      console.log("🔄 Atualizando status do histórico:", id, status)
      const { error } = await supabase.from("guest_history").update({ status }).eq("id", id)

      if (error) {
        console.error("❌ Erro ao atualizar status do histórico:", error)
        throw error
      }

      console.log("✅ Status do histórico atualizado")
    } catch (error) {
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
        throw error
      }

      console.log("✅ Histórico deletado com sucesso")
    } catch (error) {
      console.error("❌ Erro ao deletar histórico:", error)
      throw error
    }
  }

  // ==================== USERS ====================
  static async authenticateUser(email: string, password: string): Promise<any> {
    try {
      console.log("🔐 Autenticando usuário:", email)

      // Verificação simples de senha (em produção, use bcrypt)
      const validUsers: { [key: string]: { password: string; user: any } } = {
        "admin@hotel.com": {
          password: "admin123",
          user: {
            id: "admin_1",
            name: "Administrador",
            email: "admin@hotel.com",
            role: "admin",
            phone: "(11) 99999-9999",
          },
        },
        "staff@hotel.com": {
          password: "staff123",
          user: {
            id: "staff_1",
            name: "Funcionário",
            email: "staff@hotel.com",
            role: "staff",
            phone: "(11) 88888-8888",
          },
        },
        "guest@hotel.com": {
          password: "guest123",
          user: {
            id: "guest_1",
            name: "Hóspede",
            email: "guest@hotel.com",
            role: "guest",
            phone: "(11) 77777-7777",
          },
        },
      }

      const userConfig = validUsers[email]
      if (!userConfig || userConfig.password !== password) {
        throw new Error("Email ou senha incorretos")
      }

      console.log("✅ Usuário autenticado com sucesso")
      return userConfig.user
    } catch (error) {
      console.error("❌ Erro na autenticação:", error)
      throw error
    }
  }

  static async createUser(userData: any): Promise<string> {
    try {
      console.log("➕ Criando usuário:", userData)
      // Simulação de criação de usuário
      const userId = `user_${Date.now()}`
      console.log("✅ Usuário criado com sucesso:", userId)
      return userId
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error)
      throw error
    }
  }

  // ==================== REAL-TIME SYNC ====================
  static subscribeToChanges(callback: () => void) {
    console.log("🔔 Configurando subscriptions em tempo real...")

    const channels = [
      supabase
        .channel("rooms-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, (payload) => {
          console.log("🔄 Mudança detectada em rooms:", payload)
          callback()
        }),

      supabase
        .channel("reservations-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, (payload) => {
          console.log("🔄 Mudança detectada em reservations:", payload)
          callback()
        }),

      supabase
        .channel("history-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "guest_history" }, (payload) => {
          console.log("🔄 Mudança detectada em guest_history:", payload)
          callback()
        }),
    ]

    channels.forEach((channel) => {
      channel.subscribe((status) => {
        console.log(`📡 Status da subscription ${channel.topic}:`, status)
      })
    })

    return () => {
      console.log("🔕 Removendo subscriptions...")
      channels.forEach((channel) => supabase.removeChannel(channel))
    }
  }

  // ==================== HEALTH CHECK ====================
  static async healthCheck(): Promise<boolean> {
    try {
      console.log("🏥 Verificando saúde da conexão...")
      const { data, error } = await supabase.from("rooms").select("count").limit(1)

      if (error) {
        console.error("❌ Health check falhou:", error)
        return false
      }

      console.log("✅ Conexão saudável")
      return true
    } catch (error) {
      console.error("❌ Health check falhou:", error)
      return false
    }
  }
}
