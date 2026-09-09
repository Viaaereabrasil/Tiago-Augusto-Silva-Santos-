const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');

// 1. Add showStopwatch state
const stateTarget = `  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [liveClockTime, setLiveClockTime] = useState<string>('');`;
const stateRepl = `  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [liveClockTime, setLiveClockTime] = useState<string>('');
  const [showStopwatch, setShowStopwatch] = useState<boolean>(false);`;
code = code.replace(stateTarget, stateRepl);

// 2. Remove Live Clock and Time Input, add toggle for stopwatch
// The block goes from {/* LIVE CLOCK: HORA CERTA */} down to the end of the stopwatch control.
const startMarker = `{/* LIVE CLOCK: HORA CERTA */}`;
const endMarker = `</button>
            </div>

            {onOpenProgressionChart`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newBlock = `{/* Workout Date & Stopwatch Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/70 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  id="workout-date-input"
                  type="date"
                  value={session.date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none text-zinc-200 cursor-pointer w-[110px] sm:w-auto"
                />
              </div>
              
              <button
                type="button"
                onClick={() => setShowStopwatch(!showStopwatch)}
                className={\`flex items-center gap-1.5 border rounded-xl px-2.5 py-1.5 text-xs shrink-0 shadow-sm transition \${
                  showStopwatch || isTimerRunning
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-zinc-800/80 border-zinc-700/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-750'
                }\`}
                title="Mostrar/Ocultar Cronômetro"
              >
                <Timer className={\`w-4 h-4 \${isTimerRunning ? 'animate-pulse text-amber-400' : ''}\`} />
                {isTimerRunning && <span className="font-mono font-bold text-amber-400">{formatTime(elapsedSeconds)}</span>}
              </button>
            </div>

            {/* Workout Elapsed Interactive Stopwatch / Cronômetro */}
            {showStopwatch && (
              <div
                id="workout-stopwatch-control"
                className={\`flex items-center gap-1.5 border rounded-xl px-2 sm:px-2.5 py-1 text-xs shrink-0 shadow-sm transition \${
                  isTimerRunning
                    ? 'bg-zinc-800/90 border-amber-500/40 text-zinc-200'
                    : 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                }\`}
              >
                <div className="flex items-center gap-1.5 pr-1 border-r border-zinc-700/80">
                  <span className="font-mono font-bold text-amber-300 min-w-[38px] text-xs">
                    {formatTime(elapsedSeconds)}
                  </span>
                  {!isTimerRunning && (
                    <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 hidden md:inline">
                      Pausado
                    </span>
                  )}
                </div>

                {/* Start / Pause Button */}
                <button
                  id="btn-timer-toggle"
                  type="button"
                  onClick={handleToggleTimer}
                  className={\`p-1 rounded-lg transition active:scale-90 flex items-center gap-1 text-[11px] font-bold \${
                    isTimerRunning
                      ? 'hover:bg-zinc-700 text-zinc-300 hover:text-amber-300'
                      : 'bg-amber-500 text-zinc-950 px-1.5 shadow-sm font-black'
                  }\`}
                  title={isTimerRunning ? 'Pausar cronômetro' : 'Iniciar / Continuar cronômetro'}
                >
                  {isTimerRunning ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[10px]">Start</span>
                    </>
                  )}
                </button>

                {/* Zerar (Reset) Button */}
                <button
                  id="btn-timer-reset"
                  type="button"
                  onClick={handleResetTimer}
                  className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-700/70 transition active:scale-90 flex items-center gap-1 text-[11px] font-bold"
                  title="Zerar cronômetro (00:00)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Zerar</span>
                </button>
              </div>
            )}`;

  const codeBefore = code.substring(0, startIndex);
  const codeAfter = code.substring(endIndex + endMarker.length);
  code = codeBefore + newBlock + '\n\n            {onOpenProgressionChart' + codeAfter;
} else {
  console.log("Could not find markers!");
}

fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
