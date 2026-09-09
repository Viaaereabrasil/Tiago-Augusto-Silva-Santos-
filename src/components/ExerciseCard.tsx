import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Plus, 
  Trash2, 
  Flame, 
  Info, 
  Scale, 
  ChevronRight, 
  History, 
  Layers, 
  Sparkles,
  HelpCircle,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Video,
  Maximize2
} from 'lucide-react';
import { Exercise, WorkoutSet } from '../types';
import { getLastPerformanceForExercise } from '../utils/storage';
import { analyzeExerciseProgression } from '../utils/progressionEngine';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  onUpdateExercise: (updated: Exercise) => void;
  onOpenPlateCalc?: (exerciseName: string, defaultKg: number) => void;
  onSetCompletedToggle: (set: WorkoutSet, completed: boolean) => void;
  onOpenRirInfo: () => void;
  onOpenExerciseGuide?: (exerciseName: string, tab?: 'execucao' | 'video' | 'setup' | 'dicas' | 'erros') => void;
  onOpenVideo?: (exerciseName: string) => void;
  onOpenFocusMode?: (exerciseIndex: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseIndex,
  onUpdateExercise,
  onOpenPlateCalc,
  onSetCompletedToggle,
  onOpenRirInfo,
  onOpenExerciseGuide,
  onOpenVideo,
  onOpenFocusMode,
}) => {
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const lastPerf = getLastPerformanceForExercise(exercise.name);

  // Local Stopwatch for the exercise
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const formatStopwatch = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  // FASE 1: Motor de Progressão
  const progression = React.useMemo(() => {
    return analyzeExerciseProgression(exercise.name, exercise.sets[0]?.targetReps || 10);
  }, [exercise.name, exercise.sets]);

  const completedCount = exercise.sets.filter((s) => s.completed).length;
  const isFullyCompleted = exercise.sets.length > 0 && completedCount === exercise.sets.length;

  const triggerSetParticles = (targetElement: HTMLElement, willCompleteAllSets: boolean) => {
    try {
      const rect = targetElement.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      // Particle explosion originating from the clicked checkbox
      confetti({
        particleCount: willCompleteAllSets ? 36 : 22,
        spread: willCompleteAllSets ? 65 : 45,
        startVelocity: willCompleteAllSets ? 18 : 13,
        origin: { x, y },
        colors: willCompleteAllSets
          ? ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ffffff', '#60a5fa']
          : ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#ffffff'],
        ticks: 45,
        gravity: 1.2,
        scalar: 0.7,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback
    }
  };

  const handleToggleCheck = (e: React.MouseEvent<HTMLButtonElement>, index: number, set: WorkoutSet) => {
    const willBeCompleted = !set.completed;
    if (willBeCompleted) {
      const remainingUncompleted = exercise.sets.filter((s, i) => i !== index && !s.completed).length;
      const willCompleteAll = remainingUncompleted === 0;
      triggerSetParticles(e.currentTarget, willCompleteAll);
      
      // Auto-advance focus to the next set's weight input (Modo Rápido)
      const nextSet = exercise.sets[index + 1];
      if (nextSet) {
        setTimeout(() => {
          const nextInput = document.getElementById(`input-kg-${nextSet.id}`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
            nextInput.select(); // Highlight the text for quick overwrite
          }
        }, 50);
      }
    }
    handleUpdateSet(index, { completed: willBeCompleted });
  };

  const handleUpdateSet = (index: number, partial: Partial<WorkoutSet>) => {
    const newSets = [...exercise.sets];
    const current = newSets[index];
    const updated = { ...current, ...partial };

    if (partial.completed !== undefined && partial.completed !== current.completed) {
      onSetCompletedToggle(updated, partial.completed);
    }

    newSets[index] = updated;
    onUpdateExercise({ ...exercise, sets: newSets });
  };

  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: `${exercise.id}-s${Date.now()}`,
      targetReps: lastSet ? lastSet.targetReps : 10,
      targetKg: lastSet ? lastSet.targetKg : undefined,
      actualReps: lastSet ? (lastSet.actualReps ?? lastSet.targetReps) : 10,
      actualKg: lastSet ? (lastSet.actualKg ?? lastSet.targetKg) : undefined,
      rir: lastSet ? lastSet.rir : 2,
      type: 'working',
      completed: false,
    };
    onUpdateExercise({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const handleDeleteSet = (index: number) => {
    if (exercise.sets.length <= 1) return;
    const newSets = exercise.sets.filter((_, i) => i !== index);
    onUpdateExercise({ ...exercise, sets: newSets });
  };

  const getRirBadge = (rir?: number | null, type?: string) => {
    if (rir === 0) {
      return {
        text: '0 na reserva (Falha)',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        dot: 'bg-rose-500',
      };
    }
    if (rir === 1) {
      return {
        text: '1 na reserva',
        color: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        dot: 'bg-orange-400',
      };
    }
    if (rir === 2) {
      return {
        text: '2 na reserva',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-400',
      };
    }
    if (type === 'warmup') {
      return {
        text: 'Aquecimento',
        color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        dot: 'bg-sky-400',
      };
    }
    if (type === 'feeder') {
      return {
        text: 'Feeder / Preparatória',
        color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        dot: 'bg-indigo-400',
      };
    }
    return {
      text: 'Série Trabalho',
      color: 'bg-zinc-700 text-zinc-300 border-zinc-600',
      dot: 'bg-zinc-400',
    };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'peito':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'costas':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'ombros':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'triceps':
      case 'biceps':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'pernas':
      case 'gluteos':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'panturrilha':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      default:
        return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div
      id={`exercise-card-${exercise.id}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isFullyCompleted
          ? 'bg-zinc-900/90 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
          : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700/80 shadow-md'
      }`}
    >
      {/* Progression Traffic Light Header (Semáforo de Progressão) */}
      <div className={`px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs font-bold border-b ${
        progression.color === 'green' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20' :
        progression.color === 'yellow' ? 'bg-amber-950/30 text-amber-400 border-amber-500/20' :
        progression.color === 'red' ? 'bg-rose-950/30 text-rose-400 border-rose-500/20' :
        'bg-sky-950/30 text-sky-400 border-sky-500/20'
      }`}>
        <div className="flex items-center gap-1.5 uppercase tracking-wide">
          <span className="text-sm">
            {progression.color === 'green' ? '🟢' : 
             progression.color === 'yellow' ? '🟡' : 
             progression.color === 'red' ? '🔴' : '🔵'}
          </span>
          <span>Status: {progression.status}</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-90 bg-black/20 px-2 py-0.5 rounded-md border border-white/5">
          <span className="uppercase text-[10px] opacity-70">Meta de Hoje:</span>
          <span className="tracking-wide">{progression.goalText}</span>
        </div>
      </div>

      {/* Exercise Header */}
      <div className="p-3 sm:p-4 bg-zinc-850/60 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-amber-400 shrink-0 mt-0.5">
            {exerciseIndex + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                id={`btn-title-focus-${exercise.id}`}
                onClick={() => {
                  if (onOpenFocusMode) {
                    onOpenFocusMode(exerciseIndex);
                  } else if (onOpenExerciseGuide) {
                    onOpenExerciseGuide(exercise.name);
                  }
                }}
                className="text-sm sm:text-base font-bold text-white hover:text-amber-400 tracking-tight text-left transition flex items-center gap-1.5 group/title"
                title="Clique para abrir o Modo Foco (Tela Cheia sem distrações)"
              >
                <span>{exercise.name}</span>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400/70 group-hover/title:text-amber-400 transition inline shrink-0 opacity-80 group-hover/title:opacity-100 group-hover/title:scale-110" />
              </button>
              {isFullyCompleted && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-2.5 h-2.5 stroke-[3]" /> Concluído
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1 flex-wrap text-xs">
              <span
                className={`text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 sm:px-2 py-0.5 rounded-md border ${getCategoryColor(
                  exercise.category
                )}`}
              >
                {exercise.category}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium text-zinc-400 bg-zinc-800 px-1.5 sm:px-2 py-0.5 rounded-md border border-zinc-700/60 uppercase">
                {exercise.equipment}
              </span>

              {lastPerf && (
                <span className="text-[10px] sm:text-[11px] text-zinc-400 flex items-center gap-1">
                  <History className="w-3 h-3 text-amber-400/80" />
                  <span>Último: {lastPerf.bestKg ? `${lastPerf.bestKg} kg` : 'registrado'}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tools for this exercise with comfortable spacing & automatic wrapping */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {onOpenFocusMode && (
            <button
              id={`btn-focus-${exercise.id}`}
              onClick={() => onOpenFocusMode(exerciseIndex)}
              className="text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1.5 rounded-xl border border-amber-500/40 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              title="Abrir no Modo Foco (Tela Cheia sem distrações)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Foco</span>
            </button>
          )}

          {onOpenExerciseGuide && (
            <button
              id={`btn-guide-${exercise.id}`}
              onClick={() => onOpenExerciseGuide(exercise.name, 'execucao')}
              className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-amber-400 px-2.5 py-1.5 rounded-xl border border-zinc-700 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              title="Ver Exemplo & Como Executar"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Como Executar</span>
              <span className="sm:hidden">Guia</span>
            </button>
          )}

          {(onOpenVideo || onOpenExerciseGuide) && (
            <button
              id={`btn-video-${exercise.id}`}
              onClick={() => {
                if (onOpenVideo) {
                  onOpenVideo(exercise.name);
                } else if (onOpenExerciseGuide) {
                  onOpenExerciseGuide(exercise.name, 'video');
                }
              }}
              className="text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-2.5 py-1.5 rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              title="Assistir Vídeo Explicativo"
            >
              <Play className="w-3.5 h-3.5 fill-current text-rose-400" />
              <span>Vídeo</span>
            </button>
          )}

          {exercise.equipment === 'barra' && onOpenPlateCalc && (
            <button
              id={`btn-plate-calc-${exercise.id}`}
              onClick={() => {
                const highestKg = Math.max(
                  ...exercise.sets.map((s) => s.actualKg || s.targetKg || 0)
                );
                onOpenPlateCalc(exercise.name, highestKg > 0 ? highestKg : 50);
              }}
              className="text-xs font-semibold text-zinc-300 hover:text-amber-400 bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1.5 rounded-xl border border-zinc-700 flex items-center gap-1.5 transition active:scale-95"
              title="Calculadora de Anilhas na Barra"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Anilhas</span>
            </button>
          )}

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-2.5 py-1.5 rounded-xl border transition text-xs font-medium flex items-center gap-1.5 ${
              showNotes || exercise.notes
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-750'
            }`}
            title="Dicas Rápidas de Execução & Postura"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dica</span>
          </button>
        </div>
      </div>

      {/* Execution Notes / Cues */}
      {showNotes && exercise.notes && (
        <div className="px-3 sm:px-4 py-2 bg-amber-950/20 border-b border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">{exercise.notes}</p>
        </div>
      )}

      {/* Sets Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[340px] sm:min-w-0">
          <thead>
            <tr className="border-b border-zinc-800/80 text-[10px] sm:text-[11px] font-bold text-zinc-400 bg-zinc-900/40 uppercase tracking-wider">
              <th className="py-2 pl-2 sm:pl-3.5 pr-1 w-8 sm:w-12 text-center">Set</th>
              <th className="py-2 px-1 sm:px-2 w-20 sm:w-28 text-center">Carga</th>
              <th className="py-2 px-1 sm:px-2 w-16 sm:w-24 text-center">Reps</th>
              <th className="py-2 px-1 sm:px-2">
                <div className="flex items-center gap-1">
                  <span>RIR</span>
                  <button
                    onClick={onOpenRirInfo}
                    className="text-zinc-400 hover:text-amber-400 transition"
                    title="O que é RIR / Reserva?"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>
              </th>
              <th className="py-2 pr-2 sm:pr-3.5 pl-1 w-24 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-xs">
            {exercise.sets.map((set, sIdx) => {
              const rirInfo = getRirBadge(set.rir, set.type);
              const currentKg = set.actualKg !== undefined ? set.actualKg : (set.targetKg ?? '');
              const currentReps = set.actualReps !== undefined ? set.actualReps : set.targetReps;

              return (
                <tr
                  key={set.id || sIdx}
                  className={`transition-colors group ${
                    set.completed
                      ? 'bg-emerald-950/20 text-zinc-300'
                      : 'hover:bg-zinc-800/30'
                  }`}
                >
                  {/* Set Index / Type */}
                  <td className="py-2 pl-2 sm:pl-3.5 pr-1 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md font-mono text-[11px] sm:text-xs font-bold ${
                        set.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {sIdx + 1}
                    </span>
                  </td>

                  {/* Weight (Kg) Input */}
                  <td className="py-2 px-1 sm:px-2 text-center">
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                      <input
                        id={`input-kg-${set.id}`}
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder={set.targetKg ? `${set.targetKg}` : '—'}
                        value={currentKg}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const val = raw === '' ? undefined : parseFloat(raw);
                          handleUpdateSet(sIdx, { actualKg: val !== undefined && !isNaN(val) ? Math.max(0, val) : undefined });
                        }}
                        className={`w-14 sm:w-16 h-8 text-center font-mono font-bold rounded-lg border text-xs focus:outline-none transition ${
                          set.completed
                            ? 'bg-zinc-800/80 border-emerald-500/40 text-emerald-300'
                            : 'bg-zinc-800 border-zinc-700 focus:border-amber-500 text-white'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-zinc-400">kg</span>
                    </div>
                  </td>

                  {/* Reps Input */}
                  <td className="py-2 px-1 sm:px-2 text-center">
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                      <input
                        id={`input-reps-${set.id}`}
                        type="number"
                        min="1"
                        placeholder={`${set.targetReps}`}
                        value={currentReps}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const val = raw === '' ? undefined : parseInt(raw, 10);
                          handleUpdateSet(sIdx, { actualReps: val !== undefined && !isNaN(val) ? Math.max(1, val) : set.targetReps });
                        }}
                        className={`w-12 sm:w-14 h-8 text-center font-mono font-bold rounded-lg border text-xs focus:outline-none transition ${
                          set.completed
                            ? 'bg-zinc-800/80 border-emerald-500/40 text-emerald-300'
                            : 'bg-zinc-800 border-zinc-700 focus:border-amber-500 text-white'
                        }`}
                      />
                      <span className="text-[10px] font-medium text-zinc-400 hidden sm:inline">reps</span>
                    </div>
                  </td>

                  {/* RIR (Reps in reserve) Badge / Selector */}
                  <td className="py-2 px-1 sm:px-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      <select
                        id={`select-rir-${set.id}`}
                        value={set.rir === null || set.rir === undefined ? 'none' : set.rir.toString()}
                        onChange={(e) => {
                          const val = e.target.value === 'none' ? null : parseInt(e.target.value, 10);
                          handleUpdateSet(sIdx, { rir: val });
                        }}
                        className={`text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-1 rounded-lg border appearance-none cursor-pointer focus:outline-none transition max-w-[130px] sm:max-w-none ${rirInfo.color}`}
                      >
                        <option value="none" className="bg-zinc-900 text-zinc-300">
                          {set.type === 'warmup' ? 'Aquec.' : set.type === 'feeder' ? 'Feeder' : 'Trabalho'}
                        </option>
                        <option value="2" className="bg-zinc-900 text-amber-300">
                          RIR 2 (2 reserva)
                        </option>
                        <option value="1" className="bg-zinc-900 text-orange-300">
                          RIR 1 (1 reserva)
                        </option>
                        <option value="0" className="bg-zinc-900 text-rose-300">
                          RIR 0 (Falha)
                        </option>
                        <option value="3" className="bg-zinc-900 text-sky-300">
                          RIR 3+ (Leve)
                        </option>
                      </select>

                      {set.targetKg && set.actualKg && set.actualKg > set.targetKg && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">
                          +{set.actualKg - set.targetKg}kg
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action (Complete / Undo) - Modo Rápido */}
                  <td className="py-2 pr-2 sm:pr-3.5 pl-1 text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        id={`btn-check-${set.id}`}
                        onClick={(e) => handleToggleCheck(e, sIdx, set)}
                        className={`w-full max-w-[95px] mx-auto py-1.5 rounded-lg border flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                          set.completed
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                            : 'bg-amber-500 text-zinc-950 border-amber-500 hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}
                        title={set.completed ? 'Marcar como não concluída' : 'Registrar série e iniciar descanso'}
                      >
                        {set.completed ? (
                          <>
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                            OK
                          </>
                        ) : (
                          'Registrar'
                        )}
                      </button>

                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => handleDeleteSet(sIdx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition hidden sm:block shrink-0"
                          title="Remover série"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card Footer: Add Set CTA & Local Stopwatch */}
      <div className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap">
        <button
          id={`btn-add-set-${exercise.id}`}
          onClick={handleAddSet}
          className="text-[11px] sm:text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Série</span>
        </button>

        {/* Local Exercise Stopwatch */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 shadow-sm">
          <Timer className={`w-3.5 h-3.5 ${isStopwatchRunning ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`} />
          <span className={`font-mono font-bold text-xs min-w-[36px] text-center ${isStopwatchRunning ? 'text-amber-400' : 'text-zinc-400'}`}>
            {formatStopwatch(stopwatchSeconds)}
          </span>
          <div className="flex items-center gap-0.5 ml-1 border-l border-zinc-800 pl-1">
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className={`p-1 rounded text-xs transition active:scale-90 ${
                isStopwatchRunning ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-400' : 'bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300'
              }`}
              title={isStopwatchRunning ? "Pausar" : "Iniciar"}
            >
              {isStopwatchRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
            <button
              onClick={() => {
                setIsStopwatchRunning(false);
                setStopwatchSeconds(0);
              }}
              className="p-1 rounded bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition active:scale-90"
              title="Zerar Cronômetro"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] font-medium text-zinc-500 hidden sm:inline">
          {completedCount}/{exercise.sets.length} OK
        </span>
      </div>
    </div>
  );
};
