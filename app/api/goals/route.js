import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Goal from "../../models/Goal";
import User from "../../models/User";
import dbConnect from "../../utils/dbConnect";

// Helper function to get user from token
async function getUserFromToken(req) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;

    // If no token in cookies, check Authorization header
    if (!token) {
      token = await req.headers.get("Authorization")?.split(" ")[1];
    }

    if (!token) {
      return { error: "Unauthorized. Please log in.", status: 401 };
    }

    // Verify token
    let secret = process.env.JWT_SECRET;
    if (!secret) {
      return { error: "Server error. Please try again later.", status: 500 };
    }

    await dbConnect();

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return { error: "User not found.", status: 404 };
    }

    return { user };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      error: "Invalid or expired token. Please log in again.",
      status: 401,
    };
  }
}

// GET all goals
export async function GET(req) {
  try {
    const userResult = await getUserFromToken(req);
    if (userResult.error) {
      return NextResponse.json(
        { error: userResult.error },
        { status: userResult.status }
      );
    }

    const userId = userResult.user._id || userResult.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found." },
        { status: 400 }
      );
    }

    await dbConnect();

    const goals = await Goal.find({ user: userId });
    if (!goals || goals.length === 0) {
      return NextResponse.json({ goals: [] }, { status: 200 });
    }

    // Group goals by type
    const groupedGoals = {
      daily: goals.filter((goal) => goal.type === "daily"),
      weekly: goals.filter((goal) => goal.type === "weekly"),
    };

    return NextResponse.json(groupedGoals, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/goals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new goal
export async function POST(req) {
  try {
    const userResult = await getUserFromToken(req);
    if (userResult.error) {
      return NextResponse.json(
        { error: userResult.error },
        { status: userResult.status }
      );
    }

    const userId = userResult.user._id || userResult.user.id;
    const userName = userResult.user.name;
    const goalData = await req.json();

    await dbConnect();

    const newGoal = new Goal({
      ...goalData,
      user: userId,
      userName: userName,
    });

    await newGoal.save();

    return NextResponse.json({ goal: newGoal.toObject() }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/goals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
