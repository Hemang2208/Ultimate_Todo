"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit,
  Camera,
  Phone,
  Mail,
  MapPin,
  User,
  X,
  Check,
  Shield,
  Bell,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const Profile = () => {
  // Theme state initialization
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return savedTheme || (systemPrefersDark ? "dark" : "light");
    }
    return "light";
  });

  const [isDarkMode, setisDarkMode] = useState(false);

  // Theme effect
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      setisDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setisDarkMode(false);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  // User data state
  const [user, setUser] = useState(null);
  const [cachedUser, setCachedUser] = useState(null);
  const [status, setStatus] = useState({
    error: "",
    loading: true,
    success: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    gender: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  const router = useRouter();

  const handleNewPage = useCallback(() => {
    router.push("/page/feature");
  }, [router]);

  // Fetch user profile with proper error handling and caching
  const fetchUserProfile = useCallback(async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      if (!token) {
        router.push("/user/login");
        return;
      }

      // Try to load from cache first
      const cachedProfile = localStorage.getItem("userData");
      if (cachedProfile) {
        try {
          const parsedProfile = JSON.parse(cachedProfile);
          setCachedUser(parsedProfile);
          setFormData({
            name: parsedProfile.name || "",
            email: parsedProfile.email || "",
            phone: parsedProfile.phone || "",
            address: parsedProfile.address || "",
            pincode: parsedProfile.pincode || "",
            gender: parsedProfile.gender || "",
          });

          if (parsedProfile.gender === "Male") {
            setPreviewImage("/BOY.svg");
          } else {
            setPreviewImage("/GIRL.svg");
          }
        } catch (parseError) {
          console.error("Error parsing cached profile:", parseError);
          localStorage.removeItem("userData");
        }
      }

      // Fetch fresh data from server
      try {
        const { data } = await axios.get("/api/auth/profile", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.user) {
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            pincode: data.user.pincode || "",
            gender: data.user.gender || "Male",
          });

          if (data.user.gender === "Male") {
            setPreviewImage("/BOY.svg");
          } else {
            setPreviewImage("/GIRL.svg");
          }

          // Update cache
          localStorage.setItem("userData", JSON.stringify(data.user));
        }

        setStatus((prev) => ({ ...prev, loading: false, success: true }));
      } catch (fetchError) {
        router.push("/user/login");
        console.error("Error fetching profile:", fetchError);
        if (!cachedProfile) {
          setStatus({
            error:
              fetchError.response?.data?.error || "Failed to load profile.",
            loading: false,
            success: false,
          });
          toast.error("Failed to load profile. Please try again.");
        }
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      setStatus({
        error: err.response?.data?.error || "Failed to locate profile.",
        loading: false,
        success: false,
      });

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/user/login");
      }
    }
  }, [router]);

  // Fetch profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Toggle edit mode with proper state reset
  const toggleEdit = useCallback(() => {
    if (isEditing) {
      // Reset form data when canceling edit
      const userData = user || cachedUser;
      if (userData) {
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          pincode: userData.pincode || "",
          gender: userData.gender || "",
        });
        if (userData.gender === "Male") {
          setPreviewImage("/BOY.svg");
        } else {
          setPreviewImage("/GIRL.svg");
        }
      }
      setSelectedImage(null);
    }
    setIsEditing(!isEditing);
  }, [isEditing, user, cachedUser]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Save changes with proper error handling and state updates
  const handleSaveChanges = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: "" }));

      const token =
        localStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      if (!token) {
        router.push("/user/login");
        return;
      }

      // Prepare updated data
      const updatedData = { ...formData };

      let response = await axios.post("/api/auth/profile", updatedData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        const localData = localStorage.getItem("userData");
        if (localData) {
          response = { data: JSON.parse(localData) };
        } else {
          throw new Error("API request failed and no local data available");
        }
      }

      const data = response.data;

      if (data.user) {
        // Update all states with the new user data
        setUser(data.user);
        setCachedUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          pincode: data.user.pincode || "",
          gender: data.user.gender || "",
        });

        if (data.user.gender === "Male") {
          setPreviewImage("/BOY.svg");
        } else {
          setPreviewImage("/GIRL.svg");
        }

        // Update cache
        localStorage.setItem("userData", JSON.stringify(data.user));

        // Show success
        setIsEditing(false);
        setSelectedImage(null);
        setStatus((prev) => ({ ...prev, loading: false, success: true }));
        toast.success("Profile updated successfully!");
      } else {
        // Fallback if no user data is returned
        const updatedUser = {
          ...(user || cachedUser),
          ...updatedData,
        };

        setUser(updatedUser);
        setCachedUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));

        setIsEditing(false);
        setSelectedImage(null);
        setStatus((prev) => ({ ...prev, loading: false, success: true }));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatus({
        error: error.response?.data?.error || "Failed to update profile.",
        loading: false,
        success: false,
      });
      toast.error(error.response?.data?.error || "Failed to update profile.");
    }
  }, [formData, router, user, cachedUser]);

  // Loading state
  if (status.loading && !cachedUser) {
    return (
      <div className="max-w-4xl mx-auto mt-10 mb-10 p-6">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-24 w-24 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8"></div>
          <div className="w-full max-w-md space-y-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
        <p className="text-blue-500 dark:text-blue-400 text-lg text-center mt-6 font-medium">
          Loading your profile...
        </p>
      </div>
    );
  }

  // Error state
  if (status.error && !cachedUser) {
    return (
      <div className="max-w-md mx-auto mt-10 mb-10 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Profile Error
          </h1>
          <p className="text-red-500 mb-4">{status.error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userData = user || cachedUser;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 transition-colors duration-300">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-white overflow-hidden border-4 border-white shadow-lg transition-all duration-300 hover:shadow-xl">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Profile";
                    }}
                  />
                ) : userData?.name ? (
                  <span className="text-5xl font-bold">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={48} />
                )}
              </div>
            </div>
            <div className="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {userData?.name || "User Profile"}
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                {userData?.email || ""}
              </p>
              {userData?.phone && (
                <p className="text-blue-100 text-sm mt-1 flex items-center justify-center md:justify-start">
                  <Phone size={14} className="mr-1" /> {userData.phone}
                </p>
              )}
            </div>
            <div className="ml-auto mt-6 md:mt-0 flex flex-col gap-2">
              {/* <button
                onClick={toggleTheme}
                className="flex items-center justify-center bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors duration-300"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button> */}
              <button
                onClick={toggleEdit}
                className="flex items-center justify-center bg-white text-blue-600 hover:cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm"
              >
                {isEditing ? (
                  <>
                    <X size={16} className="mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center bg-white text-blue-600 hover:cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm"
              >
                <LayoutDashboard size={16} className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => router.push("/user/logout")}
                className={
                  "bg-white text-blue-600 hover:cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center"
                }
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm"
                >
                  <Check size={16} className="mr-2" />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => handleTabChange("profile")}
              className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${activeTab === "profile"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                Profile Information
              </div>
            </button>
            <button
              onClick={() => handleTabChange("security")}
              className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${activeTab === "security"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <div className="flex items-center">
                <Shield size={16} className="mr-2" />
                Security
              </div>
            </button>
            <button
              onClick={() => handleTabChange("preferences")}
              className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${activeTab === "preferences"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <div className="flex items-center">
                <Bell size={16} className="mr-2" />
                Preferences
              </div>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information Card */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <User size={18} className="mr-2 text-blue-500" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start mb-4">
                      <User
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="ml-3 w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Gender
                        </p>
                        {isEditing ? (
                          <div>
                            <select
                              id="gender"
                              name="gender"
                              value={formData.gender || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Your profile picture will be updated based on your
                              gender
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {formData.gender || "Not specified"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="ml-3 w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Full Name
                        </p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-gray-800 dark:text-white font-medium">
                            {userData?.name || "-"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="ml-3 w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email
                        </p>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your email"
                          />
                        ) : (
                          <p className="text-gray-800 dark:text-white font-medium">
                            {userData?.email || "-"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="ml-3 w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Phone
                        </p>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your phone number"
                          />
                        ) : (
                          <p className="text-gray-800 dark:text-white font-medium">
                            {userData?.phone || "-"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <MapPin size={18} className="mr-2 text-blue-500" />
                    Address Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="ml-3 w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Address
                        </p>
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="2"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your address"
                          />
                        ) : (
                          <p className="text-gray-800 dark:text-white font-medium">
                            {userData?.address || "-"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="ml-3 w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pincode
                        </p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your pincode"
                          />
                        ) : (
                          <p className="text-gray-800 dark:text-white font-medium">
                            {userData?.pincode || "-"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <Shield size={18} className="mr-2 text-blue-500" />
                    Account Information
                  </h2>
                </div>
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-blue-100 dark:border-blue-900">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your account information is securely stored. You can edit
                    your profile details using the edit button above. Keep your
                    information up to date for a better experience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Shield size={18} className="mr-2 text-blue-500" />
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Change Password
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Update your password regularly for security
                      </p>
                    </div>
                    <button
                      onClick={handleNewPage}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
                    >
                      Update
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={handleNewPage}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
                    >
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Login Activity
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        View your recent login sessions
                      </p>
                    </div>
                    <button
                      onClick={handleNewPage}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Bell size={18} className="mr-2 text-blue-500" />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Receive emails about account activity
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 dark:bg-gray-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        SMS Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Receive text messages for important updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 dark:bg-gray-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Marketing Communications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Receive updates about new features and offers
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 dark:bg-gray-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <User size={18} className="mr-2 text-blue-500" />
                  Display Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Dark Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 dark:bg-gray-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Compact View
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Show more content with less spacing
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 dark:bg-gray-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {status.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-700 dark:text-gray-300">
              Updating profile...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
