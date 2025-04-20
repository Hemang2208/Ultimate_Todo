"use client";

import { useEffect, useCallback, useReducer } from "react";
import { showToast } from "../utils/toastUtils";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/dualStorage";
import useAuth from "./useAuth";

// Reducer for todos state management
const todosReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, todos: action.payload, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_TODO":
      return { ...state, todos: [action.payload, ...state.todos] };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo._id !== action.payload),
      };
    case "REPLACE_TEMP_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo._id === action.payload.tempId ? { ...action.payload.todo } : todo
        ),
      };
    default:
      return state;
  }
};

export default function useTodos() {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(todosReducer, {
    todos: [],
    loading: true,
    error: null,
  });

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_START" });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Try to get todos from localStorage first for immediate UI
      const localTodos = getFromLocalStorage("todos");
      if (localTodos) {
        dispatch({ type: "FETCH_SUCCESS", payload: localTodos });
      }

      // Then fetch from server to ensure data is up-to-date
      const response = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch todos");
      }

      const data = await response.json();
      const serverTodos = data.todos || [];

      // Update localStorage and state with server data
      saveToLocalStorage("todos", serverTodos);
      dispatch({ type: "FETCH_SUCCESS", payload: serverTodos });
    } catch (error) {
      console.error("Error fetching todos:", error);
      dispatch({ type: "FETCH_ERROR", payload: error.message });
      showToast.error(error.message);
    }
  }, []);

  // Create a new todo
  const createTodo = useCallback(
    async (todoData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Generate a temporary ID for immediate UI update
        const tempId = `temp-${Date.now()}`;
        const tempTodo = {
          ...todoData,
          _id: tempId,
          createdAt: new Date().toISOString(),
          user: user?._id,
          userName: user?.name,
        };

        // Update UI immediately
        dispatch({ type: "ADD_TODO", payload: tempTodo });

        // Update localStorage
        const localTodos = getFromLocalStorage("todos") || [];
        saveToLocalStorage("todos", [tempTodo, ...localTodos]);

        // Save to server
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(todoData),
        });

        if (!response.ok) {
          // Revert UI change if server request fails
          dispatch({ type: "DELETE_TODO", payload: tempId });

          // Revert localStorage
          const currentLocalTodos = getFromLocalStorage("todos") || [];
          const updatedLocalTodos = currentLocalTodos.filter(
            (todo) => todo._id !== tempId
          );
          saveToLocalStorage("todos", updatedLocalTodos);

          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create todo");
        }

        const data = await response.json();

        // Replace temp todo with server todo
        dispatch({
          type: "REPLACE_TEMP_TODO",
          payload: { tempId, todo: data.todo },
        });

        // Update localStorage
        const currentLocalTodos = getFromLocalStorage("todos") || [];
        const updatedLocalTodos = currentLocalTodos.map((todo) =>
          todo._id === tempId ? data.todo : todo
        );
        saveToLocalStorage("todos", updatedLocalTodos);

        showToast.success("Todo created successfully");
        return data.todo;
      } catch (error) {
        console.error("Error creating todo:", error);
        showToast.error(error.message);
        throw error;
      }
    },
    [user]
  );

  // Update a todo
  const updateTodo = useCallback(
    async (todoId, todoData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Find the todo to update
        const todoToUpdate = state.todos.find((todo) => todo._id === todoId);
        if (!todoToUpdate) {
          throw new Error("Todo not found");
        }

        // Update UI immediately
        const updatedTodo = { ...todoToUpdate, ...todoData };
        dispatch({ type: "UPDATE_TODO", payload: updatedTodo });

        // Update localStorage
        const localTodos = getFromLocalStorage("todos") || [];
        const updatedLocalTodos = localTodos.map((todo) =>
          todo._id === todoId ? updatedTodo : todo
        );
        saveToLocalStorage("todos", updatedLocalTodos);

        // Update on server
        const response = await fetch(`/api/todos/${todoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(todoData),
        });

        if (!response.ok) {
          // Revert changes if server request fails
          dispatch({ type: "UPDATE_TODO", payload: todoToUpdate });

          // Revert localStorage
          const currentLocalTodos = getFromLocalStorage("todos") || [];
          const revertedLocalTodos = currentLocalTodos.map((todo) =>
            todo._id === todoId ? todoToUpdate : todo
          );
          saveToLocalStorage("todos", revertedLocalTodos);

          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update todo");
        }

        const data = await response.json();

        // Update with server data
        dispatch({ type: "UPDATE_TODO", payload: data.todo });

        // Update localStorage with server data
        const refreshedLocalTodos = getFromLocalStorage("todos") || [];
        const refreshedUpdatedLocalTodos = refreshedLocalTodos.map((todo) =>
          todo._id === todoId ? data.todo : todo
        );
        saveToLocalStorage("todos", refreshedUpdatedLocalTodos);

        showToast.success("Todo updated successfully");
        return data.todo;
      } catch (error) {
        console.error("Error updating todo:", error);
        showToast.error(error.message);
        throw error;
      }
    },
    [state.todos]
  );

  // Delete a todo
  const deleteTodo = useCallback(
    async (todoId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Find the todo to delete (for potential rollback)
        const todoToDelete = state.todos.find((todo) => todo._id === todoId);
        if (!todoToDelete) {
          throw new Error("Todo not found");
        }

        // Update UI immediately
        dispatch({ type: "DELETE_TODO", payload: todoId });

        // Update localStorage
        const localTodos = getFromLocalStorage("todos") || [];
        const updatedLocalTodos = localTodos.filter(
          (todo) => todo._id !== todoId
        );
        saveToLocalStorage("todos", updatedLocalTodos);

        // Delete from server
        const response = await fetch(`/api/todos/${todoId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Revert changes if server request fails
          dispatch({ type: "ADD_TODO", payload: todoToDelete });

          // Revert localStorage
          const currentLocalTodos = getFromLocalStorage("todos") || [];
          saveToLocalStorage("todos", [...currentLocalTodos, todoToDelete]);

          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete todo");
        }

        showToast.success("Todo deleted successfully");
      } catch (error) {
        console.error("Error deleting todo:", error);
        showToast.error(error.message);
        throw error;
      }
    },
    [state.todos]
  );

  // Toggle todo completion
  const toggleTodoCompletion = useCallback(
    async (todoId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Find the todo to toggle
        const todoToToggle = state.todos.find((todo) => todo._id === todoId);
        if (!todoToToggle) {
          throw new Error("Todo not found");
        }

        // Optimistic UI update
        const updatedTodo = {
          ...todoToToggle,
          isCompleted: !todoToToggle.isCompleted,
        };
        dispatch({ type: "UPDATE_TODO", payload: updatedTodo });

        // Update localStorage if available
        if (typeof window !== "undefined") {
          const localTodos = getFromLocalStorage("todos") || [];
          const updatedLocalTodos = localTodos.map((todo) =>
            todo._id === todoId ? updatedTodo : todo
          );
          saveToLocalStorage("todos", updatedLocalTodos);
        }

        // API call
        const response = await fetch(`/api/todos/${todoId}/toggle`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Revert optimistic update if API call fails
          dispatch({ type: "UPDATE_TODO", payload: todoToToggle });

          if (typeof window !== "undefined") {
            const currentLocalTodos = getFromLocalStorage("todos") || [];
            const revertedLocalTodos = currentLocalTodos.map((todo) =>
              todo._id === todoId ? todoToToggle : todo
            );
            saveToLocalStorage("todos", revertedLocalTodos);
          }

          let errorMessage = "Failed to toggle todo completion";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // Final update with server response
        dispatch({ type: "UPDATE_TODO", payload: data.todo });

        if (typeof window !== "undefined") {
          const refreshedLocalTodos = getFromLocalStorage("todos") || [];
          const refreshedUpdatedLocalTodos = refreshedLocalTodos.map((todo) =>
            todo._id === todoId ? data.todo : todo
          );
          saveToLocalStorage("todos", refreshedUpdatedLocalTodos);
        }

        return data.todo;
      } catch (error) {
        console.error("Error toggling todo completion:", error);
        showToast.error(error.message);
        throw error;
      }
    },
    [state.todos]
  );

  // Fetch todos on mount
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [fetchTodos, user]);

  return {
    todos: state.todos,
    loading: state.loading,
    error: state.error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
  };
}
