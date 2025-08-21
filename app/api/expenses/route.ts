import { type NextRequest, NextResponse } from "next/server"
import { HotelDatabase } from "@/lib/hotel-database"

export async function POST(request: NextRequest) {
  try {
    const { guestId, description, value } = await request.json()
    console.log("💰 Adicionando despesa:", { guestId, description, value })

    await HotelDatabase.addExpense(guestId, { description, value })

    console.log("✅ Despesa adicionada com sucesso")

    return NextResponse.json({
      message: "Despesa adicionada com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao adicionar despesa:", error)
    return NextResponse.json(
      {
        error: "Erro ao adicionar despesa",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
