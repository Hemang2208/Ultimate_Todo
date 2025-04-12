// app/coming-soon/page.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Moon,
  Clock,
  ArrowLeft,
  Home,
  Map,
  Mail,
  CheckCircle,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "next-themes";

// Constants
const COUNTDOWN_TARGET_DATE_KEY = "countdown_target_date";
const COUNTDOWN_COOKIE_NAME = "countdown_target";
const COUNTDOWN_DURATION_DAYS = 300;
const TIME_DISCREPANCY_THRESHOLD = 300000; // 5 minutes in ms

export default function ComingSoonPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [animateButton, setAnimateButton] = useState(false);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [timeDiscrepancy, setTimeDiscrepancy] = useState(0);
  const timerRef = useRef(null);

  // Cookie helpers
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const setCookie = (name, value, days) => {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  };

  // Server time verification
  const verifyServerTime = useCallback(async () => {
    try {
      const response = await fetch("/api/server-time", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Server time unavailable");

      const { serverTime, isValid } = await response.json();
      const serverDate = new Date(serverTime);
      const clientDate = new Date();
      const discrepancy = serverDate.getTime() - clientDate.getTime();

      if (Math.abs(discrepancy) > TIME_DISCREPANCY_THRESHOLD) {
        setTimeDiscrepancy(discrepancy);
        console.warn(`Time discrepancy detected: ${discrepancy}ms`);
        return serverDate; // Trust server time more
      }

      return clientDate; // Use client time if discrepancy is small
    } catch (err) {
      console.error("Server time verification failed:", err);
      return new Date(); // Fallback to client time
    }
  }, []);

  // Initialize countdown target date
  const initializeCountdown = useCallback(async () => {
    try {
      // Verify time with server first
      const verifiedDate = await verifyServerTime();

      // Check storage for existing target date
      const storedTargetDate =
        typeof window !== "undefined"
          ? localStorage.getItem(COUNTDOWN_TARGET_DATE_KEY)
          : null;

      // Check cookie fallback
      const cookieTargetDate = getCookie(COUNTDOWN_COOKIE_NAME);

      let targetDate;

      if (storedTargetDate) {
        targetDate = new Date(storedTargetDate);
      } else if (cookieTargetDate) {
        targetDate = new Date(cookieTargetDate);
        localStorage.setItem(
          COUNTDOWN_TARGET_DATE_KEY,
          targetDate.toISOString()
        );
      } else {
        // Initialize new countdown from verified date
        targetDate = new Date(verifiedDate);
        targetDate.setDate(targetDate.getDate() + COUNTDOWN_DURATION_DAYS);
        localStorage.setItem(
          COUNTDOWN_TARGET_DATE_KEY,
          targetDate.toISOString()
        );
        setCookie(
          COUNTDOWN_COOKIE_NAME,
          targetDate.toISOString(),
          COUNTDOWN_DURATION_DAYS
        );
      }

      // Validate target date
      if (targetDate <= verifiedDate) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return null;
      }

      return targetDate;
    } catch (err) {
      console.error("Countdown initialization error:", err);
      setError("Failed to initialize countdown. Please refresh the page.");
      return null;
    }
  }, [verifyServerTime]);

  // Update countdown display
  const updateCountdown = useCallback((targetDate) => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true,
      });
      return false;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setCountdown({
      days,
      hours,
      minutes,
      seconds,
      expired: false,
    });

    return true;
  }, []);

  // Start the countdown timer
  const startCountdown = useCallback(async () => {
    const targetDate = await initializeCountdown();
    if (!targetDate) return;

    // Initial update
    const isValid = updateCountdown(targetDate);
    if (!isValid) return;

    // Set up interval for continuous updates
    timerRef.current = setInterval(() => {
      updateCountdown(targetDate);
    }, 1000);

    setInitialized(true);
  }, [initializeCountdown, updateCountdown]);

  useEffect(() => {
    // Add entry animation
    const timer = setTimeout(() => {
      const container = document.getElementById("coming-soon-container");
      container?.classList?.remove("opacity-0");
      container?.classList?.add("opacity-100");
    }, 100);

    // Start countdown
    startCountdown();

    // Verify time periodically
    const verificationInterval = setInterval(() => {
      verifyServerTime();
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => {
      clearTimeout(timer);
      clearInterval(timerRef.current);
      clearInterval(verificationInterval);
    };
  }, [startCountdown, verifyServerTime]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const goBack = useCallback(() => {
    setAnimateButton(true);
    setTimeout(() => router.back(), 300);
  }, [router]);

  const handleNotify = useCallback(
    (e) => {
      e.preventDefault();
      if (email && email.includes("@")) {
        setNotified(true);
        // In production, you would send this to your backend
        console.log("Email submitted:", email);
      }
    },
    [email]
  );

  const CountdownDisplay = ({ label, value }) => (
    <div
      className={`flex flex-col items-center p-4 rounded-lg min-w-[70px] transition-all duration-200 ${
        theme === "dark"
          ? "bg-gray-700/50 border border-gray-600/30"
          : "bg-gray-100 border border-gray-200"
      }`}
    >
      <span className="text-3xl font-bold tabular-nums">{value}</span>
      <span className="text-xs uppercase tracking-wider mt-1">{label}</span>
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        id="coming-soon-container"
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
              <Calendar className="w-4 h-4" />
              <span>{initialized ? "Launching soon" : "Initializing..."}</span>
              {timeDiscrepancy !== 0 && (
                <span className="text-xs text-yellow-500">
                  (Time adjusted by {Math.round(timeDiscrepancy / 1000)}s)
                </span>
              )}
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

          {/* Error display */}
          {error && (
            <div className="mb-8 p-4 rounded-lg bg-red-900/50 border border-red-800/50 text-red-200 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5" />
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-1">
                  The countdown may not display correctly.
                </p>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div
                className={`p-5 rounded-full transition-all ${
                  theme === "dark"
                    ? "bg-purple-900/50 border border-purple-800/50"
                    : "bg-purple-100"
                }`}
              >
                <Clock
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <h1
              className={`text-3xl font-bold mb-3 ${
                theme === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {countdown.expired ? "Feature Launched!" : "Coming Soon"}
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {countdown.expired
                ? "The wait is over! Check out our new feature."
                : "We're working hard to bring you this exciting update."}
            </p>
          </div>

          {/* Countdown display */}
          {!countdown.expired && (
            <div className="mb-10">
              <p className="text-center mb-5 text-sm font-medium uppercase tracking-wider">
                {initialized ? "Launching in" : "Calculating time..."}
              </p>
              <div className="flex justify-center gap-3">
                <CountdownDisplay label="Days" value={countdown.days} />
                <CountdownDisplay label="Hours" value={countdown.hours} />
                <CountdownDisplay label="Minutes" value={countdown.minutes} />
                <CountdownDisplay label="Seconds" value={countdown.seconds} />
              </div>
            </div>
          )}

          {/* Notification form */}
          {!countdown.expired && !notified ? (
            <form onSubmit={handleNotify} className="mb-8">
              <div className="flex flex-col space-y-4">
                <label className="text-center text-sm font-medium">
                  Get notified when we launch
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={`w-full py-3 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500"
                    }`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                    transition duration-300 transform hover:scale-[1.02] hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                    flex items-center justify-center gap-2 font-medium`}
                >
                  Notify Me
                </button>
              </div>
            </form>
          ) : !countdown.expired ? (
            <div
              className={`mb-8 p-4 rounded-lg flex items-center justify-center gap-2 ${
                theme === "dark"
                  ? "bg-green-900/50 text-green-300 border border-green-800/50"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <p className="text-center">
                Thank you! We will notify you when we launch.
              </p>
            </div>
          ) : null}

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

        {/* Footer */}
        <div
          className={`mt-8 text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <p className="mb-2 text-sm">
            Want to learn more about upcoming features?
          </p>
          <Link href="/roadmap">
            <span
              className={`hover:underline text-sm flex items-center justify-center gap-1 ${
                theme === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            >
              <Map className="w-4 h-4" />
              View our product roadmap
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
