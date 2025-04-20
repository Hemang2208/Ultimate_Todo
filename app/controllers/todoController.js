import * as todoService from "../services/todoService"
import * as statsService from "../services/statsService"

export const getAllTodos = async (userId) => {
  const result = await todoService.getAllTodos(userId)
  return result
}

export const getTodoById = async (todoId, userId) => {
  const result = await todoService.getTodoById(todoId, userId)
  return result
}

export const createTodo = async (todoData, userId) => {
  const result = await todoService.createTodo(todoData, userId)

  if (result.success) {
    // Update stats after creating a todo
    await statsService.updateStats(userId)
  }

  return result
}

export const updateTodo = async (todoId, todoData, userId) => {
  const result = await todoService.updateTodo(todoId, todoData, userId)

  if (result.success) {
    // Update stats after updating a todo
    await statsService.updateStats(userId)
  }

  return result
}

export const deleteTodo = async (todoId, userId) => {
  const result = await todoService.deleteTodo(todoId, userId)

  if (result.success) {
    // Update stats after deleting a todo
    await statsService.updateStats(userId)
  }

  return result
}

export const toggleTodoCompletion = async (todoId, userId) => {
  const result = await todoService.toggleTodoCompletion(todoId, userId)

  if (result.success) {
    // Update stats after toggling todo completion
    await statsService.updateStats(userId)
  }

  return result
}

export const updateRecurringTasks = async (userId) => {
  const result = await todoService.updateRecurringTasks(userId)

  if (result.success && result.data.length > 0) {
    // Update stats after updating recurring tasks
    await statsService.updateStats(userId)
  }

  return result
}

export const filterAndSortTodos = (todos, { filter, searchQuery, sortBy, sortDirection, selectedTags }) => {
  let result = [...todos]

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    result = result.filter(
      (todo) =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query)),
    )
  }

  // Apply status filter
  if (filter === "completed") {
    result = result.filter((todo) => todo.isCompleted)
  } else if (filter === "active") {
    result = result.filter((todo) => !todo.isCompleted)
  } else if (filter === "today") {
    const today = new Date().toISOString().split("T")[0]
    result = result.filter((todo) => todo.dueDate === today)
  } else if (filter === "upcoming") {
    const today = new Date().toISOString().split("T")[0]
    result = result.filter((todo) => !todo.isCompleted && todo.dueDate > today)
  } else if (filter === "overdue") {
    const today = new Date().toISOString().split("T")[0]
    result = result.filter((todo) => !todo.isCompleted && todo.dueDate < today)
  }

  // Apply tag filter
  if (selectedTags.length > 0) {
    result = result.filter((todo) => selectedTags.every((tag) => todo.tags && todo.tags.includes(tag)))
  }

  // Apply sort
  result.sort((a, b) => {
    let aValue, bValue

    if (sortBy === "dueDate") {
      aValue = a.dueDate || "9999-12-31"
      bValue = b.dueDate || "9999-12-31"
    } else if (sortBy === "priority") {
      const priorityValues = { high: 3, medium: 2, low: 1 }
      aValue = priorityValues[a.priority] || 0
      bValue = priorityValues[b.priority] || 0
    } else if (sortBy === "title") {
      aValue = a.title.toLowerCase()
      bValue = b.title.toLowerCase()
    } else if (sortBy === "category") {
      aValue = a.category || ""
      bValue = b.category || ""
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return result
}
