"use client"

import { useState } from "react"
import { useHotel } from "@/contexts/hotel-context-cloud"
import { useAuth } from "@/contexts/auth-context-cloud"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Hotel,
  Users,
  Calendar,
  BarChart3,
  History,
  Settings,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  LogOut,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"
import RoomGrid from "@/components/rooms/room-grid"
import RoomFilters from "@/components/rooms/room-filters"
import StatisticsPanel from "@/components/dashboard/statistics-panel"
import FutureReservationsList from "@/components/reservations/future-reservations-list"
import AdminPanel from "@/components/admin/admin-panel"
import LoginForm from "@/components/auth/login-form"

export default function HotelDashboard() {
  const { user, logout, isAuthenticated } = useAuth()
  const {
    rooms,
    filteredRooms,
    isLoading,
    error,
    lastSync,
    isOnline,
    guestHistory,
    getGuestHistory,
    syncData,
    resetData,
    forceRefresh,
  } = useHotel()
  const [activeTab, setActiveTab] = useState("rooms")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Nunca"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)

    if (seconds < 60) return `${seconds}s atrás`
    if (minutes < 60) return `${minutes}min atrás`
    return date.toLocaleTimeString()
  }

  const handleManualSync = async () => {
    setIsRefreshing(true)
    try {
      await syncData()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleForceRefresh = async () => {
    setIsRefreshing(true)
    try {
      await forceRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleResetData = async () => {
    if (confirm("⚠️ ATENÇÃO: Isso irá resetar todos os dados para o padrão. Continuar?")) {
      setIsResetting(true)
      try {
        await resetData()
        alert("✅ Dados resetados com sucesso!")
      } finally {
        setIsResetting(false)
      }
    }
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema do hotel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header com status de sincronização */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Hotel className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Sistema Hotel</h1>
                <p className="text-sm sm:text-base text-gray-600">Bem-vindo, {user?.name}</p>
              </div>
            </div>

            {/* Status de conexão e sincronização */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                {isOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
                <span className={`${isOnline ? "text-green-600" : "text-red-600"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Sync: {formatLastSync(lastSync)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 hidden sm:inline">Supabase</span>
              </div>

              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={handleManualSync} disabled={isRefreshing}>
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline ml-2">Sync</span>
                </Button>

                <Button variant="outline" size="sm" onClick={handleForceRefresh} disabled={isRefreshing}>
                  <RotateCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline ml-2">Refresh</span>
                </Button>

                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Sair</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline" onClick={handleForceRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                      Tentar Novamente
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleResetData} disabled={isResetting}>
                      <RotateCcw className={`w-4 h-4 mr-1 ${isResetting ? "animate-spin" : ""}`} />
                      Reset
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!isOnline && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <WifiOff className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                Você está offline. As alterações serão sincronizadas quando a conexão for restaurada.
              </AlertDescription>
            </Alert>
          )}

          {rooms.length === 0 && !isLoading && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <span>Nenhum quarto encontrado. Clique em "Reset" para restaurar os dados padrão.</span>
                  <Button size="sm" onClick={handleResetData} disabled={isResetting}>
                    <RotateCcw className={`w-4 h-4 mr-1 ${isResetting ? "animate-spin" : ""}`} />
                    Reset Dados
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
              <Hotel className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{rooms.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Ocupados</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {rooms.filter((room) => room.status === "occupied").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Disponíveis</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {rooms.filter((room) => room.status === "available").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Taxa</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {rooms.length > 0
                  ? Math.round((rooms.filter((room) => room.status === "occupied").length / rooms.length) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-5 text-xs sm:text-sm">
            <TabsTrigger value="rooms" className="flex items-center gap-1 sm:gap-2">
              <Hotel className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Quartos</span>
              <span className="sm:hidden">Q</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Reservas</span>
              <span className="sm:hidden">R</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-1 sm:gap-2">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Stats</span>
              <span className="sm:hidden">S</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1 sm:gap-2">
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Histórico</span>
              <span className="sm:hidden">H</span>
            </TabsTrigger>
            {(user?.role === "admin" || user?.role === "staff") && (
              <TabsTrigger value="admin" className="flex items-center gap-1 sm:gap-2">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">A</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Filtros</CardTitle>
                <CardDescription className="text-sm">Filtre os quartos por tipo, status e preço</CardDescription>
              </CardHeader>
              <CardContent>
                <RoomFilters />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <span className="text-base sm:text-lg">Quartos ({filteredRooms.length})</span>
                  <Badge variant="outline" className="text-xs">
                    Sincronização em nuvem ativa
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  Visualize e gerencie todos os quartos do hotel. Os dados são sincronizados automaticamente via
                  Supabase.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoomGrid />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Próximas Reservas</CardTitle>
                <CardDescription className="text-sm">Gerencie as reservas futuras do hotel</CardDescription>
              </CardHeader>
              <CardContent>
                <FutureReservationsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsPanel />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Histórico de Hóspedes</CardTitle>
                <CardDescription className="text-sm">
                  Histórico completo de todos os hóspedes que passaram pelo hotel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getGuestHistory().length > 0 ? (
                    <div className="space-y-2">
                      {getGuestHistory().map((entry) => (
                        <div
                          key={entry.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-0"
                        >
                          <div>
                            <p className="font-medium text-sm sm:text-base">{entry.guest.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Quarto {entry.roomNumber} ({entry.roomType}) - {entry.checkInDate} a {entry.checkOutDate}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-medium text-sm sm:text-base">R$ {entry.totalPrice.toFixed(2)}</p>
                            <Badge
                              variant={
                                entry.status === "completed"
                                  ? "default"
                                  : entry.status === "active"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {entry.status === "completed"
                                ? "Concluído"
                                : entry.status === "active"
                                  ? "Ativo"
                                  : "Cancelado"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum histórico encontrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {(user?.role === "admin" || user?.role === "staff") && (
            <TabsContent value="admin">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
