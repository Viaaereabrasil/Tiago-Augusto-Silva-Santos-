const fs = require('fs');
let code = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

const target = `                          {sess.exercises.map((ex) => (
                            <div key={ex.id} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">`;

const repl = `                          {sess.exercises.length === 0 && (
                            <div className="text-center py-6">
                              <span className="text-3xl mb-2 block">☕</span>
                              <div className="text-sm font-bold text-zinc-300">Descanso Registrado</div>
                              <div className="text-xs text-zinc-500 mt-1">Recuperação muscular concluída.</div>
                            </div>
                          )}
                          {sess.exercises.map((ex) => (
                            <div key={ex.id} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/HistoryView.tsx', code);
