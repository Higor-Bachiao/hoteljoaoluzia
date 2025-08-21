import { type NextRequest, NextResponse } from "next/server"
import { hotelDatabase } from "@/lib/hotel-database"

export async function GET() {
  try {
    const expenses = await hotelDatabase.getAllExpenses()
    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error getting expenses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const expenseData = await request.json()

    if (!expenseData.description || !expenseData.amount || !expenseData.category) {
      return NextResponse.json({ error: "Description, amount, and category are required" }, { status: 400 })
    }

    const newExpense = await hotelDatabase.addExpense(expenseData)
    return NextResponse.json(newExpense, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
