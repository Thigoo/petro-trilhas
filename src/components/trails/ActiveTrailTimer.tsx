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

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef(0); // para throttle leve do callback

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      startTimeRef.current = null;
      return;
    }

    // Inicia o timer com o tempo real
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsedMs = Date.now() - startTimeRef.current;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);

      // Atualiza display
      setDisplayTime(formatTime(elapsedSeconds));

      // Chama onTimeUpdate com throttle (a cada 5 segundos ou quando mudar significativamente)
      if (elapsedSeconds - lastUpdateRef.current >= 5 || elapsedSeconds === 0) {
        onTimeUpdate?.(elapsedSeconds);
        lastUpdateRef.current = elapsedSeconds;
      }
    }, 1000); // mantemos 1000ms, mas o cálculo é baseado em tempo real

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
