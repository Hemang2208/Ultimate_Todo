"use client"

const PomodoroTimer = ({
  isDarkMode,
  timeLeft,
  timerMode,
  timerActive,
  currentTask,
  formatTime,
  setTimerActive,
  timerRunning,
  startTimer,
  pauseTimer,
  resetTimer,
  switchTimerMode,
}) => {
  return (
    <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-violet-50"} rounded-xl p-6`}>
      <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"} mb-2`}>Pomodoro Timer</h2>

      <div className="text-center mb-4">
        <div className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-violet-800"} mb-2`}>
          {formatTime(timeLeft)}
        </div>

        <div className={`${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-2`}>
          {timerMode === "work" ? "Focus Time" : "Break Time"}
          {currentTask && <span> - {currentTask.title}</span>}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => {
              if (timerRunning) {
                pauseTimer()
              } else {
                startTimer()
              }
            }}
            className={`${
              isDarkMode ? "bg-violet-700 hover:bg-violet-800" : "bg-violet-600 hover:bg-violet-700"
            } px-4 py-2 rounded-lg text-white`}
          >
            {timerRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className={`${
              isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-violet-200 hover:bg-violet-300"
            } px-4 py-2 rounded-lg ${isDarkMode ? "text-white" : "text-violet-800"}`}
          >
            Reset
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              switchTimerMode("work")
            }}
            className={`${
              timerMode === "work"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-600 text-white"
                : isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-violet-100 text-violet-800"
            } px-3 py-1 rounded-lg flex-1`}
          >
            Work (25m)
          </button>
          <button
            onClick={() => {
              switchTimerMode("shortBreak")
            }}
            className={`${
              timerMode === "shortBreak"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-600 text-white"
                : isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-violet-100 text-violet-800"
            } px-3 py-1 rounded-lg flex-1`}
          >
            Break (5m)
          </button>
        </div>
      </div>
    </div>
  )
}

export default PomodoroTimer
