const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

const importTarget = `import { getLastPerformanceForExercise } from '../utils/storage';`;
const importRepl = `import { getLastPerformanceForExercise } from '../utils/storage';
import { analyzeExerciseProgression } from '../utils/progressionEngine';`;

code = code.replace(importTarget, importRepl);

const stateTarget = `  const [showNotes, setShowNotes] = useState<boolean>(false);
  const lastPerf = getLastPerformanceForExercise(exercise.name);`;
const stateRepl = `  const [showNotes, setShowNotes] = useState<boolean>(false);
  const lastPerf = getLastPerformanceForExercise(exercise.name);
  
  // FASE 1: Motor de Progressão
  const progression = React.useMemo(() => {
    return analyzeExerciseProgression(exercise.name, exercise.sets[0]?.targetReps || 10);
  }, [exercise.name, exercise.sets]);`;

code = code.replace(stateTarget, stateRepl);

const headerTarget = `    <div
      id={\`exercise-card-\${exercise.id}\`}
      className={\`rounded-2xl border transition-all duration-200 overflow-hidden \${
        isFullyCompleted
          ? 'bg-zinc-900/90 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
          : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700/80 shadow-md'
      }\`}
    >
      {/* Exercise Header */}
      <div className="p-3 sm:p-4 bg-zinc-850/60 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">`;
const headerRepl = `    <div
      id={\`exercise-card-\${exercise.id}\`}
      className={\`rounded-2xl border transition-all duration-200 overflow-hidden \${
        isFullyCompleted
          ? 'bg-zinc-900/90 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
          : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700/80 shadow-md'
      }\`}
    >
      {/* Progression Traffic Light Header */}
      <div className={\`px-4 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider border-b \${
        progression.color === 'green' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
        progression.color === 'yellow' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
        progression.color === 'red' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
        'bg-sky-500/10 text-sky-400 border-sky-500/20'
      }\`}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] currentColor bg-current" />
          <span>Status: {progression.status}</span>
        </div>
        <span className="opacity-80">Meta: {progression.goalText}</span>
      </div>

      {/* Exercise Header */}
      <div className="p-3 sm:p-4 bg-zinc-850/60 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">`;

code = code.replace(headerTarget, headerRepl);

const toolsTarget = `          {onOpenFocusMode && (
            <button
              onClick={() => onOpenFocusMode(exerciseIndex)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700/80 text-[10px] sm:text-xs font-bold transition flex items-center gap-1"
              title="Modo Foco: Preencher o treino tela cheia e focado"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Focar</span>
            </button>
          )}`;

const toolsRepl = `          {onOpenFocusMode && (
            <button
              onClick={() => onOpenFocusMode(exerciseIndex)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700/80 text-[10px] sm:text-xs font-bold transition flex items-center gap-1"
              title="Modo Foco: Preencher o treino tela cheia e focado"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Focar</span>
            </button>
          )}`;

code = code.replace(toolsTarget, toolsRepl);


fs.writeFileSync('src/components/ExerciseCard.tsx', code);
