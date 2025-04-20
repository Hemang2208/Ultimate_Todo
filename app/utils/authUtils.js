import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import User from "../models/User"
import dbConnect from "./dbConnect"

/**
 * Utility function to get user from token
 * Used across all API routes for authentication
 */
export async function getUserFromToken(req) {
  try {
    const cookieStore = await cookies()
    let token = cookieStore.get("token")?.value

    // If no token in cookies, check Authorization header
    if (!token) {
      token = req.headers.get("Authorization")?.split(" ")[1]
    }

    if (!token) {
      return { error: "Unauthorized. Please log in.", status: 401 }
    }

    // Verify token
    if (!process.env.JWT_SECRET) {
      return { error: "Server error. Please try again later.", status: 500 }
    }

    await dbConnect()
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return { error: "User not found.", status: 404 }
    }

    return { user }
  } catch (error) {
    console.error("Auth error:", error)
    return { error: "Invalid or expired token. Please log in again.", status: 401 }
  }
}

/**
 * Utility function to create and sign a JWT token
 */
export function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

/**
 * Utility function to set auth cookie
 */
export function setAuthCookie(response, token) {
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return response
}

/**
 * Utility function to clear auth cookie
 */
export function clearAuthCookie(response) {
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  return response
}
