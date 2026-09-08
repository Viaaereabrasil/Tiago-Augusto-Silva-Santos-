const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const mainTarget = `      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-2.5 sm:px-4 pt-3 sm:pt-6 pb-24 sm:pb-28 flex-1 space-y-3 sm:space-y-4">`;

const mainRepl = `      {workoutFinishedCelebration ? (
        <WorkoutPostSummary 
          session={currentSession}
          onShare={() => setShowWhatsAppModal(true)}
          onFinish={() => {
            setWorkoutFinishedCelebration(false);
            handleResetWorkout();
          }}
        />
      ) : (
        <>
      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-2.5 sm:px-4 pt-3 sm:pt-6 pb-24 sm:pb-28 flex-1 space-y-3 sm:space-y-4">`;

code = code.replace(mainTarget, mainRepl);

const navTarget = `      </nav>

      {/* Modals */}`;

const navRepl = `      </nav>
      </>
      )}

      {/* Modals */}`;

code = code.replace(navTarget, navRepl);

fs.writeFileSync('src/App.tsx', code);
