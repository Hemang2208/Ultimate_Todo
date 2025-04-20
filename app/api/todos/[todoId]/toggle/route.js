import { NextResponse } from "next/server";
import Todo from "../../../../models/Todo";
import dbConnect from "../../../../utils/dbConnect";
import { getUserFromToken } from "../../../../utils/authUtils";

// PATCH toggle todo completion
export async function PATCH(req, { params }) {
  try {
    const { todoId } = await params;
    const userResult = await getUserFromToken(req);

    if (userResult.error) {
      console.error(`User not found or unauthorized: ${userResult.error}`);
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
      console.error("User ID not found.");
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

    // Log the request params and user info for debugging
    console.log(`Fetching todo with ID ${todoId} for user ${userId}`);

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      console.error(`Todo with ID ${todoId} not found for user ${userId}`);
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

    // Toggle the completion status
    todo.isCompleted = !todo.isCompleted;
    await todo.save();

    console.log(`Todo with ID ${todoId} successfully toggled`);

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
    console.error(`Error in PATCH /api/todos/${params.todoId}/toggle:`, error);
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
