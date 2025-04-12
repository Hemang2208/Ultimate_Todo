"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Shield, Zap } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gsap from "gsap";

const LandingPage = () => {
  const router = useRouter();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const handleLogin = () => {
    toast.info("Redirecting to login page...");
    setTimeout(() => router.push("/user/login"), 1000);
  };

  const handleRegister = () => {
    toast.success("Redirecting to registration page...");
    setTimeout(() => router.push("/user/register"), 1000);
  };

  const features = [
    {
      icon: <Check size={28} className="text-blue-300 mb-3" />,
      title: "Easy to Use",
      description:
        "Simple and intuitive interface for managing your daily tasks.",
    },
    {
      icon: <Shield size={28} className="text-blue-300 mb-3" />,
      title: "Secure",
      description: "Your data is protected with industry-standard encryption.",
    },
    {
      icon: <Zap size={28} className="text-blue-300 mb-3" />,
      title: "Powerful",
      description: "Advanced features to supercharge your productivity.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div ref={containerRef} className="text-center max-w-6xl w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ultimate <span className="text-yellow-300">Todo</span> List
        </h1>

        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Organize your tasks efficiently and boost your productivity with our
          powerful todo list application.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button
            onClick={handleLogin}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-white text-blue-900 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Get Started - Login
          </button>
          <button
            onClick={handleRegister}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 border-white text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Create Account
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-white max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-full sm:w-[300px] p-6 flex flex-col rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300  hover:scale-105 hover:bg-white/15"
            >
              <div className="flex flex-col items-center text-center gap-3 mb-4">
                <div className="text-blue-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-white/80 text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-white/70 text-sm">
          <p className="mb-2">Join thousands of productive users today</p>
          <p>
            &copy; {new Date().getFullYear()} Ultimate Todo List. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
