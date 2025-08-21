import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    console.log("🔍 Testando conexão com MySQL...")

    // Testar conexão básica
    const result = (await executeQuery("SELECT COUNT(*) as total FROM rooms")) as any[]

    console.log("✅ Conexão estabelecida com sucesso!")
    console.log("📊 Total de quartos no banco:", result[0]?.total || 0)

    return NextResponse.json({
      success: true,
      message: "Conexão com MySQL estabelecida com sucesso!",
      totalRooms: result[0]?.total || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Erro de conexão com MySQL:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: "Verifique se o MySQL está rodando e as credenciais estão corretas",
      },
      { status: 500 },
    )
  }
}
