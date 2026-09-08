const fs = require('fs');
let code = fs.readFileSync('src/components/ExerciseCard.tsx', 'utf8');

const toggleTarget = `  const handleToggleCheck = (e: React.MouseEvent<HTMLButtonElement>, index: number, set: WorkoutSet) => {
    const willBeCompleted = !set.completed;
    if (willBeCompleted) {
      const remainingUncompleted = exercise.sets.filter((s, i) => i !== index && !s.completed).length;
      const willCompleteAll = remainingUncompleted === 0;
      triggerSetParticles(e.currentTarget, willCompleteAll);
    }
    handleUpdateSet(index, { completed: willBeCompleted });
  };`;

const toggleRepl = `  const handleToggleCheck = (e: React.MouseEvent<HTMLButtonElement>, index: number, set: WorkoutSet) => {
    const willBeCompleted = !set.completed;
    if (willBeCompleted) {
      const remainingUncompleted = exercise.sets.filter((s, i) => i !== index && !s.completed).length;
      const willCompleteAll = remainingUncompleted === 0;
      triggerSetParticles(e.currentTarget, willCompleteAll);
      
      // Auto-advance focus to the next set's weight input (Modo Rápido)
      const nextSet = exercise.sets[index + 1];
      if (nextSet) {
        setTimeout(() => {
          const nextInput = document.getElementById(\`input-kg-\${nextSet.id}\`);
          if (nextInput) {
            nextInput.focus();
            nextInput.select(); // Highlight the text for quick overwrite
          }
        }, 50);
      }
    }
    handleUpdateSet(index, { completed: willBeCompleted });
  };`;

code = code.replace(toggleTarget, toggleRepl);

const buttonTarget = `                  {/* Completed Checkbox Toggle */}
                  <td className="py-2 pr-2 sm:pr-3.5 pl-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        id={\`btn-check-\${set.id}\`}
                        onClick={(e) => handleToggleCheck(e, sIdx, set)}
                        className={\`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-75 select-none relative group/btn \${
                          set.completed
                            ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30 scale-100'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-amber-400/60 hover:text-amber-400 hover:bg-zinc-750'
                        }\`}
                        title={set.completed ? 'Marcar como não concluída' : 'Concluir série e iniciar descanso'}
                      >
                        <Check className={\`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 \${set.completed ? 'stroke-[3] scale-110' : 'stroke-[2] scale-95 group-hover/btn:scale-110'}\`} />
                      </button>

                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => handleDeleteSet(sIdx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition hidden sm:block"
                          title="Remover série"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>`;

const buttonRepl = `                  {/* Action (Complete / Undo) - Modo Rápido */}
                  <td className="py-2 pr-2 sm:pr-3.5 pl-1 text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        id={\`btn-check-\${set.id}\`}
                        onClick={(e) => handleToggleCheck(e, sIdx, set)}
                        className={\`w-full max-w-[95px] mx-auto py-1.5 rounded-lg border flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 \${
                          set.completed
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                            : 'bg-amber-500 text-zinc-950 border-amber-500 hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }\`}
                        title={set.completed ? 'Marcar como não concluída' : 'Registrar série e iniciar descanso'}
                      >
                        {set.completed ? (
                          <>
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                            OK
                          </>
                        ) : (
                          'Registrar'
                        )}
                      </button>

                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => handleDeleteSet(sIdx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition hidden sm:block shrink-0"
                          title="Remover série"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>`;

code = code.replace(buttonTarget, buttonRepl);

fs.writeFileSync('src/components/ExerciseCard.tsx', code);
