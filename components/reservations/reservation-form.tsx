"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useHotel } from "@/contexts/hotel-context-cloud"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import { calculateTotalStayPrice, getNumberOfNights } from "@/lib/price-utils"

interface ReservationFormProps {
  initialRoomId?: string
  onReservationSuccess?: () => void
}

export default function ReservationForm({ initialRoomId, onReservationSuccess }: ReservationFormProps) {
  const { rooms, makeReservation } = useHotel()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    roomId: initialRoomId || "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestCpf: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  })

  // Apenas quartos disponíveis podem ser reservados
  const availableRooms = rooms.filter((room) => room.status === "available")
  const selectedRoom = availableRooms.find((r) => r.id === formData.roomId) || null

  useEffect(() => {
    if (initialRoomId && formData.roomId !== initialRoomId) {
      setFormData((prev) => ({ ...prev, roomId: initialRoomId }))
    }
  }, [initialRoomId, formData.roomId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!selectedRoom) {
        alert("Por favor, selecione um quarto válido.")
        return
      }

      // Validação de datas: check-out deve ser depois do check-in
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      if (checkOutDate <= checkInDate) {
        alert("A data de check-out deve ser posterior à data de check-in.")
        setIsSubmitting(false)
        return
      }

      await makeReservation({
        roomId: formData.roomId,
        guest: {
          name: formData.guestName,
          email: formData.guestEmail || undefined, // Só envia se preenchido
          phone: formData.guestPhone || undefined, // Só envia se preenchido
          cpf: formData.guestCpf || undefined, // Só envia se preenchido
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
        },
      })

      setFormData({
        roomId: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        guestCpf: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
      })

      alert("Reserva realizada com sucesso!")
      onReservationSuccess?.()
    } catch (error) {
      console.error("Erro ao fazer reserva:", error)
      alert("Erro ao fazer reserva. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const totalStayPrice = selectedRoom
    ? calculateTotalStayPrice(selectedRoom.price, formData.guests, formData.checkIn, formData.checkOut)
    : 0
  const numberOfNights = selectedRoom ? getNumberOfNights(formData.checkIn, formData.checkOut) : 0

  return (
    <div className="flex flex-col h-full max-h-[70vh] sm:max-h-none">
      <div className="flex-1 overflow-y-auto px-1 sm:px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room" className="text-sm">
                Quarto
              </Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) => handleInputChange("roomId", value)}
                disabled={!!initialRoomId}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione um quarto" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id} className="text-sm">
                      Quarto {room.number} - {room.type} (R$ {room.price.toFixed(2)}/pessoa)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="text-sm">
                Número de Hóspedes
              </Label>
              <Select
                value={formData.guests.toString()}
                onValueChange={(value) => handleInputChange("guests", Number.parseInt(value))}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-sm">
                      {num} {num === 1 ? "pessoa" : "pessoas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              Dados do Hóspede
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-sm">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="guestName"
                  value={formData.guestName}
                  onChange={(e) => handleInputChange("guestName", e.target.value)}
                  placeholder="Nome do hóspede"
                  required
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestEmail" className="text-sm">
                  Email <span className="text-gray-400 text-xs">(opcional)</span>
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => handleInputChange("guestEmail", e.target.value)}
                  placeholder="email@exemplo.com"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone" className="text-sm">
                  Telefone <span className="text-gray-400 text-xs">(opcional)</span>
                </Label>
                <Input
                  id="guestPhone"
                  type="tel"
                  value={formData.guestPhone}
                  onChange={(e) => handleInputChange("guestPhone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCpf" className="text-sm">
                  CPF <span className="text-gray-400 text-xs">(opcional)</span>
                </Label>
                <Input
                  id="guestCpf"
                  value={formData.guestCpf}
                  onChange={(e) => handleInputChange("guestCpf", e.target.value)}
                  placeholder="000.000.000-00"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium">Datas da Estadia</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="text-sm">
                  Check-in <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange("checkIn", e.target.value)}
                  min={new Date().toLocaleDateString("en-CA")}
                  required
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOut" className="text-sm">
                  Check-out <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange("checkOut", e.target.value)}
                  min={formData.checkIn || new Date().toISOString().split("T")[0]}
                  required
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {selectedRoom && formData.checkIn && formData.checkOut && (
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Resumo do Preço</h4>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Quarto:</span>
                  <span>
                    {selectedRoom.number} ({selectedRoom.type})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Preço por pessoa/noite:</span>
                  <span>R$ {selectedRoom.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Número de pessoas:</span>
                  <span>{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Número de noites:</span>
                  <span>{numberOfNights}</span>
                </div>
                <div className="flex justify-between font-bold text-blue-900 border-t pt-1 text-sm sm:text-base">
                  <span>Total da Estadia:</span>
                  <span>R$ {totalStayPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !selectedRoom || !formData.checkIn || !formData.checkOut || !formData.guestName}
            size="sm"
          >
            {isSubmitting ? "Processando..." : "Confirmar Reserva"}
          </Button>
        </form>
      </div>
    </div>
  )
}
