"use client"

/**
 * Utility for dual storage (localStorage + MongoDB)
 * Provides methods to save and retrieve data from both localStorage and MongoDB
 */

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data))
    }
    return true
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
    return false
  }
}

// Get data from localStorage
export const getFromLocalStorage = (key) => {
  try {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    }
    return null
  } catch (error) {
    console.error(`Error getting from localStorage (${key}):`, error)
    return null
  }
}

// Remove data from localStorage
export const removeFromLocalStorage = (key) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
    return true
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
    return false
  }
}

// Dual save (localStorage + API)
export const dualSave = async (localKey, apiEndpoint, data, token) => {
  try {
    // First save to localStorage for immediate UI update
    saveToLocalStorage(localKey, data)

    // Then save to MongoDB via API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to save data to server")
    }

    const serverData = await response.json()

    // Update localStorage with server data (which includes _id)
    saveToLocalStorage(localKey, serverData)

    return { success: true, data: serverData }
  } catch (error) {
    console.error(`Error in dual save (${localKey}):`, error)
    return { success: false, error: error.message, localData: data }
  }
}

// Dual fetch (try localStorage first, then API)
export const dualFetch = async (localKey, apiEndpoint, token) => {
  try {
    // Try localStorage first
    const localData = getFromLocalStorage(localKey)

    if (localData) {
      // If we have local data, return it immediately
      // But also fetch from server in the background to ensure data is up-to-date
      fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) return response.json()
          throw new Error("Failed to fetch from server")
        })
        .then((serverData) => {
          // Update localStorage with latest server data
          saveToLocalStorage(localKey, serverData)
        })
        .catch((error) => {
          console.error(`Background fetch error (${localKey}):`, error)
        })

      return { success: true, data: localData, source: "localStorage" }
    }

    // If no local data, fetch from server
    const response = await fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch data from server")
    }

    const serverData = await response.json()

    // Save server data to localStorage
    saveToLocalStorage(localKey, serverData)

    return { success: true, data: serverData, source: "server" }
  } catch (error) {
    console.error(`Error in dual fetch (${localKey}):`, error)
    return { success: false, error: error.message }
  }
}

// Dual update (update localStorage + API)
export const dualUpdate = async (localKey, apiEndpoint, id, data, token) => {
  try {
    // Update localStorage first
    const localData = getFromLocalStorage(localKey)

    if (localData) {
      const updatedLocalData = Array.isArray(localData)
        ? localData.map((item) => (item._id === id ? { ...item, ...data } : item))
        : { ...localData, ...data }

      saveToLocalStorage(localKey, updatedLocalData)
    }

    // Then update on server
    const response = await fetch(`${apiEndpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update data on server")
    }

    const serverData = await response.json()

    // Update localStorage with server response
    if (localData) {
      const finalLocalData = Array.isArray(localData)
        ? localData.map((item) => (item._id === id ? serverData : item))
        : serverData

      saveToLocalStorage(localKey, finalLocalData)
    }

    return { success: true, data: serverData }
  } catch (error) {
    console.error(`Error in dual update (${localKey}):`, error)
    return { success: false, error: error.message }
  }
}

// Dual delete (delete from localStorage + API)
export const dualDelete = async (localKey, apiEndpoint, id, token) => {
  try {
    // Delete from localStorage first
    const localData = getFromLocalStorage(localKey)

    if (localData && Array.isArray(localData)) {
      const filteredData = localData.filter((item) => item._id !== id)
      saveToLocalStorage(localKey, filteredData)
    }

    // Then delete from server
    const response = await fetch(`${apiEndpoint}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete data from server")
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in dual delete (${localKey}):`, error)
    return { success: false, error: error.message }
  }
}
