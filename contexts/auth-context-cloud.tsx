"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/hotel"
import { HotelServiceCloud } from "@/lib/hotel-service-cloud"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("hotel_current_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Erro ao carregar usuário salvo:", error)
        localStorage.removeItem("hotel_current_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userData = await HotelServiceCloud.authenticateUser(email, password)
      setUser(userData)
      localStorage.setItem("hotel_current_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      await HotelServiceCloud.createUser(userData)
      // Após registro, fazer login automaticamente
      await login(userData.email, userData.password)
    } catch (error) {
      console.error("Erro no registro:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hotel_current_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
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
