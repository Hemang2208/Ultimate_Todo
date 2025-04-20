import { NextResponse } from "next/server";
import Todo from "../../models/Todo";
import dbConnect from "../../utils/dbConnect";
import { getUserFromToken } from "../../utils/authUtils";

// GET all todos
export async function GET(req) {
  try {
    const userResult = await getUserFromToken(req);

    if (userResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: userResult.error,
        },
        {
          status: userResult.status,
        }
      );
    }

    const userId = userResult.user._id || userResult.user.id;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    await dbConnect();

    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        todos,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in GET /api/todos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

// POST create a new todo
export async function POST(req) {
  try {
    const userResult = await getUserFromToken(req);

    if (userResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: userResult.error,
        },
        {
          status: userResult.status,
        }
      );
    }

    const userId = userResult.user._id;
    const userName = userResult.user.name;
    const todoData = await req.json();

    await dbConnect();

    // Create a new todo with the user ID and name
    const newTodo = new Todo({
      ...todoData,
      user: userId,
      userName: userName,
    });

    await newTodo.save();

    return NextResponse.json(
      {
        success: true,
        todo: newTodo.toObject(),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/todos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
