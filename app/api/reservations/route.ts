import { type NextRequest, NextResponse } from "next/server"
import { HotelDatabase } from "@/lib/hotel-database"

export async function GET() {
  try {
    console.log("🔍 Buscando reservas futuras...")
    const reservations = await HotelDatabase.getFutureReservations()
    console.log(`✅ ${reservations.length} reservas futuras encontradas`)

    return NextResponse.json(reservations)
  } catch (error: any) {
    console.error("❌ Erro ao buscar reservas:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { roomId, guest } = await request.json()
    console.log("📅 Criando nova reserva:", { roomId, guest: guest.name })

    const reservationId = await HotelDatabase.createReservation(roomId, guest)
    console.log("✅ Reserva criada com ID:", reservationId)

    return NextResponse.json({
      id: reservationId,
      message: "Reserva criada com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao criar reserva:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar reserva",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
