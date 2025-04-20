import Stats from "../models/Stats"
import Todo from "../models/Todo"
import dbConnect from "../utils/dbConnect"

export const getStats = async (userId) => {
  await dbConnect()
  try {
    let stats = await Stats.findOne({ user: userId })

    if (!stats) {
      stats = new Stats({ user: userId })
      await stats.save()
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}

export const updateStats = async (userId) => {
  await dbConnect()
  try {
    // Get all todos for the user
    const todos = await Todo.find({ user: userId })

    // Calculate stats
    const completed = todos.filter((todo) => todo.isCompleted).length
    const total = todos.length

    // Count by category
    const completedByCategory = {}
    // Count by priority
    const completedByPriority = {}

    todos.forEach((todo) => {
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

    // Get existing stats
    let stats = await Stats.findOne({ user: userId })

    if (!stats) {
      stats = new Stats({ user: userId })
    }

    // Check streak
    const today = new Date().toDateString()
    const lastCompleted = stats.lastCompletedDate

    let streak = stats.streak

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

    // Update stats
    stats.completed = completed
    stats.total = total
    stats.completedByCategory = completedByCategory
    stats.completedByPriority = completedByPriority
    stats.streak = streak
    stats.lastCompletedDate = completed > 0 ? today : lastCompleted

    await stats.save()

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error updating stats:", error)
    return { success: false, error: "Failed to update stats" }
  }
}
