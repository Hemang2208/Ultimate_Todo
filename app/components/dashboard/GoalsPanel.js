"use client"
import { Plus, CheckCircle, Circle } from "lucide-react"

const GoalsPanel = ({ isDarkMode, goals, setShowGoalsModal, toggleGoalCompleted }) => {
  return (
    <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-violet-50"} rounded-xl p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>Goals</h2>
        <button
          onClick={() => setShowGoalsModal(true)}
          className={`${
            isDarkMode ? "bg-violet-700 hover:bg-violet-800" : "bg-violet-600 hover:bg-violet-700"
          } p-2 rounded-full text-white`}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className={`font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-2`}>Daily Goals</h3>
          {goals.daily.length === 0 ? (
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-violet-600"}`}>No daily goals set</p>
          ) : (
            <ul className="space-y-2">
              {goals.daily.map((goal) => (
                <li key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleGoalCompleted("daily", goal.id)}
                      className={`${isDarkMode ? "text-gray-300" : "text-violet-600"} mr-2`}
                    >
                      {goal.completed ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
                    </button>
                    <span
                      className={goal.completed ? `line-through ${isDarkMode ? "text-gray-500" : "text-gray-400"}` : ""}
                    >
                      {goal.text}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className={`font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-2`}>Weekly Goals</h3>
          {goals.weekly.length === 0 ? (
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-violet-600"}`}>No weekly goals set</p>
          ) : (
            <ul className="space-y-2">
              {goals.weekly.map((goal) => (
                <li key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleGoalCompleted("weekly", goal.id)}
                      className={`${isDarkMode ? "text-gray-300" : "text-violet-600"} mr-2`}
                    >
                      {goal.completed ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
                    </button>
                    <span
                      className={goal.completed ? `line-through ${isDarkMode ? "text-gray-500" : "text-gray-400"}` : ""}
                    >
                      {goal.text}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default GoalsPanel
