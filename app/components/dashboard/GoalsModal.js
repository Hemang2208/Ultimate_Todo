"use client"
import { X, Plus, CheckCircle, Circle } from "lucide-react"

const GoalsModal = ({
  isDarkMode,
  goalType,
  setGoalType,
  goalInput,
  setGoalInput,
  handleAddGoal,
  goals,
  toggleGoalCompleted,
  handleRemoveGoal,
  setShowGoalsModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 max-w-md w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>Manage Goals</h2>
          <button
            onClick={() => setShowGoalsModal(false)}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X size={20} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setGoalType("daily")}
              className={`px-4 py-2 rounded-lg ${
                goalType === "daily"
                  ? isDarkMode
                    ? "bg-violet-700 text-white"
                    : "bg-violet-100 text-violet-800"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              Daily Goals
            </button>
            <button
              onClick={() => setGoalType("weekly")}
              className={`px-4 py-2 rounded-lg ${
                goalType === "weekly"
                  ? isDarkMode
                    ? "bg-violet-700 text-white"
                    : "bg-violet-100 text-violet-800"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              Weekly Goals
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && goalInput.trim()) {
                  e.preventDefault()
                  handleAddGoal()
                }
              }}
              placeholder={`Add ${goalType} goal`}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
              } focus:outline-none focus:ring-2`}
            />
            <button
              onClick={handleAddGoal}
              disabled={!goalInput.trim()}
              className={`${
                goalInput.trim()
                  ? isDarkMode
                    ? "bg-violet-700 hover:bg-violet-800"
                    : "bg-violet-600 hover:bg-violet-700"
                  : isDarkMode
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gray-300 cursor-not-allowed"
              } px-4 py-2 rounded-lg text-white`}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className={`space-y-2 max-h-60 overflow-y-auto ${isDarkMode ? "scrollbar-dark" : "scrollbar-light"}`}>
            {goals[goalType].length === 0 ? (
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>No {goalType} goals set yet</p>
            ) : (
              goals[goalType].map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <button onClick={() => toggleGoalCompleted(goalType, goal.id)} className="mr-3">
                      {goal.completed ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <Circle size={18} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                      )}
                    </button>
                    <span className={goal.completed ? "line-through text-gray-500" : ""}>{goal.text}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(goalType, goal.id)}
                    className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                  >
                    <X size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalsModal
