"use client"

import type React from "react"

import { useState } from "react"
import { useHotel } from "@/contexts/hotel-context-cloud"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CalendarDays, User, Mail, Phone, CreditCard } from "lucide-react"
import type { Guest } from "@/types/hotel"

interface ReservationFormProps {
  initialRoomId?: string
  onReservationSuccess?: () => void
}

export default function ReservationForm({ initialRoomId, onReservationSuccess }: ReservationFormProps) {
  const { rooms, makeReservation } = useHotel()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    roomId: initialRoomId || "",
    name: "",
    email: "",
    phone: "",
    cpf: "",
    guests: 1,
    checkIn: "",
    checkOut: "",
  })

  const availableRooms = rooms.filter((room) => room.status === "available")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validações básicas
      if (!formData.roomId) {
        throw new Error("Selecione um quarto")
      }

      if (!formData.name.trim()) {
        throw new Error("Nome é obrigatório")
      }

      if (!formData.checkIn || !formData.checkOut) {
        throw new Error("Datas de check-in e check-out são obrigatórias")
      }

      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)

      if (checkOutDate <= checkInDate) {
        throw new Error("Data de check-out deve ser posterior ao check-in")
      }

      const selectedRoom = rooms.find((room) => room.id === formData.roomId)
      if (!selectedRoom) {
        throw new Error("Quarto não encontrado")
      }

      if (formData.guests > selectedRoom.capacity) {
        throw new Error(`Este quarto comporta no máximo ${selectedRoom.capacity} hóspedes`)
      }

      const guest: Guest = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        cpf: formData.cpf.trim() || undefined,
        guests: formData.guests,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        expenses: [],
      }

      await makeReservation({
        roomId: formData.roomId,
        guest,
      })

      // Limpar formulário
      setFormData({
        roomId: initialRoomId || "",
        name: "",
        email: "",
        phone: "",
        cpf: "",
        guests: 1,
        checkIn: "",
        checkOut: "",
      })

      onReservationSuccess?.()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Data mínima é hoje
  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!initialRoomId && (
        <div className="space-y-2">
          <Label htmlFor="roomId">Quarto</Label>
          <Select value={formData.roomId} onValueChange={(value) => handleInputChange("roomId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um quarto" />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  Quarto {room.number} - {room.type} (R$ {room.price}/pessoa/noite)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="Nome do hóspede"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Número de Hóspedes</Label>
          <Select
            value={formData.guests.toString()}
            onValueChange={(value) => handleInputChange("guests", Number.parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "hóspede" : "hóspedes"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => handleInputChange("cpf", e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="checkIn">Check-in *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={(e) => handleInputChange("checkIn", e.target.value)}
              className="pl-10"
              min={today}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkOut">Check-out *</Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="checkOut"
              type="date"
              value={formData.checkOut}
              onChange={(e) => handleInputChange("checkOut", e.target.value)}
              className="pl-10"
              min={formData.checkIn || today}
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processando..." : "Confirmar Reserva"}
      </Button>
    </form>
  )
}
