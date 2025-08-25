"use client"

import { useState } from "react"
import { useHotel } from "@/contexts/hotel-context-cloud"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bed,
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Calendar,
  DollarSign,
  PlusCircle,
  RefreshCw,
  Eye,
  LogOut,
} from "lucide-react"
import type { Room } from "@/types/hotel"
import { calculateTotalStayPrice, getNumberOfNights } from "@/lib/price-utils"
import ReservationForm from "@/components/reservations/reservation-form"

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const { checkoutRoom, addExpenseToRoom, futureReservations, syncData } = useHotel()
  const [showDetails, setShowDetails] = useState(false)
  const [showReservationDialog, setShowReservationDialog] = useState(false)
  const [newExpenseDescription, setNewExpenseDescription] = useState("")
  const [newExpenseValue, setNewExpenseValue] = useState<number | string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Verificar se este quarto tem reserva futura
  const hasFutureReservation = futureReservations.some((reservation) => reservation.roomId === room.id)

  const getStatusDisplay = () => {
    if (room.status === "available" && hasFutureReservation) {
      return {
        statusText: "Disponível (Reservado)",
        statusColor: "bg-green-100 text-green-800 border-green-200",
      }
    }

    switch (room.status) {
      case "available":
        return { statusText: "Disponível", statusColor: "bg-green-100 text-green-800 border-green-200" }
      case "occupied":
        return { statusText: "Ocupado", statusColor: "bg-red-100 text-red-800 border-red-200" }
      case "maintenance":
        return { statusText: "Manutenção", statusColor: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      case "reserved":
        return { statusText: "Reservado", statusColor: "bg-blue-100 text-blue-800 border-blue-200" }
      default:
        return { statusText: "Desconhecido", statusColor: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  const { statusText: displayedStatusText, statusColor: displayedStatusColor } = getStatusDisplay()

  const handleLiberarQuarto = async () => {
    if (confirm("Tem certeza que deseja liberar este quarto?")) {
      await checkoutRoom(room.id)
    }
  }

  const handleAddExpense = async () => {
    if (room.guest && newExpenseDescription && newExpenseValue !== "" && Number(newExpenseValue) > 0) {
      await addExpenseToRoom(room.id, {
        description: newExpenseDescription,
        value: Number(newExpenseValue),
      })
      setNewExpenseDescription("")
      setNewExpenseValue("")
    } else {
      alert("Por favor, preencha a descrição e um valor válido para a despesa.")
    }
  }

  const handleRefreshRoom = async () => {
    setIsRefreshing(true)
    try {
      await syncData()
    } finally {
      setIsRefreshing(false)
    }
  }

  const displayPrice = room.guest
    ? calculateTotalStayPrice(
        room.price,
        room.guest.guests,
        room.guest.checkIn,
        room.guest.checkOut,
        room.guest.expenses || [],
      )
    : room.price

  const numberOfNights = room.guest ? getNumberOfNights(room.guest.checkIn, room.guest.checkOut) : 0

  // Quarto pode ser reservado se estiver disponível (mesmo com reserva futura)
  const canReserve = room.status === "available"

  // Quarto pode ser liberado se estiver ocupado
  const canCheckout = room.status === "occupied"

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow relative h-full flex flex-col">
        {/* Botão de Refresh no canto superior direito */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-60 hover:opacity-100 z-10"
          onClick={handleRefreshRoom}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        <CardHeader className="pb-3 pr-12 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">Quarto {room.number}</h3>
            <Badge className={`${displayedStatusColor} text-xs`}>{displayedStatusText}</Badge>
          </div>
          <p className="text-sm text-gray-600">{room.type}</p>
        </CardHeader>

        <CardContent className="space-y-3 flex-grow">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-blue-600">R$ {displayPrice.toFixed(2)}</span>
            <span className="text-xs text-gray-500">
              {room.guest
                ? `R$ ${room.price.toFixed(2)}/pessoa/noite + despesas`
                : `R$ ${room.price.toFixed(2)} por pessoa/noite`}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{room.capacity}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{room.beds}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {room.amenities.includes("wifi") && <Wifi className="w-4 h-4 text-blue-500" />}
            {room.amenities.includes("parking") && <Car className="w-4 h-4 text-green-500" />}
            {room.amenities.includes("breakfast") && <Coffee className="w-4 h-4 text-orange-500" />}
            {room.amenities.includes("tv") && <Tv className="w-4 h-4 text-purple-500" />}
            {room.amenities.includes("ar-condicionado") && (
              <div className="w-4 h-4 bg-cyan-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">AC</span>
              </div>
            )}
          </div>

          {room.guest && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium truncate">{room.guest.name}</p>
              {room.guest.email && <p className="text-xs text-gray-600 truncate">{room.guest.email}</p>}
              <p className="text-xs text-gray-600">Check-in: {new Date(room.guest.checkIn).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4 flex-shrink-0">
          {/* Primeira linha - Botão Detalhes sempre presente */}
          <Button variant="outline" size="sm" onClick={() => setShowDetails(true)} className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>

          {/* Segunda linha - Ações específicas */}
          <div className="flex gap-2 w-full">
            {canReserve && (
              <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Reservar</span>
                    <span className="sm:hidden">Reserva</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto flex flex-col mx-2">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Reservar Quarto {room.number}</DialogTitle>
                    <DialogDescription className="text-sm">
                      Preencha os dados para confirmar a reserva.
                    </DialogDescription>
                  </DialogHeader>
                  <ReservationForm
                    initialRoomId={room.id}
                    onReservationSuccess={() => setShowReservationDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            )}

            {canCheckout && (
              <Button size="sm" onClick={handleLiberarQuarto} variant="destructive" className="flex-1">
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Liberar</span>
                <span className="sm:hidden">Check-out</span>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto flex flex-col mx-2">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Quarto {room.number} - Detalhes</DialogTitle>
            <DialogDescription className="text-sm">Informações completas do quarto</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-1">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-sm sm:text-base">Informações Básicas</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Tipo:</strong> {room.type}
                  </p>
                  <p>
                    <strong>Capacidade:</strong> {room.capacity} pessoas
                  </p>
                  <p>
                    <strong>Camas:</strong> {room.beds}
                  </p>
                  <p>
                    <strong>Preço por pessoa/noite:</strong> R$ {room.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm sm:text-base">Comodidades</h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {room.guest && (
                <>
                  <div>
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Hóspede Atual</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Nome:</strong> {room.guest.name}
                      </p>
                      {room.guest.email && (
                        <p className="break-all">
                          <strong>Email:</strong> {room.guest.email}
                        </p>
                      )}
                      {room.guest.phone && (
                        <p>
                          <strong>Telefone:</strong> {room.guest.phone}
                        </p>
                      )}
                      {room.guest.cpf && (
                        <p>
                          <strong>CPF:</strong> {room.guest.cpf}
                        </p>
                      )}
                      <p>
                        <strong>Check-in:</strong> {new Date(room.guest.checkIn).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Check-out previsto:</strong> {new Date(room.guest.checkOut).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Hóspedes:</strong> {room.guest.guests}
                      </p>
                      <p>
                        <strong>Noites:</strong> {getNumberOfNights(room.guest.checkIn, room.guest.checkOut)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <DollarSign className="w-4 h-4" />
                      Despesas Adicionais
                    </h4>
                    {room.guest.expenses && room.guest.expenses.length > 0 ? (
                      <ul className="space-y-1 text-sm">
                        {room.guest.expenses.map((expense, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="truncate mr-2">{expense.description}</span>
                            <span className="font-medium">R$ {expense.value.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma despesa adicional.</p>
                    )}

                    <div className="mt-4 space-y-3">
                      <Label htmlFor="newExpenseDescription" className="text-sm">
                        Adicionar Nova Despesa
                      </Label>
                      <Input
                        id="newExpenseDescription"
                        placeholder="Descrição (ex: Consumo do frigobar)"
                        value={newExpenseDescription}
                        onChange={(e) => setNewExpenseDescription(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Valor (R$)"
                        value={newExpenseValue}
                        onChange={(e) => setNewExpenseValue(e.target.value)}
                        min="0"
                        step="0.01"
                        className="text-sm"
                      />
                      <Button onClick={handleAddExpense} className="w-full" size="sm">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Adicionar Despesa
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <div className="flex flex-col sm:flex-row justify-between font-bold text-blue-900 gap-1">
                      <span className="text-sm">Total da Estadia:</span>
                      <span className="text-base">
                        R${" "}
                        {calculateTotalStayPrice(
                          room.price,
                          room.guest.guests,
                          room.guest.checkIn,
                          room.guest.checkOut,
                          room.guest.expenses || [],
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
