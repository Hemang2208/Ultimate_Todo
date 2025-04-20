"use client"
import { List, Calendar, BarChart2, ChevronRight, ChevronLeft, ArrowUp, ArrowDown, Tag } from "lucide-react"

const Sidebar = ({
  isDarkMode,
  view,
  setView,
  filter,
  setFilter,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  tags,
  selectedTags,
  handleToggleTag,
}) => {
  return (
    <div className="md:w-1/4 space-y-6">
      {/* View Selector */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm`}>
        <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-violet-900"} mb-3`}>Views</h2>
        <div className="space-y-1">
          <button
            onClick={() => setView("list")}
            className={`w-full flex items-center px-3 py-2 rounded-lg ${
              view === "list"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-100 text-violet-800"
                : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
            }`}
          >
            <List size={18} className="mr-2" /> Task List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`w-full flex items-center px-3 py-2 rounded-lg ${
              view === "calendar"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-100 text-violet-800"
                : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
            }`}
          >
            <Calendar size={18} className="mr-2" /> Calendar
          </button>
          <button
            onClick={() => setView("stats")}
            className={`w-full flex items-center px-3 py-2 rounded-lg ${
              view === "stats"
                ? isDarkMode
                  ? "bg-violet-700 text-white"
                  : "bg-violet-100 text-violet-800"
                : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
            }`}
          >
            <BarChart2 size={18} className="mr-2" /> Statistics
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm`}>
        <div className="flex justify-between items-center mb-3">
          <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-violet-900"}`}>Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            {showFilters ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {showFilters && (
          <>
            <div className="space-y-1 mb-4">
              <button
                onClick={() => setFilter("all")}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  filter === "all"
                    ? isDarkMode
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-800"
                    : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  filter === "active"
                    ? isDarkMode
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-800"
                    : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  filter === "completed"
                    ? isDarkMode
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-800"
                    : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("today")}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  filter === "today"
                    ? isDarkMode
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-800"
                    : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  filter === "upcoming"
                    ? isDarkMode
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-800"
                    : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter("overdue")}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${
                  filter === "overdue"
                    ? isDarkMode
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-800"
                    : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                Overdue
              </button>
            </div>

            <div className="mb-4">
              <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-2`}>
                Sort By
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSortBy("dueDate")
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                    sortBy === "dueDate"
                      ? isDarkMode
                        ? "bg-violet-700 text-white"
                        : "bg-violet-100 text-violet-800"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Due Date
                  {sortBy === "dueDate" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp size={14} className="ml-1" />
                    ) : (
                      <ArrowDown size={14} className="ml-1" />
                    ))}
                </button>
                <button
                  onClick={() => {
                    setSortBy("priority")
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                    sortBy === "priority"
                      ? isDarkMode
                        ? "bg-violet-700 text-white"
                        : "bg-violet-100 text-violet-800"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Priority
                  {sortBy === "priority" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp size={14} className="ml-1" />
                    ) : (
                      <ArrowDown size={14} className="ml-1" />
                    ))}
                </button>
                <button
                  onClick={() => {
                    setSortBy("title")
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                    sortBy === "title"
                      ? isDarkMode
                        ? "bg-violet-700 text-white"
                        : "bg-violet-100 text-violet-800"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Title
                  {sortBy === "title" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp size={14} className="ml-1" />
                    ) : (
                      <ArrowDown size={14} className="ml-1" />
                    ))}
                </button>
              </div>
            </div>

            {tags.length > 0 && (
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-violet-800"} mb-2`}>
                  Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2 py-1 rounded-full text-xs flex items-center ${
                        selectedTags.includes(tag)
                          ? isDarkMode
                            ? "bg-violet-700 text-white"
                            : "bg-violet-600 text-white"
                          : isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar
