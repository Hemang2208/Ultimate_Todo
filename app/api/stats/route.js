import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Stats from "../../models/Stats";
import Todo from "../../models/Todo";
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

// GET stats
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
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await dbConnect();

    let stats = await Stats.findOne({ user: userId });

    if (!stats) {
      stats = new Stats({ user: userId });
      await stats.save();
    }

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST update stats
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
    if (!userId) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    await dbConnect();

    // Get all todos for the user
    const todos = await Todo.find({ user: userId });

    // Calculate stats
    const completed = await todos.filter((todo) => todo.isCompleted).length;
    const total = todos.length;

    // Count by category
    const completedByCategory = {};
    // Count by priority
    const completedByPriority = {};

    todos.forEach((todo) => {
      if (todo.isCompleted) {
        // Count by category
        if (todo.category) {
          completedByCategory[todo.category] =
            (completedByCategory[todo.category] || 0) + 1;
        }

        // Count by priority
        if (todo.priority) {
          completedByPriority[todo.priority] =
            (completedByPriority[todo.priority] || 0) + 1;
        }
      }
    });

    // Get existing stats
    let stats = await Stats.findOne({ user: userId });

    if (!stats) {
      stats = await new Stats({ user: userId });
    }

    // Check streak
    const today = new Date().toDateString();
    const lastCompleted = stats.lastCompletedDate;

    let streak = stats.streak;

    if (completed > 0 && lastCompleted !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (lastCompleted === yesterdayString) {
        streak += 1;
      } else if (lastCompleted !== today) {
        streak = 1;
      }
    }

    // Update stats
    stats.completed = completed;
    stats.total = total;
    stats.completedByCategory = completedByCategory;
    stats.completedByPriority = completedByPriority;
    stats.streak = streak;
    stats.lastCompletedDate = completed > 0 ? today : lastCompleted;

    await stats.save();

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
