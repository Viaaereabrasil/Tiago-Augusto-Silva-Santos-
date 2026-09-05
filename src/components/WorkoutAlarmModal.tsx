import React, { useEffect, useState, useCallback } from 'react';
import {
  BellRing,
  Play,
  Clock,
  Volume2,
  VolumeX,
  X,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Square,
  AlertCircle
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface WorkoutAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: (templateId: string) => void;
  onSnooze: (minutes: number) => void;
  workoutTitle: string;
  templateId: string;
  scheduledTime: string;
  soundPattern?: 'intense' | 'classic' | 'chime' | 'countdown';
}

export const WorkoutAlarmModal: React.FC<WorkoutAlarmModalProps> = ({
  isOpen,
  onClose,
  onStartWorkout,
  onSnooze,
  workoutTitle,
  templateId,
  scheduledTime,
  soundPattern = 'intense',
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(true);

  // Stop alarm sound and stop vibrating
  const handleStopAlarm = useCallback(() => {
    sounds.stopAlarm();
    setIsAlarmActive(false);
    setIsMuted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsMuted(false);
      setIsAlarmActive(true);
      const pattern = (soundPattern || 'intense') as 'intense' | 'classic' | 'chime' | 'countdown';
      sounds.startAlarm(pattern);
    } else {
      sounds.stopAlarm();
      setIsAlarmActive(false);
    }

    return () => {
      sounds.stopAlarm();
    };
  }, [isOpen, soundPattern]);

  // Keyboard shortcut: Space, Enter, or Escape stops the alarm immediately
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        if (isAlarmActive) {
          handleStopAlarm();
        } else if (e.key === 'Escape') {
          handleDismiss();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAlarmActive, handleStopAlarm]);

  const handleToggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const pattern = (soundPattern || 'intense') as 'intense' | 'classic' | 'chime' | 'countdown';
    if (isMuted || !isAlarmActive) {
      sounds.startAlarm(pattern);
      setIsMuted(false);
      setIsAlarmActive(true);
    } else {
      handleStopAlarm();
    }
  };

  const handleStart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleStopAlarm();
    onStartWorkout(templateId);
    onClose();
  };

  const handleSnoozeClick = (minutes = 5, e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleStopAlarm();
    onSnooze(minutes);
    onClose();
  };

  const handleDismiss = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleStopAlarm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="workout-alarm-backdrop"
      onClick={(e) => {
        // Clicking backdrop stops alarm if ringing, or closes modal if already stopped
        if (e.target === e.currentTarget) {
          if (isAlarmActive) {
            handleStopAlarm();
          } else {
            handleDismiss();
          }
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      title="Clique no fundo para parar o alarme"
    >
      <div
        id="workout-alarm-modal"
        onClick={(e) => {
          // If user clicks anywhere on the alarm card and it's active, stop it!
          // We only stop the alarm sound if they clicked directly on the card or non-button areas
          const target = e.target as HTMLElement;
          if (isAlarmActive && !target.closest('button')) {
            handleStopAlarm();
          }
        }}
        className={`relative w-full max-w-lg bg-zinc-950 border-2 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-100 animate-in zoom-in-95 duration-200 cursor-default ${
          isAlarmActive
            ? 'border-rose-500 shadow-rose-500/30'
            : 'border-emerald-500/60 shadow-emerald-500/20'
        }`}
      >
        {/* Glowing Pulse Header Background */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isAlarmActive ? 'bg-rose-500/25 animate-pulse' : 'bg-emerald-500/15'
          }`}
        />

        {/* Top bar with Status / Mute / Dismiss */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800/80 relative z-10">
          <div
            onClick={isAlarmActive ? handleStopAlarm : undefined}
            className={`flex items-center gap-2 cursor-pointer select-none rounded-lg px-2 py-1 transition ${
              isAlarmActive ? 'hover:bg-rose-500/10' : ''
            }`}
            title={isAlarmActive ? 'Clique para parar o som' : undefined}
          >
            {isAlarmActive ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 animate-bounce" />
                  Alarme Tocando (Toque p/ Parar)
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Alarme Silenciado
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-alarm-toggle-sound"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                !isAlarmActive || isMuted
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
              }`}
              title={!isAlarmActive || isMuted ? 'Tocar Alarme Novamente' : 'Silenciar Alarme'}
            >
              {!isAlarmActive || isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[11px] hidden sm:inline">
                {!isAlarmActive || isMuted ? 'Silenciado' : 'Tocando'}
              </span>
            </button>

            <button
              id="btn-alarm-close-x"
              onClick={handleDismiss}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition active:scale-95"
              title="Fechar / Dispensar Alarme"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Alarm Content */}
        <div className="p-5 sm:p-7 text-center space-y-5 relative z-10">
          {/* Big Interactive Animated Alarm Target - Clicking it immediately stops the alarm! */}
          <div
            id="alarm-interactive-target"
            onClick={isAlarmActive ? handleStopAlarm : undefined}
            className={`mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 shadow-2xl flex items-center justify-center transition-all duration-300 select-none ${
              isAlarmActive
                ? 'bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-rose-600/40 cursor-pointer hover:scale-105 active:scale-95 group'
                : 'bg-zinc-800 shadow-zinc-900 cursor-default'
            }`}
            title={isAlarmActive ? 'CLIQUE AQUI PARA PARAR O ALARME' : 'Alarme Parado'}
          >
            <div className="w-full h-full bg-zinc-950 rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden p-2">
              {isAlarmActive ? (
                <>
                  <div className="absolute inset-0 bg-rose-500/15 animate-pulse" />
                  <BellRing className="w-9 h-9 sm:w-11 sm:h-11 text-rose-400 animate-bounce group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[10px] font-black uppercase text-rose-300 tracking-wider">
                    Toque p/ Parar
                  </span>
                </>
              ) : (
                <>
                  <Dumbbell className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-400">
                    Silenciado
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-bold mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Horário Agendado: {scheduledTime}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAlarmActive ? 'Hora de Treinar! 🔥' : 'Alarme Parado ✅'}
            </h2>

            <p className="text-base sm:text-lg font-bold text-amber-300 mt-1">
              {workoutTitle}
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
              {isAlarmActive
                ? 'Clique no botão abaixo ou toque em qualquer lugar do alarme para parar o som.'
                : 'Mantenha sua disciplina e consistência. Inicie o treino agora ou agende para depois!'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary STOP Button if alarm is ringing */}
            {isAlarmActive && (
              <button
                id="btn-stop-alarm-primary"
                onClick={handleStopAlarm}
                className="w-full py-4 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-2xl shadow-rose-600/40 border-2 border-rose-400 animate-pulse cursor-pointer"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>PARAR ALARME AGORA</span>
              </button>
            )}

            {/* Start Workout Button */}
            <button
              id="btn-alarm-start-workout"
              onClick={handleStart}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition active:scale-95 shadow-xl group ${
                isAlarmActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/25'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-emerald-500/30'
              }`}
            >
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              <span>INICIAR TREINO AGORA</span>
            </button>

            {/* Secondary Controls (Snooze & Dismiss) */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="btn-alarm-snooze"
                onClick={(e) => handleSnoozeClick(5, e)}
                className="py-3 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-amber-400 border border-zinc-700 hover:border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Clock className="w-4 h-4" />
                <span>Adiar 5 min (Snooze)</span>
              </button>

              <button
                id="btn-alarm-dismiss"
                onClick={handleDismiss}
                className="py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <X className="w-4 h-4" />
                <span>Dispensar Alarme</span>
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="p-3 bg-zinc-900/60 border-t border-zinc-850 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Toque na tela ou pressione Espaço / Esc para parar o alarme a qualquer momento.</span>
        </div>
      </div>
    </div>
  );
};
