import { type NextRequest, NextResponse } from "next/server"
import { HotelDatabase } from "@/lib/hotel-database"

export async function GET() {
  try {
    console.log("🔍 Buscando todos os quartos...")
    const rooms = await HotelDatabase.getAllRooms()
    console.log(`✅ ${rooms.length} quartos encontrados`)

    return NextResponse.json(rooms)
  } catch (error: any) {
    console.error("❌ Erro ao buscar quartos:", error)
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
    const roomData = await request.json()
    console.log("🏨 Criando novo quarto:", roomData)

    const roomId = await HotelDatabase.createRoom(roomData)
    console.log("✅ Quarto criado com ID:", roomId)

    return NextResponse.json({
      id: roomId,
      message: "Quarto criado com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao criar quarto:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar quarto",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
