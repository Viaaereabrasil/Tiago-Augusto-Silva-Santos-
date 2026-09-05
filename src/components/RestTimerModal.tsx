import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Plus, Bell, Volume2, VolumeX, Minimize2, Maximize2, Zap } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const RestTimerModal: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initialSeconds when changed
  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setTimeLeft(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRunning(false);
            if (soundEnabled) {
              sounds.playTimerDone();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isRunning, soundEnabled]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progress = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const strokeDashoffset = 283 - (283 * (100 - progress)) / 100;

  const setPreset = (sec: number) => {
    setTotalSeconds(sec);
    setTimeLeft(sec);
    setIsRunning(true);
  };

  const addTime = (sec: number) => {
    setTimeLeft((prev) => {
      const next = prev + sec;
      if (next > totalSeconds) {
        setTotalSeconds(next);
      }
      return next;
    });
    if (!isRunning) setIsRunning(true);
  };

  // Minimized floating bubble
  if (isMinimized) {
    return (
      <div
        id="rest-timer-minimized"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-50 bg-zinc-900 border-2 border-amber-500 rounded-full shadow-2xl p-2.5 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all group"
      >
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-zinc-600'}`} />
        <span className="font-mono font-black text-amber-300 text-sm">{formattedTime}</span>
        <Maximize2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition" />
      </div>
    );
  }

  return (
    <div
      id="rest-timer-docked"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-zinc-850/80 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>Cronômetro de Descanso</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            title="Minimizar cronômetro"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
            title="Fechar cronômetro"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body: Circular progress & Time */}
      <div className="p-4 flex flex-col items-center">
        <div
          id="rest-timer-circle"
          onClick={() => {
            if (timeLeft === 0) {
              sounds.stopAlarm();
              setTimeLeft(totalSeconds);
              setIsRunning(false);
            } else {
              setIsRunning(!isRunning);
            }
          }}
          className="relative w-32 h-32 flex items-center justify-center my-1 cursor-pointer select-none group transition-transform hover:scale-105 active:scale-95"
          title={
            timeLeft === 0
              ? 'Clique para parar o alarme e reiniciar'
              : isRunning
              ? 'Clique para pausar'
              : 'Clique para continuar'
          }
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-zinc-800"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`transition-all duration-300 ${
                timeLeft === 0 ? 'stroke-rose-500 animate-pulse' : 'stroke-amber-400'
              }`}
              strokeWidth="7"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span
              className={`font-mono text-3xl font-extrabold tracking-tight ${
                timeLeft === 0 ? 'text-rose-400 animate-bounce' : 'text-white'
              }`}
            >
              {formattedTime}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              {timeLeft === 0 ? 'PRONTO! (CLIQUE P/ PARAR)' : isRunning ? 'DESCANSANDO' : 'PAUSADO'}
            </span>
          </div>
        </div>

        {/* Quick Add Time Buttons */}
        <div className="flex items-center gap-2 mt-2 w-full justify-center">
          <button
            onClick={() => addTime(15)}
            className="px-2.5 py-1 text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-750 hover:text-white rounded-lg border border-zinc-700 transition"
          >
            +15s
          </button>
          <button
            onClick={() => addTime(30)}
            className="px-2.5 py-1 text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-750 hover:text-white rounded-lg border border-zinc-700 transition"
          >
            +30s
          </button>
          <button
            onClick={() => addTime(60)}
            className="px-2.5 py-1 text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-750 hover:text-white rounded-lg border border-zinc-700 transition"
          >
            +60s
          </button>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            id="btn-timer-reset"
            onClick={() => {
              setTimeLeft(totalSeconds);
              setIsRunning(false);
            }}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 transition active:scale-95"
            title="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="btn-timer-toggle"
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-zinc-950" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>Continuar</span>
              </>
            )}
          </button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-4 gap-1.5 w-full mt-4 pt-3 border-t border-zinc-800/80">
          {[45, 60, 90, 120].map((preset) => (
            <button
              key={preset}
              onClick={() => setPreset(preset)}
              className={`py-1 rounded-lg text-xs font-bold transition ${
                totalSeconds === preset
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-750'
              }`}
            >
              {preset}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
