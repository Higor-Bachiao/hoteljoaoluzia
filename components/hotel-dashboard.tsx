"use client"

import { useAuth } from "@/contexts/auth-context"
import { useHotel } from "@/contexts/hotel-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Hotel, Users, Calendar, TrendingUp, Wifi, Tv, Snowflake, Coffee, Bath, Mountain } from "lucide-react"
import { formatCurrency } from "@/lib/price-utils"

export function HotelDashboard() {
  const { user, logout } = useAuth()
  const { rooms, isLoading, error, lastSync, isOnline, forceRefresh } = useHotel()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do hotel...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      case "reserved":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível"
      case "occupied":
        return "Ocupado"
      case "maintenance":
        return "Manutenção"
      case "reserved":
        return "Reservado"
      default:
        return status
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "tv":
        return <Tv className="h-4 w-4" />
      case "ar-condicionado":
        return <Snowflake className="h-4 w-4" />
      case "minibar":
        return <Coffee className="h-4 w-4" />
      case "banheira":
        return <Bath className="h-4 w-4" />
      case "varanda":
        return <Mountain className="h-4 w-4" />
      default:
        return null
    }
  }

  const statistics = {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter((r) => r.status === "occupied").length,
    availableRooms: rooms.filter((r) => r.status === "available").length,
    maintenanceRooms: rooms.filter((r) => r.status === "maintenance").length,
  }

  const occupancyRate = statistics.totalRooms > 0 ? (statistics.occupiedRooms / statistics.totalRooms) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Hotel className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema Hotel</h1>
                <p className="text-sm text-gray-500">
                  Bem-vindo, {user?.name} ({user?.role})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm text-gray-600">{isOnline ? "Online" : "Offline"}</span>
              </div>
              {lastSync && <span className="text-xs text-gray-500">Última sync: {lastSync.toLocaleTimeString()}</span>}
              <Button onClick={forceRefresh} variant="outline" size="sm">
                Atualizar
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Quartos</CardTitle>
              <Hotel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quartos Ocupados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.occupiedRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quartos Disponíveis</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.availableRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Quartos ({rooms.length})</CardTitle>
            <CardDescription>Visualização de todos os quartos do hotel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">Quarto {room.number}</h3>
                      <p className="text-sm text-gray-600">{room.type}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(room.status)}`}></div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline">{getStatusText(room.status)}</Badge>

                    <div className="text-sm text-gray-600">
                      <p>
                        {room.capacity} pessoa(s) • {room.beds} cama(s)
                      </p>
                      <p className="font-semibold text-green-600">{formatCurrency(room.price)}/noite</p>
                    </div>

                    {room.guest && (
                      <div className="text-sm bg-blue-50 p-2 rounded">
                        <p className="font-medium">{room.guest.name}</p>
                        <p className="text-xs text-gray-600">
                          {room.guest.checkIn} - {room.guest.checkOut}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
