"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useHotel } from "@/contexts/hotel-context-cloud"
import { useAuth } from "@/contexts/auth-context-cloud"
import { LogOut, RefreshCw, Wifi, WifiOff } from "lucide-react"

export function HotelDashboard() {
  const { user, logout } = useAuth()
  const { rooms, filteredRooms, isLoading, error, lastSync, isOnline, syncData, forceRefresh, getStatistics } =
    useHotel()

  const [stats, setStats] = useState(getStatistics())

  useEffect(() => {
    setStats(getStatistics())
  }, [rooms, getStatistics])

  const handleRefresh = async () => {
    await forceRefresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Sistema Hotel</h1>
              <div className="flex items-center space-x-2">
                {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
                <span className="text-sm text-gray-500">{isOnline ? "Online" : "Offline"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {lastSync && <span>Última sync: {lastSync.toLocaleTimeString()}</span>}
              </div>

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user?.name}</span>
                <Badge variant="secondary">{user?.role}</Badge>
              </div>

              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Quartos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRooms}</div>
              <p className="text-xs text-muted-foreground">Quartos no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quartos Ocupados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupiedRooms}</div>
              <p className="text-xs text-muted-foreground">Taxa de ocupação: {stats.occupancyRate.toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quartos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableRooms}</div>
              <p className="text-xs text-muted-foreground">Prontos para reserva</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hóspedes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGuests}</div>
              <p className="text-xs text-muted-foreground">No hotel agora</p>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Quartos ({filteredRooms.length})</CardTitle>
            <CardDescription>Visualização de todos os quartos do hotel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-4 rounded-lg border-2 ${
                    room.status === "available"
                      ? "border-green-200 bg-green-50"
                      : room.status === "occupied"
                        ? "border-red-200 bg-red-50"
                        : room.status === "maintenance"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-lg">{room.number}</div>
                    <div className="text-sm text-gray-600">{room.type}</div>
                    <div className="text-xs text-gray-500">
                      {room.capacity} pessoa{room.capacity > 1 ? "s" : ""}
                    </div>
                    <div className="text-sm font-medium mt-1">R$ {room.price}</div>
                    <Badge
                      variant={
                        room.status === "available"
                          ? "default"
                          : room.status === "occupied"
                            ? "destructive"
                            : "secondary"
                      }
                      className="mt-2 text-xs"
                    >
                      {room.status === "available"
                        ? "Disponível"
                        : room.status === "occupied"
                          ? "Ocupado"
                          : room.status === "maintenance"
                            ? "Manutenção"
                            : "Reservado"}
                    </Badge>
                    {room.guest && <div className="mt-2 text-xs text-gray-600">{room.guest.name}</div>}
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
