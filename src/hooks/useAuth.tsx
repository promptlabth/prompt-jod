"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would check with your auth provider
        // For demo, we'll use localStorage
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async () => {
    // In a real app, you would use Google OAuth
    // For demo, we'll simulate a successful login
    const mockUser = {
      id: "123",
      name: "Demo User",
      email: "demo@example.com",
      picture: "https://via.placeholder.com/150",
    }

    setUser(mockUser)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
