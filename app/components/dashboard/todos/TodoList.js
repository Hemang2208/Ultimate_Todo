"use client"

import { Plus } from "lucide-react"
import TodoItem from "./TodoItem"

export default function TodoList({
  isDarkMode,
  filteredTodos,
  isDragging,
  draggedTaskId,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  toggleCompleted,
  handleEdit,
  handleDelete,
  startTimer,
  getPriorityBadgeColor,
  setShowAddForm,
  filter,
}) {
  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`text-5xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>📝</div>
        <h3 className={`text-xl font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>No tasks found</h3>
        <p className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          {filter === "all" ? "Add a new task to get started" : `No ${filter} tasks available`}
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className={`mt-4 px-4 py-2 rounded-lg ${
            isDarkMode ? "bg-violet-700 hover:bg-violet-800 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"
          }`}
        >
          <Plus size={18} className="inline mr-1" /> Add Task
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          isDarkMode={isDarkMode}
          toggleCompleted={toggleCompleted}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          startTimer={startTimer}
          getPriorityBadgeColor={getPriorityBadgeColor}
          isDragging={isDragging}
          draggedTaskId={draggedTaskId}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
        />
      ))}
    </div>
  )
}
