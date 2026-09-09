const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

// Update imports
const importsRegex = /import \{\s*Check,[\s\S]*?Maximize2\n\} from 'lucide-react';/;
const importsRepl = `import { 
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
} from 'lucide-react';`;
code = code.replace(importsRegex, importsRepl);

// Update state
const stateRegex = /  const \[showNotes, setShowNotes\] = useState<boolean>\(false\);\n  const lastPerf = getLastPerformanceForExercise\(exercise\.name\);/;
const stateRepl = `  const [showNotes, setShowNotes] = useState<boolean>(false);
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
    return \`\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
  };`;
code = code.replace(stateRegex, stateRepl);

// Update footer
const footerRegex = /\{\/\* Card Footer: Add Set CTA \*\/\}[\s\S]*?concluídas\n        <\/span>\n      <\/div>/;
const footerRepl = `{/* Card Footer: Add Set CTA & Local Stopwatch */}
      <div className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap">
        <button
          id={\`btn-add-set-\${exercise.id}\`}
          onClick={handleAddSet}
          className="text-[11px] sm:text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Série</span>
        </button>

        {/* Local Exercise Stopwatch */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 shadow-sm">
          <Timer className={\`w-3.5 h-3.5 \${isStopwatchRunning ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}\`} />
          <span className={\`font-mono font-bold text-xs min-w-[36px] text-center \${isStopwatchRunning ? 'text-amber-400' : 'text-zinc-400'}\`}>
            {formatStopwatch(stopwatchSeconds)}
          </span>
          <div className="flex items-center gap-0.5 ml-1 border-l border-zinc-800 pl-1">
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className={\`p-1 rounded text-xs transition active:scale-90 \${
                isStopwatchRunning ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-400' : 'bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300'
              }\`}
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
      </div>`;
code = code.replace(footerRegex, footerRepl);

fs.writeFileSync('src/components/ExerciseCard.tsx', code);
