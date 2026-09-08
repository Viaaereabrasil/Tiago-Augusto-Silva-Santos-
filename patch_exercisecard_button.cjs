const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

const targetTableStart = `      {/* Sets Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[340px] sm:min-w-0">
          <thead>
            <tr className="border-b border-zinc-800/80 text-[10px] sm:text-[11px] font-bold text-zinc-400 bg-zinc-900/40 uppercase tracking-wider">
              <th className="py-2 pl-2 sm:pl-3.5 pr-1 w-8 sm:w-12 text-center">Set</th>
              <th className="py-2 px-1 sm:px-2 w-20 sm:w-28 text-center">Carga</th>
              <th className="py-2 px-1 sm:px-2 w-16 sm:w-24 text-center">Reps</th>
              <th className="py-2 px-1 sm:px-2">
                <div className="flex items-center gap-1">
                  <span>Sensação / RIR</span>
                  <button
                    onClick={onOpenRirInfo}
                    className="text-zinc-400 hover:text-amber-400 transition"
                    title="O que é RIR / Reserva?"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>
              </th>
              <th className="py-2 pr-2 sm:pr-3.5 pl-1 w-12 sm:w-16 text-center">Feito</th>
            </tr>
          </thead>`;

const replTableStart = `      {/* Sets Table */}
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
          </thead>`;

code = code.replace(targetTableStart, replTableStart);

const targetAction = `                  {/* Checkbox (Complete) */}
                  <td className="py-2 pr-2 sm:pr-3.5 pl-1 text-center">
                    <button
                      onClick={(e) => handleToggleCheck(e, sIdx, set)}
                      className={\`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-lg border-2 flex items-center justify-center transition-all active:scale-90 \${
                        set.completed
                          ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : 'bg-zinc-800 border-zinc-600 hover:border-emerald-500/50 hover:bg-zinc-700'
                      }\`}
                    >
                      {set.completed && <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />}
                    </button>
                  </td>`;

const replAction = `                  {/* Action (Complete / Undo) */}
                  <td className="py-2 pr-2 sm:pr-3.5 pl-1 text-center align-middle">
                    <button
                      onClick={(e) => handleToggleCheck(e, sIdx, set)}
                      className={\`w-full max-w-[90px] mx-auto py-1.5 rounded-lg border flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 \${
                        set.completed
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-amber-500 text-zinc-950 border-amber-500 hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      }\`}
                    >
                      {set.completed ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          OK
                        </>
                      ) : (
                        'Registrar'
                      )}
                    </button>
                  </td>`;

code = code.replace(targetAction, replAction);

fs.writeFileSync('src/components/ExerciseCard.tsx', code);
