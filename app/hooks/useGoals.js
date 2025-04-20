"use client";

import { useEffect, useCallback, useReducer } from "react";
import { showToast } from "../utils/toastUtils";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/dualStorage";
import useAuth from "./useAuth";

// Reducer for goals state management
// filepath: d:\College\Skills\Development\WEB Development\GitHub\Ultimate Todo\todo\app\hooks\useGoals.js
const goalsReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, goals: action.payload, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_GOAL":
      return {
        ...state,
        goals: {
          ...state.goals,
          [action.payload.type]: [
            ...(state.goals[action.payload.type] || []), // Fallback to an empty array
            action.payload,
          ],
        },
      };
    case "UPDATE_GOAL":
      return {
        ...state,
        goals: {
          ...state.goals,
          [action.payload.type]: (state.goals[action.payload.type] || []).map(
            (goal) => (goal._id === action.payload._id ? action.payload : goal)
          ),
        },
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals: {
          ...state.goals,
          [action.payload.type]: (
            state.goals[action.payload.type] || []
          ).filter((goal) => goal._id !== action.payload._id),
        },
      };
    case "REPLACE_TEMP_GOAL":
      return {
        ...state,
        goals: {
          ...state.goals,
          [action.payload.type]: (state.goals[action.payload.type] || []).map(
            (goal) =>
              goal._id === action.payload.tempId ? action.payload.goal : goal
          ),
        },
      };
    default:
      return state;
  }
};

export default function useGoals() {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(goalsReducer, {
    goals: { daily: [], weekly: [] },
    loading: true,
    error: null,
  });

  // Fetch all goals
  const fetchGoals = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_START" });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Try to get goals from localStorage first for immediate UI
      const localGoals = getFromLocalStorage("goals");
      if (localGoals) {
        dispatch({ type: "FETCH_SUCCESS", payload: localGoals });
      }

      // Then fetch from server to ensure data is up-to-date
      const response = await fetch("/api/goals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch goals");
      }

      const data = await response.json();

      // Update localStorage and state with server data
      saveToLocalStorage("goals", data);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching goals:", error);
      dispatch({ type: "FETCH_ERROR", payload: error.message });
      showToast.error(error.message);
    }
  }, []);

  // Create a new goal
  const createGoal = useCallback(
    async (goalData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Generate a temporary ID for immediate UI update
        const tempId = `temp-${Date.now()}`;
        const tempGoal = {
          ...goalData,
          _id: tempId,
          createdAt: new Date().toISOString(),
          user: user?._id,
          userName: user?.name,
        };

        // Update UI immediately
        dispatch({ type: "ADD_GOAL", payload: tempGoal });

        // Update localStorage
        const localGoals = getFromLocalStorage("goals") || {
          daily: [],
          weekly: [],
        };
        const updatedLocalGoals = {
          ...localGoals,
          [goalData.type]: [...(localGoals[goalData.type] || []), tempGoal],
        };
        saveToLocalStorage("goals", updatedLocalGoals);

        // Save to server
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(goalData),
        });

        if (!response.ok) {
          // Revert UI change if server request fails
          dispatch({
            type: "DELETE_GOAL",
            payload: { _id: tempId, type: goalData.type },
          });

          // Revert localStorage
          const currentLocalGoals = getFromLocalStorage("goals") || {
            daily: [],
            weekly: [],
          };
          const revertedLocalGoals = {
            ...currentLocalGoals,
            [goalData.type]: (currentLocalGoals[goalData.type] || []).filter(
              (goal) => goal._id !== tempId
            ),
          };
          saveToLocalStorage("goals", revertedLocalGoals);

          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create goal");
        }

        const data = await response.json();

        // Replace temp goal with server goal
        dispatch({
          type: "REPLACE_TEMP_GOAL",
          payload: {
            tempId,
            goal: data.goal,
            type: goalData.type,
          },
        });

        // Update localStorage
        const currentLocalGoals = getFromLocalStorage("goals") || {
          daily: [],
          weekly: [],
        };
        const updatedGoalsAfterServer = {
          ...currentLocalGoals,
          [goalData.type]: (currentLocalGoals[goalData.type] || []).map(
            (goal) => (goal._id === tempId ? data.goal : goal)
          ),
        };
        saveToLocalStorage("goals", updatedGoalsAfterServer);

        showToast.success("Goal created successfully");
        return data.goal;
      } catch (error) {
        console.error("Error creating goal:", error);
        showToast.error(error.message);
        throw error;
      }
    },
    [user]
  );

  // Toggle goal completion
  const toggleGoalCompletion = useCallback(
    async (goalId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Find the goal and its type
        let goalType = null;
        let foundGoal = null;

        for (const type in state.goals) {
          const goal = state.goals[type].find((g) => g._id === goalId);
          if (goal) {
            goalType = type;
            foundGoal = goal;
            break;
          }
        }

        if (!goalType || !foundGoal) {
          throw new Error("Goal not found");
        }

        // Update UI immediately
        const updatedGoal = {
          ...foundGoal,
          completed: !foundGoal.completed,
        };

        dispatch({
          type: "UPDATE_GOAL",
          payload: { ...updatedGoal, type: goalType },
        });

        // Update localStorage
        const localGoals = getFromLocalStorage("goals") || {
          daily: [],
          weekly: [],
        };
        const updatedLocalGoals = {
          ...localGoals,
          [goalType]: (localGoals[goalType] || []).map((goal) =>
            goal._id === goalId ? updatedGoal : goal
          ),
        };
        saveToLocalStorage("goals", updatedLocalGoals);

        // Update on server
        const response = await fetch(`/api/goals/${goalId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Revert changes if server request fails
          dispatch({
            type: "UPDATE_GOAL",
            payload: { ...foundGoal, type: goalType },
          });

          // Revert localStorage
          const currentLocalGoals = getFromLocalStorage("goals") || {
            daily: [],
            weekly: [],
          };
          const revertedLocalGoals = {
            ...currentLocalGoals,
            [goalType]: (currentLocalGoals[goalType] || []).map((goal) =>
              goal._id === goalId ? foundGoal : goal
            ),
          };
          saveToLocalStorage("goals", revertedLocalGoals);

          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to toggle goal completion"
          );
        }

        const data = await response.json();

        // Update with server data
        dispatch({
          type: "UPDATE_GOAL",
          payload: { ...data.goal, type: goalType },
        });

        // Update localStorage with server data
        const refreshedLocalGoals = getFromLocalStorage("goals") || {
          daily: [],
          weekly: [],
        };
        const refreshedUpdatedLocalGoals = {
          ...refreshedLocalGoals,
          [goalType]: (refreshedLocalGoals[goalType] || []).map((goal) =>
            goal._id === goalId ? data.goal : goal
          ),
        };
        saveToLocalStorage("goals", refreshedUpdatedLocalGoals);
      } catch (error) {
        console.error("Error toggling goal completion:", error);
        showToast.error(error.message);
        throw error;
      }
    },
    [state.goals]
  );

  // Delete a goal
  const deleteGoal = useCallback(
    async (goalId, goalType) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Find the goal to delete (for potential rollback)
        const goalToDelete = state.goals[goalType]?.find(
          (goal) => goal._id === goalId
        );
        if (!goalToDelete) {
          throw new Error("Goal not found");
        }

        // Update UI immediately
        dispatch({
          type: "DELETE_GOAL",
          payload: { _id: goalId, type: goalType },
        });

        // Update localStorage
        const localGoals = getFromLocalStorage("goals") || {
          daily: [],
          weekly: [],
        };
        const updatedLocalGoals = {
          ...localGoals,
          [goalType]: (localGoals[goalType] || []).filter(
            (goal) => goal._id !== goalId
          ),
        };
        saveToLocalStorage("goals", updatedLocalGoals);

        // Delete from server
        const response = await fetch(`/api/goals/${goalId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Revert changes if server request fails
          dispatch({
            type: "ADD_GOAL",
            payload: { ...goalToDelete, type: goalType },
          });

          // Revert localStorage
          const currentLocalGoals = getFromLocalStorage("goals") || {
            daily: [],
            weekly: [],
          };
          const revertedLocalGoals = {
            ...currentLocalGoals,
            [goalType]: [...(currentLocalGoals[goalType] || []), goalToDelete],
          };
          saveToLocalStorage("goals", revertedLocalGoals);

          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete goal");
        }

        showToast.success("Goal deleted successfully");
      } catch (error) {
        console.error("Error deleting goal:", error);
        showToast.error(error.message);
        throw error;
      }
    },
    [state.goals]
  );

  // Fetch goals on mount
  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [fetchGoals, user]);

  return {
    goals: state.goals,
    loading: state.loading,
    error: state.error,
    fetchGoals,
    createGoal,
    toggleGoalCompletion,
    deleteGoal,
  };
}
