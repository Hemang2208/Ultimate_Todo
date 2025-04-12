import { useState } from 'react';
import { usePomodoro, TIMER_MODES } from '../hooks/usePomodoro';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const Timer = ({ className = '' }) => {
  const {
    timeLeft,
    mode,
    isRunning,
    formatTime,
    setCustomTime,
    start,
    pause,
    reset,
    switchMode,
    sessionCount
  } = usePomodoro();

  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);

  const formattedTime = formatTime(timeLeft);

  const handleCustomTimeSubmit = () => {
    setCustomTime(customHours, customMinutes, customSeconds);
    setShowCustomTime(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <TimerIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pomodoro Timer</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => switchMode(TIMER_MODES.WORK)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === TIMER_MODES.WORK ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <Brain className="w-4 h-4 inline-block mr-1" />
            Work
          </button>
          <button
            onClick={() => switchMode(TIMER_MODES.SHORT_BREAK)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === TIMER_MODES.SHORT_BREAK ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <Coffee className="w-4 h-4 inline-block mr-1" />
            Short Break
          </button>
          <button
            onClick={() => switchMode(TIMER_MODES.LONG_BREAK)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === TIMER_MODES.LONG_BREAK ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <Coffee className="w-4 h-4 inline-block mr-1" />
            Long Break
          </button>
        </div>
      </div>

      <div className="text-center py-8">
        {showCustomTime ? (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-center space-x-4">
              <input
                type="number"
                value={customHours}
                onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 px-3 py-2 border rounded-lg text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Hours"
                min="0"
              />
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-20 px-3 py-2 border rounded-lg text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Minutes"
                min="0"
                max="59"
              />
              <input
                type="number"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-20 px-3 py-2 border rounded-lg text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Seconds"
                min="0"
                max="59"
              />
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleCustomTimeSubmit}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Set Time
              </button>
              <button
                onClick={() => setShowCustomTime(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-6xl font-bold text-gray-800 dark:text-white cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            onClick={() => setShowCustomTime(true)}
          >
            {formattedTime.display}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={isRunning ? pause : start}
          className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start</span>
            </>
          )}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>
      <div className="text-center py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Session {sessionCount} of 4 • {mode === TIMER_MODES.WORK ? 'Focus Time' : mode === TIMER_MODES.SHORT_BREAK ? 'Short Break' : 'Long Break'}
        </p>
      </div>
    </div>
  );
};

export default Timer;