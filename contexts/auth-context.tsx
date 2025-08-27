"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/hotel"
import { hotelApi } from "@/lib/hotel-api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar se há usuário logado ao carregar a aplicação
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const currentUser = hotelApi.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await hotelApi.login(email, password)
      setUser(response.user)

      console.log("✅ Login realizado com sucesso:", response.user.name)
    } catch (error: any) {
      console.error("❌ Erro no login:", error)
      setError(error.message || "Erro ao fazer login")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    hotelApi.logout()
    setUser(null)
    setError(null)
    console.log("✅ Logout realizado com sucesso")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
