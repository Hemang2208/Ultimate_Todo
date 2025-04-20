"use client"

import { useState } from "react"
import { CheckCircle, Circle, Edit, Trash2, Timer, Tag, Bookmark, ChevronDown, ChevronUp } from "lucide-react"

export default function TodoItem({
  todo,
  isDarkMode,
  toggleCompleted,
  handleEdit,
  handleDelete,
  startTimer,
  getPriorityBadgeColor,
  isDragging,
  draggedTaskId,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
}) {
  const [expanded, setExpanded] = useState(false)

  // Ensure todo has an _id
  if (!todo || !todo._id) {
    console.error("Invalid todo object:", todo)
    return null
  }

  return (
    <div
      draggable
      onDragStart={() => handleDragStart(todo._id)}
      onDragOver={(e) => handleDragOver(e, todo._id)}
      onDragEnd={handleDragEnd}
      className={`p-4 mb-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"} ${
        isDragging && draggedTaskId === todo._id ? "opacity-50 border-2 border-dashed border-blue-500" : ""
      } transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-start">
        <button onClick={() => toggleCompleted(todo._id)} className="mr-3 mt-1 flex-shrink-0">
          {todo.isCompleted ? (
            <CheckCircle size={20} className="text-green-500" />
          ) : (
            <Circle size={20} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-base font-medium ${
                todo.isCompleted ? "line-through text-gray-500" : isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {todo.title}
            </h3>

            {todo.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadgeColor(todo.priority, isDarkMode)}`}>
                {todo.priority}
              </span>
            )}

            {todo.dueDate && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isDarkMode ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800"
                }`}
              >
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {todo.description && (
            <p
              className={`text-sm mt-1 ${
                todo.isCompleted ? "line-through text-gray-500" : isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {todo.category && (
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                  isDarkMode ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800"
                }`}
              >
                <Bookmark size={12} className="mr-1" />
                {todo.category}
              </span>
            )}

            {todo.tags &&
              todo.tags.map((tag, index) => (
                <span
                  key={`${todo._id}-tag-${index}`}
                  className={`text-xs px-2 py-1 rounded-full flex items-center ${
                    isDarkMode ? "bg-violet-900 text-violet-200" : "bg-violet-100 text-violet-800"
                  }`}
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}

            {todo.recurring && todo.recurring !== "none" && (
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                  isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                }`}
              >
                {todo.recurring}
              </span>
            )}
          </div>

          {/* Subtasks (shown when expanded) */}
          {expanded && todo.subtasks && todo.subtasks.length > 0 && (
            <div
              className={`mt-3 pl-6 space-y-1 ${isDarkMode ? "border-l border-gray-600" : "border-l border-gray-300"}`}
            >
              {todo.subtasks.map((subtask, index) => (
                <div key={`${todo._id}-subtask-${index}`} className="flex items-center text-sm">
                  <span
                    className={
                      subtask.completed
                        ? "text-green-500 mr-2"
                        : `${isDarkMode ? "text-gray-400" : "text-gray-500"} mr-2`
                    }
                  >
                    {subtask.completed ? <CheckCircle size={14} /> : <Circle size={14} />}
                  </span>
                  <span className={subtask.completed ? "line-through text-gray-500" : ""}>{subtask.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-1 ml-2">
          {!todo.isCompleted && (
            <button
              onClick={() => startTimer(todo)}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              title="Start timer"
            >
              <Timer size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
            </button>
          )}

          <button
            onClick={() => handleEdit(todo._id)}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            title="Edit task"
          >
            <Edit size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
          </button>
          <button
            onClick={() => handleDelete(todo._id)}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            title="Delete task"
          >
            <Trash2 size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronUp size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
            ) : (
              <ChevronDown size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
