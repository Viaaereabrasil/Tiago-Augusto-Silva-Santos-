const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

const target = `      {/* Execution Notes / Cues */}
      {showNotes && exercise.notes && (
        <div className="px-3 sm:px-4 py-2 bg-amber-950/20 border-b border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">{exercise.notes}</p>
        </div>
      )}

      {/* Sets Table Table Container */}`;

const repl = `      {/* Execution Notes / Cues */}
      {showNotes && exercise.notes && (
        <div className="px-3 sm:px-4 py-2 bg-amber-950/20 border-b border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">{exercise.notes}</p>
        </div>
      )}

      {/* FASE 1: Motor de Progressão - Comparativo e Sugestão */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 border-b border-zinc-800 bg-zinc-900/40">
        <div className="p-3">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <History className="w-3 h-3 text-zinc-500" />
            Último Treino {progression.lastDate ? \`(\${progression.lastDate})\` : ''}
          </div>
          {progression.lastSets && progression.lastSets.length > 0 ? (
            <div className="space-y-1">
              <div className="text-xs text-zinc-300">
                <span className="text-zinc-500 mr-1">Carga Max:</span> 
                <span className="font-black text-white">{Math.max(...progression.lastSets.map(s => s.kg || 0))} kg</span>
              </div>
              <div className="text-[11px] text-zinc-400">
                <span className="text-zinc-500 mr-1">Reps:</span>
                {progression.lastSets.map(s => s.reps).join(' / ')}
              </div>
              <div className="text-[11px] text-zinc-400">
                <span className="text-zinc-500 mr-1">RIR:</span>
                {progression.lastSets.map(s => s.rir ?? '-').join(' / ')}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                <span className="text-zinc-500 mr-1">Volume:</span>
                <span className="text-amber-400/80 font-bold">{progression.lastWorkoutVolume} kg</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 italic">Sem registros recentes.</div>
          )}
        </div>
        <div className="p-3 bg-emerald-950/10">
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
        </div>
      </div>

      {/* Sets Table Table Container */}`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/ExerciseCard.tsx', code);
