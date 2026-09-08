const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');

const target = `<div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/70 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                id="workout-date-input"
                type="date"
                value={session.date}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none text-zinc-200 cursor-pointer w-28 sm:w-auto"
              />
            </div>`;

const repl = `            <div className="flex items-center gap-2 flex-wrap">
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

              <div className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/70 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  id="workout-time-input"
                  type="time"
                  value={(() => {
                    if (session.startTime.includes('T')) {
                      const d = new Date(session.startTime);
                      if (!isNaN(d.getTime())) {
                        return \`\${String(d.getHours()).padStart(2, '0')}:\${String(d.getMinutes()).padStart(2, '0')}\`;
                      }
                    }
                    return session.startTime;
                  })()}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none text-zinc-200 cursor-pointer w-16 sm:w-auto"
                />
              </div>
            </div>`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
