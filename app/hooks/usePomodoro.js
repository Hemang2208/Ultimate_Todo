"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { saveToLocalStorage, getFromLocalStorage } from "../utils/dualStorage"

export default function usePomodoro() {
  // Try to get pomodoro state from localStorage
  const getInitialState = () => {
    const savedState = getFromLocalStorage("pomodoroState")
    if (savedState) {
      // If there's a saved state but the timer was running, reset it
      if (savedState.timerRunning) {
        return {
          ...savedState,
          timerRunning: false,
        }
      }
      return savedState
    }

    // Default state
    return {
      timeLeft: 25 * 60, // 25 minutes in seconds
      timerMode: "work", // 'work', 'shortBreak', 'longBreak'
      timerActive: false,
      timerRunning: false,
      currentTask: null,
    }
  }

  const initialState = getInitialState()

  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft)
  const [timerMode, setTimerMode] = useState(initialState.timerMode)
  const [timerActive, setTimerActive] = useState(initialState.timerActive)
  const [timerRunning, setTimerRunning] = useState(initialState.timerRunning)
  const [currentTask, setCurrentTask] = useState(initialState.currentTask)
  const timerRef = useRef(null)

  // Clear any existing interval
  const clearTimerInterval = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Save state to localStorage
  const saveState = useCallback(() => {
    saveToLocalStorage("pomodoroState", {
      timeLeft,
      timerMode,
      timerActive,
      timerRunning,
      currentTask,
    })
  }, [timeLeft, timerMode, timerActive, timerRunning, currentTask])

  // Start the timer
  const startTimer = useCallback(
    (task = null) => {
      if (task) {
        setCurrentTask(task)
      }

      setTimerActive(true)
      setTimerRunning(true)

      // Clear any existing interval first
      clearTimerInterval()

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Play notification sound
            try {
              const audio = new Audio("/notification.mp3")
              audio.play().catch((e) => console.log("Audio play error:", e))
            } catch (e) {
              console.log("Audio error:", e)
            }

            // Show browser notification
            if (Notification && Notification.permission === "granted") {
              try {
                new Notification("Pomodoro Timer", {
                  body:
                    timerMode === "work"
                      ? "Work session completed! Take a break."
                      : "Break time is over! Back to work.",
                  icon: "/favicon.ico",
                })
              } catch (e) {
                console.log("Notification error:", e)
              }
            }

            // Clear the current interval
            clearTimerInterval()

            setTimerRunning(false)

            // Auto switch to next mode
            if (timerMode === "work") {
              setTimerMode("shortBreak")
              return 5 * 60 // 5 minute break
            } else {
              setTimerMode("work")
              return 25 * 60 // 25 minute work session
            }
          }
          return prev - 1
        })
      }, 1000)
    },
    [timerMode, clearTimerInterval],
  )

  // Pause the timer
  const pauseTimer = useCallback(() => {
    clearTimerInterval()
    setTimerRunning(false)
  }, [clearTimerInterval])

  // Reset the timer
  const resetTimer = useCallback(() => {
    clearTimerInterval()
    setTimerRunning(false)

    if (timerMode === "work") {
      setTimeLeft(25 * 60)
    } else if (timerMode === "shortBreak") {
      setTimeLeft(5 * 60)
    } else {
      setTimeLeft(15 * 60)
    }
  }, [timerMode, clearTimerInterval])

  // Switch timer mode
  const switchTimerMode = useCallback(
    (mode) => {
      clearTimerInterval()
      setTimerRunning(false)
      setTimerMode(mode)

      if (mode === "work") {
        setTimeLeft(25 * 60)
      } else if (mode === "shortBreak") {
        setTimeLeft(5 * 60)
      } else if (mode === "longBreak") {
        setTimeLeft(15 * 60)
      }
    },
    [clearTimerInterval],
  )

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Save state when it changes
  useEffect(() => {
    saveState()
  }, [timeLeft, timerMode, timerActive, timerRunning, currentTask, saveState])

  // Clean up on unmount
  useEffect(() => {
    // Request notification permission
    if (
      typeof window !== "undefined" &&
      Notification &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission()
    }

    return () => {
      clearTimerInterval()
    }
  }, [clearTimerInterval])

  return {
    timeLeft,
    timerMode,
    timerActive,
    timerRunning,
    currentTask,
    startTimer,
    pauseTimer,
    resetTimer,
    switchTimerMode,
    formatTime,
    setTimerActive,
  }
}
