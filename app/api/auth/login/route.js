"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import dbConnect from "@/app/utils/dbConnect";
import { limitRequests } from "../../../middleware/rateLimiter";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req) => {
  try {
    // Apply rate limiting
    const rateLimitResponse = await limitRequests(req);
    if (rateLimitResponse.status !== 200) return rateLimitResponse;

    await dbConnect();

    // Parse request body
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required." },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid Email or Password." },
        { status: 401 }
      );
    }

    // Check if password matches
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return NextResponse.json(
        { error: "Invalid Email or Password." },
        { status: 401 }
      );
    }

    // Generate JWT Token
    let jw = process.env.JWT_SECRET;
    if (!jw) {
      return NextResponse.json(
        { error: "Server error. Please try again later." },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set Cookie for Authentication (Secure & HttpOnly)
    let Cook = await cookies();
    Cook.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600, // 1 hour
    });

    // Return token for localStorage (Frontend Use)
    return NextResponse.json(
      { message: "Login Successful!", token, user },
      { status: 201 }
    );
  } catch (error) {
    console.error("🚨 Login Error:", error.message || error);

    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
};
