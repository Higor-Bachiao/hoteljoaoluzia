"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type { Room, Reservation, HotelFilters, HotelStatistics, Expense, Guest } from "@/types/hotel"
import { getNumberOfNights } from "@/lib/price-utils"
import { HotelServiceCloud } from "@/lib/hotel-service-cloud"

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

interface HotelContextType {
  rooms: Room[]
  filteredRooms: Room[]
  filters: HotelFilters
  setFilters: (filters: HotelFilters) => void
  clearFilters: () => void
  searchRooms: (term: string) => void
  addRoom: (room: Omit<Room, "id" | "status" | "guest">) => Promise<void>
  updateRoom: (roomId: string, updates: Partial<Room>) => Promise<void>
  deleteRoom: (roomId: string) => Promise<void>
  checkoutRoom: (roomId: string) => Promise<void>
  makeReservation: (reservation: Omit<Reservation, "id" | "createdAt">) => Promise<void>
  addExpenseToRoom: (roomId: string, expense: Expense) => Promise<void>
  getStatistics: () => HotelStatistics
  getFutureReservations: () => Room[]
  futureReservations: Reservation[]
  cancelFutureReservation: (reservationId: string) => Promise<void>
  guestHistory: GuestHistory[]
  getGuestHistory: () => GuestHistory[]
  deleteGuestHistory: (historyId: string) => Promise<void>
  isLoading: boolean
  error: string | null
  lastSync: Date | null
  isOnline: boolean
  syncData: () => Promise<void>
  resetData: () => Promise<void>
  forceRefresh: () => Promise<void>
}

const HotelContext = createContext<HotelContextType | undefined>(undefined)

export function HotelProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [futureReservations, setFutureReservations] = useState<Reservation[]>([])
  const [guestHistory, setGuestHistory] = useState<GuestHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [filters, setFilters] = useState<HotelFilters>({
    type: "",
    status: "",
    minPrice: 0,
    maxPrice: 1000,
  })

  // Monitorar status de conexão
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncData()
    }
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Função para sincronizar dados
  const syncData = async (silent = true) => {
    try {
      if (!silent) {
        setError(null)
        console.log("Sincronizando dados...")
      }

      const [roomsData, reservationsData, historyData] = await Promise.all([
        HotelServiceCloud.getAllRooms(),
        HotelServiceCloud.getFutureReservations(),
        HotelServiceCloud.getGuestHistory(),
      ])

      setRooms(roomsData)
      setFutureReservations(reservationsData)
      setGuestHistory(historyData)
      setLastSync(new Date())
      setError(null)

      if (!silent) {
        console.log(`Dados sincronizados: ${roomsData.length} quartos`)
      }
    } catch (error: any) {
      console.error("Erro na sincronização:", error)
      setError(`Erro de sincronização: ${error.message}`)
    }
  }

  // Função para reset dos dados
  const resetData = async () => {
    try {
      setIsLoading(true)
      localStorage.removeItem("hotel_current_user")

      const defaultRooms = HotelServiceCloud.getDefaultRooms()
      setRooms(defaultRooms)
      setFutureReservations([])
      setGuestHistory([])
      setError(null)
      setLastSync(new Date())
    } catch (error: any) {
      setError(`Erro ao resetar: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para forçar refresh
  const forceRefresh = async () => {
    setIsLoading(true)
    await syncData(false)
    setIsLoading(false)
  }

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        await syncData(false)
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error)
        setError(`Erro ao carregar dados: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Sincronização automática
  useEffect(() => {
    if (!isLoading && isOnline) {
      syncIntervalRef.current = setInterval(() => {
        syncData(true)
      }, 30000) // 30 segundos

      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current)
        }
      }
    }
  }, [isLoading, isOnline])

  // Aplicar filtros
  useEffect(() => {
    let filtered = rooms

    if (filters.type) {
      filtered = filtered.filter((room) => room.type === filters.type)
    }

    if (filters.status) {
      filtered = filtered.filter((room) => room.status === filters.status)
    }

    if (filters.minPrice > 0) {
      filtered = filtered.filter((room) => room.price >= filters.minPrice)
    }

    if (filters.maxPrice < 1000) {
      filtered = filtered.filter((room) => room.price <= filters.maxPrice)
    }

    setFilteredRooms(filtered)
  }, [rooms, filters])

  // Funções de busca e filtro
  const clearFilters = () => {
    setFilters({
      type: "",
      status: "",
      minPrice: 0,
      maxPrice: 1000,
    })
  }

  const searchRooms = (term: string) => {
    if (!term) {
      setFilteredRooms(rooms)
      return
    }

    const filtered = rooms.filter(
      (room) =>
        room.number.toLowerCase().includes(term.toLowerCase()) ||
        room.type.toLowerCase().includes(term.toLowerCase()) ||
        room.guest?.name?.toLowerCase().includes(term.toLowerCase()),
    )

    setFilteredRooms(filtered)
  }

  // Funções de gerenciamento de quartos
  const addRoom = async (room: Omit<Room, "id" | "status" | "guest">) => {
    try {
      await HotelServiceCloud.createRoom({ ...room, status: "available" })
      await syncData(false)
    } catch (error) {
      throw error
    }
  }

  const updateRoom = async (roomId: string, updates: Partial<Room>) => {
    try {
      await HotelServiceCloud.updateRoom(roomId, updates)
      await syncData(false)
    } catch (error) {
      throw error
    }
  }

  const deleteRoom = async (roomId: string) => {
    try {
      await HotelServiceCloud.deleteRoom(roomId)
      await syncData(false)
    } catch (error) {
      throw error
    }
  }

  const checkoutRoom = async (roomId: string) => {
    try {
      const room = rooms.find((r) => r.id === roomId)
      if (room && room.guest) {
        // Atualizar status no histórico para "completed"
        const historyEntry = guestHistory.find(
          (entry) =>
            entry.roomNumber === room.number && entry.guest.name === room.guest?.name && entry.status === "active",
        )

        if (historyEntry) {
          await HotelServiceCloud.updateGuestHistoryStatus(historyEntry.id, "completed")
        }
      }

      await HotelServiceCloud.updateRoom(roomId, { status: "available", guest: undefined })
      await syncData(false)
    } catch (error) {
      throw error
    }
  }

  // Funções de reserva
  const makeReservation = async (reservation: Omit<Reservation, "id" | "createdAt">) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const checkInDate = new Date(reservation.guest.checkIn)
      checkInDate.setHours(0, 0, 0, 0)

      // Se o check-in é hoje ou no passado, ocupar o quarto imediatamente
      if (checkInDate.getTime() <= today.getTime()) {
        await HotelServiceCloud.updateRoom(reservation.roomId, {
          status: "occupied",
          guest: reservation.guest,
        })
      } else {
        // Se é para o futuro, adicionar às reservas futuras
        await HotelServiceCloud.createReservation(reservation.roomId, reservation.guest)
      }

      // Adicionar ao histórico
      const room = rooms.find((r) => r.id === reservation.roomId)
      if (room) {
        const nights = getNumberOfNights(reservation.guest.checkIn, reservation.guest.checkOut)
        const totalPrice =
          room.price * reservation.guest.guests * nights +
          (reservation.guest.expenses?.reduce((sum, exp) => sum + exp.value, 0) || 0)

        await HotelServiceCloud.addToGuestHistory({
          guest: reservation.guest,
          roomNumber: room.number,
          roomType: room.type,
          checkInDate: reservation.guest.checkIn,
          checkOutDate: reservation.guest.checkOut,
          totalPrice,
          status: "active",
        })
      }

      await syncData(false)
    } catch (error) {
      throw error
    }
  }

  const cancelFutureReservation = async (reservationId: string) => {
    try {
      const reservation = futureReservations.find((r) => r.id === reservationId)
      if (reservation) {
        // Atualizar status no histórico para "cancelled"
        const historyEntry = guestHistory.find(
          (entry) =>
            entry.guest.name === reservation.guest.name &&
            entry.checkInDate === reservation.guest.checkIn &&
            entry.status === "active",
        )

        if (historyEntry) {
          await HotelServiceCloud.updateGuestHistoryStatus(historyEntry.id, "cancelled")
        }
      }

      await HotelServiceCloud.cancelReservation(reservationId)
      await syncData(false)
    } catch (error) {
      throw error
    }
  }

  // Função de despesas
  const addExpenseToRoom = async (roomId: string, expense: Expense) => {
    try {
      const room = rooms.find((r) => r.id === roomId)
      if (room && room.guest) {
        const updatedGuest = {
          ...room.guest,
          expenses: [...(room.guest.expenses || []), expense],
        }

        await HotelServiceCloud.updateRoom(roomId, { guest: updatedGuest })
        await syncData(false)
      }
    } catch (error) {
      throw error
    }
  }

  // Funções de estatísticas
  const getStatistics = (): HotelStatistics => {
    const totalRooms = rooms.length
    const occupiedRooms = rooms.filter((room) => room.status === "occupied").length
    const availableRooms = rooms.filter((room) => room.status === "available").length
    const reservedRooms = futureReservations.length
    const maintenanceRooms = rooms.filter((room) => room.status === "maintenance").length

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

    const roomsByType = rooms.reduce(
      (acc, room) => {
        acc[room.type] = (acc[room.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const monthlyRevenue = rooms
      .filter((room) => room.status === "occupied" && room.guest)
      .reduce((total, room) => {
        const nights = room.guest ? getNumberOfNights(room.guest.checkIn, room.guest.checkOut) : 0
        const expensesTotal = room.guest?.expenses?.reduce((sum, exp) => sum + exp.value, 0) || 0
        return total + room.price * (room.guest?.guests || 0) * nights + expensesTotal
      }, 0)

    const activeGuests = rooms
      .filter((room) => room.guest && room.status === "occupied")
      .reduce((total, room) => total + (room.guest?.guests || 0), 0)

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      reservedRooms,
      maintenanceRooms,
      occupancyRate,
      roomsByType,
      monthlyRevenue,
      activeGuests,
    }
  }

  const getFutureReservations = (): Room[] => {
    return futureReservations
      .map((reservation) => {
        const room = rooms.find((r) => r.id === reservation.roomId)
        if (!room) return null

        return {
          ...room,
          status: "reserved" as const,
          guest: reservation.guest,
        }
      })
      .filter(Boolean) as Room[]
  }

  const getGuestHistory = (): GuestHistory[] => {
    return guestHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const deleteGuestHistory = async (historyId: string) => {
    try {
      await HotelServiceCloud.deleteGuestHistory(historyId)
      await syncData(false)
    } catch (error) {
      throw error
    }
  }

  return (
    <HotelContext.Provider
      value={{
        rooms,
        filteredRooms,
        filters,
        setFilters,
        clearFilters,
        searchRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        checkoutRoom,
        makeReservation,
        addExpenseToRoom,
        getStatistics,
        getFutureReservations,
        futureReservations,
        cancelFutureReservation,
        guestHistory,
        getGuestHistory,
        deleteGuestHistory,
        isLoading,
        error,
        lastSync,
        isOnline,
        syncData,
        resetData,
        forceRefresh,
      }}
    >
      {children}
    </HotelContext.Provider>
  )
}

export function useHotel() {
  const context = useContext(HotelContext)
  if (context === undefined) {
    throw new Error("useHotel must be used within a HotelProvider")
  }
  return context
}
