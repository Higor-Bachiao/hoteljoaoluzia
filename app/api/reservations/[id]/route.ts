import { type NextRequest, NextResponse } from "next/server"
import { HotelDatabase } from "@/lib/hotel-database"

// Esta função é necessária para export estático com rotas dinâmicas
export async function generateStaticParams() {
  // Para reservas, vamos gerar alguns IDs comuns
  // Em produção, isso seria baseado em dados reais
  const reservationIds = []
  for (let i = 1; i <= 100; i++) {
    reservationIds.push({ id: i.toString() })
  }
  return reservationIds
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🔍 Buscando reserva ${params.id}`)

    const reservation = await HotelDatabase.getReservationById(params.id)

    if (!reservation) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 })
    }

    console.log("✅ Reserva encontrada:", reservation)

    return NextResponse.json(reservation)
  } catch (error: any) {
    console.error("❌ Erro ao buscar reserva:", error)
    return NextResponse.json(
      {
        error: "Erro ao buscar reserva",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    console.log(`🔄 Atualizando reserva ${params.id}:`, data)

    await HotelDatabase.updateReservation(params.id, data)

    console.log("✅ Reserva atualizada com sucesso")

    return NextResponse.json({
      message: "Reserva atualizada com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao atualizar reserva:", error)
    return NextResponse.json(
      {
        error: "Erro ao atualizar reserva",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

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
