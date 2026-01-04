import React, { useState, useEffect } from 'react';
import { Thai } from '../mock-data/mockData';

interface CountdownTimerProps {
  thai: Thai;
  onTimeUp?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ thai, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // Mock countdown - calculate time to next session
    const calculateTimeLeft = () => {
      const now = new Date();
      const times = thai.times;
      
      // Find next time slot
      let nextTime: Date | null = null;
      for (const timeStr of times) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const targetTime = new Date();
        targetTime.setHours(hours, minutes, 0, 0);
        
        if (targetTime > now) {
          nextTime = targetTime;
          break;
        }
      }
      
      // If no time today, use first time tomorrow
      if (!nextTime) {
        const [hours, minutes] = times[0].split(':').map(Number);
        nextTime = new Date();
        nextTime.setDate(nextTime.getDate() + 1);
        nextTime.setHours(hours, minutes, 0, 0);
      }
      
      const diff = nextTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        onTimeUp?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [thai, onTimeUp]);

  if (!timeLeft) return null;

  return (
    <div className="bg-gradient-to-r from-tet-red-500 to-tet-red-600 text-white rounded-lg p-4 shadow-lg">
      <div className="text-center">
        <p className="text-sm mb-2">Thời gian còn lại đến phiên tiếp theo:</p>
        <div className="flex justify-center space-x-4 text-2xl font-bold">
          <div className="bg-white/20 rounded px-4 py-2">
            <div>{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs font-normal">Giờ</div>
          </div>
          <div className="bg-white/20 rounded px-4 py-2">
            <div>{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs font-normal">Phút</div>
          </div>
          <div className="bg-white/20 rounded px-4 py-2">
            <div>{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs font-normal">Giây</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

