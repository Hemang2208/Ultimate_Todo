"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function ToastProvider() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // Check for theme preference in localStorage
        const savedTheme = localStorage.getItem("darkMode") || localStorage.getItem("theme");
        if (savedTheme) {
            try {
                const isDark = JSON.parse(savedTheme) === true || savedTheme === "dark";
                setTheme(isDark ? "dark" : "light");
            } catch (e) {
                console.error("Error parsing theme preference:", e);
            }
        }
    }, []);

    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme}
        />
    );
}