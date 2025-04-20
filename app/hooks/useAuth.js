"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)

      // First check localStorage
      const userData = localStorage.getItem("userData")
      const token = localStorage.getItem("token")

      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return false
      }

      // Set user from localStorage for immediate UI update
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }

      // Verify with server
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        // Clear invalid auth data
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
        setIsAuthenticated(false)
        setUser(null)
        return false
      }

      const data = await response.json()

      if (data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("userData", JSON.stringify(data.user))
        return true
      } else {
        setIsAuthenticated(false)
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setIsAuthenticated(false)
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("userData", JSON.stringify(data.user))

      setUser(data.user)
      setIsAuthenticated(true)

      toast.success("Login successful")
      return true
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Register user
  const register = useCallback(async (userData) => {
    try {
      setLoading(true)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast.success("Registration successful")
      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout user
  const logout = useCallback(async () => {
    try {
      setLoading(true)

      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("userData")

      // Clear state
      setUser(null)
      setIsAuthenticated(false)

      toast.success("Logout successful")
      router.push("/user/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
    } finally {
      setLoading(false)
    }
  }, [router])

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }
}
