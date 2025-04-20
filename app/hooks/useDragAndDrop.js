"use client"

import { useState, useEffect } from "react"
import { saveToLocalStorage } from "../utils/dualStorage"

export default function useDragAndDrop(initialTodos, onReorder) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [todos, setTodos] = useState(initialTodos)

  // Update todos when initialTodos changes
  useEffect(() => {
    setTodos(initialTodos)
  }, [initialTodos])

  // Handle drag start
  const handleDragStart = (id) => {
    setIsDragging(true)
    setDraggedTaskId(id)
  }

  // Handle drag over
  const handleDragOver = (e, id) => {
    e.preventDefault()
    if (id === draggedTaskId) return

    const draggedItemIndex = todos.findIndex((todo) => todo._id === draggedTaskId)
    const targetIndex = todos.findIndex((todo) => todo._id === id)

    if (draggedItemIndex === -1 || targetIndex === -1) return

    // Reorder the todos
    const newTodos = [...todos]
    const [removed] = newTodos.splice(draggedItemIndex, 1)
    newTodos.splice(targetIndex, 0, removed)

    setTodos(newTodos)

    // Save to localStorage
    saveToLocalStorage("todos", newTodos)

    // Call the callback if provided
    if (onReorder) {
      onReorder(newTodos)
    }
  }

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedTaskId(null)
  }

  return {
    todos,
    setTodos,
    isDragging,
    draggedTaskId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}
