"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { HotelServiceCloud } from "@/lib/hotel-service-cloud"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "guest"
  phone?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, "id" | "role"> & { password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem("hotel_current_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
        console.log("✅ Usuário restaurado do localStorage:", userData.email)
      } catch (error) {
        console.error("❌ Erro ao restaurar usuário:", error)
        localStorage.removeItem("hotel_current_user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Autenticar com Supabase
      const userData = await HotelServiceCloud.authenticateUser(email, password)

      setUser(userData)
      setIsAuthenticated(true)

      // Salvar usuário atual no localStorage
      localStorage.setItem("hotel_current_user", JSON.stringify(userData))
      console.log("✅ Login realizado com sucesso:", userData.email)
    } catch (error: any) {
      console.error("❌ Erro no login:", error)
      throw new Error(error.message || "Email ou senha incorretos")
    }
  }

  const register = async (userData: Omit<User, "id" | "role"> & { password: string }) => {
    try {
      // Criar usuário no Supabase
      const userId = await HotelServiceCloud.createUser({
        ...userData,
        role: "guest",
      })

      const newUser: User = {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: "guest",
        phone: userData.phone,
      }

      setUser(newUser)
      setIsAuthenticated(true)

      // Salvar usuário atual no localStorage
      localStorage.setItem("hotel_current_user", JSON.stringify(newUser))
      console.log("✅ Usuário registrado com sucesso:", newUser.email)
    } catch (error: any) {
      console.error("❌ Erro no registro:", error)
      throw new Error(error.message || "Erro ao criar conta")
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)

    // Remover usuário atual do localStorage
    localStorage.removeItem("hotel_current_user")
    console.log("✅ Logout realizado com sucesso")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
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
