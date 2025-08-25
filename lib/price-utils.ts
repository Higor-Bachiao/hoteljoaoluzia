import type { Expense } from "@/types/hotel"

export function getNumberOfNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return Math.max(1, daysDiff)
}

export function calculateTotalStayPrice(
  pricePerPersonPerNight: number,
  numberOfGuests: number,
  checkIn: string,
  checkOut: string,
  expenses: Expense[] = [],
): number {
  const nights = getNumberOfNights(checkIn, checkOut)
  const roomPrice = pricePerPersonPerNight * numberOfGuests * nights
  const expensesTotal = expenses.reduce((sum, expense) => sum + expense.value, 0)
  return roomPrice + expensesTotal
}
