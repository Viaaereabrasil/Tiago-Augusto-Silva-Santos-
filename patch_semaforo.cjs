const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

const target = `      {/* Progression Traffic Light Header */}
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
      </div>`;

const repl = `      {/* Progression Traffic Light Header (Semáforo de Progressão) */}
      <div className={\`px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs font-bold border-b \${
        progression.color === 'green' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20' :
        progression.color === 'yellow' ? 'bg-amber-950/30 text-amber-400 border-amber-500/20' :
        progression.color === 'red' ? 'bg-rose-950/30 text-rose-400 border-rose-500/20' :
        'bg-sky-950/30 text-sky-400 border-sky-500/20'
      }\`}>
        <div className="flex items-center gap-1.5 uppercase tracking-wide">
          <span className="text-sm">
            {progression.color === 'green' ? '🟢' : 
             progression.color === 'yellow' ? '🟡' : 
             progression.color === 'red' ? '🔴' : '🔵'}
          </span>
          <span>Status: {progression.status}</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-90 bg-black/20 px-2 py-0.5 rounded-md border border-white/5">
          <span className="uppercase text-[10px] opacity-70">Meta de Hoje:</span>
          <span className="tracking-wide">{progression.goalText}</span>
        </div>
      </div>`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/ExerciseCard.tsx', code);
