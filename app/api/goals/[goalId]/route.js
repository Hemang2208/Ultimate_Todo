import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Goal from "../../../models/Goal";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

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

// PATCH toggle goal completion
export async function PATCH(req, { params }) {
  try {
    const { goalId } = await params;
    const userResult = await getUserFromToken(req);

    if (userResult.error) {
      return NextResponse.json(
        { error: userResult.error },
        { status: userResult.status }
      );
    }

    const userId = userResult.user._id || userResult.user.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }
    await dbConnect();

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    goal.completed = !goal.completed;
    await goal.save();

    return NextResponse.json({ goal }, { status: 200 });
  } catch (error) {
    console.error(`Error in PATCH /api/goals/${params.goalId}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a goal
export async function DELETE(req, { params }) {
  try {
    const { goalId } = await params;
    const userResult = await getUserFromToken(req);

    if (userResult.error) {
      return NextResponse.json(
        { error: userResult.error },
        { status: userResult.status }
      );
    }

    const userId = userResult.user._id || userResult.user.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }
    await dbConnect();

    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Goal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in DELETE /api/goals/${params.goalId}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
