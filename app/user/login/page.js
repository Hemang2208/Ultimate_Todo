"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gsap from "gsap";
import {
  Mail,
  Lock,
  Loader2,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
} from "lucide-react";
import ToastProvider from "@/app/components/ToastProvider";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  // Toggle dark mode and persist in localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Check for saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      const isDark = JSON.parse(savedMode);
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  // Animation on mount
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        opacity: 1,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format";
    if (password.length < 8) return "Password must be at least 8 characters";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = await validateForm();
    if (validationError) {
      toast.error(validationError, {
        icon: <XCircle className="text-red-500" />,
      });
      return;
    }

    setIsLoading(true);

    const loadingToastId = toast.loading("Authenticating...", {
      icon: <Loader2 className="animate-spin text-blue-500" />,
    });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // include cookies
      });

      const data = await response.json();
      console.log("Server response:", response.status, data);

      if (response.status === 201) {
        // Optional animation on form
        if (formRef.current) {
          gsap.to(formRef.current, {
            y: -10,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          });
        }

        // Save auth data locally
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // Update the toast with success
        toast.update(loadingToastId, {
          render: data.message || "Login successful! Redirecting...",
          type: "success",
          isLoading: false,
          icon: <CheckCircle className="text-green-500" />,
          autoClose: 2000,
        });

        // Redirect after a short delay
        setTimeout(() => router.push("/user/profile"), 100);
      } else {
        // Close the loading toast first
        toast.dismiss(loadingToastId);

        // Create a new error toast
        toast.error(data.error || "Login failed. Please try again.", {
          icon: <XCircle className="text-red-500" />,
          autoClose: 5000,
        });

        console.error("Login failed:", data.error);

        // Add visual feedback by shaking the form
        if (formRef.current) {
          gsap.to(formRef.current, {
            x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
            duration: 0.6,
            ease: "power2.out",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      // Close the loading toast first
      toast.dismiss(loadingToastId);

      // Create a new error toast
      toast.error(error.message || "An unexpected error occurred", {
        icon: <XCircle className="text-red-500" />,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Use the shared ToastProvider component */}
      <ToastProvider />
      
      <div
        ref={formRef}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Mail size={16} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${darkMode
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-600"
                : "bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
                }`}
              aria-label="Email address"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Lock size={16} />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${darkMode
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-600"
                : "bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
                }`}
              aria-label="Password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Don{"'"}t have an account?{" "}
            <button
              onClick={() => router.push("/user/register")}
              className={`font-medium ${darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-500"
                }`}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
