import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { HotelProvider } from "@/contexts/hotel-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "Sistema completo de gerenciamento hoteleiro",
  keywords: ["hotel", "management", "reservas", "quartos", "hospedagem"],
  authors: [{ name: "Hotel Management Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <HotelProvider>{children}</HotelProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
