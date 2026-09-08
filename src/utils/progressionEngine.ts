import { WorkoutSession, Exercise } from '../types';
import { loadHistory } from './storage';

export type ProgressionStatus = 'progredir' | 'consolidar' | 'manter' | 'reduzir';
export type ProgressionColor = 'green' | 'yellow' | 'blue' | 'red';

export interface ProgressionDecision {
  status: ProgressionStatus;
  color: ProgressionColor;
  goalText: string;
  suggestionText: string;
  suggestedKg?: number;
  suggestedReps?: string;
  suggestedRir?: string;
  lastWorkoutVolume?: number;
  lastSets?: { reps: number; kg?: number; rir?: number | null }[];
  lastDate?: string;
}

export function analyzeExerciseProgression(exerciseName: string, currentTargetReps: number): ProgressionDecision {
  const history = loadHistory();
  // Find all past sessions with this exercise, sorted newest first
  const sessionsWithEx = history.filter(s => 
    s.exercises.some(e => e.name.trim().toLowerCase() === exerciseName.trim().toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sessionsWithEx.length === 0) {
    return {
      status: 'manter',
      color: 'blue',
      goalText: 'Estabelecer base',
      suggestionText: 'Não há dados suficientes. Encontre uma carga com a qual você consiga fazer as repetições alvo com RIR 1-2.',
    };
  }

  const lastSession = sessionsWithEx[0];
  const lastEx = lastSession.exercises.find(e => e.name.trim().toLowerCase() === exerciseName.trim().toLowerCase());
  
  if (!lastEx) {
     return {
      status: 'manter',
      color: 'blue',
      goalText: 'Estabelecer base',
      suggestionText: 'Não há dados suficientes.',
    };
  }

  const completedSets = lastEx.sets.filter(s => s.completed);
  
  if (completedSets.length === 0) {
    return {
      status: 'manter',
      color: 'blue',
      goalText: 'Completar exercício',
      suggestionText: 'Você não completou séries deste exercício na última vez.',
    };
  }

  let totalVolume = 0;
  let allReachedTargetReps = true;
  let allZeroRir = true;
  let someZeroRir = false;
  let avgRir = 0;
  let validRirCount = 0;
  
  // Assuming sets are homogeneous in target reps for the suggestion base
  const baseTargetReps = currentTargetReps || completedSets[0].targetReps;
  const maxActualKg = Math.max(...completedSets.map(s => s.actualKg || s.targetKg || 0));
  
  completedSets.forEach(s => {
    const reps = s.actualReps || s.targetReps;
    const kg = s.actualKg || s.targetKg || 0;
    totalVolume += (reps * kg);
    
    if (reps < baseTargetReps) {
      allReachedTargetReps = false;
    }
    
    if (s.rir !== undefined && s.rir !== null) {
      validRirCount++;
      avgRir += s.rir;
      if (s.rir > 0) allZeroRir = false;
      if (s.rir === 0) someZeroRir = true;
    }
  });

  if (validRirCount > 0) {
    avgRir = avgRir / validRirCount;
  } else {
    // If no RIR, fallback assumptions
    allZeroRir = false;
  }

  let status: ProgressionStatus = 'manter';
  let color: ProgressionColor = 'blue';
  let goalText = '';
  let suggestionText = '';
  let suggestedKg = maxActualKg;
  let suggestedReps = `${baseTargetReps - 2}-${baseTargetReps}`;
  let suggestedRir = '1-2';

  // Progression Logic
  if (allReachedTargetReps && avgRir >= 1.5) {
    // Reached reps and had gas in the tank -> Progress Weight
    status = 'progredir';
    color = 'green';
    goalText = 'Aumentar carga';
    suggestedKg = maxActualKg > 0 ? maxActualKg + (maxActualKg > 20 ? 2 : 1) : maxActualKg;
    suggestedReps = `${baseTargetReps - 2}-${baseTargetReps}`;
    suggestedRir = '1-2';
    suggestionText = `Você atingiu as repetições com RIR folgado (RIR Médio: ${avgRir.toFixed(1)}). Hora de aumentar a carga!`;
  } else if (allReachedTargetReps && avgRir > 0) {
     // Reached reps but it was tough -> Consolidate
    status = 'consolidar';
    color = 'yellow';
    goalText = 'Consolidar desempenho';
    suggestedKg = maxActualKg;
    suggestedReps = `${baseTargetReps}`;
    suggestedRir = '1';
    suggestionText = `Carga atual está no limite ideal. Tente consolidar o movimento e talvez buscar +1 repetição em uma das séries.`;
  } else if (!allReachedTargetReps && someZeroRir) {
    // Missed reps and went to failure -> Reduce/Maintain
    // Check if previous to last session was also failing
    status = 'reduzir';
    color = 'red';
    goalText = 'Recuperar técnica / Deload';
    suggestedKg = maxActualKg > 0 ? Math.max(1, maxActualKg - (maxActualKg > 20 ? 2 : 1)) : maxActualKg;
    suggestedReps = `${baseTargetReps}`;
    suggestedRir = '2';
    suggestionText = `Desempenho caiu e você foi à falha sem bater a meta. Considere reduzir um pouco a carga para focar na execução.`;
  } else {
    status = 'manter';
    color = 'blue';
    goalText = 'Tentar +1 repetição';
    suggestedKg = maxActualKg;
    suggestedReps = `${baseTargetReps}`;
    suggestedRir = '0-1';
    suggestionText = `Mantenha a carga e lute para conquistar mais repetições nas últimas séries.`;
  }

  const lastSets = completedSets.map(s => ({
    reps: s.actualReps || s.targetReps,
    kg: s.actualKg || s.targetKg,
    rir: s.rir
  }));

  return {
    status,
    color,
    goalText,
    suggestionText,
    suggestedKg,
    suggestedReps,
    suggestedRir,
    lastWorkoutVolume: totalVolume,
    lastSets,
    lastDate: lastSession.date,
  };
}
