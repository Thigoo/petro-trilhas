"use client";

import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IActiveTrailTimerProps {
  isActive: boolean;
  onTimeUpdate?: (seconds: number) => void;
}
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
export default function ActiveTrailTimer({
  isActive,
  onTimeUpdate,
}: IActiveTrailTimerProps) {
  const [displayTime, setDisplayTime] = useState("00:00");
  const secondsRef = useRef(0); // ← Usa ref para não causar re-render
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      secondsRef.current += 1;
      const newSeconds = secondsRef.current;

      // Atualiza apenas o display (estado local do timer)
      setDisplayTime(formatTime(newSeconds));

      // Callback para a página (se precisar do tempo total)
      onTimeUpdate?.(newSeconds);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onTimeUpdate]);

  return (
    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-mono shadow-xl border border-white/10">
      <Clock size={18} className="text-emerald-400" />
      <span className="tracking-wider">{displayTime}</span>
    </div>
  );
}
