import { useState, useRef, useEffect } from 'react';

export const TIMER_MODES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak'
};

export const DEFAULT_TIMES = {
  [TIMER_MODES.WORK]: 25 * 60,
  [TIMER_MODES.SHORT_BREAK]: 5 * 60,
  [TIMER_MODES.LONG_BREAK]: 15 * 60
};

export const usePomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES[TIMER_MODES.WORK]);
  const [mode, setMode] = useState(TIMER_MODES.WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [sessionCount, setSessionCount] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours,
      minutes,
      seconds: secs,
      display: `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    };
  };

  const setCustomTime = (hours, minutes, seconds) => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    setTimeLeft(totalSeconds);
  };

  const handleSessionComplete = () => {
    if (mode === TIMER_MODES.WORK) {
      setTotalSessions(prev => prev + 1);
      if (sessionCount === 4) {
        setSessionCount(1);
        switchMode(TIMER_MODES.LONG_BREAK);
      } else {
        setSessionCount(prev => prev + 1);
        switchMode(TIMER_MODES.SHORT_BREAK);
      }
    } else {
      switchMode(TIMER_MODES.WORK);
    }
  };

  const start = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      const startTime = performance.now();
      let lastUpdateTime = startTime;
      let accumulatedTime = 0;

      const tick = (currentTime) => {
        if (!intervalRef.current || !isRunning) {
          cancelAnimationFrame(intervalRef.current);
          intervalRef.current = null;
          return;
        }

        const deltaTime = currentTime - lastUpdateTime;
        accumulatedTime += deltaTime;

        if (accumulatedTime >= 1000) {
          const decrementAmount = Math.floor(accumulatedTime / 1000);
          accumulatedTime = accumulatedTime % 1000;

          setTimeLeft((prev) => {
            const newTime = Math.max(0, prev - decrementAmount);
            if (newTime === 0) {
              cancelAnimationFrame(intervalRef.current);
              intervalRef.current = null;
              setIsRunning(false);
              playNotification();
              handleSessionComplete();
              return 0;
            }
            return newTime;
          });
        }

        lastUpdateTime = currentTime;
        intervalRef.current = requestAnimationFrame(tick);
      };

      intervalRef.current = requestAnimationFrame(tick);
    }
  };

  const pause = () => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = () => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIMES[mode]);
  };

  const switchMode = (newMode) => {
    if (isRunning && intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
    setMode(newMode);
    setTimeLeft(DEFAULT_TIMES[newMode]);
  };

  const playNotification = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(mode === TIMER_MODES.WORK ? 'Break Time!' : 'Work Time!', {
          body: mode === TIMER_MODES.WORK ? 'Time to take a break!' : 'Break is over, back to work!'
        });
      }
    } catch (error) {
      console.error('Notification failed:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning && intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  return {
    timeLeft,
    mode,
    isRunning,
    currentTask,
    sessionCount,
    totalSessions,
    formatTime,
    setCustomTime,
    start,
    pause,
    reset,
    switchMode,
    setCurrentTask
  };
};