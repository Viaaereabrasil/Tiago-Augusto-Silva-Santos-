const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutCalendarModal.tsx', 'utf8');

const target = `          {activeTab === 'weekly_plan' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-850 p-4 rounded-xl border border-zinc-800">
                <div>
                  <h3 className="text-sm font-black text-white">
                    Configuração da Divisão Semanal Recorrente
                  </h3>`;

const replacement = `          {activeTab === 'weekly_plan' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="p-4 bg-zinc-900 border border-emerald-500/30 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white">Modo de Escala Contínua (Flexível)</h3>
                    <button
                      onClick={() => {
                        const isContinuous = scheduleState.scheduleMode === 'continuous';
                        const updated = {
                          ...scheduleState,
                          scheduleMode: isContinuous ? 'weekly' : 'continuous',
                          continuousPlan: scheduleState.continuousPlan || ['inferiores-a', 'superior-a', 'inferiores-b', 'superior-b'],
                          continuousStartDate: scheduleState.continuousStartDate || new Date().toISOString().slice(0, 10),
                        };
                        setScheduleState(updated as any);
                        saveSchedule(updated as any);
                      }}
                      className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition \${
                        scheduleState.scheduleMode === 'continuous'
                          ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }\`}
                    >
                      {scheduleState.scheduleMode === 'continuous' ? 'Ativado' : 'Ativar Modo Contínuo'}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    No modo contínuo, os treinos não são fixos por dia da semana. Se você colocar um dia como "Descanso", o próximo treino da sequência automaticamente passa para o dia seguinte, garantindo que você nunca pule um treino do seu ciclo!
                  </p>
                </div>
              </div>

              {scheduleState.scheduleMode === 'continuous' ? (
                <div className="p-4 bg-zinc-850 rounded-xl border border-zinc-800">
                  <h3 className="text-sm font-black text-white mb-1">Sua Sequência de Treinos</h3>
                  <p className="text-xs text-zinc-400 mb-4">Esta é a ordem que seus treinos vão seguir indefinidamente. Dias de descanso não entram aqui, você marca eles direto no calendário quando precisar!</p>
                  
                  <div className="space-y-2 mb-4">
                    {(scheduleState.continuousPlan || []).map((templateId, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">{idx + 1}</span>
                          <span className="text-sm font-bold text-zinc-200">
                            {templates.find(t => t.id === templateId)?.title || templateId}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newPlan = [...(scheduleState.continuousPlan || [])];
                            newPlan.splice(idx, 1);
                            const updated = { ...scheduleState, continuousPlan: newPlan };
                            setScheduleState(updated as any);
                            saveSchedule(updated as any);
                          }}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      id="add-continuous-template"
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const select = document.getElementById('add-continuous-template') as HTMLSelectElement;
                        if (select && select.value) {
                          const newPlan = [...(scheduleState.continuousPlan || []), select.value];
                          const updated = { ...scheduleState, continuousPlan: newPlan };
                          setScheduleState(updated as any);
                          saveSchedule(updated as any);
                        }
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-850 p-4 rounded-xl border border-zinc-800">
                    <div>
                      <h3 className="text-sm font-black text-white">
                        Configuração da Divisão Semanal Recorrente
                      </h3>`;

code = code.replace(target, replacement);

const endTarget = `                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (`;

const endReplacement = `                    </div>
                  );
                })}
              </div>
              </>
              )}
            </div>
          )}

          {activeTab === 'stats' && (`;

code = code.replace(endTarget, endReplacement);
fs.writeFileSync('src/components/WorkoutCalendarModal.tsx', code);
