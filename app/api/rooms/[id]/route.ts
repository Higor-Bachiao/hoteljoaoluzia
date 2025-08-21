import { type NextRequest, NextResponse } from "next/server"
import { hotelDatabase } from "@/lib/hotel-database"

export async function generateStaticParams() {
  // Gerar parâmetros estáticos para os quartos (101-120)
  const roomIds = Array.from({ length: 20 }, (_, i) => ({
    id: (101 + i).toString(),
  }))

  return roomIds
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number.parseInt(params.id)

    if (!roomId) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
    }

    const room = await hotelDatabase.getRoomById(roomId)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error getting room:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number.parseInt(params.id)
    const updateData = await request.json()

    if (!roomId) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
    }

    const updatedRoom = await hotelDatabase.updateRoom(roomId, updateData)

    if (!updatedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
