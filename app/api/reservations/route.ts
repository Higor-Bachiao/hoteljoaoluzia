import { type NextRequest, NextResponse } from "next/server"
import { hotelDatabase } from "@/lib/hotel-database"

export async function GET() {
  try {
    const reservations = await hotelDatabase.getAllReservations()
    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error getting reservations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reservationData = await request.json()

    if (
      !reservationData.roomId ||
      !reservationData.guestName ||
      !reservationData.checkIn ||
      !reservationData.checkOut
    ) {
      return NextResponse.json(
        { error: "Room ID, guest name, check-in, and check-out dates are required" },
        { status: 400 },
      )
    }

    const newReservation = await hotelDatabase.createReservation(reservationData)
    return NextResponse.json(newReservation, { status: 201 })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
