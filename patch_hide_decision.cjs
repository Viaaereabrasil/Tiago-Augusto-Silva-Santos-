const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Decisão do Dia */}
        <DailyDecision exercises={currentSession.exercises} />`;
const repl = `{/* Decisão do Dia - Ocultado a pedido do usuário */}
        <div className="hidden">
          <DailyDecision exercises={currentSession.exercises} />
        </div>`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
