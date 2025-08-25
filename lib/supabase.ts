import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para o banco de dados
export interface DatabaseRoom {
  id: string
  number: string
  type: string
  capacity: number
  beds: number
  price: number
  amenities: string[]
  status: string
  guest_data?: any
  updated_at: string
}

export interface DatabaseReservation {
  id: string
  room_id: string
  guest_data: any
  created_at: string
  updated_at: string
}

export interface DatabaseHistory {
  id: string
  guest_data: any
  room_number: string
  room_type: string
  check_in_date: string
  check_out_date: string
  total_price: number
  status: string
  created_at: string
}

export interface DatabaseUser {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  password_hash: string
  created_at: string
}
