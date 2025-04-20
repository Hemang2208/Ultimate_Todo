import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import User from "../models/User"
import dbConnect from "../utils/dbConnect"

export const getAuthUser = async (req) => {
  try {
    const cookieStore = cookies()
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

    try {
      await dbConnect()
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        return { error: "User not found.", status: 404 }
      }

      return { user }
    } catch (err) {
      return { error: "Invalid or expired token. Please log in again.", status: 401 }
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return { error: "Internal server error.", status: 500 }
  }
}

export const validateRequest = async (req) => {
  const authResult = await getAuthUser(req)

  if (authResult.error) {
    return { error: authResult.error, status: authResult.status }
  }

  return { user: authResult.user }
}
