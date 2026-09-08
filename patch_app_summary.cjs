const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = `import { DailyDecision } from './components/DailyDecision';`;
const importRepl = `import { DailyDecision } from './components/DailyDecision';
import { WorkoutPostSummary } from './components/WorkoutPostSummary';`;

code = code.replace(importTarget, importRepl);

const renderTarget = `        {workoutFinishedCelebration && (
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-zinc-900 border border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm sm:text-base">Treino Concluído com Sucesso! 🔥</h3>
                <p className="text-[11px] sm:text-xs text-zinc-300">
                  {completedSets} séries • Volume de {totalTonnage.toLocaleString('pt-BR')} kg levantados.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Exportar WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Header Controls */}
        <div className="flex items-center justify-between">`;

const renderRepl = `        {workoutFinishedCelebration ? (
          <WorkoutPostSummary 
            session={currentSession}
            onShare={() => setShowWhatsAppModal(true)}
            onFinish={() => {
              setWorkoutFinishedCelebration(false);
              setActiveTab('home');
            }}
          />
        ) : (
          <>
        {/* Top Header Controls */}
        <div className="flex items-center justify-between">`;

code = code.replace(renderTarget, renderRepl);

// We need to close the Fragment that wraps the original Workout view
const navTarget = `      </nav>

      {/* Modals */}`;

const navRepl = `      </nav>
      </>
        )}

      {/* Modals */}`;

code = code.replace(navTarget, navRepl);

fs.writeFileSync('src/App.tsx', code);
