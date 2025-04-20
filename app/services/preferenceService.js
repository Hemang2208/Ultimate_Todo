// Load dark mode preference
export const loadDarkMode = () => {
  try {
    const savedDarkMode = localStorage.getItem("darkMode")
    return savedDarkMode ? JSON.parse(savedDarkMode) : false
  } catch (error) {
    console.error("Error loading dark mode preference:", error)
    return false
  }
}

// Save dark mode preference
export const saveDarkMode = (isDarkMode) => {
  try {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
    document.body.className = isDarkMode ? "dark" : ""
    return true
  } catch (error) {
    console.error("Error saving dark mode preference:", error)
    return false
  }
}

// Load tags from localStorage
export const loadTags = () => {
  try {
    const savedTags = localStorage.getItem("tags")
    return savedTags ? JSON.parse(savedTags) : []
  } catch (error) {
    console.error("Error loading tags:", error)
    return []
  }
}

// Save tags to localStorage
export const saveTags = (tags) => {
  try {
    localStorage.setItem("tags", JSON.stringify(tags))
    return true
  } catch (error) {
    console.error("Error saving tags:", error)
    return false
  }
}

// Check authentication
export const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}
