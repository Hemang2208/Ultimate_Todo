import { NextResponse } from "next/server";
import User from "../models/User";

export const validateUserInput = async (input) => {
  try {
    const { name, email, password, phone, gender } = input;

    const cleanName = name?.trim();
    const cleanEmail = email?.toLowerCase().trim();
    const cleanPhone = phone?.toString().trim();

    if (!cleanName || !cleanEmail || !password || !cleanPhone || !gender) {
      return NextResponse.json(
        { error: "❌ All fields are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "❌ Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 7) {
      return NextResponse.json(
        { error: "❌ Password must be at least 7 characters long." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "❌ Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    if (gender !== "Male" && gender !== "Female") {
      return NextResponse.json(
        { error: "❌ Gender must be either 'Male' or 'Female'." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "⚠️ This Email is already registered. Please Login instead." },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("🚨 Error in Validating User Input:", error.message || error);
    return NextResponse.json(
      { error: "⚠️ Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
};
