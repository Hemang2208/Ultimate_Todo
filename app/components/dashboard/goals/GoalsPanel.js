"use client";

import { Plus } from "lucide-react";
import GoalItem from "./GoalItem";

export default function GoalsPanel({
  isDarkMode,
  goals = { daily: [], weekly: [] },
  setShowGoalsModal,
  toggleGoalCompleted,
  handleRemoveGoal,
}) {
  // Fix: Changed weeklyGoals to goals.weekly in the ternary operation
  const dailyGoals = Array.isArray(goals.daily) ? goals.daily : [];
  const weeklyGoals = Array.isArray(goals.weekly) ? goals.weekly : [];

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-violet-50"
      } rounded-xl p-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-xl font-semibold ${
            isDarkMode ? "text-white" : "text-violet-900"
          }`}
        >
          Goals
        </h2>
        <button
          onClick={() => setShowGoalsModal(true)}
          className={`${
            isDarkMode
              ? "bg-violet-700 hover:bg-violet-800"
              : "bg-violet-600 hover:bg-violet-700"
          } p-2 rounded-full text-white`}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3
            className={`font-medium ${
              isDarkMode ? "text-gray-300" : "text-violet-800"
            } mb-2`}
          >
            Daily Goals
          </h3>
          {dailyGoals.length === 0 ? (
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-violet-600"
              }`}
            >
              No daily goals set
            </p>
          ) : (
            <ul className="space-y-2">
              {dailyGoals.map((goal) => (
                <GoalItem
                  key={goal._id}
                  goal={goal}
                  isDarkMode={isDarkMode}
                  toggleGoalCompleted={toggleGoalCompleted}
                  handleRemoveGoal={handleRemoveGoal}
                />
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3
            className={`font-medium ${
              isDarkMode ? "text-gray-300" : "text-violet-800"
            } mb-2`}
          >
            Weekly Goals
          </h3>
          {weeklyGoals.length === 0 ? (
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-violet-600"
              }`}
            >
              No weekly goals set
            </p>
          ) : (
            <ul className="space-y-2">
              {weeklyGoals.map((goal) => (
                <GoalItem
                  key={goal._id}
                  goal={goal}
                  isDarkMode={isDarkMode}
                  toggleGoalCompleted={toggleGoalCompleted}
                  handleRemoveGoal={handleRemoveGoal}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
