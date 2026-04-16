"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface IActiveTrailTimerProps {
  isActive: boolean;
  onTimeUpdate?: (seconds: number) => void;
}
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default function ActiveTrailTimer({
  isActive,
  onTimeUpdate,
}: IActiveTrailTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          onTimeUpdate?.(newSeconds);
          return newSeconds;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onTimeUpdate]);
  return (
    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-mono shadow-xl border border-white/10">
      <Clock size={18} className="text-emerald-400" />
      <span className="tracking-wider">{formatTime(seconds)}</span>
    </div>
  );
}
