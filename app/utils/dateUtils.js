// Format time for the Pomodoro timer
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Get today's date in ISO format
export const getTodayISO = () => {
  return new Date().toISOString().split("T")[0]
}

// Check if a date is today
export const isToday = (dateString) => {
  const today = new Date().toDateString()
  const date = new Date(dateString).toDateString()
  return date === today
}

// Check if a date is in the past
export const isPastDate = (dateString) => {
  const today = getTodayISO()
  return dateString < today
}

// Check if a date is in the future
export const isFutureDate = (dateString) => {
  const today = getTodayISO()
  return dateString > today
}
