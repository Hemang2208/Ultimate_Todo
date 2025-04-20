"use client"

import { CheckCircle, Circle, X } from "lucide-react"

export default function GoalItem({ goal, isDarkMode, toggleGoalCompleted, handleRemoveGoal }) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => toggleGoalCompleted(goal._id)}
          className={`${isDarkMode ? "text-gray-300" : "text-violet-600"} mr-2`}
        >
          {goal.completed ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
        </button>
        <span className={goal.completed ? `line-through ${isDarkMode ? "text-gray-500" : "text-gray-400"}` : ""}>
          {goal.text}
        </span>
      </div>
      <button
        onClick={() => handleRemoveGoal(goal._id, goal.type)}
        className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
      >
        <X size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
      </button>
    </li>
  )
}
