"use client"
import { CheckCircle, Circle, Edit, Trash2, Tag, Bookmark, Timer } from "lucide-react"

const TaskList = ({
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
}) => {
  return (
    <div className="space-y-3">
      {filteredTodos.map((todo) => (
        <div
          key={todo.id}
          draggable
          onDragStart={() => handleDragStart(todo.id)}
          onDragOver={(e) => handleDragOver(e, todo.id)}
          onDragEnd={handleDragEnd}
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} ${
            isDragging && draggedTaskId === todo.id ? "opacity-50" : "opacity-100"
          } transition-opacity duration-200 flex items-start`}
        >
          <button onClick={() => toggleCompleted(todo.id)} className="mr-3 mt-1">
            {todo.isCompleted ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : (
              <Circle size={20} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
            )}
          </button>

          <div className="flex-1">
            <h3
              className={`font-medium ${
                todo.isCompleted ? "line-through text-gray-500" : isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {todo.title}
            </h3>

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
              {todo.priority && (
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(todo.priority, isDarkMode)}`}>
                  {todo.priority}
                </span>
              )}

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
                todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      isDarkMode ? "bg-violet-900 text-violet-200" : "bg-violet-100 text-violet-800"
                    }`}
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}

              {todo.dueDate && (
                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center ${
                    new Date(todo.dueDate) < new Date() && !todo.isCompleted
                      ? isDarkMode
                        ? "bg-red-900 text-red-200"
                        : "bg-red-100 text-red-800"
                      : isDarkMode
                        ? "bg-gray-600 text-gray-200"
                        : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {todo.subtasks && todo.subtasks.length > 0 && (
              <div
                className={`mt-3 pl-6 space-y-1 ${
                  isDarkMode ? "border-l border-gray-600" : "border-l border-gray-300"
                }`}
              >
                {todo.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center text-sm">
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

          <div className="flex space-x-1">
            {!todo.isCompleted && (
              <button
                onClick={() => startTimer(todo)}
                className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                title="Start Timer"
              >
                <Timer size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
              </button>
            )}
            <button
              onClick={() => handleEdit(todo.id)}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            >
              <Edit size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            >
              <Trash2 size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList
