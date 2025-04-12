// app/maintenance/page.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Moon,
  Settings,
  ArrowLeft,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Clock,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function MaintenancePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [animateButton, setAnimateButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const [statusMessages, setStatusMessages] = useState([
    { message: "Initializing system maintenance...", completed: true },
    { message: "Upgrading database schemas...", completed: false },
    { message: "Optimizing application performance...", completed: false },
    { message: "Testing new features...", completed: false },
    { message: "Final checks and validations...", completed: false },
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review recent updates", completed: false },
    { id: 2, text: "Check system requirements", completed: false },
    { id: 3, text: "Backup your data", completed: false },
  ]);
  const progressInterval = useRef(null);
  const messageInterval = useRef(null);

  useEffect(() => {
    // Add entry animation
    const timer = setTimeout(() => {
      document
        .getElementById("maintenance-container")
        ?.classList?.remove("opacity-0");
      document
        .getElementById("maintenance-container")
        ?.classList?.add("opacity-100");
    }, 100);

    // Animate progress bar
    progressInterval.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 98) {
          clearInterval(progressInterval.current);
          return 98;
        }
        return prevProgress + Math.random() * 2;
      });
    }, 1000);

    // Update status messages
    let currentMessageIndex = 1;
    messageInterval.current = setInterval(() => {
      if (currentMessageIndex < statusMessages.length) {
        setStatusMessages((prev) => {
          const newMessages = [...prev];
          newMessages[currentMessageIndex] = {
            ...newMessages[currentMessageIndex],
            completed: true,
          };
          return newMessages;
        });
        currentMessageIndex++;
      } else {
        clearInterval(messageInterval.current);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (messageInterval.current) clearInterval(messageInterval.current);
    };
  }, [statusMessages.length]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const goBack = useCallback(() => {
    setAnimateButton(true);
    setTimeout(() => router.back(), 300);
  }, [router]);

  const tryAccess = useCallback(() => {
    const element = document.getElementById("access-error");
    element?.classList?.remove("opacity-0");
    element?.classList?.add("opacity-100");

    setTimeout(() => {
      element?.classList?.remove("opacity-100");
      element?.classList?.add("opacity-0");
    }, 3000);
  }, []);

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleTaskList = () => {
    setIsTaskListOpen(!isTaskListOpen);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        id="maintenance-container"
        className="w-full max-w-lg transition-opacity duration-700 opacity-0 transform"
      >
        <div
          className={`relative p-8 rounded-2xl shadow-xl ${
            theme === "dark"
              ? "bg-gray-800/90 border border-gray-700/50"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Error Notification */}
          <div
            id="access-error"
            className={`absolute top-4 left-0 right-0 mx-auto w-5/6 p-3 rounded-lg bg-red-500/90 text-white opacity-0 transition-opacity duration-300 flex items-center justify-center gap-2`}
          >
            <AlertTriangle className="w-5 h-5" />
            <p className="text-center text-sm">
              Sorry, the site is currently under maintenance and cannot be
              accessed.
            </p>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Settings className="w-5 h-5" />
              <span>Maintenance Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                theme === "dark"
                  ? "bg-gray-700 text-amber-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div
                className={`p-5 rounded-full ${
                  theme === "dark"
                    ? "bg-yellow-900/50 border border-yellow-800/50"
                    : "bg-yellow-100"
                }`}
              >
                <Settings
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <h1
              className={`text-3xl font-bold mb-3 ${
                theme === "dark" ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              Site Under Maintenance
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              We are upgrading our systems to serve you better. Please check
              back soon.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>Progress</span>
              <span className="font-mono">{Math.floor(progress)}%</span>
            </div>
            <div
              className={`w-full h-2.5 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mb-8">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Maintenance Status:
            </h3>
            <div className="space-y-3">
              {statusMessages.map((status, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      status.completed
                        ? theme === "dark"
                          ? "bg-green-700 text-green-300"
                          : "bg-green-500 text-white"
                        : theme === "dark"
                        ? "bg-gray-700"
                        : "bg-gray-300"
                    }`}
                  >
                    {status.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span
                    className={`ml-3 ${
                      status.completed
                        ? theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-900"
                        : theme === "dark"
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    {status.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={goBack}
              className={`w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg 
                transition duration-300 transform hover:scale-[1.02] hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                ${animateButton ? "scale-95 opacity-80" : ""}
                flex items-center justify-center gap-2 font-medium`}
            >
              <ArrowLeft className="w-5 h-5" />
              Go back to recent page
            </button>

            <button
              onClick={tryAccess}
              className={`w-full py-3 px-6 rounded-lg border transition duration-300
                hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400"
                } flex items-center justify-center gap-2 font-medium`}
            >
              Try to access site anyway
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <div
          className={`mt-8 flex flex-col items-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {/* Estimated Completion */}
          <div className="mb-6 text-center">
            <p className="mb-2">Estimated completion time:</p>
            <div
              className={`p-3 rounded-lg font-mono flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-gray-800/50 border border-gray-700/30"
                  : "bg-white border border-gray-300"
              }`}
            >
              <Clock className="w-5 h-5" />
              {new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </div>
          </div>

          {/* Support Links */}
          <div className="mb-8 text-center">
            <p className="mb-3">Need immediate assistance?</p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <span
                  className={`hover:underline flex items-center gap-1 ${
                    theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </span>
              </Link>
              <Link href="/status">
                <span
                  className={`hover:underline flex items-center gap-1 ${
                    theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  System Status
                </span>
              </Link>
            </div>
          </div>

          {/* Task List */}
          <div className="w-full">
            <div
              className={`p-4 rounded-lg cursor-pointer ${
                theme === "dark"
                  ? "bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800/70"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              } transition-colors duration-200`}
              onClick={toggleTaskList}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  While you wait: Organize your tasks
                </span>
                {isTaskListOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>

              {isTaskListOpen && (
                <div className="mt-4">
                  <p className="text-sm mb-3 text-left">
                    Here are some things you can do while waiting:
                  </p>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg flex items-start gap-3 ${
                          theme === "dark"
                            ? "bg-gray-700/50 hover:bg-gray-700/70"
                            : "bg-gray-100 hover:bg-gray-200"
                        } transition-colors duration-200`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskCompletion(task.id);
                          }}
                          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center ${
                            task.completed
                              ? theme === "dark"
                                ? "bg-green-700 text-green-300"
                                : "bg-green-500 text-white"
                              : theme === "dark"
                              ? "bg-gray-600"
                              : "bg-gray-300"
                          }`}
                        >
                          {task.completed && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                        <span
                          className={`flex-1 ${
                            task.completed ? "line-through opacity-75" : ""
                          }`}
                        >
                          {task.text}
                        </span>
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
