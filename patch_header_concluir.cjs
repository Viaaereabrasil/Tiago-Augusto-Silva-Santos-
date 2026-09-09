const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutHeader.tsx', 'utf8');

const target = `            <button
              id="btn-finish-workout"
              onClick={onFinishWorkout}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-900/30 flex items-center gap-2 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Concluir Treino</span>
              <span className="sm:hidden">Concluir</span>
            </button>`;

code = code.replace(target, '');
fs.writeFileSync('src/components/WorkoutHeader.tsx', code);
