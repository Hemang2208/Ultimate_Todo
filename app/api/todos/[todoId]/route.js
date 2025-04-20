import { NextResponse } from "next/server";
import Todo from "../../../models/Todo";
import dbConnect from "../../../utils/dbConnect";
import { getUserFromToken } from "../../../utils/authUtils";

// GET a single todo
export async function GET(req, { params }) {
  try {
    const { todoId } = await params;
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

    const todo = await Todo.findOne({ _id: todoId, user: userId });

    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        todo,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in GET /api/todos/${params.todoId}:`, error);
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

// PUT update a todo
export async function PUT(req, { params }) {
  try {
    const { todoId } = await params;
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
    const todoData = await req.json();

    await dbConnect();

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        {
          status: 404,
        }
      );
    }

    // Update todo fields
    Object.keys(todoData).forEach((key) => {
      if (todoData[key] !== undefined && key !== "user" && key !== "_id") {
        todo[key] = todoData[key];
      }
    });

    await todo.save();

    return NextResponse.json(
      {
        success: true,
        todo,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in PUT /api/todos/${params.todoId}:`, error);
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

// DELETE a todo
export async function DELETE(req, { params }) {
  try {
    const { todoId } = await params;
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

    const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Todo deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in DELETE /api/todos/${params.todoId}:`, error);
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
