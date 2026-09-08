import React, { useMemo } from 'react';
import { Target } from 'lucide-react';
import { Exercise } from '../types';
import { analyzeExerciseProgression } from '../utils/progressionEngine';

interface DailyDecisionProps {
  exercises: Exercise[];
}

export const DailyDecision: React.FC<DailyDecisionProps> = ({ exercises }) => {
  const decisions = useMemo(() => {
    return exercises.map(ex => {
      const prog = analyzeExerciseProgression(ex.name, ex.sets[0]?.targetReps || 10);
      return { exerciseName: ex.name, ...prog };
    });
  }, [exercises]);

  if (exercises.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
      <div className="px-4 py-2 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
        <Target className="w-4 h-4 text-amber-400" />
        Decisão do Dia
      </div>
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {decisions.map((d, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                d.color === 'green' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                d.color === 'yellow' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                d.color === 'red' ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.5)]' :
                'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]'
              }`} />
              <span className="text-xs font-bold text-white truncate flex-1">{d.exerciseName}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap self-start sm:self-auto sm:ml-auto ${
               d.color === 'green' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
               d.color === 'yellow' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' :
               d.color === 'red' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' :
               'text-sky-400 bg-sky-500/10 border border-sky-500/20'
            }`}>
              {d.goalText}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
