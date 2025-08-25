import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context-cloud"
import { HotelProvider } from "@/contexts/hotel-context-cloud"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Hotel",
  description: "Sistema completo de gerenciamento hoteleiro",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <HotelProvider>{children}</HotelProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
