export interface Room {
  id: string
  number: string
  type: string
  capacity: number
  beds: number
  price: number
  amenities: string[]
  status: "available" | "occupied" | "maintenance" | "reserved"
  guest?: Guest
}

export interface Guest {
  name: string
  email?: string
  phone?: string
  cpf?: string
  guests: number
  checkIn: string
  checkOut: string
  expenses?: Expense[]
}

export interface Expense {
  description: string
  value: number
}

export interface Reservation {
  id: string
  roomId: string
  guest: Guest
  createdAt: string
}

export interface HotelFilters {
  type: string
  status: string
  minPrice: number
  maxPrice: number
}

export interface HotelStatistics {
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  reservedRooms: number
  maintenanceRooms: number
  occupancyRate: number
  roomsByType: Record<string, number>
  monthlyRevenue: number
  activeGuests: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "guest"
  phone?: string
}
