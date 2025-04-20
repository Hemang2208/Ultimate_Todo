"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { saveToLocalStorage, getFromLocalStorage } from "../utils/dualStorage"

export default function useStats() {
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    completedByCategory: {},
    completedByPriority: {},
    streak: 0,
    lastCompletedDate: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Try to get stats from localStorage first
      const localStats = getFromLocalStorage("stats")
      if (localStats) {
        setStats(localStats)
        setLoading(false)
      }

      // Then fetch from server to ensure data is up-to-date
      const response = await fetch("/api/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch stats")
      }

      const data = await response.json()

      // Update localStorage and state with server data
      saveToLocalStorage("stats", data)
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update stats
  const updateStats = useCallback(async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Calculate local stats based on todos in localStorage
      const localTodos = getFromLocalStorage("todos") || []

      const completed = localTodos.filter((todo) => todo.isCompleted).length
      const total = localTodos.length

      // Count by category
      const completedByCategory = {}
      // Count by priority
      const completedByPriority = {}

      localTodos.forEach((todo) => {
        if (todo.isCompleted) {
          // Count by category
          if (todo.category) {
            completedByCategory[todo.category] = (completedByCategory[todo.category] || 0) + 1
          }

          // Count by priority
          if (todo.priority) {
            completedByPriority[todo.priority] = (completedByPriority[todo.priority] || 0) + 1
          }
        }
      })

      // Get existing stats from localStorage
      const localStats = getFromLocalStorage("stats") || {
        completed: 0,
        total: 0,
        completedByCategory: {},
        completedByPriority: {},
        streak: 0,
        lastCompletedDate: "",
      }

      // Check streak
      const today = new Date().toDateString()
      const lastCompleted = localStats.lastCompletedDate

      let streak = localStats.streak

      if (completed > 0 && lastCompleted !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toDateString()

        if (lastCompleted === yesterdayString) {
          streak += 1
        } else if (lastCompleted !== today) {
          streak = 1
        }
      }

      // Update local stats
      const updatedLocalStats = {
        ...localStats,
        completed,
        total,
        completedByCategory,
        completedByPriority,
        streak,
        lastCompletedDate: completed > 0 ? today : lastCompleted,
      }

      // Update UI immediately
      setStats(updatedLocalStats)

      // Update localStorage
      saveToLocalStorage("stats", updatedLocalStats)

      // Update on server
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update stats")
      }

      const data = await response.json()

      // Update with server data
      setStats(data)

      // Update localStorage with server data
      saveToLocalStorage("stats", data)
    } catch (error) {
      console.error("Error updating stats:", error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    fetchStats,
    updateStats,
  }
}
