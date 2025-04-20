import * as statsService from "../services/statsService"
import { loadTodos } from "../services/todoService"
import { loadStats } from "../services/statsService"

// Get current stats
export const getStats = async (userId) => {
  const result = await statsService.getStats(userId)
  return result
}

// Refresh stats based on current todos
export const updateStats = async (userId) => {
  const result = await statsService.updateStats(userId)
  return result
}

// Calculate task completion rate
export const getCompletionRate = () => {
  const stats = loadStats()
  return stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
}

// Get tasks by category
export const getTasksByCategory = () => {
  const todos = loadTodos()
  const tasksByCategory = {}

  todos.forEach((todo) => {
    if (todo.category) {
      tasksByCategory[todo.category] = (tasksByCategory[todo.category] || 0) + 1
    }
  })

  return tasksByCategory
}

// Get tasks by priority
export const getTasksByPriority = () => {
  const todos = loadTodos()

  return {
    high: todos.filter((todo) => todo.priority === "high").length,
    medium: todos.filter((todo) => todo.priority === "medium").length,
    low: todos.filter((todo) => todo.priority === "low").length,
  }
}
