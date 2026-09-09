const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for ToolsModal
code = code.replace(
  `import { AuthModal } from './components/AuthModal';`,
  `import { AuthModal } from './components/AuthModal';\nimport { ToolsModal } from './components/ToolsModal';`
);

// 2. Add state for showToolsModal
code = code.replace(
  `const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);`,
  `const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);\n  const [showToolsModal, setShowToolsModal] = useState<boolean>(false);`
);

// 3. Find the main pb-28 and change to pb-40
code = code.replace(
  `<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans pb-28">`,
  `<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans pb-[160px]">`
);

// 4. Replace the old Bottom Action Bar with the new one
const oldBottomNavRegex = /\{\/\* Floating Bottom Action Bar [\s\S]*?<\/nav>/m;
const newBottomNav = `      {/* Floating Concluir Button (Placed above bottom nav) */}
      <div className="fixed bottom-[72px] sm:bottom-[80px] inset-x-0 px-4 z-20 pointer-events-none flex justify-center">
        <button
          id="btn-nav-finish"
          onClick={handleFinishWorkout}
          className={\`pointer-events-auto w-full max-w-[360px] px-6 py-3.5 sm:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-2xl \${
            currentSession.exercises.length === 0
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-zinc-950 shadow-emerald-500/20'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-amber-500/20'
          }\`}
        >
          {currentSession.exercises.length === 0 ? <Coffee className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{currentSession.exercises.length === 0 ? 'Concluir Descanso' : \`Concluir Treino (\${completedSets}/\${totalSets})\`}</span>
        </button>
      </div>

      {/* New Minimalist Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-black border-t border-zinc-900 px-4 py-2 sm:py-3 z-30 safe-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => {
              setShowHistoryModal(false);
              setShowToolsModal(false);
              setShowSettingsModal(false);
            }}
            className={\`p-3 flex flex-col items-center justify-center transition \${(!showHistoryModal && !showToolsModal && !showSettingsModal) ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}\`}
          >
            <Dumbbell className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => {
              setShowHistoryModal(true);
              setShowToolsModal(false);
              setShowSettingsModal(false);
            }}
            className={\`p-3 flex flex-col items-center justify-center transition \${showHistoryModal ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}\`}
          >
            <CalendarCheck className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => {
              setShowToolsModal(true);
              setShowHistoryModal(false);
              setShowSettingsModal(false);
            }}
            className={\`p-3 flex flex-col items-center justify-center transition \${showToolsModal ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}\`}
          >
            <Layers className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => {
              setShowSettingsModal(true);
              setShowHistoryModal(false);
              setShowToolsModal(false);
            }}
            className={\`p-3 flex flex-col items-center justify-center transition \${showSettingsModal ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}\`}
          >
            <Settings className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
        </div>
      </nav>`;

code = code.replace(oldBottomNavRegex, newBottomNav);

// 5. Add the ToolsModal to the modals section
const modalInsertionRegex = /\{\/\* Modals \*\/\}/;
code = code.replace(
  modalInsertionRegex,
  `{/* Modals */}\n      <ToolsModal\n        isOpen={showToolsModal}\n        onClose={() => setShowToolsModal(false)}\n        onOpenAlarm={() => handleOpenCalendarWithTab('alarm')}\n        onOpenTimer={() => setShowRestTimer(true)}\n        onOpenPlates={() => {\n          setPlateCalcTarget({ name: 'Barra Olímpica', kg: 50 });\n          setShowPlateCalc(true);\n        }}\n      />`
);

fs.writeFileSync('src/App.tsx', code);
