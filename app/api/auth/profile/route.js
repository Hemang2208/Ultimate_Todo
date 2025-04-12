"use server";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async (req) => {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;

    if (!token) {
      token = await req.headers.get("Authorization")?.split(" ")[1];
    }

    if (!token) {
      console.error("🚨 Authentication Error: No Token Provided.");
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is missing.");
        return NextResponse.json(
          { error: "Server Error. Please Try Again Later." },
          { status: 500 }
        );
      }

      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid or Expired Token. Please Log In Again." },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User Not Found." }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("🚨 Profile Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
};

export async function POST(req) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;

    if (!token) {
      token = await req.headers.get("Authorization")?.split(" ")[1];
    }

    if (!token) {
      console.error("🚨 Authentication Error: No Token Provided.");
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is missing.");
        return NextResponse.json(
          { error: "Server Error. Please Try Again Later." },
          { status: 500 }
        );
      }

      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid or Expired Token. Please Log In Again." },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User Not Found." }, { status: 404 });
    }

    // Extract data from request body
    const requestData = await req.json();

    // Update user fields if provided in the request
    if (requestData.name) user.name = requestData.name;
    if (requestData.email) user.email = requestData.email;
    if (requestData.phone) user.phone = requestData.phone;
    if (requestData.address) user.address = requestData.address;
    if (requestData.pincode) user.pincode = requestData.pincode;
    if (requestData.gender) user.gender = requestData.gender;

    await user.save();

    // Return the updated user data including the profile image
    const updatedUser = await User.findById(decoded.userId).select("-password");

    return NextResponse.json(
      {
        message: "Profile Updated Successfully.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Profile Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
