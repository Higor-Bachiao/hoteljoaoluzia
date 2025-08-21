import { NextResponse } from "next/server"
import { hotelDatabase } from "@/lib/hotel-database"

export async function GET() {
  try {
    // Teste simples de conexão
    const rooms = await hotelDatabase.getAllRooms()

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      roomCount: rooms.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
