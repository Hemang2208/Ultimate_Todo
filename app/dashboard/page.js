"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { Plus } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Import components
import Header from "../components/dashboard/Header"
import TodoList from "../components/dashboard/todos/TodoList"
import PomodoroTimer from "../components/dashboard/PomodoroTimer"
import GoalsPanel from "../components/dashboard/goals/GoalsPanel"
import CalendarView from "../components/dashboard/CalendarView"
import StatsView from "../components/dashboard/stats/StatsView"
import Sidebar from "../components/dashboard/Sidebar"
import TodoForm from "../components/dashboard/todos/TodoForm"
import GoalsModal from "../components/dashboard/goals/GoalsModal"

// Import hooks
import useAuth from "../hooks/useAuth"
import usePomodoro from "../hooks/usePomodoro"
import useDragAndDrop from "../hooks/useDragAndDrop"
import useTodos from "../hooks/useTodos"
import useGoals from "../hooks/useGoals"
import useStats from "../hooks/useStats"
import useLocalStorage from "../hooks/useLocalStorage"

// Import utils
import { filterAndSortTodos } from "../utils/todoUtils"

const UltimateTodoApp = () => {
  // Auth hook
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()

  // Core states
  const [filteredTodos, setFilteredTodos] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState("all")
  const [customCategory, setCustomCategory] = useState("")
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [showFilters, setShowFilters] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedTaskTags, setSelectedTaskTags] = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [subtaskInput, setSubtaskInput] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reminder, setReminder] = useState("")
  const [recurring, setRecurring] = useState("none")
  const [categories, setCategories] = useLocalStorage("categories", ["Work", "Personal", "Study", "Health", "Shopping"])
  const [isDarkMode, setIsDarkMode] = useLocalStorage("darkMode", false)

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navbarRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // View states
  const [view, setView] = useLocalStorage("view", "list")
  const [calendarView, setCalendarView] = useLocalStorage("calendarView", "month")

  // Productivity feature states
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [goalType, setGoalType] = useState("daily")
  const [goalInput, setGoalInput] = useState("")

  // Router for navigation
  const router = useRouter()

  // Use custom hooks
  const {
    todos,
    loading: todosLoading,
    error: todosError,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
  } = useTodos()

  const { goals, loading: goalsLoading, error: goalsError, createGoal, toggleGoalCompletion, deleteGoal } = useGoals()

  const { stats, loading: statsLoading, error: statsError, updateStats } = useStats()

  const {
    timeLeft,
    timerMode,
    timerActive,
    timerRunning,
    currentTask,
    startTimer,
    pauseTimer,
    resetTimer,
    switchTimerMode,
    formatTime,
    setTimerActive,
  } = usePomodoro()

  const { draggedTaskId, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(todos, (newTodos) => {
    // This would be where we'd update the order in the database
    // For now, we'll just update the local state
    setFilteredTodos(newTodos)
  })

  // GSAP animations
  useEffect(() => {
    if (navbarRef.current) {
      gsap.from(navbarRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [])

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.from(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [router.pathname])

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/user/login")
    }
  }, [authLoading, isAuthenticated, router])

  // Apply dark mode
  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : ""
  }, [isDarkMode])

  // Extract unique tags from todos
  useEffect(() => {
    if (todos.length > 0) {
      const uniqueTags = [...new Set(todos.flatMap((todo) => todo.tags || []))]
      setTags(uniqueTags)
    }
  }, [todos])

  // Apply filters and sort to todos
  const applyFiltersAndSort = useCallback(() => {
    const result = filterAndSortTodos(todos, {
      filter,
      searchQuery,
      sortBy,
      sortDirection,
      selectedTags,
    })

    setFilteredTodos(result)
  }, [todos, filter, searchQuery, sortBy, sortDirection, selectedTags])

  // Update filtered todos when todos or filters change
  useEffect(() => {
    applyFiltersAndSort()
  }, [todos, filter, searchQuery, sortBy, sortDirection, selectedTags, applyFiltersAndSort])

  // Mobile menu handlers
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Handle adding a new tag to a task
  const handleAddTag = () => {
    if (!tagInput.trim()) return

    const newTag = tagInput.trim()

    // Add to selected task tags
    if (!selectedTaskTags.includes(newTag)) {
      setSelectedTaskTags([...selectedTaskTags, newTag])
    }

    setTagInput("")
  }

  // Handle removing a tag from a task
  const handleRemoveTag = (tag) => {
    setSelectedTaskTags(selectedTaskTags.filter((t) => t !== tag))
  }

  // Handle toggling a tag selection for filtering
  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Add a new goal
  const handleAddGoal = async () => {
    if (!goalInput.trim()) return

    try {
      await createGoal({
        text: goalInput.trim(),
        type: goalType,
      })
      setGoalInput("")
    } catch (error) {
      console.error("Error adding goal:", error)
      toast.error("Failed to add goal")
    }
  }

  // Toggle a goal's completion status
  const handleToggleGoalCompleted = async (goalId) => {
    try {
      await toggleGoalCompletion(goalId)
    } catch (error) {
      console.error("Error toggling goal completion:", error)
      toast.error("Failed to update goal")
    }
  }

  // Remove a goal
  const handleRemoveGoal = async (goalId, type) => {
    try {
      await deleteGoal(goalId, type)
    } catch (error) {
      console.error("Error removing goal:", error)
      toast.error("Failed to delete goal")
    }
  }

  // Add a new subtask
  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return

    const newSubtask = {
      id: Date.now(),
      text: subtaskInput.trim(),
      completed: false,
    }
    setSubtasks([...subtasks, newSubtask])
    setSubtaskInput("")
  }

  // Remove a subtask
  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id))
  }

  // Handle task form submission
  const handleSaveTask = async () => {
    if (!title.trim()) return

    try {
      if (editingId) {
        // Update existing task
        await updateTodo(editingId, {
          title,
          description,
          dueDate,
          startDate,
          category,
          priority,
          tags: selectedTaskTags,
          subtasks,
          reminder,
          recurring,
        })
        toast.success("Task updated successfully")
      } else {
        // Add new task
        await createTodo({
          title,
          description,
          dueDate,
          startDate,
          category,
          priority,
          tags: selectedTaskTags,
          subtasks,
          reminder,
          recurring,
        })
        toast.success("Task added successfully")
      }

      // Reset form
      setTitle("")
      setDescription("")
      setDueDate("")
      setStartDate("")
      setCategory("")
      setPriority("medium")
      setTagInput("")
      setSelectedTaskTags([])
      setSubtasks([])
      setReminder("")
      setRecurring("none")
      setEditingId(null)
      setShowAddForm(false)

      // Update stats
      await updateStats()
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error("Failed to save task")
    }
  }

  // Handle deleting a task
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id)
      toast.success("Task deleted successfully")
      await updateStats()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  // Edit a task
  const handleEdit = (id) => {
    const todo = todos.find((todo) => todo._id === id)
    if (todo) {
      setTitle(todo.title)
      setDescription(todo.description || "")
      setDueDate(todo.dueDate || "")
      setStartDate(todo.startDate || "")
      setCategory(todo.category || "")
      setPriority(todo.priority || "medium")
      setSelectedTaskTags(todo.tags || [])
      setSubtasks(todo.subtasks || [])
      setReminder(todo.reminder || "")
      setRecurring(todo.recurring || "none")
      setEditingId(id)
      setShowAddForm(true)
    }
  }

  // Toggle task completion status
  const handleToggleCompleted = async (id) => {
    try {
      await toggleTodoCompletion(id)
      await updateStats()
    } catch (error) {
      console.error("Error toggling task completion:", error)
      toast.error("Failed to update task")
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Add a custom category
  const handleAddCustomCategory = () => {
    if (!customCategory.trim() || categories.includes(customCategory)) {
      setShowCustomCategoryInput(false)
      setCustomCategory("")
      return
    }

    setCategories([...categories, customCategory])
    setCategory(customCategory)
    setShowCustomCategoryInput(false)
    setCustomCategory("")
  }

  // Helper function to get priority badge color
  const getPriorityBadgeColor = (priority, isDark) => {
    if (priority === "high") {
      return isDark ? "bg-red-900 text-red-200" : "bg-red-200 text-red-800"
    } else if (priority === "medium") {
      return isDark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-200 text-yellow-800"
    } else {
      return isDark ? "bg-blue-900 text-blue-200" : "bg-blue-200 text-blue-800"
    }
  }

  // Helper function to get priority color based on priority value
  const getPriorityColor = (priority, isDark) => {
    if (priority === "high") {
      return isDark ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"
    } else if (priority === "medium") {
      return isDark ? "bg-yellow-900 text-yellow-100" : "bg-yellow-100 text-yellow-800"
    } else {
      return isDark ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"
    }
  }

  // Calculate tasks by category for stats
  const tasksByCategory = {}
  todos.forEach((todo) => {
    if (todo.category) {
      tasksByCategory[todo.category] = (tasksByCategory[todo.category] || 0) + 1
    }
  })

  // Calculate tasks by priority for stats
  const tasksByPriority = {
    high: todos.filter((todo) => todo.priority === "high").length,
    medium: todos.filter((todo) => todo.priority === "medium").length,
    low: todos.filter((todo) => todo.priority === "low").length,
  }

  // Show loading state
  if (authLoading || todosLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Loading...</p>
        </div>
      </div>
    )
  }

  // Render the main app layout
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />

      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        navbarRef={navbarRef}
        mobileMenuRef={mobileMenuRef}
        router={router}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        logout={logout}
        user={user}
      />

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar
            isDarkMode={isDarkMode}
            view={view}
            setView={setView}
            filter={filter}
            setFilter={setFilter}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            tags={tags}
            selectedTags={selectedTags}
            handleToggleTag={handleToggleTag}
          />

          {/* Main Content Area */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Pomodoro Timer */}
              <PomodoroTimer
                isDarkMode={isDarkMode}
                timeLeft={timeLeft}
                timerMode={timerMode}
                timerActive={timerActive}
                currentTask={currentTask}
                formatTime={formatTime}
                setTimerActive={setTimerActive}
                timerRunning={timerRunning}
                startTimer={startTimer}
                pauseTimer={pauseTimer}
                resetTimer={resetTimer}
                switchTimerMode={switchTimerMode}
              />

              {/* Goals */}
              <GoalsPanel
                isDarkMode={isDarkMode}
                goals={goals}
                setShowGoalsModal={setShowGoalsModal}
                toggleGoalCompleted={handleToggleGoalCompleted}
                handleRemoveGoal={handleRemoveGoal}
              />
            </div>

            {view === "list" && (
              <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-sm`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>
                    {filter === "all"
                      ? "All Tasks"
                      : filter === "active"
                        ? "Active Tasks"
                        : filter === "completed"
                          ? "Completed Tasks"
                          : filter === "today"
                            ? "Today's Tasks"
                            : filter === "upcoming"
                              ? "Upcoming Tasks"
                              : filter === "overdue"
                                ? "Overdue Tasks"
                                : "Tasks"}
                  </h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-violet-700 hover:bg-violet-800 text-white"
                        : "bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    <Plus size={18} className="inline mr-1" /> Add Task
                  </button>
                </div>

                <TodoList
                  isDarkMode={isDarkMode}
                  filteredTodos={filteredTodos}
                  isDragging={draggedTaskId !== null}
                  draggedTaskId={draggedTaskId}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDragEnd={handleDragEnd}
                  toggleCompleted={handleToggleCompleted}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  startTimer={startTimer}
                  getPriorityBadgeColor={getPriorityBadgeColor}
                  setShowAddForm={setShowAddForm}
                  filter={filter}
                />
              </div>
            )}

            {view === "calendar" && (
              <CalendarView
                isDarkMode={isDarkMode}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarView={calendarView}
                setCalendarView={setCalendarView}
                todos={todos}
                setShowAddForm={setShowAddForm}
                setDueDate={setDueDate}
                getPriorityColor={getPriorityColor}
                toggleCompleted={handleToggleCompleted}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}

            {view === "stats" && (
              <StatsView
                isDarkMode={isDarkMode}
                stats={stats}
                tasksByCategory={tasksByCategory}
                tasksByPriority={tasksByPriority}
              />
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Task Modal */}
      {showAddForm && (
        <TodoForm
          isDarkMode={isDarkMode}
          editingId={editingId}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          startDate={startDate}
          setStartDate={setStartDate}
          category={category}
          setCategory={setCategory}
          priority={priority}
          setPriority={setPriority}
          tagInput={tagInput}
          setTagInput={setTagInput}
          selectedTaskTags={selectedTaskTags}
          setSelectedTaskTags={setSelectedTaskTags}
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          subtaskInput={subtaskInput}
          setSubtaskInput={setSubtaskInput}
          reminder={reminder}
          setReminder={setReminder}
          recurring={recurring}
          setRecurring={setRecurring}
          showCustomCategoryInput={showCustomCategoryInput}
          setShowCustomCategoryInput={setShowCustomCategoryInput}
          customCategory={customCategory}
          setCustomCategory={setCustomCategory}
          categories={categories}
          handleAddCustomCategory={handleAddCustomCategory}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
          handleAddSubtask={handleAddSubtask}
          handleRemoveSubtask={handleRemoveSubtask}
          handleSaveTask={handleSaveTask}
          setShowAddForm={setShowAddForm}
          setEditingId={setEditingId}
        />
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <GoalsModal
          isDarkMode={isDarkMode}
          goalType={goalType}
          setGoalType={setGoalType}
          goalInput={goalInput}
          setGoalInput={setGoalInput}
          handleAddGoal={handleAddGoal}
          goals={goals}
          toggleGoalCompleted={handleToggleGoalCompleted}
          handleRemoveGoal={handleRemoveGoal}
          setShowGoalsModal={setShowGoalsModal}
        />
      )}
    </div>
  )
}

export default UltimateTodoApp
