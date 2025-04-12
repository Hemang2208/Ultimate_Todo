"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          let errorMessage = "Unknown error";
          try {
            errorMessage = await response.json();
          } catch (err) {
            console.error("Failed to parse error response:", err);
          }
          console.error("Logout API Error:", errorMessage);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setTimeout(() => {
          router.replace("/");
        }, 500);
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center bg-white justify-center min-h-screen">
      <p className="text-lg text-center font-semibold text-black">Thank You.</p>
    </div>
  );
};

export default LogoutPage;
