"use client"

import { useHotel } from "@/contexts/hotel-context-cloud"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, X } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function RoomFilters() {
  const { filters, setFilters, clearFilters } = useHotel()

  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, type: value === "all" ? "" : value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value === "all" ? "" : value })
  }

  const handlePriceChange = (values: number[]) => {
    setFilters({ ...filters, minPrice: values[0], maxPrice: values[1] })
  }

  const hasActiveFilters = filters.type || filters.status || filters.minPrice > 0 || filters.maxPrice < 1000

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {hasActiveFilters && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo de Quarto</Label>
            <Select value={filters.type || "all"} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Solteiro">Solteiro</SelectItem>
                <SelectItem value="Casal">Casal</SelectItem>
                <SelectItem value="Triplo">Triplo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="occupied">Ocupado</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="reserved">Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Faixa de Preço (R$)</Label>
            <div className="px-2">
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={handlePriceChange}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>R$ {filters.minPrice}</span>
                <span>R$ {filters.maxPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
