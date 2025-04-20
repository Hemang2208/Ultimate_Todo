"use client"
import { ChevronLeft, ChevronRight, Plus, CheckCircle, Circle, Edit, Trash2 } from "lucide-react"

const CalendarView = ({
  isDarkMode,
  selectedDate,
  setSelectedDate,
  calendarView,
  setCalendarView,
  todos,
  setShowAddForm,
  setDueDate,
  getPriorityColor,
  toggleCompleted,
  handleEdit,
  handleDelete,
}) => {
  // Calculate calendar data
  const today = new Date()
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  // Get first day of month and total days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Generate days array with task counts
  const days = []
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Create days for previous month to fill the first row
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevMonthDay = new Date(currentYear, currentMonth, -startingDayOfWeek + i + 1)
    days.push({
      date: prevMonthDay,
      isCurrentMonth: false,
      hasTask: false,
      tasks: [],
    })
  }

  // Create days for current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i)
    const dateString = date.toISOString().split("T")[0]
    const dayTasks = todos.filter((todo) => todo.dueDate === dateString)

    days.push({
      date,
      isCurrentMonth: true,
      hasTask: dayTasks.length > 0,
      tasks: dayTasks,
    })
  }

  // Fill the last row with next month's days
  const daysNeeded = 42 - days.length // 6 rows of 7 days
  for (let i = 1; i <= daysNeeded; i++) {
    const nextMonthDay = new Date(currentYear, currentMonth + 1, i)
    days.push({
      date: nextMonthDay,
      isCurrentMonth: false,
      hasTask: false,
      tasks: [],
    })
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-2xl p-6`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>
            {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const prevMonth = new Date(selectedDate)
                prevMonth.setMonth(prevMonth.getMonth() - 1)
                setSelectedDate(prevMonth)
              }}
              className={`p-1 rounded-full ${
                isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-violet-100 text-violet-800"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                const nextMonth = new Date(selectedDate)
                nextMonth.setMonth(nextMonth.getMonth() + 1)
                setSelectedDate(nextMonth)
              }}
              className={`p-1 rounded-full ${
                isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-violet-100 text-violet-800"
              }`}
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className={`px-3 py-1 text-sm rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-violet-100 hover:bg-violet-200 text-violet-800"
              }`}
            >
              Today
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCalendarView("month")}
            className={`px-3 py-1 rounded-lg ${
              calendarView === "month"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-600 text-white"
                : isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-violet-100 text-violet-800"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setCalendarView("week")}
            className={`px-3 py-1 rounded-lg ${
              calendarView === "week"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-600 text-white"
                : isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-violet-100 text-violet-800"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setCalendarView("day")}
            className={`px-3 py-1 rounded-lg ${
              calendarView === "day"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-600 text-white"
                : isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-violet-100 text-violet-800"
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {calendarView === "month" && (
        <>
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className={`text-center text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday = day.date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 rounded-lg ${
                    !day.isCurrentMonth
                      ? isDarkMode
                        ? "bg-gray-900 text-gray-600"
                        : "bg-gray-100 text-gray-400"
                      : isToday
                        ? isDarkMode
                          ? "bg-violet-900 border border-violet-500"
                          : "bg-violet-100 border border-violet-500"
                        : isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-800"
                  }`}
                  onClick={() => {
                    setSelectedDate(day.date)
                    setCalendarView("day")
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`${
                        isToday ? (isDarkMode ? "text-white font-bold" : "text-violet-800 font-bold") : ""
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                    {day.hasTask && (
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-violet-500" : "bg-violet-600"}`}></div>
                    )}
                  </div>

                  {day.tasks.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {day.tasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded truncate ${
                            task.isCompleted
                              ? isDarkMode
                                ? "bg-gray-600 text-gray-300 line-through"
                                : "bg-gray-200 text-gray-500 line-through"
                              : getPriorityColor(task.priority, isDarkMode)
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {day.tasks.length > 2 && <div className="text-xs text-center">+{day.tasks.length - 2} more</div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {calendarView === "week" && (
        <div>
          {/* Week view implementation */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date(selectedDate)
              const currentDay = date.getDay()
              const diff = i - currentDay
              date.setDate(date.getDate() + diff)

              const dateString = date.toISOString().split("T")[0]
              const dayTasks = todos.filter((todo) => todo.dueDate === dateString)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div key={i} className="space-y-2">
                  <div
                    className={`text-center p-2 rounded-t-lg ${
                      isToday
                        ? isDarkMode
                          ? "bg-violet-800 text-white"
                          : "bg-violet-200 text-violet-900"
                        : isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {date.toLocaleString("default", { weekday: "short" })}
                    </div>
                    <div className="font-medium">{date.getDate()}</div>
                  </div>

                  <div
                    className={`h-64 overflow-y-auto p-2 rounded-b-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
                    }`}
                  >
                    {dayTasks.length === 0 ? (
                      <div
                        className={`text-center text-xs italic mt-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                      >
                        No tasks
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-2 text-sm rounded ${
                              task.isCompleted
                                ? isDarkMode
                                  ? "bg-gray-700 line-through text-gray-400"
                                  : "bg-gray-100 line-through text-gray-500"
                                : getPriorityColor(task.priority, isDarkMode)
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {calendarView === "day" && (
        <div>
          {/* Day view implementation */}
          <div className="flex flex-col">
            <div
              className={`text-center p-4 mb-4 rounded-lg ${
                selectedDate.toDateString() === new Date().toDateString()
                  ? isDarkMode
                    ? "bg-violet-900"
                    : "bg-violet-100"
                  : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-100"
              }`}
            >
              <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-violet-900"}`}>
                {selectedDate.toLocaleString("default", { weekday: "long" })}, {selectedDate.getDate()}{" "}
                {selectedDate.toLocaleString("default", { month: "long" })}
              </h3>
            </div>

            <div className={`rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"} p-4`}>
              {(() => {
                const dateString = selectedDate.toISOString().split("T")[0]
                const dayTasks = todos.filter((todo) => todo.dueDate === dateString)

                if (dayTasks.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className={`text-5xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>📅</div>
                      <h4 className={`text-xl font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        No tasks for this day
                      </h4>
                      <button
                        onClick={() => {
                          setShowAddForm(true)
                          setDueDate(dateString)
                        }}
                        className={`mt-4 px-4 py-2 rounded-lg ${
                          isDarkMode
                            ? "bg-violet-700 hover:bg-violet-800 text-white"
                            : "bg-violet-600 hover:bg-violet-700 text-white"
                        }`}
                      >
                        <Plus size={18} className="inline mr-1" /> Add Task
                      </button>
                    </div>
                  )
                }

                return (
                  <div className="space-y-3">
                    <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Tasks for Today</h4>
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} flex items-start`}
                      >
                        <button onClick={() => toggleCompleted(task.id)} className="mr-3 mt-1">
                          {task.isCompleted ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <Circle size={20} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                          )}
                        </button>

                        <div className="flex-1">
                          <h5
                            className={`font-medium ${
                              task.isCompleted
                                ? "line-through text-gray-500"
                                : isDarkMode
                                  ? "text-white"
                                  : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </h5>

                          {task.description && (
                            <p
                              className={`text-sm mt-1 ${
                                task.isCompleted
                                  ? "line-through text-gray-500"
                                  : isDarkMode
                                    ? "text-gray-300"
                                    : "text-gray-600"
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(task.id)}
                            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                          >
                            <Edit size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                          >
                            <Trash2 size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView
