import { type NextRequest, NextResponse } from "next/server"
import { hotelDatabase } from "@/lib/hotel-database"

export async function generateStaticParams() {
  // Gerar parâmetros estáticos para reservas (1-100)
  const reservationIds = Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
  }))

  return reservationIds
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = Number.parseInt(params.id)

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 })
    }

    const reservation = await hotelDatabase.getReservationById(reservationId)

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error getting reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = Number.parseInt(params.id)
    const updateData = await request.json()

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 })
    }

    const updatedReservation = await hotelDatabase.updateReservation(reservationId, updateData)

    if (!updatedReservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = Number.parseInt(params.id)

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 })
    }

    const success = await hotelDatabase.cancelReservation(reservationId)

    if (!success) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Reservation cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
