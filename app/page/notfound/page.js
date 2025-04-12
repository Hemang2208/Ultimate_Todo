// app/not-found.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Moon,
  AlertTriangle,
  ArrowLeft,
  Home,
  Search,
  Map,
  Mail,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function NotFoundPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [animateButton, setAnimateButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Add entry animation
    const timer = setTimeout(() => {
      document
        .getElementById("not-found-container")
        ?.classList?.remove("opacity-0");
      document
        .getElementById("not-found-container")
        ?.classList?.add("opacity-100");
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

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, router]
  );

  // Popular links or pages that might be relevant
  const popularLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Blog", href: "/blog", icon: ChevronRight },
    { name: "Products", href: "/products", icon: ChevronRight },
    { name: "About Us", href: "/about", icon: ChevronRight },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        id="not-found-container"
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
              <AlertTriangle className="w-5 h-5" />
              <span>Page Not Found</span>
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
                    ? "bg-blue-900/50 border border-blue-800/50"
                    : "bg-blue-100"
                }`}
              >
                <AlertTriangle
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <h1
              className={`text-3xl font-bold mb-3 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              404 - Page Not Found
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Oops! The page you are looking for doesnt exist or has been moved.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our site..."
                className={`block w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                }`}
              />
              <button
                type="submit"
                className={`absolute right-1.5 top-1.5 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                  transition duration-300 transform hover:scale-[1.02] hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular links */}
          {/* <div className="mb-8">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span>Popular Pages:</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {popularLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700/50 hover:bg-gray-700/70"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{link.name}</span>
                </Link>
              ))}
            </div>
          </div> */}

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

            <Link href="/">
              <button
                className={`w-full py-3 px-6 rounded-lg border transition duration-300
                  hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400"
                  } flex items-center justify-center gap-2 font-medium`}
              >
                <Home className="w-5 h-5" />
                Go to Homepage
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
          <p className="mb-3">Need more help?</p>
          <div className="flex justify-center gap-4">
            <Link href="/sitemap">
              <span
                className={`hover:underline flex items-center gap-1 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <Map className="w-4 h-4" />
                Sitemap
              </span>
            </Link>
            <Link href="/contact">
              <span
                className={`hover:underline flex items-center gap-1 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <Mail className="w-4 h-4" />
                Contact Us
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
