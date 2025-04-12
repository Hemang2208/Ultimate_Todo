"use client";

import { useState, useEffect } from 'react';
import { Brain, Lightbulb, Clock, Target } from 'lucide-react';

const SmartSuggestions = ({ todos, stats, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    generateSuggestions();
  }, [todos, stats]);

  const generateSuggestions = () => {
    const newSuggestions = [];

    // Analyze overdue tasks
    const overdueTasks = todos.filter(todo => 
      !todo.isCompleted && 
      new Date(todo.dueDate) < new Date() && 
      todo.dueDate
    );

    if (overdueTasks.length > 0) {
      newSuggestions.push({
        type: 'reschedule',
        icon: Clock,
        title: 'Overdue Tasks',
        description: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider rescheduling them.`,
        action: () => onApplySuggestion('reschedule', overdueTasks)
      });
    }

    // Analyze task completion patterns
    const completedTasks = todos.filter(todo => todo.isCompleted);
    const mostProductiveCategory = Object.entries(stats.completedByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostProductiveCategory) {
      newSuggestions.push({
        type: 'productivity',
        icon: Target,
        title: 'Productivity Insight',
        description: `You're most productive with ${mostProductiveCategory[0]} tasks. Consider focusing on these during your peak hours.`,
        action: () => onApplySuggestion('focus', { category: mostProductiveCategory[0] })
      });
    }

    // Suggest task grouping
    const categories = {};
    todos.forEach(todo => {
      if (!todo.isCompleted && todo.category) {
        categories[todo.category] = (categories[todo.category] || 0) + 1;
      }
    });

    const categoryWithMostTasks = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0];

    if (categoryWithMostTasks && categoryWithMostTasks[1] >= 3) {
      newSuggestions.push({
        type: 'batch',
        icon: Brain,
        title: 'Batch Processing',
        description: `You have ${categoryWithMostTasks[1]} tasks in ${categoryWithMostTasks[0]}. Consider batch processing them for better efficiency.`,
        action: () => onApplySuggestion('batch', { category: categoryWithMostTasks[0] })
      });
    }

    // Suggest breaks based on completed tasks
    if (completedTasks.length >= 3) {
      newSuggestions.push({
        type: 'break',
        icon: Lightbulb,
        title: 'Take a Break',
        description: 'You\'ve completed several tasks. Consider taking a short break to maintain productivity.',
        action: () => onApplySuggestion('break')
      });
    }

    setSuggestions(newSuggestions);
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2 text-violet-600 dark:text-violet-400" />
        Smart Suggestions
      </h2>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer"
            onClick={suggestion.action}
          >
            <suggestion.icon className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{suggestion.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;