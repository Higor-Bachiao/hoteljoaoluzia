"use client"

import { useAuth } from "@/contexts/auth-context"
import LoginForm from "@/components/auth/login-form"
import HotelDashboard from "@/components/hotel-dashboard"
import LoadingWrapper from "@/components/loading-wrapper"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingWrapper />
  }

  if (!user) {
    return <LoginForm />
  }

  return <HotelDashboard />
}
