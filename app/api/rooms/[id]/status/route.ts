import { type NextRequest, NextResponse } from "next/server"
import { HotelDatabase } from "@/lib/hotel-database"

// Esta função é necessária para export estático com rotas dinâmicas
export async function generateStaticParams() {
  // Para export estático, precisamos definir todos os IDs possíveis
  // Como temos quartos de 101 a 120, vamos gerar esses parâmetros
  const roomIds = []
  for (let i = 101; i <= 120; i++) {
    roomIds.push({ id: i.toString() })
  }
  return roomIds
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, guest } = await request.json()
    console.log(`🔄 Atualizando status do quarto ${params.id} para: ${status}`)

    await HotelDatabase.updateRoomStatus(params.id, status, guest)

    console.log("✅ Status do quarto atualizado com sucesso")

    return NextResponse.json({
      message: "Status do quarto atualizado com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao atualizar status:", error)
    return NextResponse.json(
      {
        error: "Erro ao atualizar status do quarto",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
