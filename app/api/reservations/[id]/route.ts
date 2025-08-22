import { type NextRequest, NextResponse } from "next/server"
import { HotelDatabase } from "@/lib/hotel-database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🗑️ Cancelando reserva ${params.id}`)

    await HotelDatabase.cancelReservation(params.id)

    console.log("✅ Reserva cancelada com sucesso")

    return NextResponse.json({
      message: "Reserva cancelada com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao cancelar reserva:", error)
    return NextResponse.json(
      {
        error: "Erro ao cancelar reserva",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
