"use client"

import { X, Check, Plus, Circle, Tag } from "lucide-react"

export default function TodoForm({
  isDarkMode,
  editingId,
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  startDate,
  setStartDate,
  category,
  setCategory,
  priority,
  setPriority,
  tagInput,
  setTagInput,
  selectedTaskTags,
  setSelectedTaskTags,
  subtasks,
  setSubtasks,
  subtaskInput,
  setSubtaskInput,
  reminder,
  setReminder,
  recurring,
  setRecurring,
  showCustomCategoryInput,
  setShowCustomCategoryInput,
  customCategory,
  setCustomCategory,
  categories,
  handleAddCustomCategory,
  handleAddTag,
  handleRemoveTag,
  handleAddSubtask,
  handleRemoveSubtask,
  handleSaveTask,
  setShowAddForm,
  setEditingId,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>
            {editingId ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={() => {
              setShowAddForm(false)
              setEditingId(null)
              setTitle("")
              setDescription("")
              setDueDate("")
              setStartDate("")
              setCategory("")
              setPriority("medium")
              setTagInput("")
              setSubtasks([])
              setReminder("")
              setRecurring("none")
            }}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X size={20} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
              } focus:outline-none focus:ring-2`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
              } focus:outline-none focus:ring-2`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
                Category
              </label>
              {showCustomCategoryInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="New category"
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                    } focus:outline-none focus:ring-2`}
                  />
                  <button
                    onClick={handleAddCustomCategory}
                    className={`${
                      isDarkMode ? "bg-violet-700 hover:bg-violet-800" : "bg-violet-600 hover:bg-violet-700"
                    } px-4 py-2 rounded-lg text-white`}
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomCategoryInput(false)
                      setCustomCategory("")
                    }}
                    className={`${
                      isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                    } px-4 py-2 rounded-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                    } focus:outline-none focus:ring-2`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowCustomCategoryInput(true)}
                    className={`${
                      isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                    } px-4 py-2 rounded-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    title="Add custom category"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                } focus:outline-none focus:ring-2`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add tags (press Enter)"
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                } focus:outline-none focus:ring-2`}
              />
              <button
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className={`${
                  tagInput.trim()
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

            {selectedTaskTags && selectedTaskTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTaskTags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      isDarkMode ? "bg-violet-900 text-violet-200" : "bg-violet-100 text-violet-800"
                    }`}
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 p-0.5 rounded-full hover:bg-violet-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
              Subtasks
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && subtaskInput.trim()) {
                    e.preventDefault()
                    handleAddSubtask()
                  }
                }}
                placeholder="Add subtask (press Enter)"
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                } focus:outline-none focus:ring-2`}
              />
              <button
                onClick={handleAddSubtask}
                disabled={!subtaskInput.trim()}
                className={`${
                  subtaskInput.trim()
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

            {subtasks.length > 0 && (
              <div
                className={`mt-3 pl-6 space-y-1 ${
                  isDarkMode ? "border-l border-gray-600" : "border-l border-gray-300"
                }`}
              >
                {subtasks.map((subtask, index) => (
                  <div key={subtask.id || index} className="flex items-center text-sm group">
                    <span className={`mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <Circle size={14} />
                    </span>
                    <span className="flex-1">{subtask.text}</span>
                    <button
                      onClick={() => handleRemoveSubtask(subtask.id || index)}
                      className={`p-1 rounded-full opacity-0 group-hover:opacity-100 ${
                        isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                      }`}
                    >
                      <X size={14} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
                Reminder
              </label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                } focus:outline-none focus:ring-2`}
              >
                <option value="">No reminder</option>
                <option value="10min">10 minutes before</option>
                <option value="30min">30 minutes before</option>
                <option value="1hour">1 hour before</option>
                <option value="1day">1 day before</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-700"} mb-1`}>
                Recurring
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-violet-200 focus:ring-violet-500"
                } focus:outline-none focus:ring-2`}
              >
                <option value="none">Not recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                setTitle("")
                setDescription("")
                setDueDate("")
                setStartDate("")
                setCategory("")
                setPriority("medium")
                setTagInput("")
                setSubtasks([])
                setReminder("")
                setRecurring("none")
              }}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTask}
              disabled={!title.trim()}
              className={`px-4 py-2 rounded-lg ${
                title.trim()
                  ? isDarkMode
                    ? "bg-violet-700 hover:bg-violet-800 text-white"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
                  : isDarkMode
                    ? "bg-gray-700 cursor-not-allowed text-gray-500"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
            >
              {editingId ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
