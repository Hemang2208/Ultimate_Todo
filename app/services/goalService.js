import Goal from "../models/Goal"
import dbConnect from "../utils/dbConnect"

export const getAllGoals = async (userId) => {
  await dbConnect()
  try {
    const goals = await Goal.find({ user: userId })

    // Group goals by type
    const groupedGoals = {
      daily: goals.filter((goal) => goal.type === "daily"),
      weekly: goals.filter((goal) => goal.type === "weekly"),
    }

    return { success: true, data: groupedGoals }
  } catch (error) {
    console.error("Error fetching goals:", error)
    return { success: false, error: "Failed to fetch goals" }
  }
}

export const createGoal = async (goalData, userId) => {
  await dbConnect()
  try {
    const newGoal = new Goal({
      ...goalData,
      user: userId,
    })
    await newGoal.save()
    return { success: true, data: newGoal }
  } catch (error) {
    console.error("Error creating goal:", error)
    return { success: false, error: "Failed to create goal" }
  }
}

export const toggleGoalCompletion = async (goalId, userId) => {
  await dbConnect()
  try {
    const goal = await Goal.findOne({ _id: goalId, user: userId })
    if (!goal) {
      return { success: false, error: "Goal not found" }
    }

    goal.completed = !goal.completed
    await goal.save()

    return { success: true, data: goal }
  } catch (error) {
    console.error("Error toggling goal completion:", error)
    return { success: false, error: "Failed to toggle goal completion" }
  }
}

export const deleteGoal = async (goalId, userId) => {
  await dbConnect()
  try {
    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId })
    if (!goal) {
      return { success: false, error: "Goal not found" }
    }
    return { success: true, data: goal }
  } catch (error) {
    console.error("Error deleting goal:", error)
    return { success: false, error: "Failed to delete goal" }
  }
}
