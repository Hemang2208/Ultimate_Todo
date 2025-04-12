"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sun, Moon, Plus, Menu, X, User, LogOut } from "lucide-react";
import gsap from "gsap";

const Navbar = () => {
  // State declarations
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Toggle functions
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // GSAP animations
  useEffect(() => {
    if (navbarRef.current) {
      gsap.from(navbarRef.current, {
        opacity: 0,
        y: -20,
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

  return (
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
                <Menu size={24} className="transition-transform duration-300" />
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
  );
};

export default Navbar;
