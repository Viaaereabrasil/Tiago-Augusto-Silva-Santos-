const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = `import { ExerciseCard } from './components/ExerciseCard';`;
const importRepl = `import { ExerciseCard } from './components/ExerciseCard';
import { DailyDecision } from './components/DailyDecision';`;

code = code.replace(importTarget, importRepl);

const divTarget = `        {/* List of Exercises */}
        <div className="space-y-3 sm:space-y-4">`;
const divRepl = `        {/* Decisão do Dia */}
        <DailyDecision exercises={currentSession.exercises} />

        {/* List of Exercises */}
        <div className="space-y-3 sm:space-y-4">`;

code = code.replace(divTarget, divRepl);

fs.writeFileSync('src/App.tsx', code);
