const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            <button
              id="btn-nav-finish"
              onClick={handleFinishWorkout}
              className="px-3.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs flex items-center gap-2 transition active:scale-95 shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir ({completedSets}/{totalSets})</span>
            </button>`;

const repl = `            <button
              id="btn-nav-finish"
              onClick={handleFinishWorkout}
              className={\`px-3.5 sm:px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition active:scale-95 shadow-lg \${
                currentSession.exercises.length === 0
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20'
              }\`}
            >
              {currentSession.exercises.length === 0 ? <Coffee className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{currentSession.exercises.length === 0 ? 'Concluir Descanso' : \`Concluir (\${completedSets}/\${totalSets})\`}</span>
            </button>`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
