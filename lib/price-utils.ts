export function getNumberOfNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const timeDifference = checkOutDate.getTime() - checkInDate.getTime()
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
  return Math.max(1, daysDifference)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function calculateTotalPrice(
  pricePerPerson: number,
  guests: number,
  nights: number,
  expenses: { value: number }[] = [],
): number {
  const roomPrice = pricePerPerson * guests * nights
  const expensesTotal = expenses.reduce((sum, expense) => sum + expense.value, 0)
  return roomPrice + expensesTotal
}
