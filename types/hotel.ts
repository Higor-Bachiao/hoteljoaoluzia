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
  updatedAt?: string
}

export interface Guest {
  name: string
  email: string
  phone: string
  document: string
  guests: number
  checkIn: string
  checkOut: string
  expenses?: Expense[]
}

export interface Expense {
  id: string
  description: string
  value: number
  date: string
}

export interface Reservation {
  id: string
  roomId: string
  guest: Guest
  status: "active" | "completed" | "cancelled"
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
  phone: string
}

export interface GuestHistory {
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
