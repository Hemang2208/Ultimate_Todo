"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import dbConnect from "@/app/utils/dbConnect";
import { validateUserInput } from "@/app/middleware/validateUserInput";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await dbConnect();

    const body = await req.json();
    const validationResponse = await validateUserInput(body);
    if (validationResponse.status !== 200) return validationResponse;

    const { name, email, password, phone, address, pincode, gender } = body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered. Please login instead." },
        { status: 400 }
      );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender: gender || "Male",
      address: address || "Enter Here",
      pincode: pincode || "Enter Here",
    });

    // Generate JWT Token
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server error. Please try again later." },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set Token in Cookies (Secure & HttpOnly)
    const response = NextResponse.json(
      { message: "User Registered Successfully!", token, user },
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("🚨 Registration Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate Entry. Email or Phone Already Exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error. Please Try Again Later." },
      { status: 500 }
    );
  }
};
