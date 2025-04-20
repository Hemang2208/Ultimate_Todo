import Todo from "../models/Todo"
import dbConnect from "../utils/dbConnect"

export const getAllTodos = async (userId) => {
  await dbConnect()
  try {
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 })
    return { success: true, data: todos }
  } catch (error) {
    console.error("Error fetching todos:", error)
    return { success: false, error: "Failed to fetch todos" }
  }
}

export const getTodoById = async (todoId, userId) => {
  await dbConnect()
  try {
    const todo = await Todo.findOne({ _id: todoId, user: userId })
    if (!todo) {
      return { success: false, error: "Todo not found" }
    }
    return { success: true, data: todo }
  } catch (error) {
    console.error("Error fetching todo:", error)
    return { success: false, error: "Failed to fetch todo" }
  }
}

export const createTodo = async (todoData, userId) => {
  await dbConnect()
  try {
    const newTodo = new Todo({
      ...todoData,
      user: userId,
    })
    await newTodo.save()
    return { success: true, data: newTodo }
  } catch (error) {
    console.error("Error creating todo:", error)
    return { success: false, error: "Failed to create todo" }
  }
}

export const updateTodo = async (todoId, todoData, userId) => {
  await dbConnect()
  try {
    const todo = await Todo.findOne({ _id: todoId, user: userId })
    if (!todo) {
      return { success: false, error: "Todo not found" }
    }

    // Update todo fields
    Object.keys(todoData).forEach((key) => {
      if (todoData[key] !== undefined) {
        todo[key] = todoData[key]
      }
    })

    await todo.save()
    return { success: true, data: todo }
  } catch (error) {
    console.error("Error updating todo:", error)
    return { success: false, error: "Failed to update todo" }
  }
}

export const deleteTodo = async (todoId, userId) => {
  await dbConnect()
  try {
    const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId })
    if (!todo) {
      return { success: false, error: "Todo not found" }
    }
    return { success: true, data: todo }
  } catch (error) {
    console.error("Error deleting todo:", error)
    return { success: false, error: "Failed to delete todo" }
  }
}

export const toggleTodoCompletion = async (todoId, userId) => {
  await dbConnect()
  try {
    const todo = await Todo.findOne({ _id: todoId, user: userId })
    if (!todo) {
      return { success: false, error: "Todo not found" }
    }

    todo.isCompleted = !todo.isCompleted
    await todo.save()

    return { success: true, data: todo }
  } catch (error) {
    console.error("Error toggling todo completion:", error)
    return { success: false, error: "Failed to toggle todo completion" }
  }
}

export const updateRecurringTasks = async (userId) => {
  await dbConnect()
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const recurringTodos = await Todo.find({
      user: userId,
      recurring: { $ne: "none" },
      isCompleted: true,
    })

    const updatedTodos = []

    for (const todo of recurringTodos) {
      const dueDateTime = new Date(todo.dueDate)
      dueDateTime.setHours(0, 0, 0, 0)

      if (dueDateTime <= today) {
        const newDueDate = new Date(dueDateTime)

        // Calculate the next occurrence based on recurrence pattern
        if (todo.recurring === "daily") {
          newDueDate.setDate(newDueDate.getDate() + 1)
        } else if (todo.recurring === "weekly") {
          newDueDate.setDate(newDueDate.getDate() + 7)
        } else if (todo.recurring === "monthly") {
          newDueDate.setMonth(newDueDate.getMonth() + 1)
        }

        // Reset completion status and update due date
        todo.isCompleted = false
        todo.dueDate = newDueDate.toISOString().split("T")[0]

        // Reset subtasks completion status
        if (todo.subtasks && todo.subtasks.length > 0) {
          todo.subtasks = todo.subtasks.map((subtask) => ({
            ...subtask.toObject(),
            completed: false,
          }))
        }

        await todo.save()
        updatedTodos.push(todo)
      }
    }

    return { success: true, data: updatedTodos }
  } catch (error) {
    console.error("Error updating recurring tasks:", error)
    return { success: false, error: "Failed to update recurring tasks" }
  }
}
