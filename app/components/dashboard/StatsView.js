const StatsView = ({ isDarkMode, stats, tasksByCategory, tasksByPriority }) => {
  // Calculate completion rate
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-2xl p-6`}>
      <div className="mb-8">
        <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"} mb-6`}>
          Productivity Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completion Rate */}
          <div className={`${isDarkMode ? "bg-gray-700" : "bg-violet-50"} rounded-xl p-4 text-center`}>
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-1`}>
              Task Completion Rate
            </h3>
            <div className="relative h-24 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={isDarkMode ? "#374151" : "#EDE9FE"}
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={isDarkMode ? "#7C3AED" : "#8B5CF6"}
                    strokeWidth="10"
                    strokeDasharray={`${completionRate * 2.51} 251`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-violet-800"}`}>
                {completionRate}%
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-6">
              <div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Completed</div>
                <div className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>
                  {stats.completed}
                </div>
              </div>
              <div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total</div>
                <div className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>
                  {stats.total}
                </div>
              </div>
            </div>
          </div>

          {/* Productivity Streak */}
          <div className={`${isDarkMode ? "bg-gray-700" : "bg-violet-50"} rounded-xl p-4 text-center`}>
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-1`}>
              Current Streak
            </h3>
            <div className="flex items-center justify-center h-24">
              <div className={`text-5xl font-bold ${isDarkMode ? "text-white" : "text-violet-800"}`}>
                {stats.streak}
              </div>
              <div className={`text-lg ml-2 ${isDarkMode ? "text-gray-300" : "text-violet-700"}`}>days</div>
            </div>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {stats.streak > 0 ? "Keep up the good work!" : "Complete a task today to start a streak!"}
            </div>
          </div>

          {/* Tasks by Priority */}
          <div className={`${isDarkMode ? "bg-gray-700" : "bg-violet-50"} rounded-xl p-4`}>
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-3`}>
              Tasks by Priority
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`w-full bg-gray-200 rounded-full h-2.5 ${isDarkMode ? "bg-gray-600" : ""}`}>
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{
                      width: `${(tasksByPriority.high / stats.total) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
                <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  High ({tasksByPriority.high})
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-full bg-gray-200 rounded-full h-2.5 ${isDarkMode ? "bg-gray-600" : ""}`}>
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{
                      width: `${(tasksByPriority.medium / stats.total) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
                <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Medium ({tasksByPriority.medium})
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-full bg-gray-200 rounded-full h-2.5 ${isDarkMode ? "bg-gray-600" : ""}`}>
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{
                      width: `${(tasksByPriority.low / stats.total) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
                <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Low ({tasksByPriority.low})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks by Category */}
        <div className={`${isDarkMode ? "bg-gray-700" : "bg-violet-50"} rounded-xl p-6 mt-6`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-3`}>
            Tasks by Category
          </h3>

          {Object.keys(tasksByCategory).length === 0 ? (
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>No categorized tasks yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(tasksByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{category}</span>
                  <div className="flex items-center">
                    <div
                      className={`h-2 rounded-full ${isDarkMode ? "bg-violet-600" : "bg-violet-500"}`}
                      style={{ width: `${Math.min(count * 10, 100)}px` }}
                    ></div>
                    <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsView
