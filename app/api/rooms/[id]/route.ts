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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🔍 Buscando quarto ${params.id}`)

    const room = await HotelDatabase.getRoomById(params.id)

    if (!room) {
      return NextResponse.json({ error: "Quarto não encontrado" }, { status: 404 })
    }

    console.log("✅ Quarto encontrado:", room)

    return NextResponse.json(room)
  } catch (error: any) {
    console.error("❌ Erro ao buscar quarto:", error)
    return NextResponse.json(
      {
        error: "Erro ao buscar quarto",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    console.log(`🔄 Atualizando quarto ${params.id}:`, data)

    await HotelDatabase.updateRoom(params.id, data)

    console.log("✅ Quarto atualizado com sucesso")

    return NextResponse.json({
      message: "Quarto atualizado com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao atualizar quarto:", error)
    return NextResponse.json(
      {
        error: "Erro ao atualizar quarto",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
