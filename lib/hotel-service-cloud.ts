import { supabase } from "./supabase"
import type { Room, Reservation, Guest } from "@/types/hotel"

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
  // Dados padrão do sistema - garantindo que sempre temos quartos
  static getDefaultRooms(): Room[] {
    return [
      {
        id: "room_101",
        number: "101",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 80,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_102",
        number: "102",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 120,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },
      {
        id: "room_103",
        number: "103",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 150,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_104",
        number: "104",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 80,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_105",
        number: "105",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 120,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_201",
        number: "201",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 85,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_202",
        number: "202",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 125,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },
      {
        id: "room_203",
        number: "203",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 155,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
    ]
  }

  // Função para inicializar quartos padrão no Supabase se não existirem
  static async initializeDefaultRooms(): Promise<void> {
    try {
      const { data: existingRooms, error } = await supabase.from("rooms").select("id").limit(1)

      if (error) {
        console.warn("Erro ao verificar quartos existentes:", error)
        return
      }

      // Se não há quartos, criar os padrão
      if (!existingRooms || existingRooms.length === 0) {
        console.log("Inicializando quartos padrão no Supabase...")
        const defaultRooms = this.getDefaultRooms()

        for (const room of defaultRooms) {
          await supabase.from("rooms").insert({
            id: room.id,
            number: room.number,
            type: room.type,
            capacity: room.capacity,
            beds: room.beds,
            price: room.price,
            amenities: room.amenities,
            status: room.status,
            guest_data: null,
          })
        }
        console.log("Quartos padrão inicializados com sucesso")
      }
    } catch (error) {
      console.warn("Erro ao inicializar quartos padrão:", error)
    }
  }

  // ==================== ROOMS ====================
  static async getAllRooms(): Promise<Room[]> {
    try {
      // Primeiro, tentar inicializar quartos padrão se necessário
      await this.initializeDefaultRooms()

      const { data, error } = await supabase.from("rooms").select("*").order("number")

      if (error) {
        console.warn("Erro ao buscar quartos do Supabase, usando dados padrão:", error)
        return this.getDefaultRooms()
      }

      if (!data || data.length === 0) {
        console.log("Nenhum quarto encontrado no Supabase, retornando dados padrão")
        return this.getDefaultRooms()
      }

      const rooms = data.map((row: any) => ({
        id: row.id,
        number: row.number,
        type: row.type,
        capacity: row.capacity,
        beds: row.beds,
        price: Number.parseFloat(row.price.toString()),
        amenities: Array.isArray(row.amenities) ? row.amenities : [],
        status: row.status,
        guest: row.guest_data || undefined,
      }))

      console.log(`Carregados ${rooms.length} quartos do Supabase`)
      return rooms
    } catch (error) {
      console.warn("Erro de conexão com Supabase, usando dados padrão:", error)
      return this.getDefaultRooms()
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
      console.log("Quarto criado com sucesso:", data.id)
      return data.id
    } catch (error) {
      console.error("Erro ao criar quarto:", error)
      throw error
    }
  }

  static async updateRoom(id: string, updates: Partial<Room>): Promise<void> {
    try {
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

      if (error) throw error
      console.log("Quarto atualizado com sucesso:", id)
    } catch (error) {
      console.error("Erro ao atualizar quarto:", error)
      throw error
    }
  }

  static async deleteRoom(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id)
      if (error) throw error
      console.log("Quarto deletado com sucesso:", id)
    } catch (error) {
      console.error("Erro ao deletar quarto:", error)
      throw error
    }
  }

  // ==================== RESERVATIONS ====================
  static async getFutureReservations(): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false })

      if (error) {
        console.warn("Erro ao buscar reservas:", error)
        return []
      }

      const reservations = data.map((row: any) => ({
        id: row.id,
        roomId: row.room_id,
        guest: row.guest_data,
        createdAt: row.created_at,
      }))

      console.log(`Carregadas ${reservations.length} reservas futuras`)
      return reservations
    } catch (error) {
      console.warn("Erro ao buscar reservas:", error)
      return []
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
      console.log("Reserva criada com sucesso:", data.id)
      return data.id
    } catch (error) {
      console.error("Erro ao criar reserva:", error)
      throw error
    }
  }

  static async cancelReservation(reservationId: string): Promise<void> {
    try {
      const { error } = await supabase.from("reservations").delete().eq("id", reservationId)
      if (error) throw error
      console.log("Reserva cancelada com sucesso:", reservationId)
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error)
      throw error
    }
  }

  // ==================== GUEST HISTORY ====================
  static async getGuestHistory(): Promise<GuestHistory[]> {
    try {
      const { data, error } = await supabase.from("guest_history").select("*").order("created_at", { ascending: false })

      if (error) {
        console.warn("Erro ao buscar histórico:", error)
        return []
      }

      const history = data.map((row: any) => ({
        id: row.id,
        guest: row.guest_data,
        roomNumber: row.room_number,
        roomType: row.room_type,
        checkInDate: row.check_in_date,
        checkOutDate: row.check_out_date,
        totalPrice: Number.parseFloat(row.total_price.toString()),
        status: row.status,
        createdAt: row.created_at,
      }))

      console.log(`Carregado histórico de ${history.length} hóspedes`)
      return history
    } catch (error) {
      console.warn("Erro ao buscar histórico:", error)
      return []
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
      console.log("Histórico adicionado com sucesso:", data.id)
      return data.id
    } catch (error) {
      console.error("Erro ao adicionar histórico:", error)
      throw error
    }
  }

  static async updateGuestHistoryStatus(id: string, status: string): Promise<void> {
    try {
      const { error } = await supabase.from("guest_history").update({ status }).eq("id", id)

      if (error) throw error
      console.log("Status do histórico atualizado:", id, status)
    } catch (error) {
      console.error("Erro ao atualizar status do histórico:", error)
      throw error
    }
  }

  static async deleteGuestHistory(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("guest_history").delete().eq("id", id)
      if (error) throw error
      console.log("Histórico deletado com sucesso:", id)
    } catch (error) {
      console.error("Erro ao deletar histórico:", error)
      throw error
    }
  }

  // ==================== USERS ====================
  static async authenticateUser(email: string, password: string): Promise<any> {
    // Sistema de autenticação simples para demonstração
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

    return userConfig.user
  }

  // ==================== REAL-TIME SYNC ====================
  static subscribeToChanges(callback: () => void) {
    const channels = [
      supabase.channel("rooms-changes").on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => {
        console.log("Mudança detectada em rooms")
        callback()
      }),

      supabase
        .channel("reservations-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => {
          console.log("Mudança detectada em reservations")
          callback()
        }),

      supabase
        .channel("history-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "guest_history" }, () => {
          console.log("Mudança detectada em guest_history")
          callback()
        }),
    ]

    channels.forEach((channel) => channel.subscribe())

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel))
    }
  }
}
