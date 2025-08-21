import { type NextRequest, NextResponse } from "next/server"
import { hotelDatabase } from "@/lib/hotel-database"

export async function GET() {
  try {
    const rooms = await hotelDatabase.getAllRooms()
    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error getting rooms:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const roomData = await request.json()

    if (!roomData.number || !roomData.type || !roomData.price) {
      return NextResponse.json({ error: "Room number, type, and price are required" }, { status: 400 })
    }

    const newRoom = await hotelDatabase.createRoom(roomData)
    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
