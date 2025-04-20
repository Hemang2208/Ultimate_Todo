// Todo model structure
export const createTodo = ({
  id = Date.now(),
  title,
  description = "",
  dueDate = "",
  startDate = "",
  category = "",
  priority = "medium",
  tags = [],
  subtasks = [],
  reminder = "",
  recurring = "none",
  isCompleted = false,
}) => {
  return {
    id,
    title,
    description,
    dueDate,
    startDate,
    category,
    priority,
    tags,
    subtasks,
    reminder,
    recurring,
    isCompleted,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const createSubtask = (text) => {
  return {
    id: Date.now(),
    text,
    completed: false,
  }
}

export const createGoal = (text) => {
  return {
    id: Date.now(),
    text,
    completed: false,
  }
}
