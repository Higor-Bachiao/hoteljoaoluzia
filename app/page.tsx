"use client"

import { useAuth } from "@/contexts/auth-context-cloud"
import LoginForm from "@/components/auth/login-form"
import HotelDashboard from "@/components/hotel-dashboard"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <HotelDashboard />
}
