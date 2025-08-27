export function getNumberOfNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return Math.max(1, nights) // Mínimo de 1 noite
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR")
}

export function calculateTotalPrice(basePrice: number, guests: number, nights: number, expenses = 0): number {
  return basePrice * guests * nights + expenses
}
