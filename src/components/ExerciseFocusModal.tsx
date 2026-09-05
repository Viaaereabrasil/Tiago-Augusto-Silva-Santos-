import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Plus, 
  Trash2, 
  X, 
  Maximize2, 
  Minimize2, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Scale, 
  BookOpen, 
  Video, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Activity, 
  Clock, 
  Layers, 
  History,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Exercise, WorkoutSet } from '../types';
import { getLastPerformanceForExercise } from '../utils/storage';
import { sounds } from '../utils/audio';

interface ExerciseFocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
  exerciseIndex: number;
  totalExercises: number;
  onUpdateExercise: (updated: Exercise) => void;
  onNextExercise?: () => void;
  onPrevExercise?: () => void;
  onOpenPlateCalc?: (exerciseName: string, defaultKg: number) => void;
  onOpenExerciseGuide?: (exerciseName: string, tab?: 'execucao' | 'video' | 'setup' | 'dicas' | 'erros') => void;
  onOpenVideo?: (exerciseName: string) => void;
  onSetCompletedToggle?: (set: WorkoutSet, completed: boolean) => void;
  soundEnabled?: boolean;
}

export const ExerciseFocusModal: React.FC<ExerciseFocusModalProps> = ({
  isOpen,
  onClose,
  exercise,
  exerciseIndex,
  totalExercises,
  onUpdateExercise,
  onNextExercise,
  onPrevExercise,
  onOpenPlateCalc,
  onOpenExerciseGuide,
  onOpenVideo,
  onSetCompletedToggle,
  soundEnabled = true,
}) => {
  // Find first uncompleted set index, or 0
  const [activeSetIndex, setActiveSetIndex] = useState<number>(0);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [autoStartTimerOnCheck, setAutoStartTimerOnCheck] = useState<boolean>(true);

  // Integrated Rest Timer state
  const [restSeconds, setRestSeconds] = useState<number>(90);
  const [restTimeLeft, setRestTimeLeft] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const lastPerf = getLastPerformanceForExercise(exercise.name);

  // When opening or when exercise changes, set activeSetIndex to first incomplete set
  useEffect(() => {
    if (isOpen && exercise.sets.length > 0) {
      const firstIncompleteIdx = exercise.sets.findIndex((s) => !s.completed);
      setActiveSetIndex(firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0);
    }
  }, [isOpen, exercise.id]);

  // Keep activeSetIndex in bounds if sets change
  useEffect(() => {
    if (activeSetIndex >= exercise.sets.length && exercise.sets.length > 0) {
      setActiveSetIndex(exercise.sets.length - 1);
    }
  }, [exercise.sets.length, activeSetIndex]);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Rest Timer ticking logic
  useEffect(() => {
    if (!isOpen) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            if (soundEnabled) {
              sounds.playTimerDone();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isOpen, isTimerRunning, soundEnabled]);

  if (!isOpen) return null;

  const currentSet = exercise.sets[activeSetIndex] || exercise.sets[0];
  const completedSetsCount = exercise.sets.filter((s) => s.completed).length;
  const isAllCompleted = exercise.sets.length > 0 && completedSetsCount === exercise.sets.length;

  const handleUpdateCurrentSet = (partial: Partial<WorkoutSet>) => {
    if (!currentSet) return;
    const newSets = [...exercise.sets];
    const updated = { ...currentSet, ...partial };

    if (partial.completed !== undefined && partial.completed !== currentSet.completed) {
      if (onSetCompletedToggle) {
        onSetCompletedToggle(updated, partial.completed);
      }
    }

    newSets[activeSetIndex] = updated;
    onUpdateExercise({ ...exercise, sets: newSets });
  };

  const triggerCelebration = (isFinalSetOfExercise: boolean) => {
    try {
      if (soundEnabled) {
        sounds.playSetCheck();
      }
      confetti({
        particleCount: isFinalSetOfExercise ? 45 : 25,
        spread: isFinalSetOfExercise ? 75 : 55,
        startVelocity: isFinalSetOfExercise ? 22 : 16,
        origin: { x: 0.5, y: 0.65 },
        colors: isFinalSetOfExercise
          ? ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ffffff', '#60a5fa']
          : ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#ffffff'],
        ticks: 50,
        gravity: 1.1,
        scalar: 0.8,
        shapes: ['circle', 'square'],
      });
    } catch {
      // Ignore
    }
  };

  const handleToggleCompleteCurrentSet = () => {
    if (!currentSet) return;
    const willBeCompleted = !currentSet.completed;

    if (willBeCompleted) {
      const remainingUncompleted = exercise.sets.filter((s, i) => i !== activeSetIndex && !s.completed).length;
      const willCompleteAll = remainingUncompleted === 0;
      triggerCelebration(willCompleteAll);

      // Start rest timer if enabled
      if (autoStartTimerOnCheck) {
        setRestTimeLeft(restSeconds);
        setIsTimerRunning(true);
      }

      handleUpdateCurrentSet({ completed: true });

      // Automatically advance to the next incomplete set if not all completed
      if (!willCompleteAll) {
        const nextIncomplete = exercise.sets.findIndex((s, i) => i > activeSetIndex && !s.completed);
        if (nextIncomplete !== -1) {
          setActiveSetIndex(nextIncomplete);
        } else {
          // Check if there is an uncompleted before
          const prevIncomplete = exercise.sets.findIndex((s) => !s.completed && s.id !== currentSet.id);
          if (prevIncomplete !== -1) {
            setActiveSetIndex(prevIncomplete);
          }
        }
      }
    } else {
      handleUpdateCurrentSet({ completed: false });
    }
  };

  const handleAddSet = () => {
    const last = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: `${exercise.id}-s${Date.now()}`,
      targetReps: last ? last.targetReps : 10,
      targetKg: last ? last.targetKg : undefined,
      actualReps: last ? (last.actualReps ?? last.targetReps) : 10,
      actualKg: last ? (last.actualKg ?? last.targetKg) : undefined,
      rir: last ? last.rir : 2,
      type: 'working',
      completed: false,
    };
    const newSets = [...exercise.sets, newSet];
    onUpdateExercise({ ...exercise, sets: newSets });
    setActiveSetIndex(newSets.length - 1);
  };

  const handleDeleteSet = (idx: number) => {
    if (exercise.sets.length <= 1) return;
    const newSets = exercise.sets.filter((_, i) => i !== idx);
    onUpdateExercise({ ...exercise, sets: newSets });
    if (activeSetIndex >= newSets.length) {
      setActiveSetIndex(newSets.length - 1);
    }
  };

  const handleAdjustKg = (delta: number) => {
    const currentKg = currentSet?.actualKg ?? currentSet?.targetKg ?? 0;
    const nextKg = Math.max(0, Math.round((currentKg + delta) * 10) / 10);
    handleUpdateCurrentSet({ actualKg: nextKg });
  };

  const handleAdjustReps = (delta: number) => {
    const currentReps = currentSet?.actualReps ?? currentSet?.targetReps ?? 10;
    const nextReps = Math.max(1, currentReps + delta);
    handleUpdateCurrentSet({ actualReps: nextReps });
  };

  // Rest Timer Formatter
  const timerMinutes = Math.floor(restTimeLeft / 60);
  const timerSecondsDisplay = restTimeLeft % 60;
  const formattedTimer = `${timerMinutes.toString().padStart(2, '0')}:${timerSecondsDisplay.toString().padStart(2, '0')}`;

  const setTimerPreset = (secs: number) => {
    setRestSeconds(secs);
    setRestTimeLeft(secs);
    setIsTimerRunning(true);
  };

  const getRirBadgeInfo = (rir?: number | null) => {
    switch (rir) {
      case 0:
        return { label: 'Falha Total (0 RIR)', desc: 'Nenhuma repetição restante possível', color: 'border-rose-500 bg-rose-500/20 text-rose-300' };
      case 1:
        return { label: '1 na Reserva', desc: 'Faria mais 1 repetição com esforço máximo', color: 'border-orange-500 bg-orange-500/20 text-orange-300' };
      case 2:
        return { label: '2 na Reserva', desc: 'Zona ideal de hipertrofia com segurança', color: 'border-amber-500 bg-amber-500/20 text-amber-300' };
      default:
        return { label: '3+ na Reserva', desc: 'Série de preparação ou aquecimento', color: 'border-zinc-700 bg-zinc-800 text-zinc-300' };
    }
  };

  const rirInfo = getRirBadgeInfo(currentSet?.rir);

  return (
    <div
      id="exercise-focus-overlay"
      className="fixed inset-0 z-50 bg-zinc-950/98 backdrop-blur-xl text-white flex flex-col h-screen max-h-screen select-none overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Bar / Header */}
      <header className="px-4 py-3 sm:px-6 sm:py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="btn-close-focus-mode"
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition active:scale-95 text-xs font-bold shrink-0"
            title="Sair do Modo Foco (ESC)"
          >
            <Minimize2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Sair do Foco</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                Ex. {exerciseIndex + 1}/{totalExercises}
              </span>
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight truncate">
                {exercise.name}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
              <span className="capitalize font-semibold text-zinc-300">{exercise.category}</span>
              <span>•</span>
              <span className="uppercase text-[10px] text-zinc-400">{exercise.equipment}</span>
              {lastPerf && (
                <>
                  <span>•</span>
                  <span className="text-[11px] text-amber-300/90 flex items-center gap-1">
                    <History className="w-3 h-3 text-amber-400" />
                    Recorde: {lastPerf.bestKg ? `${lastPerf.bestKg} kg` : 'registrado'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Helper Tools */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {exercise.equipment === 'barra' && onOpenPlateCalc && (
            <button
              onClick={() => {
                const kg = currentSet?.actualKg || currentSet?.targetKg || 60;
                onOpenPlateCalc(exercise.name, kg);
              }}
              className="px-3 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Calculadora de Anilhas"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Anilhas</span>
            </button>
          )}

          {onOpenExerciseGuide && (
            <button
              onClick={() => onOpenExerciseGuide(exercise.name, 'execucao')}
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Guia de Execução"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Execução</span>
            </button>
          )}

          {onOpenVideo && (
            <button
              onClick={() => onOpenVideo(exercise.name)}
              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Assistir Vídeo"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Vídeo</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="Fechar Modo Foco"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Fechar</span>
          </button>
        </div>
      </header>

      {/* Main Focus Workspace */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 max-w-4xl w-full mx-auto flex flex-col justify-between">
        
        {/* Set Navigator Tabs with automatic wrapping & comfortable spacing */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              Séries do Exercício ({completedSetsCount}/{exercise.sets.length} Concluídas)
            </span>
            {isAllCompleted && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Exercício Finalizado!
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 py-1">
            {exercise.sets.map((set, idx) => {
              const isActive = idx === activeSetIndex;
              return (
                <button
                  key={set.id}
                  onClick={() => setActiveSetIndex(idx)}
                  className={`px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                      : set.completed
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span>Série {idx + 1}</span>
                  {set.completed ? (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${isActive ? 'bg-zinc-950 text-amber-400' : 'bg-emerald-500 text-zinc-950'}`}>
                      ✓
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-75 font-mono">
                      {set.actualKg ?? set.targetKg ?? '--'}kg
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={handleAddSet}
              className="px-3.5 py-2.5 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 hover:bg-amber-500/10 hover:border-amber-500/40 text-zinc-400 hover:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Adicionar mais uma série"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Série</span>
            </button>
          </div>
        </div>

        {/* Big High-Visibility Active Set HUD */}
        {currentSet && (
          <div className="rounded-2xl sm:rounded-3xl bg-zinc-900/90 border-2 border-zinc-800 p-4 sm:p-6 shadow-2xl space-y-5">
            {/* Header info of active set */}
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-amber-400">
                  Série {activeSetIndex + 1} de {exercise.sets.length}
                </span>

                {/* Set Type Switcher */}
                <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
                  {(['working', 'top_set', 'feeder', 'warmup'] as const).map((t) => {
                    const isSelected = (currentSet.type || 'working') === t;
                    const labels: Record<string, string> = {
                      working: 'Trabalho',
                      top_set: 'Top Set',
                      feeder: 'Feeder',
                      warmup: 'Aquec.',
                    };
                    return (
                      <button
                        key={t}
                        onClick={() => handleUpdateCurrentSet({ type: t })}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {labels[t]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {exercise.sets.length > 1 && (
                <button
                  onClick={() => handleDeleteSet(activeSetIndex)}
                  className="text-xs text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition flex items-center gap-1"
                  title="Excluir esta série"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              )}
            </div>

            {/* Giant Grid of Metric Inputs (CARGA & REPS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CARGA (KG) - Giant Legible Display */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between space-y-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Scale className="w-4 h-4" /> Carga Total (kg)
                  </span>
                  {currentSet.targetKg && (
                    <span className="text-[11px] font-medium text-zinc-400">
                      Meta: {currentSet.targetKg} kg
                    </span>
                  )}
                </div>

                {/* Big Number Display & Direct Edit */}
                <div className="flex items-baseline justify-center gap-1 py-1">
                  <input
                    id="focus-input-kg"
                    type="number"
                    step="0.5"
                    value={currentSet.actualKg ?? currentSet.targetKg ?? ''}
                    placeholder="0"
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? undefined : parseFloat(raw);
                      handleUpdateCurrentSet({ actualKg: val !== undefined && !isNaN(val) ? Math.max(0, val) : undefined });
                    }}
                    className="w-32 sm:w-40 text-center font-mono font-black text-4xl sm:text-5xl bg-transparent border-b-2 border-amber-500/50 focus:border-amber-400 text-amber-300 focus:outline-none focus:ring-0 transition"
                  />
                  <span className="text-xl sm:text-2xl font-black text-zinc-400">kg</span>
                </div>

                {/* Steppers for Carga */}
                <div className="grid grid-cols-5 gap-1.5 w-full">
                  {[-5, -1, 1, 2.5, 5].map((delta) => (
                    <button
                      key={delta}
                      onClick={() => handleAdjustKg(delta)}
                      className="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-amber-400 font-mono font-bold text-xs sm:text-sm active:scale-95 transition"
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </button>
                  ))}
                </div>
              </div>

              {/* REPETIÇÕES (REPS) - Giant Legible Display */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between space-y-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Repetições Feitas
                  </span>
                  <span className="text-[11px] font-medium text-zinc-400">
                    Alvo: {currentSet.targetReps} reps
                  </span>
                </div>

                {/* Big Number Display & Direct Edit */}
                <div className="flex items-baseline justify-center gap-1 py-1">
                  <input
                    id="focus-input-reps"
                    type="number"
                    min="1"
                    max="100"
                    value={currentSet.actualReps ?? currentSet.targetReps ?? ''}
                    placeholder="10"
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? undefined : parseInt(raw, 10);
                      handleUpdateCurrentSet({ actualReps: val !== undefined && !isNaN(val) ? Math.max(1, val) : currentSet.targetReps });
                    }}
                    className="w-28 sm:w-36 text-center font-mono font-black text-4xl sm:text-5xl bg-transparent border-b-2 border-cyan-500/50 focus:border-cyan-400 text-white focus:outline-none focus:ring-0 transition"
                  />
                  <span className="text-xl sm:text-2xl font-black text-zinc-400">reps</span>
                </div>

                {/* Steppers for Reps */}
                <div className="grid grid-cols-4 gap-1.5 w-full">
                  {[-2, -1, 1, 2].map((delta) => (
                    <button
                      key={delta}
                      onClick={() => handleAdjustReps(delta)}
                      className="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-cyan-400 font-mono font-bold text-xs sm:text-sm active:scale-95 transition"
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIR / Esforço Selector (Repetições na Reserva) */}
            <div className="space-y-2 bg-zinc-950/60 p-3 sm:p-4 rounded-2xl border border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" /> Percepção de Esforço (RIR - Reps na Reserva)
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${rirInfo.color}`}>
                  {rirInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { rir: 0, label: '0 RIR', sub: 'Falha Total', color: 'hover:border-rose-500 hover:text-rose-400' },
                  { rir: 1, label: '1 RIR', sub: 'Quase Falha', color: 'hover:border-orange-500 hover:text-orange-400' },
                  { rir: 2, label: '2 RIR', sub: 'Hipertrofia Ideal', color: 'hover:border-amber-500 hover:text-amber-400' },
                  { rir: 3, label: '3+ RIR', sub: 'Aquecimento', color: 'hover:border-sky-500 hover:text-sky-400' },
                ].map((item) => {
                  const isSelected = (currentSet.rir ?? 2) === item.rir;
                  return (
                    <button
                      key={item.rir}
                      type="button"
                      onClick={() => handleUpdateCurrentSet({ rir: item.rir })}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center active:scale-95 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                          : `bg-zinc-900 border-zinc-800 text-zinc-400 ${item.color}`
                      }`}
                    >
                      <span className="font-black text-xs sm:text-sm">{item.label}</span>
                      <span className="text-[9px] sm:text-[10px] opacity-75 truncate">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Giant Prominent Complete Set Action Button */}
            <button
              id={`btn-focus-complete-set-${currentSet.id}`}
              onClick={handleToggleCompleteCurrentSet}
              className={`w-full py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 shadow-xl ${
                currentSet.completed
                  ? 'bg-zinc-800 hover:bg-zinc-750 text-emerald-400 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 shadow-emerald-500/30'
              }`}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${currentSet.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-950 text-emerald-400'}`}>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
              </div>
              <span>
                {currentSet.completed
                  ? `Série ${activeSetIndex + 1} Concluída! (Toque para desmarcar)`
                  : `CONCLUIR SÉRIE ${activeSetIndex + 1}`}
              </span>
            </button>
          </div>
        )}

        {/* Integrated Rest Timer & Cue Bar */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isTimerRunning ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <span>Cronômetro de Descanso</span>
                  <label className="text-[10px] text-zinc-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoStartTimerOnCheck}
                      onChange={(e) => setAutoStartTimerOnCheck(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 w-3 h-3"
                    />
                    <span>Auto-iniciar</span>
                  </label>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Descanse entre 60s e 180s para recuperação neural.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`font-mono font-black text-2xl sm:text-3xl ${isTimerRunning ? 'text-amber-400' : 'text-zinc-200'}`}>
                {formattedTimer}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-2 rounded-xl border font-bold transition active:scale-95 ${
                  isTimerRunning
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500 text-zinc-950 border-amber-400'
                }`}
                title={isTimerRunning ? 'Pausar' : 'Iniciar'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setRestTimeLeft(restSeconds);
                }}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition active:scale-95"
                title="Reiniciar timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Timer Presets with auto wrap & generous spacing */}
          <div className="flex flex-wrap items-center gap-2 py-0.5 w-full md:w-auto justify-end">
            {[60, 90, 120, 180].map((s) => (
              <button
                key={s}
                onClick={() => setTimerPreset(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border active:scale-95 ${
                  restSeconds === s && isTimerRunning
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Execution Cues & Posture Drawer */}
        {exercise.notes && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-3 sm:p-4 space-y-1.5">
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full flex items-center justify-between text-xs font-bold text-zinc-300 hover:text-amber-400 transition text-left"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                Lembretes de Postura & Execução
              </span>
              {showTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showTips && (
              <p className="text-xs text-zinc-300 leading-relaxed pt-1 border-t border-zinc-800">
                {exercise.notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation (Previous & Next Exercise) */}
      <footer className="px-4 py-3 bg-zinc-900/95 border-t border-zinc-800 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={onPrevExercise}
          disabled={exerciseIndex === 0 || !onPrevExercise}
          className="px-3 sm:px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition active:scale-95 border border-zinc-700"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exercício Anterior</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          Modo Foco em Execução • Zero Distrações
        </span>

        <button
          onClick={onNextExercise}
          disabled={exerciseIndex === totalExercises - 1 || !onNextExercise}
          className="px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none text-zinc-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
        >
          <span>Próximo Exercício</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
