"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gsap from "gsap";
import {
  User,
  Mail,
  Lock,
  Phone,
  Loader2,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
} from "lucide-react";
import ToastProvider from "@/app/components/ToastProvider";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    pincode: "",
    gender: "Male",
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
  }, [formRef]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const { name, email, password, phone, pincode } = formData;

    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, {
        icon: <XCircle className="text-red-500" />,
      });
      return;
    }

    setIsLoading(true);
    toast.info("Processing registration...", {
      icon: <Loader2 className="animate-spin" />,
      autoClose: false,
    });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Success animation
      if (formRef.current) {
        gsap.to(formRef.current, {
          y: -10,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        });
      }

      toast.success("Registration successful! Redirecting...", {
        icon: <CheckCircle className="text-green-500" />,
      });

      setTimeout(() => router.push("/user/login"), 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "An error occurred during registration", {
        icon: <XCircle className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { id: "name", label: "Full Name", icon: User, type: "text" },
    { id: "email", label: "Email", icon: Mail, type: "email" },
    { id: "password", label: "Password", icon: Lock, type: "password" },
    { id: "phone", label: "Phone", icon: Phone, type: "tel" },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <ToastProvider />
      
      <div
        ref={formRef}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User size={24} />
            Register Account
          </h1>
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
          {inputFields.map(({ id, label, icon: Icon, type }) => (
            <div key={id} className="space-y-1">
              <label
                htmlFor={id}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Icon size={16} />
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={formData[id]}
                onChange={handleInputChange}
                required={id !== "address" && id !== "pincode"}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Register Now"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Already have an account?{" "}
            <button
              onClick={() => router.push("/user/login")}
              className={`font-medium ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
