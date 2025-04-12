// app/unauthorized/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Moon,
  ShieldAlert,
  ArrowLeft,
  LogIn,
  Lock,
  Mail,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [animateButton, setAnimateButton] = useState(false);

  useEffect(() => {
    // Add entry animation
    const timer = setTimeout(() => {
      document.getElementById("container")?.classList?.remove("opacity-0");
      document.getElementById("container")?.classList?.add("opacity-100");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const goBack = useCallback(() => {
    setAnimateButton(true);
    setTimeout(() => router.back(), 300);
  }, [router]);

  // Suggested actions for unauthorized access
  const suggestedActions = [
    {
      title: "Log in with different credentials",
      description: "You may have access with another account",
      action: "Go to Login",
      icon: LogIn,
      href: "/login",
    },
    {
      title: "Request access",
      description: "Contact administrator for permissions",
      action: "Contact Admin",
      icon: Mail,
      href: "/contact",
    },
    {
      title: "Check your permissions",
      description: "Review your account privileges",
      action: "View Account",
      icon: Lock,
      href: "/account",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        id="container"
        className="w-full max-w-md transition-opacity duration-700 opacity-0 transform"
      >
        <div
          className={`p-8 rounded-2xl shadow-xl ${
            theme === "dark"
              ? "bg-gray-800/90 border border-gray-700/50"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Header with theme toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Access Restricted</span>
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

          {/* Main content */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div
                className={`p-5 rounded-full ${
                  theme === "dark"
                    ? "bg-red-900/50 border border-red-800/50"
                    : "bg-red-100"
                }`}
              >
                <ShieldAlert
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <h1
              className={`text-3xl font-bold mb-3 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              Unauthorized Access
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              You dont have permission to view this page with your current
              credentials.
            </p>
          </div>

          {/* Suggested actions */}
          <div className="mb-8">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              What you can do:
            </h3>
            <div className="space-y-3">
              {suggestedActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className={`block p-4 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700/50 hover:bg-gray-700/70"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <action.icon
                        className={`w-5 h-5 ${
                          theme === "dark" ? "text-red-400" : "text-red-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm mt-1">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Action buttons */}
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

            <Link href="/login">
              <button
                className={`w-full py-3 px-6 rounded-lg border transition duration-300
                  hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400"
                  } flex items-center justify-center gap-2 font-medium`}
              >
                <LogIn className="w-5 h-5" />
                Go to Login
              </button>
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div
          className={`mt-8 text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <p className="mb-3">Need help with access?</p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <span
                className={`hover:underline flex items-center gap-1 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </span>
            </Link>
            <Link href="/help">
              <span
                className={`hover:underline flex items-center gap-1 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Help Center
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
