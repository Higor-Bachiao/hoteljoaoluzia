import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    console.log(`🔄 Atualizando quarto ${params.id}:`, updates)

    // Construir query de update dinamicamente
    const fields = Object.keys(updates)
      .filter((key) => key !== "id")
      .map((key) => `${key} = ?`)
      .join(", ")

    const values = Object.keys(updates)
      .filter((key) => key !== "id")
      .map((key) => {
        if (key === "amenities") {
          return JSON.stringify(updates[key])
        }
        return updates[key]
      })

    if (fields.length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
    }

    const query = `UPDATE rooms SET ${fields} WHERE id = ?`
    await executeQuery(query, [...values, params.id])

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🗑️ Deletando quarto ${params.id}`)

    // Primeiro, deletar reservas relacionadas
    await executeQuery("DELETE FROM reservations WHERE room_id = ?", [params.id])

    // Depois, deletar o quarto
    await executeQuery("DELETE FROM rooms WHERE id = ?", [params.id])

    console.log("✅ Quarto deletado com sucesso")

    return NextResponse.json({
      message: "Quarto deletado com sucesso",
    })
  } catch (error: any) {
    console.error("❌ Erro ao deletar quarto:", error)
    return NextResponse.json(
      {
        error: "Erro ao deletar quarto",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
