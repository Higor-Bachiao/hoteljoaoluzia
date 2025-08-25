"use client"

import { useHotel } from "@/contexts/hotel-context-cloud"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Filter, X } from "lucide-react"

export default function RoomFilters() {
  const { filters, setFilters, clearFilters } = useHotel()

  const roomTypes = ["Solteiro", "Casal", "Casal com AR", "Triplo"]
  const statusOptions = [
    { value: "available", label: "Disponível" },
    { value: "occupied", label: "Ocupado" },
    { value: "maintenance", label: "Manutenção" },
    { value: "reserved", label: "Reservado" },
  ]

  const hasActiveFilters = filters.type || filters.status || filters.minPrice || filters.maxPrice

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
            <Filter className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Filtros</span>
            <span className="sm:hidden">Filtrar</span>
            {hasActiveFilters && <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-2 h-2"></span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 sm:w-56" align="end">
          <DropdownMenuLabel className="text-sm">Tipo de Quarto</DropdownMenuLabel>
          {roomTypes.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => setFilters({ ...filters, type: filters.type === type ? "" : type })}
              className={`text-sm ${filters.type === type ? "bg-blue-50" : ""}`}
            >
              {type}
              {filters.type === type && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-sm">Status</DropdownMenuLabel>
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setFilters({ ...filters, status: filters.status === option.value ? "" : option.value })}
              className={`text-sm ${filters.status === option.value ? "bg-blue-50" : ""}`}
            >
              {option.label}
              {filters.status === option.value && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs sm:text-sm">
          <X className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Limpar</span>
          <span className="sm:hidden">X</span>
        </Button>
      )}
    </div>
  )
}
