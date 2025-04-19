"use client"

import type React from "react"

import { Box } from "@mui/material"
import Navbar from "./Navbar"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import LoginPage from "@/components/features/auth/LoginPage"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show login page if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
    </Box>
  )
}
