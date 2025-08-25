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
  // TODOS OS 49 QUARTOS DO SISTEMA
  static getDefaultRooms(): Room[] {
    return [
      // Andar 1 - Quartos 101-120
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
        id: "room_106",
        number: "106",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 150,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_107",
        number: "107",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 80,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_108",
        number: "108",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 120,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },
      {
        id: "room_109",
        number: "109",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 150,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_110",
        number: "110",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 80,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_111",
        number: "111",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 120,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_112",
        number: "112",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 150,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_113",
        number: "113",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 80,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_114",
        number: "114",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 120,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },
      {
        id: "room_115",
        number: "115",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 150,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_116",
        number: "116",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 80,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_117",
        number: "117",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 120,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_118",
        number: "118",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 150,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_119",
        number: "119",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 80,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_120",
        number: "120",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 120,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },

      // Andar 2 - Quartos 201-220
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
      {
        id: "room_204",
        number: "204",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 85,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_205",
        number: "205",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 125,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_206",
        number: "206",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 155,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_207",
        number: "207",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 85,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_208",
        number: "208",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 125,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },
      {
        id: "room_209",
        number: "209",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 155,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_210",
        number: "210",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 85,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_211",
        number: "211",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 125,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_212",
        number: "212",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 155,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_213",
        number: "213",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 85,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_214",
        number: "214",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 125,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },
      {
        id: "room_215",
        number: "215",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 155,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_216",
        number: "216",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 85,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_217",
        number: "217",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 125,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_218",
        number: "218",
        type: "Triplo",
        capacity: 3,
        beds: 2,
        price: 155,
        amenities: ["wifi", "tv", "minibar"],
        status: "available",
      },
      {
        id: "room_219",
        number: "219",
        type: "Solteiro",
        capacity: 1,
        beds: 1,
        price: 85,
        amenities: ["wifi", "tv"],
        status: "available",
      },
      {
        id: "room_220",
        number: "220",
        type: "Casal",
        capacity: 2,
        beds: 1,
        price: 125,
        amenities: ["wifi", "tv", "ar-condicionado"],
        status: "available",
      },

      // Andar 3 - Quartos 301-309 (Suítes Premium)
      {
        id: "room_301",
        number: "301",
        type: "Suíte",
        capacity: 2,
        beds: 1,
        price: 200,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_302",
        number: "302",
        type: "Suíte",
        capacity: 2,
        beds: 1,
        price: 200,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_303",
        number: "303",
        type: "Suíte",
        capacity: 3,
        beds: 2,
        price: 250,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_304",
        number: "304",
        type: "Suíte",
        capacity: 2,
        beds: 1,
        price: 200,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_305",
        number: "305",
        type: "Suíte",
        capacity: 3,
        beds: 2,
        price: 250,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_306",
        number: "306",
        type: "Suíte",
        capacity: 2,
        beds: 1,
        price: 200,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_307",
        number: "307",
        type: "Suíte",
        capacity: 3,
        beds: 2,
        price: 250,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_308",
        number: "308",
        type: "Suíte",
        capacity: 2,
        beds: 1,
        price: 200,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira"],
        status: "available",
      },
      {
        id: "room_309",
        number: "309",
        type: "Suíte Premium",
        capacity: 4,
        beds: 2,
        price: 300,
        amenities: ["wifi", "tv", "ar-condicionado", "minibar", "banheira", "varanda"],
        status: "available",
      },
    ]
  }

  // Função para garantir que todos os quartos existam no Supabase
  static async ensureAllRoomsExist(): Promise<void> {
    try {
      console.log("🔍 Verificando se todos os 49 quartos existem no Supabase...")

      const { data: existingRooms, error } = await supabase.from("rooms").select("id, number").order("number")

      if (error) {
        console.warn("Erro ao verificar quartos existentes:", error)
        return
      }

      const defaultRooms = this.getDefaultRooms()
      const existingRoomIds = new Set(existingRooms?.map((room) => room.id) || [])
      const missingRooms = defaultRooms.filter((room) => !existingRoomIds.has(room.id))

      if (missingRooms.length > 0) {
        console.log(`📝 Criando ${missingRooms.length} quartos faltantes no Supabase...`)

        // Inserir quartos em lotes para evitar timeout
        const batchSize = 10
        for (let i = 0; i < missingRooms.length; i += batchSize) {
          const batch = missingRooms.slice(i, i + batchSize)
          const roomsToInsert = batch.map((room) => ({
            id: room.id,
            number: room.number,
            type: room.type,
            capacity: room.capacity,
            beds: room.beds,
            price: room.price,
            amenities: room.amenities,
            status: room.status,
            guest_data: null,
          }))

          const { error: insertError } = await supabase.from("rooms").insert(roomsToInsert)

          if (insertError) {
            console.error(`Erro ao inserir lote ${i / batchSize + 1}:`, insertError)
          } else {
            console.log(`✅ Lote ${i / batchSize + 1} inserido com sucesso (${batch.length} quartos)`)
          }
        }

        console.log("✅ Todos os quartos foram criados no Supabase")
      } else {
        console.log("✅ Todos os 49 quartos já existem no Supabase")
      }
    } catch (error) {
      console.error("❌ Erro ao garantir existência dos quartos:", error)
    }
  }

  // ==================== ROOMS ====================
  static async getAllRooms(): Promise<Room[]> {
    try {
      // Primeiro, garantir que todos os quartos existam
      await this.ensureAllRoomsExist()

      console.log("🔄 Buscando todos os quartos do Supabase...")
      const { data, error } = await supabase.from("rooms").select("*").order("number")

      if (error) {
        console.warn("❌ Erro ao buscar quartos do Supabase:", error)
        console.log("🔧 Retornando dados padrão (49 quartos)")
        return this.getDefaultRooms()
      }

      if (!data || data.length === 0) {
        console.log("⚠️ Nenhum quarto encontrado no Supabase, retornando dados padrão")
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

      console.log(`✅ Carregados ${rooms.length} quartos do Supabase`)

      // Se não temos todos os 49 quartos, completar com os padrão
      if (rooms.length < 49) {
        console.log(`⚠️ Apenas ${rooms.length} quartos encontrados, completando com dados padrão`)
        const defaultRooms = this.getDefaultRooms()
        const existingIds = new Set(rooms.map((r) => r.id))
        const missingRooms = defaultRooms.filter((r) => !existingIds.has(r.id))
        return [...rooms, ...missingRooms]
      }

      return rooms
    } catch (error) {
      console.error("❌ Erro de conexão com Supabase:", error)
      console.log("🔧 Retornando dados padrão (49 quartos)")
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
      console.log("✅ Quarto criado:", data.id)
      return data.id
    } catch (error) {
      console.error("❌ Erro ao criar quarto:", error)
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
      console.log("✅ Quarto atualizado:", id)
    } catch (error) {
      console.error("❌ Erro ao atualizar quarto:", error)
      throw error
    }
  }

  static async deleteRoom(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id)
      if (error) throw error
      console.log("✅ Quarto deletado:", id)
    } catch (error) {
      console.error("❌ Erro ao deletar quarto:", error)
      throw error
    }
  }

  // ==================== RESERVATIONS ====================
  static async getFutureReservations(): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false })

      if (error) {
        console.warn("❌ Erro ao buscar reservas:", error)
        return []
      }

      const reservations = data.map((row: any) => ({
        id: row.id,
        roomId: row.room_id,
        guest: row.guest_data,
        createdAt: row.created_at,
      }))

      console.log(`✅ Carregadas ${reservations.length} reservas futuras`)
      return reservations
    } catch (error) {
      console.warn("❌ Erro ao buscar reservas:", error)
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
      console.log("✅ Reserva criada:", data.id)
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
      console.log("✅ Reserva cancelada:", reservationId)
    } catch (error) {
      console.error("❌ Erro ao cancelar reserva:", error)
      throw error
    }
  }

  // ==================== GUEST HISTORY ====================
  static async getGuestHistory(): Promise<GuestHistory[]> {
    try {
      const { data, error } = await supabase.from("guest_history").select("*").order("created_at", { ascending: false })

      if (error) {
        console.warn("❌ Erro ao buscar histórico:", error)
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

      console.log(`✅ Carregado histórico de ${history.length} hóspedes`)
      return history
    } catch (error) {
      console.warn("❌ Erro ao buscar histórico:", error)
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
      console.log("✅ Histórico adicionado:", data.id)
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
      console.log("✅ Status do histórico atualizado:", id, status)
    } catch (error) {
      console.error("❌ Erro ao atualizar status do histórico:", error)
      throw error
    }
  }

  static async deleteGuestHistory(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("guest_history").delete().eq("id", id)
      if (error) throw error
      console.log("✅ Histórico deletado:", id)
    } catch (error) {
      console.error("❌ Erro ao deletar histórico:", error)
      throw error
    }
  }

  // ==================== USERS ====================
  static async authenticateUser(email: string, password: string): Promise<any> {
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
        console.log("🔄 Mudança detectada em rooms")
        callback()
      }),

      supabase
        .channel("reservations-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => {
          console.log("🔄 Mudança detectada em reservations")
          callback()
        }),

      supabase
        .channel("history-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "guest_history" }, () => {
          console.log("🔄 Mudança detectada em guest_history")
          callback()
        }),
    ]

    channels.forEach((channel) => channel.subscribe())

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel))
    }
  }
}
