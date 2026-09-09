const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');

// 1. Update formatTime to always show HH:MM:SS
const timeTarget = `  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hours > 0) {
      return \`\${hours.toString().padStart(2, '0')}:\${mins.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
    }
    return \`\${mins.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
  };`;
const timeRepl = `  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return \`\${hours.toString().padStart(2, '0')}:\${mins.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
  };`;
code = code.replace(timeTarget, timeRepl);

// 2. Add minimalist live clock next to the date
const dateTarget = `            {/* Workout Date & Stopwatch Toggle */}
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
              </div>`;
const dateRepl = `            {/* Workout Date, Clock & Stopwatch Toggle */}
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

              {/* Minimalist Live Clock */}
              <div className="flex items-center justify-center bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-2.5 py-1.5 shadow-sm">
                <span className="font-mono font-bold tracking-wider text-xs text-zinc-300">
                  {liveClockTime || '00:00:00'}
                </span>
              </div>`;
code = code.replace(dateTarget, dateRepl);

fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
