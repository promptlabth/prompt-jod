import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ThemeProvider from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n/I18nProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Jod - Smart Note-Taking Assistant",
  description: "Chat-based note-taking assistant with reminder and scheduling features",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
