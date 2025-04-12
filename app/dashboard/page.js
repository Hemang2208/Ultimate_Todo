"use client";

import gsap from "gsap";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  List,
  Calendar,
  BarChart2,
  CheckCircle,
  Circle,
  Timer,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Moon,
  Sun,
  Search,
  ArrowUp,
  ArrowDown,
  Tag,
  Clock,
  Bookmark,
  Repeat,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import Navbar from "../components/Navbar";

const UltimateTodoApp = () => {
  // Core states
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTaskTags, setSelectedTaskTags] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminder, setReminder] = useState("");
  const [recurring, setRecurring] = useState("none");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [categories, setCategories] = useState([
    "Work",
    "Personal",
    "Study",
    "Health",
    "Shopping",
  ]);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Add useEffect for handling mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        // sm breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile menu handlers
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // View states
  const [view, setView] = useState("list");
  const [calendarView, setCalendarView] = useState("month");

  // Productivity feature states
  const [goals, setGoals] = useState({ daily: [], weekly: [] });
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goalType, setGoalType] = useState("daily");
  const [goalInput, setGoalInput] = useState("");

  // Pomodoro timer states
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentTask, setCurrentTask] = useState(null);
  const timerRef = useRef(null);

  // Router for navigation
  const router = useRouter();
  const pathname = usePathname();

  // GSAP animations
  useEffect(() => {
    if (navbarRef.current) {
      gsap.from(navbarRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.from(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Stats state
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    completedByCategory: {},
    completedByPriority: {},
    streak: 0,
    lastCompletedDate: "",
  });

  // Check authentication and load todos from localStorage on component mount
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login page if no token is found
      router.push("/user/login");
      return;
    }

    const savedTodos = localStorage.getItem("todos");
    const savedGoals = localStorage.getItem("goals");
    const savedTags = localStorage.getItem("tags");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedTags) setTags(JSON.parse(savedTags));
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));

    document.body.className = savedDarkMode === "true" ? "dark" : "";
  }, [router]);

  // Apply filters and sort to todos
  const applyFiltersAndSort = useCallback(() => {
    let result = [...todos];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          (todo.description && todo.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filter === "completed") {
      result = result.filter((todo) => todo.isCompleted);
    } else if (filter === "active") {
      result = result.filter((todo) => !todo.isCompleted);
    } else if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter((todo) => todo.dueDate === today);
    } else if (filter === "upcoming") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(
        (todo) => !todo.isCompleted && todo.dueDate > today
      );
    } else if (filter === "overdue") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(
        (todo) => !todo.isCompleted && todo.dueDate < today
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      result = result.filter((todo) =>
        selectedTags.every((tag) => todo.tags && todo.tags.includes(tag))
      );
    }

    // Apply sort
    result.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "dueDate") {
        aValue = a.dueDate || "9999-12-31";
        bValue = b.dueDate || "9999-12-31";
      } else if (sortBy === "priority") {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        aValue = priorityValues[a.priority] || 0;
        bValue = priorityValues[b.priority] || 0;
      } else if (sortBy === "title") {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      } else if (sortBy === "category") {
        aValue = a.category || "";
        bValue = b.category || "";
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTodos(result);
  }, [todos, filter, searchQuery, sortBy, sortDirection, selectedTags]);

  // Save todos to localStorage when todos state changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    applyFiltersAndSort();
  }, [todos, applyFiltersAndSort]);

  // Save goals to localStorage when goals state changes
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // Save tags to localStorage when tags state changes
  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    document.body.className = isDarkMode ? "dark" : "";
  }, [isDarkMode]);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("todoStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Update stats when todos change
  useEffect(() => {
    if (todos.length > 0) {
      const completed = todos.filter((todo) => todo.isCompleted).length;
      const completedByCategory = {};
      const completedByPriority = {};

      todos.forEach((todo) => {
        if (todo.isCompleted) {
          // Count by category
          if (todo.category) {
            completedByCategory[todo.category] =
              (completedByCategory[todo.category] || 0) + 1;
          }

          // Count by priority
          if (todo.priority) {
            completedByPriority[todo.priority] =
              (completedByPriority[todo.priority] || 0) + 1;
          }
        }
      });

      // Check streak
      let streak = stats.streak;
      const today = new Date().toDateString();
      const lastCompleted = stats.lastCompletedDate;

      if (completed > 0 && lastCompleted !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (lastCompleted === yesterdayString) {
          streak += 1;
        } else if (lastCompleted !== today) {
          streak = 1;
        }
      }

      const newStats = {
        completed,
        total: todos.length,
        completedByCategory,
        completedByPriority,
        streak,
        lastCompletedDate: completed > 0 ? today : lastCompleted,
      };

      setStats(newStats);
      localStorage.setItem("todoStats", JSON.stringify(newStats));
    }
  }, [todos, stats.streak, stats.lastCompletedDate]);

  // Pomodoro timer effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);

            // Switch modes when timer ends
            if (timerMode === "work") {
              setTimerMode("shortBreak");
              setTimeLeft(5 * 60); // 5 minute break

              // Play notification sound
              const audio = new Audio(
                "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
              );
              audio.play().catch((e) => console.log("Audio play failed:", e));

              // Show browser notification if available
              if (
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification("Break Time!", {
                  body: "Time to take a short break.",
                });
              }
            } else if (timerMode === "shortBreak") {
              setTimerMode("work");
              setTimeLeft(25 * 60); // Back to work

              // Play notification sound
              const audio = new Audio(
                "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
              );
              audio.play().catch((e) => console.log("Audio play failed:", e));

              // Show browser notification if available
              if (
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification("Work Time!", {
                  body: "Break is over, back to work!",
                });
              }
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, timerMode]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  // Check for recurring tasks and update them if needed
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedTodos = todos.map((todo) => {
      if (todo.recurring && todo.recurring !== "none" && todo.isCompleted) {
        const dueDateTime = new Date(todo.dueDate);
        dueDateTime.setHours(0, 0, 0, 0);

        if (dueDateTime <= today) {
          let newDueDate = new Date(dueDateTime);

          // Calculate the next occurrence based on recurrence pattern
          if (todo.recurring === "daily") {
            newDueDate.setDate(newDueDate.getDate() + 1);
          } else if (todo.recurring === "weekly") {
            newDueDate.setDate(newDueDate.getDate() + 7);
          } else if (todo.recurring === "monthly") {
            newDueDate.setMonth(newDueDate.getMonth() + 1);
          }

          // Reset completion status and update due date
          return {
            ...todo,
            isCompleted: false,
            dueDate: newDueDate.toISOString().split("T")[0],
            subtasks: todo.subtasks
              ? todo.subtasks.map((st) => ({ ...st, completed: false }))
              : [],
          };
        }
      }
      return todo;
    });

    if (JSON.stringify(updatedTodos) !== JSON.stringify(todos)) {
      setTodos(updatedTodos);
    }
  }, [todos]);

  // Format time for Pomodoro timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle adding a new tag to a task
  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const newTag = tagInput.trim();

    // Add to global tags if it doesn't exist
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }

    setTagInput("");
  };

  // Handle toggling a tag selection for filtering
  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const startPomodoro = () => {
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          // Handle timer completion
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Add this function with your other functions in the component
  const switchTimerMode = (mode) => {
    setTimerMode(mode);

    // Reset timer based on the selected mode
    if (mode === "work") {
      setTimeLeft(25 * 60); // 25 minutes for work
    } else if (mode === "shortBreak") {
      setTimeLeft(5 * 60); // 5 minutes for short break
    } else if (mode === "longBreak") {
      setTimeLeft(15 * 60); // 15 minutes for long break
    }

    // If timer is running, stop it and restart with new time
    if (timerRunning) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // In your pausePomodoro function
  const pausePomodoro = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
  };

  // In your resetPomodoro function
  const resetPomodoro = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    // Reset to the appropriate time based on the current mode
    if (timerMode === "work") {
      setTimeLeft(25 * 60);
    } else if (timerMode === "shortBreak") {
      setTimeLeft(5 * 60);
    } else {
      setTimeLeft(15 * 60);
    }
  };

  // Start Pomodoro timer for a specific task
  const startTimer = (taskId) => {
    const task = todos.find((todo) => todo.id === taskId);
    if (task) {
      setCurrentTask(task);
      setTimerMode("work");
      setTimeLeft(25 * 60);
      setTimerActive(true);
    }
  };

  // Reset Pomodoro timer
  const resetTimer = () => {
    setTimerActive(false);
    if (timerMode === "work") {
      setTimeLeft(25 * 60);
    } else if (timerMode === "shortBreak") {
      setTimeLeft(5 * 60);
    }
  };

  // Add a new goal
  const handleAddGoal = () => {
    if (!goalInput.trim()) return;

    const newGoal = {
      id: Date.now(),
      text: goalInput,
      completed: false,
    };

    setGoals({
      ...goals,
      [goalType]: [...goals[goalType], newGoal],
    });

    setGoalInput("");
  };

  // Toggle a goal's completion status
  const toggleGoalCompleted = (type, id) => {
    setGoals({
      ...goals,
      [type]: goals[type].map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ),
    });
  };

  // Add a new subtask
  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;

    const newSubtask = {
      id: Date.now(),
      text: subtaskInput,
      completed: false,
    };

    setSubtasks([...subtasks, newSubtask]);
    setSubtaskInput("");
  };

  // Toggle a subtask's completion status
  const toggleSubtaskCompleted = (id) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    );
  };

  // Handle task form submission
  const handleSaveTask = () => {
    if (!title.trim()) return;

    if (editingId) {
      // Update existing task
      setTodos(
        todos.map((todo) =>
          todo.id === editingId
            ? {
                ...todo,
                title,
                description,
                dueDate,
                startDate,
                category,
                priority,
                tags: selectedTaskTags || [], // Use selectedTaskTags instead of tagInput
                subtasks,
                reminder,
                recurring,
                updatedAt: new Date().toISOString(),
              }
            : todo
        )
      );
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        title,
        description,
        dueDate,
        startDate,
        category,
        priority,
        tags: selectedTaskTags || [], // Use selectedTaskTags instead of tagInput
        subtasks,
        reminder,
        recurring,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTodos([...todos, newTask]);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
    setStartDate("");
    setCategory("");
    setPriority("medium");
    setTagInput("");
    setSelectedTaskTags([]); // Reset selectedTaskTags
    setSubtasks([]);
    setReminder("");
    setRecurring("none");
    setEditingId(null);
    setShowAddForm(false);
  };

  // Handle deleting a task
  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Edit a task
  const handleEdit = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setDueDate(todo.dueDate || "");
      setStartDate(todo.startDate || "");
      setCategory(todo.category || "");
      setPriority(todo.priority || "medium");
      setSubtasks(todo.subtasks || []);
      setReminder(todo.reminder || "");
      setRecurring(todo.recurring || "none");
      setEditingId(id);
      setShowAddForm(true);
    }
  };

  // Toggle task completion status
  const toggleCompleted = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  // Handle drag start for task reordering
  const handleDragStart = (id) => {
    setIsDragging(true);
    setDraggedTaskId(id);
  };

  // Handle drag over for task reordering
  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id === draggedTaskId) return;

    const draggedItemIndex = filteredTodos.findIndex(
      (todo) => todo.id === draggedTaskId
    );
    const targetIndex = filteredTodos.findIndex((todo) => todo.id === id);

    if (draggedItemIndex === -1 || targetIndex === -1) return;

    // Reorder the filtered todos
    const newFilteredTodos = [...filteredTodos];
    const [removed] = newFilteredTodos.splice(draggedItemIndex, 1);
    newFilteredTodos.splice(targetIndex, 0, removed);
    setFilteredTodos(newFilteredTodos);

    // Update the original todos list based on the new order
    const newTodos = [];
    const filteredIds = new Set(newFilteredTodos.map((todo) => todo.id));

    // First add all reordered filtered todos
    newFilteredTodos.forEach((todo) => {
      newTodos.push(todo);
    });

    // Then add any todos that weren't in the filtered list
    todos.forEach((todo) => {
      if (!filteredIds.has(todo.id)) {
        newTodos.push(todo);
      }
    });

    setTodos(newTodos);
  };

  // Handle drag end for task reordering
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTaskId(null);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Add a custom category
  const handleAddCustomCategory = () => {
    if (!customCategory.trim() || categories.includes(customCategory)) {
      setShowCustomCategoryInput(false);
      setCustomCategory("");
      return;
    }

    setCategories([...categories, customCategory]);
    setCategory(customCategory);
    setShowCustomCategoryInput(false);
    setCustomCategory("");
  };

  // Navbar Code
  <Navbar />;

  // Render the Pomodoro timer component
  const renderPomodoroTimer = () => {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-violet-50"
        } rounded-xl p-6`}
      >
        <h2
          className={`text-xl font-semibold ${
            isDarkMode ? "text-white" : "text-violet-900"
          } mb-2`}
        >
          Pomodoro Timer
        </h2>

        <div className="text-center mb-4">
          <div
            className={`text-4xl font-bold ${
              isDarkMode ? "text-white" : "text-violet-800"
            } mb-2`}
          >
            {formatTime(timeLeft)}
          </div>

          <div
            className={`${
              isDarkMode ? "text-gray-300" : "text-violet-700"
            } mb-2`}
          >
            {timerMode === "work" ? "Focus Time" : "Break Time"}
            {currentTask && <span> - {currentTask.title}</span>}
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`${
                isDarkMode
                  ? "bg-violet-700 hover:bg-violet-800"
                  : "bg-violet-600 hover:bg-violet-700"
              } px-4 py-2 rounded-lg text-white`}
            >
              {timerActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className={`${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-violet-200 hover:bg-violet-300"
              } px-4 py-2 rounded-lg ${
                isDarkMode ? "text-white" : "text-violet-800"
              }`}
            >
              Reset
            </button>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setTimerMode("work");
                setTimeLeft(25 * 60);
                setTimerActive(false);
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
                setTimerMode("shortBreak");
                setTimeLeft(5 * 60);
                setTimerActive(false);
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
    );
  };

  // Render the goals component
  const renderGoals = () => {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-violet-50"
        } rounded-xl p-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-violet-900"
            }`}
          >
            Goals
          </h2>
          <button
            onClick={() => setShowGoalsModal(true)}
            className={`${
              isDarkMode
                ? "bg-violet-700 hover:bg-violet-800"
                : "bg-violet-600 hover:bg-violet-700"
            } p-2 rounded-full text-white`}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3
              className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-violet-800"
              } mb-2`}
            >
              Daily Goals
            </h3>
            {goals.daily.length === 0 ? (
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-violet-600"
                }`}
              >
                No daily goals set
              </p>
            ) : (
              <ul className="space-y-2">
                {goals.daily.map((goal) => (
                  <li
                    key={goal.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleGoalCompleted("daily", goal.id)}
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-violet-600"
                        } mr-2`}
                      >
                        {goal.completed ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>
                      <span
                        className={
                          goal.completed
                            ? `line-through ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`
                            : ""
                        }
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
            <h3
              className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-violet-800"
              } mb-2`}
            >
              Weekly Goals
            </h3>
            {goals.weekly.length === 0 ? (
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-violet-600"
                }`}
              >
                No weekly goals set
              </p>
            ) : (
              <ul className="space-y-2">
                {goals.weekly.map((goal) => (
                  <li
                    key={goal.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleGoalCompleted("weekly", goal.id)}
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-violet-600"
                        } mr-2`}
                      >
                        {goal.completed ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>
                      <span
                        className={
                          goal.completed
                            ? `line-through ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`
                            : ""
                        }
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
    );
  };

  // Render subtasks section in the task form
  const renderSubtasksSection = () => {
    return (
      <div className="space-y-2">
        <label
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-violet-700"
          } mb-1`}
        >
          Subtasks
        </label>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            placeholder="Add a subtask"
            className={`flex-1 px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-violet-200 focus:ring-violet-500"
            } focus:outline-none focus:ring-2`}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSubtask();
              }
            }}
          />
          <button
            onClick={handleAddSubtask}
            disabled={!subtaskInput.trim()}
            className={`${
              isDarkMode
                ? "bg-violet-700 hover:bg-violet-800 disabled:bg-gray-600"
                : "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300"
            } px-4 py-2 rounded-lg text-white disabled:cursor-not-allowed`}
          >
            <Plus size={18} />
          </button>
        </div>

        {subtasks.length > 0 && (
          <ul
            className={`pl-2 space-y-2 ${
              isDarkMode
                ? "border-l-2 border-gray-700"
                : "border-l-2 border-violet-200"
            }`}
          >
            {subtasks.map((subtask) => (
              <li
                key={subtask.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggleSubtaskCompleted(subtask.id)}
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-violet-600"
                    } mr-2`}
                  >
                    {subtask.completed ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <span
                    className={
                      subtask.completed
                        ? `line-through ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`
                        : ""
                    }
                  >
                    {subtask.text}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSubtasks(subtasks.filter((st) => st.id !== subtask.id));
                  }}
                  className={`${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Render tags section
  const renderTagsSection = () => {
    return (
      <div className="space-y-2">
        <label
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-violet-700"
          } mb-1`}
        >
          Tags
        </label>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            className={`flex-1 px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-violet-200 focus:ring-violet-500"
            } focus:outline-none focus:ring-2`}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <button
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            className={`${
              isDarkMode
                ? "bg-violet-700 hover:bg-violet-800 disabled:bg-gray-600"
                : "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300"
            } px-4 py-2 rounded-lg text-white disabled:cursor-not-allowed`}
          >
            <Plus size={18} />
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-1 rounded-full text-xs flex items-center ${
                  isDarkMode
                    ? "bg-violet-900 text-violet-200"
                    : "bg-violet-100 text-violet-800"
                }`}
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render calendar view
  const renderCalendarView = () => {
    // Calculate calendar data
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    // Get first day of month and total days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Generate days array with task counts
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Create days for previous month to fill the first row
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(
        currentYear,
        currentMonth,
        -startingDayOfWeek + i + 1
      );
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        hasTask: false,
        tasks: [],
      });
    }

    // Create days for current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateString = date.toISOString().split("T")[0];
      const dayTasks = todos.filter((todo) => todo.dueDate === dateString);

      days.push({
        date,
        isCurrentMonth: true,
        hasTask: dayTasks.length > 0,
        tasks: dayTasks,
      });
    }

    // Fill the last row with next month's days
    const daysNeeded = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= daysNeeded; i++) {
      const nextMonthDay = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        hasTask: false,
        tasks: [],
      });
    }

    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-2xl p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-violet-900"
              }`}
            >
              {selectedDate.toLocaleString("default", { month: "long" })}{" "}
              {selectedDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
                className={`p-1 rounded-full ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-violet-100 text-violet-800"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
                className={`p-1 rounded-full ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-violet-100 text-violet-800"
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
                  className={`text-center text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isToday =
                  day.date.toDateString() === new Date().toDateString();

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
                      setSelectedDate(day.date);
                      setCalendarView("day");
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`${
                          isToday
                            ? isDarkMode
                              ? "text-white font-bold"
                              : "text-violet-800 font-bold"
                            : ""
                        }`}
                      >
                        {day.date.getDate()}
                      </span>
                      {day.hasTask && (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isDarkMode ? "bg-violet-500" : "bg-violet-600"
                          }`}
                        ></div>
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
                        {day.tasks.length > 2 && (
                          <div className="text-xs text-center">
                            +{day.tasks.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {calendarView === "week" && (
          <div>
            {/* Week view implementation */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date(selectedDate);
                const currentDay = date.getDay();
                const diff = i - currentDay;
                date.setDate(date.getDate() + diff);

                const dateString = date.toISOString().split("T")[0];
                const dayTasks = todos.filter(
                  (todo) => todo.dueDate === dateString
                );
                const isToday =
                  date.toDateString() === new Date().toDateString();

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
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {date.toLocaleString("default", { weekday: "short" })}
                      </div>
                      <div className="font-medium">{date.getDate()}</div>
                    </div>

                    <div
                      className={`h-64 overflow-y-auto p-2 rounded-b-lg ${
                        isDarkMode
                          ? "bg-gray-800"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {dayTasks.length === 0 ? (
                        <div
                          className={`text-center text-xs italic mt-4 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
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
                );
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
                <h3
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-violet-900"
                  }`}
                >
                  {selectedDate.toLocaleString("default", { weekday: "long" })},{" "}
                  {selectedDate.getDate()}{" "}
                  {selectedDate.toLocaleString("default", { month: "long" })}
                </h3>
              </div>

              <div
                className={`rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
                } p-4`}
              >
                {(() => {
                  const dateString = selectedDate.toISOString().split("T")[0];
                  const dayTasks = todos.filter(
                    (todo) => todo.dueDate === dateString
                  );

                  if (dayTasks.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <div
                          className={`text-5xl mb-4 ${
                            isDarkMode ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
                          📅
                        </div>
                        <h4
                          className={`text-xl font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          No tasks for this day
                        </h4>
                        <button
                          onClick={() => {
                            setShowAddForm(true);
                            setDueDate(dateString);
                          }}
                          className={`mt-4 px-4 py-2 rounded-lg ${
                            isDarkMode
                              ? "bg-violet-700 hover:bg-violet-800 text-white"
                              : "bg-violet-600 hover:bg-violet-700 text-white"
                          }`}
                        >
                          Add Task
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      <h4
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Tasks for Today
                      </h4>
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-50"
                          } flex items-start`}
                        >
                          <button
                            onClick={() => toggleCompleted(task.id)}
                            className="mr-3 mt-1"
                          >
                            {task.isCompleted ? (
                              <CheckCircle
                                size={20}
                                className="text-green-500"
                              />
                            ) : (
                              <Circle
                                size={20}
                                className={
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }
                              />
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

                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.priority && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(
                                    task.priority,
                                    isDarkMode
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              )}

                              {task.category && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                    isDarkMode
                                      ? "bg-gray-600 text-gray-200"
                                      : "bg-gray-200 text-gray-800"
                                  }`}
                                >
                                  <Bookmark size={12} className="mr-1" />
                                  {task.category}
                                </span>
                              )}

                              {task.tags &&
                                task.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                      isDarkMode
                                        ? "bg-violet-900 text-violet-200"
                                        : "bg-violet-100 text-violet-800"
                                    }`}
                                  >
                                    <Tag size={12} className="mr-1" />
                                    {tag}
                                  </span>
                                ))}
                            </div>

                            {task.subtasks && task.subtasks.length > 0 && (
                              <div
                                className={`mt-3 pl-6 space-y-1 ${
                                  isDarkMode
                                    ? "border-l border-gray-600"
                                    : "border-l border-gray-300"
                                }`}
                              >
                                {task.subtasks.map((subtask) => (
                                  <div
                                    key={subtask.id}
                                    className="flex items-center text-sm"
                                  >
                                    <span
                                      className={
                                        subtask.completed
                                          ? "text-green-500 mr-2"
                                          : `${
                                              isDarkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            } mr-2`
                                      }
                                    >
                                      {subtask.completed ? (
                                        <CheckCircle size={14} />
                                      ) : (
                                        <Circle size={14} />
                                      )}
                                    </span>
                                    <span
                                      className={
                                        subtask.completed
                                          ? "line-through text-gray-500"
                                          : ""
                                      }
                                    >
                                      {subtask.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(task.id)}
                              className={`p-2 rounded-full ${
                                isDarkMode
                                  ? "hover:bg-gray-600"
                                  : "hover:bg-gray-200"
                              }`}
                            >
                              <Edit
                                size={18}
                                className={
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className={`p-2 rounded-full ${
                                isDarkMode
                                  ? "hover:bg-gray-600"
                                  : "hover:bg-gray-200"
                              }`}
                            >
                              <Trash2
                                size={18}
                                className={
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to get priority color based on priority value
  const getPriorityColor = (priority, isDark) => {
    if (priority === "high") {
      return isDark ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800";
    } else if (priority === "medium") {
      return isDark
        ? "bg-yellow-900 text-yellow-100"
        : "bg-yellow-100 text-yellow-800";
    } else {
      return isDark ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800";
    }
  };

  // Helper function to get priority badge color
  const getPriorityBadgeColor = (priority, isDark) => {
    if (priority === "high") {
      return isDark ? "bg-red-900 text-red-200" : "bg-red-200 text-red-800";
    } else if (priority === "medium") {
      return isDark
        ? "bg-yellow-900 text-yellow-200"
        : "bg-yellow-200 text-yellow-800";
    } else {
      return isDark ? "bg-blue-900 text-blue-200" : "bg-blue-200 text-blue-800";
    }
  };

  // Render statistics view
  const renderStatsView = () => {
    // Calculate completion rate
    const completionRate =
      stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    // Calculate tasks by category
    const tasksByCategory = {};
    todos.forEach((todo) => {
      if (todo.category) {
        tasksByCategory[todo.category] =
          (tasksByCategory[todo.category] || 0) + 1;
      }
    });

    // Calculate tasks by priority
    const tasksByPriority = {
      high: todos.filter((todo) => todo.priority === "high").length,
      medium: todos.filter((todo) => todo.priority === "medium").length,
      low: todos.filter((todo) => todo.priority === "low").length,
    };

    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-2xl p-6`}
      >
        <div className="mb-8">
          <h2
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-white" : "text-violet-900"
            } mb-6`}
          >
            Productivity Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Completion Rate */}
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-violet-50"
              } rounded-xl p-4 text-center`}
            >
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-violet-800"
                } mb-1`}
              >
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
                <div
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-violet-800"
                  }`}
                >
                  {completionRate}%
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-6">
                <div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Completed
                  </div>
                  <div
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-violet-900"
                    }`}
                  >
                    {stats.completed}
                  </div>
                </div>
                <div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total
                  </div>
                  <div
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-violet-900"
                    }`}
                  >
                    {stats.total}
                  </div>
                </div>
              </div>
            </div>

            {/* Productivity Streak */}
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-violet-50"
              } rounded-xl p-4 text-center`}
            >
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-violet-800"
                } mb-1`}
              >
                Current Streak
              </h3>
              <div className="flex items-center justify-center h-24">
                <div
                  className={`text-5xl font-bold ${
                    isDarkMode ? "text-white" : "text-violet-800"
                  }`}
                >
                  {stats.streak}
                </div>
                <div
                  className={`text-lg ml-2 ${
                    isDarkMode ? "text-gray-300" : "text-violet-700"
                  }`}
                >
                  days
                </div>
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {stats.streak > 0
                  ? "Keep up the good work!"
                  : "Complete a task today to start a streak!"}
              </div>
            </div>

            {/* Tasks by Priority */}
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-violet-50"
              } rounded-xl p-4`}
            >
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-violet-800"
                } mb-3`}
              >
                Tasks by Priority
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div
                    className={`w-full bg-gray-200 rounded-full h-2.5 ${
                      isDarkMode ? "bg-gray-600" : ""
                    }`}
                  >
                    <div
                      className="bg-red-500 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (tasksByPriority.high / stats.total) * 100 || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    High ({tasksByPriority.high})
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-full bg-gray-200 rounded-full h-2.5 ${
                      isDarkMode ? "bg-gray-600" : ""
                    }`}
                  >
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (tasksByPriority.medium / stats.total) * 100 || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Medium ({tasksByPriority.medium})
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-full bg-gray-200 rounded-full h-2.5 ${
                      isDarkMode ? "bg-gray-600" : ""
                    }`}
                  >
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (tasksByPriority.low / stats.total) * 100 || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Low ({tasksByPriority.low})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks by Category */}
          <div
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-violet-50"
            } rounded-xl p-6 mt-6`}
          >
            <h3
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-violet-800"
              } mb-3`}
            >
              Tasks by Category
            </h3>

            {Object.keys(tasksByCategory).length === 0 ? (
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No categorized tasks yet
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(tasksByCategory).map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {category}
                    </span>
                    <div className="flex items-center">
                      <div
                        className={`h-2 rounded-full ${
                          isDarkMode ? "bg-violet-600" : "bg-violet-500"
                        }`}
                        style={{ width: `${Math.min(count * 10, 100)}px` }}
                      ></div>
                      <span
                        className={`ml-2 text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render the main app layout
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        ref={navbarRef}
        className={`sticky top-0 z-50 py-4 px-6 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } shadow-sm transition-colors duration-300`}
      >
        <div className="container mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center">
              <h1
                onClick={() => router.push("/")}
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-violet-700"
                } cursor-pointer transition-colors duration-300 hover:text-violet-500`}
              >
                Ultimate Todo
              </h1>
            </div>

            <div className="flex items-center cursor-pointer justify-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 cursor-pointer py-2 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 focus:border-violet-500"
                      : "bg-gray-50 border-gray-200 focus:border-violet-500"
                  } border focus:outline-none focus:ring-2 focus:ring-violet-500`}
                />
                <Search
                  size={18}
                  className={`absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>

              <button
                onClick={toggleDarkMode}
                className={`p-2 cursor-pointer rounded-full transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-amber-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => router.push("/user/profile")}
                className={`px-4 cursor-pointer py-2 rounded-lg flex items-center transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-violet-800 hover:bg-violet-700"
                    : "bg-violet-600 hover:bg-violet-700"
                } text-white`}
              >
                <User size={18} className="mr-1" /> Profile
              </button>

              <button
                onClick={() => router.push("/user/logout")}
                className={`px-4 cursor-pointer py-2 rounded-lg flex items-center transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-violet-800 hover:bg-violet-700"
                    : "bg-violet-600 hover:bg-violet-700"
                } text-white`}
              >
                <LogOut size={18} className="mr-1" /> Logout
              </button>

              <button
                onClick={() => router.push("/tasks/new")}
                className={`px-4 cursor-pointer py-2 rounded-lg flex items-center transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-violet-800 hover:bg-violet-700"
                    : "bg-violet-600 hover:bg-violet-700"
                } text-white`}
              >
                <Plus size={18} className="mr-1" /> Add Task
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex justify-between items-center">
              <h1
                onClick={() => router.push("/")}
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-violet-700"
                } cursor-pointer`}
              >
                Ultimate Todo
              </h1>
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-lg ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="transition-transform duration-300" />
                ) : (
                  <Menu
                    size={24}
                    className="transition-transform duration-300"
                  />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className={`mt-4 py-4 px-4 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                } shadow-lg`}
              >
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg transition-all duration-300 ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600 focus:border-violet-500"
                          : "bg-white border-gray-200 focus:border-violet-500"
                      } border focus:outline-none focus:ring-2 focus:ring-violet-500`}
                    />
                    <Search
                      size={18}
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>

                  <button
                    onClick={() => {
                      router.push("/tasks/new");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-violet-800 hover:bg-violet-700"
                        : "bg-violet-600 hover:bg-violet-700"
                    } text-white`}
                  >
                    <Plus size={18} className="mr-2" /> Add Task
                  </button>

                  <button
                    onClick={toggleDarkMode}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun size={18} className="mr-2" /> Light Mode
                      </>
                    ) : (
                      <>
                        <Moon size={18} className="mr-2" /> Dark Mode
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/user/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-violet-800 hover:bg-violet-700"
                        : "bg-violet-600 hover:bg-violet-700"
                    } text-white`}
                  >
                    <User size={18} className="mr-2" /> Profile
                  </button>

                  <button
                    onClick={() => {
                      router.push("/user/logout");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-violet-800 hover:bg-violet-700"
                        : "bg-violet-600 hover:bg-violet-700"
                    } text-white`}
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4 space-y-6">
            {/* View Selector */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-4 shadow-sm`}
            >
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-violet-900"
                } mb-3`}
              >
                Views
              </h2>
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
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-4 shadow-sm`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-violet-900"
                  }`}
                >
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1 rounded ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {showFilters ? (
                    <ChevronRight size={18} />
                  ) : (
                    <ChevronLeft size={18} />
                  )}
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
                    <h3
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-violet-800"
                      } mb-2`}
                    >
                      Sort By
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSortBy("dueDate");
                          setSortDirection(
                            sortDirection === "asc" ? "desc" : "asc"
                          );
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
                          setSortBy("priority");
                          setSortDirection(
                            sortDirection === "asc" ? "desc" : "asc"
                          );
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
                          setSortBy("title");
                          setSortDirection(
                            sortDirection === "asc" ? "desc" : "asc"
                          );
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
                      <h3
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-violet-800"
                        } mb-2`}
                      >
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

            {/* Pomodoro Timer */}
            {renderPomodoroTimer()}

            {/* Goals */}
            {renderGoals()}
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
            {view === "list" && (
              <div
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl p-6 shadow-sm`}
              >
                <h2
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-violet-900"
                  } mb-6`}
                >
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

                {filteredTodos.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className={`text-5xl mb-4 ${
                        isDarkMode ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      📝
                    </div>
                    <h3
                      className={`text-xl font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      No tasks found
                    </h3>
                    <p
                      className={`mt-2 ${
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {filter === "all"
                        ? "Add a new task to get started"
                        : `No ${filter} tasks available`}
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className={`mt-4 px-4 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-violet-700 hover:bg-violet-800 text-white"
                          : "bg-violet-600 hover:bg-violet-700 text-white"
                      }`}
                    >
                      <Plus size={18} className="inline mr-1" /> Add Task
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <li
                        key={todo.id}
                        draggable
                        onDragStart={() => handleDragStart(todo.id)}
                        onDragOver={(e) => handleDragOver(e, todo.id)}
                        onDragEnd={handleDragEnd}
                        className={`p-4 rounded-lg ${
                          isDragging && draggedTaskId === todo.id
                            ? isDarkMode
                              ? "bg-gray-700 border-2 border-violet-500"
                              : "bg-violet-50 border-2 border-violet-500"
                            : isDarkMode
                            ? "bg-gray-700"
                            : "bg-gray-50"
                        } flex items-start`}
                      >
                        <button
                          onClick={() => toggleCompleted(todo.id)}
                          className="mr-3 mt-1"
                        >
                          {todo.isCompleted ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <Circle
                              size={20}
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            />
                          )}
                        </button>

                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              todo.isCompleted
                                ? "line-through text-gray-500"
                                : isDarkMode
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            {todo.title}
                          </h3>

                          {todo.description && (
                            <p
                              className={`text-sm mt-1 ${
                                todo.isCompleted
                                  ? "line-through text-gray-500"
                                  : isDarkMode
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {todo.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mt-2">
                            {todo.dueDate && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                  new Date(todo.dueDate) < new Date() &&
                                  !todo.isCompleted
                                    ? "bg-red-100 text-red-800"
                                    : isDarkMode
                                    ? "bg-gray-600 text-gray-200"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                <Clock size={12} className="mr-1" />
                                {new Date(todo.dueDate).toLocaleDateString()}
                              </span>
                            )}

                            {todo.priority && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(
                                  todo.priority,
                                  isDarkMode
                                )}`}
                              >
                                {todo.priority}
                              </span>
                            )}

                            {todo.category && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                  isDarkMode
                                    ? "bg-gray-600 text-gray-200"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                <Bookmark size={12} className="mr-1" />
                                {todo.category}
                              </span>
                            )}

                            {todo.recurring && todo.recurring !== "none" && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                  isDarkMode
                                    ? "bg-blue-900 text-blue-200"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                <Repeat size={12} className="mr-1" />
                                {todo.recurring}
                              </span>
                            )}

                            {todo.tags &&
                              todo.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                    isDarkMode
                                      ? "bg-violet-900 text-violet-200"
                                      : "bg-violet-100 text-violet-800"
                                  }`}
                                >
                                  <Tag size={12} className="mr-1" />
                                  {tag}
                                </span>
                              ))}
                          </div>

                          {todo.subtasks && todo.subtasks.length > 0 && (
                            <div
                              className={`mt-3 pl-6 space-y-1 ${
                                isDarkMode
                                  ? "border-l border-gray-600"
                                  : "border-l border-gray-300"
                              }`}
                            >
                              {todo.subtasks.map((subtask) => (
                                <div
                                  key={subtask.id}
                                  className="flex items-center text-sm"
                                >
                                  <span
                                    className={
                                      subtask.completed
                                        ? "text-green-500 mr-2"
                                        : `${
                                            isDarkMode
                                              ? "text-gray-400"
                                              : "text-gray-500"
                                          } mr-2`
                                    }
                                  >
                                    {subtask.completed ? (
                                      <CheckCircle size={14} />
                                    ) : (
                                      <Circle size={14} />
                                    )}
                                  </span>
                                  <span
                                    className={
                                      subtask.completed
                                        ? "line-through text-gray-500"
                                        : ""
                                    }
                                  >
                                    {subtask.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-1">
                          <button
                            onClick={() => startTimer(todo.id)}
                            className={`p-2 rounded-full ${
                              isDarkMode
                                ? "hover:bg-gray-600"
                                : "hover:bg-gray-200"
                            }`}
                            title="Start Timer"
                          >
                            <Timer
                              size={18}
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }
                            />
                          </button>
                          <button
                            onClick={() => handleEdit(todo.id)}
                            className={`p-2 rounded-full ${
                              isDarkMode
                                ? "hover:bg-gray-600"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <Edit
                              size={18}
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className={`p-2 rounded-full ${
                              isDarkMode
                                ? "hover:bg-gray-600"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <Trash2
                              size={18}
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }
                            />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {view === "calendar" && renderCalendarView()}

            {view === "stats" && renderStatsView()}
          </div>
        </div>
      </main>

      {/* Add/Edit Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-violet-900"
                }`}
              >
                {editingId ? "Edit Task" : "Add New Task"}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setTitle("");
                  setDescription("");
                  setDueDate("");
                  setStartDate("");
                  setCategory("");
                  setPriority("medium");
                  setTagInput("");
                  setSubtasks([]);
                  setReminder("");
                  setRecurring("none");
                }}
                className={`p-2 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X
                  size={20}
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-violet-700"
                  } mb-1`}
                >
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-violet-200 focus:ring-violet-500"
                  } focus:outline-none focus:ring-2`}
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-violet-700"
                  } mb-1`}
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-violet-200 focus:ring-violet-500"
                  } focus:outline-none focus:ring-2`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-violet-700"
                    } mb-1`}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-violet-200 focus:ring-violet-500"
                    } focus:outline-none focus:ring-2`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-violet-700"
                    } mb-1`}
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-violet-200 focus:ring-violet-500"
                    } focus:outline-none focus:ring-2`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-violet-700"
                    } mb-1`}
                  >
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
                          isDarkMode
                            ? "border-gray-600 bg-gray-700 text-white"
                            : "border-violet-200 focus:ring-violet-500"
                        } focus:outline-none focus:ring-2`}
                      />
                      <button
                        onClick={handleAddCustomCategory}
                        className={`${
                          isDarkMode
                            ? "bg-violet-700 hover:bg-violet-800"
                            : "bg-violet-600 hover:bg-violet-700"
                        } px-4 py-2 rounded-lg text-white`}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomCategoryInput(false);
                          setCustomCategory("");
                        }}
                        className={`${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        } px-4 py-2 rounded-lg ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
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
                          isDarkMode
                            ? "border-gray-600 bg-gray-700 text-white"
                            : "border-violet-200 focus:ring-violet-500"
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
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        } px-4 py-2 rounded-lg ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                        title="Add custom category"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-violet-700"
                    } mb-1`}
                  >
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-violet-200 focus:ring-violet-500"
                    } focus:outline-none focus:ring-2`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-violet-700"
                  } mb-1`}
                >
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagInput.trim()) {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tags (press Enter)"
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-violet-200 focus:ring-violet-500"
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
                          isDarkMode
                            ? "bg-violet-900 text-violet-200"
                            : "bg-violet-100 text-violet-800"
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
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-violet-700"
                  } mb-1`}
                >
                  Subtasks
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && subtaskInput.trim()) {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    placeholder="Add subtask (press Enter)"
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-violet-200 focus:ring-violet-500"
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
                      isDarkMode
                        ? "border-l border-gray-600"
                        : "border-l border-gray-300"
                    }`}
                  >
                    {subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center text-sm group"
                      >
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <Circle size={14} />
                        </span>
                        <span className="flex-1">{subtask.text}</span>
                        <button
                          onClick={() => handleRemoveSubtask(subtask.id)}
                          className={`p-1 rounded-full opacity-0 group-hover:opacity-100 ${
                            isDarkMode
                              ? "hover:bg-gray-600"
                              : "hover:bg-gray-200"
                          }`}
                        >
                          <X
                            size={14}
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-violet-700"
                    } mb-1`}
                  >
                    Reminder
                  </label>
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-violet-200 focus:ring-violet-500"
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
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-violet-700"
                    } mb-1`}
                  >
                    Recurring
                  </label>
                  <select
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-violet-200 focus:ring-violet-500"
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
                    setShowAddForm(false);
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                    setDueDate("");
                    setStartDate("");
                    setCategory("");
                    setPriority("medium");
                    setTagInput("");
                    setSubtasks([]);
                    setReminder("");
                    setRecurring("none");
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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
      )}

      {/* Pomodoro Timer Modal */}
      {timerActive && (
        <div className="fixed bottom-4 right-4 z-40">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl p-4 shadow-lg w-64`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-violet-900"
                }`}
              >
                {timerMode === "work"
                  ? "Work Time"
                  : timerMode === "shortBreak"
                  ? "Short Break"
                  : "Long Break"}
              </h3>
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  setTimerActive(false);
                  setCurrentTask(null);
                }}
                className={`p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X
                  size={16}
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
              </button>
            </div>

            {currentTask && (
              <p
                className={`text-xs mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } truncate`}
              >
                Working on: {currentTask.title}
              </p>
            )}

            <div className="flex justify-center mb-4">
              <div
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-violet-900"
                }`}
              >
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              {!timerRunning ? (
                <button
                  onClick={startPomodoro}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    isDarkMode
                      ? "bg-violet-700 hover:bg-violet-800 text-white"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={pausePomodoro}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    isDarkMode
                      ? "bg-yellow-700 hover:bg-yellow-800 text-white"
                      : "bg-yellow-600 hover:bg-yellow-700 text-white"
                  }`}
                >
                  Pause
                </button>
              )}
              <button
                onClick={resetPomodoro}
                className={`px-3 py-1 rounded-lg text-sm ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Reset
              </button>
            </div>

            <div className="flex justify-center mt-3 space-x-1">
              <button
                onClick={() => switchTimerMode("work")}
                className={`px-2 py-1 rounded text-xs ${
                  timerMode === "work"
                    ? isDarkMode
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-800"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Work
              </button>
              <button
                onClick={() => switchTimerMode("shortBreak")}
                className={`px-2 py-1 rounded text-xs ${
                  timerMode === "shortBreak"
                    ? isDarkMode
                      ? "bg-green-700 text-white"
                      : "bg-green-100 text-green-800"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Short Break
              </button>
              <button
                onClick={() => switchTimerMode("longBreak")}
                className={`px-2 py-1 rounded text-xs ${
                  timerMode === "longBreak"
                    ? isDarkMode
                      ? "bg-blue-700 text-white"
                      : "bg-blue-100 text-blue-800"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Long Break
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl p-6 max-w-md w-full`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-violet-900"
                }`}
              >
                Manage Goals
              </h2>
              <button
                onClick={() => setShowGoalsModal(false)}
                className={`p-2 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X
                  size={20}
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setGoalType("daily")}
                  className={`px-4 py-2 rounded-lg ${
                    goalType === "daily"
                      ? isDarkMode
                        ? "bg-violet-700 text-white"
                        : "bg-violet-100 text-violet-800"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Daily Goals
                </button>
                <button
                  onClick={() => setGoalType("weekly")}
                  className={`px-4 py-2 rounded-lg ${
                    goalType === "weekly"
                      ? isDarkMode
                        ? "bg-violet-700 text-white"
                        : "bg-violet-100 text-violet-800"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Weekly Goals
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && goalInput.trim()) {
                      e.preventDefault();
                      handleAddGoal();
                    }
                  }}
                  placeholder={`Add ${goalType} goal`}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-violet-200 focus:ring-violet-500"
                  } focus:outline-none focus:ring-2`}
                />
                <button
                  onClick={handleAddGoal}
                  disabled={!goalInput.trim()}
                  className={`${
                    goalInput.trim()
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

              <div
                className={`space-y-2 max-h-60 overflow-y-auto ${
                  isDarkMode ? "scrollbar-dark" : "scrollbar-light"
                }`}
              >
                {goals[goalType].length === 0 ? (
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No {goalType} goals set yet
                  </p>
                ) : (
                  goals[goalType].map((goal) => (
                    <div
                      key={goal.id}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleGoalCompleted(goal.id)}
                          className="mr-3"
                        >
                          {goal.completed ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <Circle
                              size={18}
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            />
                          )}
                        </button>
                        <span
                          className={
                            goal.completed ? "line-through text-gray-500" : ""
                          }
                        >
                          {goal.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveGoal(goal.id)}
                        className={`p-1 rounded-full ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                      >
                        <X
                          size={16}
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }
                        />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UltimateTodoApp;
