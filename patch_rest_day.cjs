const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const handleFinishWorkoutTarget = `  const handleFinishWorkout = () => {`;
const handleLogRestDayFunc = `  const handleLogRestDay = () => {
    const today = new Date().toISOString().slice(0, 10);
    const endTime = new Date().toISOString();
    const restSession: WorkoutSession = {
      id: \`session-rest-\${Date.now()}\`,
      templateId: 'rest',
      title: 'DIA DE DESCANSO',
      date: today,
      startTime: endTime,
      endTime: endTime,
      exercises: [],
      completed: true,
      durationMinutes: 0,
      notes: 'Recuperação muscular',
    };
    
    addSessionToHistory(restSession);
    
    // Save to Firestore if authenticated
    if (authUser) {
      saveSessionToCloud(authUser.uid, restSession);
    }
    
    setWorkoutFinishedCelebration(true);
  };

  const handleFinishWorkout = () => {`;

code = code.replace(handleFinishWorkoutTarget, handleLogRestDayFunc);

const btnTarget = `{currentSession.templateId !== nextWorkout.templateId && (
              <button
                id="btn-switch-to-next"
                onClick={() => handleSelectTemplate(nextWorkout.templateId)}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Carregar Próximo</span>
              </button>
            )}`;

const btnRepl = `{currentSession.templateId !== nextWorkout.templateId && (
              <button
                id="btn-switch-to-next"
                onClick={() => handleSelectTemplate(nextWorkout.templateId)}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Carregar Próximo</span>
              </button>
            )}

            <button
              id="btn-log-rest-day"
              onClick={handleLogRestDay}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Registrar um dia de descanso no histórico"
            >
              <Coffee className="w-4 h-4 text-zinc-400" />
              <span>Descanso</span>
            </button>`;

code = code.replace(btnTarget, btnRepl);

fs.writeFileSync('src/App.tsx', code);
