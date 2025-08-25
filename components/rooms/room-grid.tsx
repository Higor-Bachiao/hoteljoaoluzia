"use client"

import { useState } from "react"
import { useHotel } from "@/contexts/hotel-context-cloud"
import RoomCard from "./room-card"
import RoomFilters from "./room-filters"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function RoomGrid() {
  const { rooms, filteredRooms, searchRooms, error, isOnline, forceRefresh } = useHotel()
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    searchRooms(value)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await forceRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar quartos..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
        <div className="flex gap-2">
          <RoomFilters />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || !isOnline}
            className="text-xs sm:text-sm bg-transparent"
          >
            <Search className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline ml-2">Atualizar</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <span className="text-sm">Problemas na sincronização. Alguns dados podem estar desatualizados.</span>
              <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                Tentar Novamente
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!isOnline && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800 text-sm">
            Sem conexão com a internet. Visualizando dados em cache.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {filteredRooms.length === 0 && rooms.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base sm:text-lg">Nenhum quarto encontrado com os filtros aplicados.</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchTerm("")
              searchRooms("")
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-base sm:text-lg mb-4">Nenhum quarto encontrado no sistema.</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Carregando..." : "Recarregar Dados"}
          </Button>
        </div>
      )}
    </div>
  )
}
