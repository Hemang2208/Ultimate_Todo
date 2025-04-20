import * as goalService from "../services/goalService"

export const getAllGoals = async (userId) => {
  const result = await goalService.getAllGoals(userId)
  return result
}

export const createGoal = async (goalData, userId) => {
  const result = await goalService.createGoal(goalData, userId)
  return result
}

export const toggleGoalCompletion = async (goalId, userId) => {
  const result = await goalService.toggleGoalCompletion(goalId, userId)
  return result
}

export const deleteGoal = async (goalId, userId) => {
  const result = await goalService.deleteGoal(goalId, userId)
  return result
}
