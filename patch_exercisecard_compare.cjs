const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

const target = `        <div className="p-3 bg-emerald-950/10">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Sugestão para Hoje
          </div>
          <div className="space-y-1">
            <div className="text-xs text-zinc-300">
              <span className="text-zinc-500 mr-1">Carga Alvo:</span> 
              <span className="font-black text-emerald-400">{progression.suggestedKg} kg</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              <span className="text-zinc-500 mr-1">Faixa:</span>
              <span className="text-white">{progression.suggestedReps} reps</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              <span className="text-zinc-500 mr-1">RIR Alvo:</span>
              <span className="text-white">{progression.suggestedRir}</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 mt-1.5 leading-snug border-l-2 border-emerald-500/30 pl-2">
              {progression.suggestionText}
            </p>
          </div>
        </div>`;

const repl = `        <div className="p-3 bg-emerald-950/10">
          {!isFullyCompleted ? (
            <>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Sugestão para Hoje
              </div>
              <div className="space-y-1">
                <div className="text-xs text-zinc-300">
                  <span className="text-zinc-500 mr-1">Carga Alvo:</span> 
                  <span className="font-black text-emerald-400">{progression.suggestedKg} kg</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500 mr-1">Faixa:</span>
                  <span className="text-white">{progression.suggestedReps} reps</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500 mr-1">RIR Alvo:</span>
                  <span className="text-white">{progression.suggestedRir}</span>
                </div>
                <p className="text-[10px] text-emerald-400/80 mt-1.5 leading-snug border-l-2 border-emerald-500/30 pl-2">
                  {progression.suggestionText}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-500" />
                Desempenho de Hoje
              </div>
              <div className="space-y-1">
                <div className="text-xs text-zinc-300">
                  <span className="text-zinc-500 mr-1">Carga Max:</span> 
                  <span className="font-black text-emerald-400">
                    {Math.max(...exercise.sets.filter(s => s.completed).map(s => s.actualKg || s.targetKg || 0))} kg
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500 mr-1">Reps:</span>
                  <span className="text-white">
                    {exercise.sets.filter(s => s.completed).map(s => s.actualReps || s.targetReps).join(' / ')}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500 mr-1">Volume:</span>
                  <span className="text-white">
                    {exercise.sets.filter(s => s.completed).reduce((acc, s) => acc + ((s.actualReps || s.targetReps) * (s.actualKg || s.targetKg || 0)), 0)} kg
                  </span>
                </div>
              </div>
            </>
          )}
        </div>`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/ExerciseCard.tsx', code);
