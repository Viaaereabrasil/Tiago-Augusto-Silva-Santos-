import React, { useState } from 'react';
import { 
  X, 
  History, 
  Calendar, 
  Clock, 
  Dumbbell, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2,
  Sparkles,
  TrendingUp,
  BarChart3,
  ListOrdered,
  Layers,
  FileText
} from 'lucide-react';
import { WorkoutSession } from '../types';
import { loadHistory, saveHistory } from '../utils/storage';
import { TonnageProgressionChart } from './TonnageProgressionChart';
import { RpeEffortProgressionChart } from './RpeEffortProgressionChart';
import { deleteSessionFromCloud } from '../lib/firestoreSync';
import { Activity } from 'lucide-react';

interface HistoryViewProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession?: (session: WorkoutSession) => void;
  initialTab?: 'charts' | 'rpe' | 'list';
  userId?: string | null;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  isOpen,
  onClose,
  onLoadSession,
  initialTab = 'charts',
  userId,
}) => {
  const [history, setHistory] = useState<WorkoutSession[]>(() => loadHistory());
  const [activeTab, setActiveTab] = useState<'charts' | 'rpe' | 'list'>(initialTab);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync state if initialTab changes or modal reopens
  React.useEffect(() => {
    if (isOpen) {
      setHistory(loadHistory());
      setActiveTab(initialTab);
      setDeleteConfirmId(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const executeDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((s) => s.id !== id);
    setHistory(updated);
    saveHistory(updated);
    setDeleteConfirmId(null);
    if (userId) {
      deleteSessionFromCloud(userId, id);
    }
    showToast('Registro de treino excluído com sucesso.');
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `treinos_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup exportado com sucesso.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setHistory(parsed);
            saveHistory(parsed);
            showToast('Histórico importado com sucesso!');
          } else {
            showToast('Formato de backup inválido.', 'error');
          }
        } catch {
          showToast('Arquivo de backup corrompido ou ilegível.', 'error');
        }
      };
    }
  };

  // Calculate high level stats
  const totalWorkouts = history.length;
  const totalKgAllTime = history.reduce((acc, sess) => {
    return (
      acc +
      sess.exercises.reduce((exAcc, ex) => {
        return (
          exAcc +
          ex.sets.reduce((setAcc, set) => {
            if (set.completed && set.actualKg && set.actualReps) {
              return setAcc + set.actualKg * set.actualReps;
            }
            return setAcc;
          }, 0)
        );
      }, 0)
    );
  }, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-4 max-h-[92vh] flex flex-col text-zinc-100">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg">
                Progressão de Cargas & Histórico de Treinos
              </h3>
              <p className="text-xs text-zinc-400">
                Visualização gráfica de tonelagem acumulada e evolução de força
              </p>
            </div>
          </div>
          <button
            id="btn-close-history"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Toast Notification */}
        {toast && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              toast.type === 'error'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-xs opacity-70 hover:opacity-100 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/90 px-3 sm:px-6 gap-1 sm:gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            id="tab-history-charts"
            onClick={() => setActiveTab('charts')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'charts'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Tonelagem & Cargas</span>
          </button>

          <button
            id="tab-history-rpe"
            onClick={() => setActiveTab('rpe')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'rpe'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Média de Esforço & RPE</span>
          </button>

          <button
            id="tab-history-list"
            onClick={() => setActiveTab('list')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'list'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Lista de Sessões ({totalWorkouts})</span>
          </button>
        </div>

        {/* High Level Stats Strip */}
        <div className="px-5 py-3 bg-zinc-950/80 border-b border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Treinos Concluídos</span>
              <span className="text-sm font-extrabold text-white font-mono">{totalWorkouts}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2.5">
            <Dumbbell className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Tonnage Total Acumulado</span>
              <span className="text-sm font-extrabold text-amber-300 font-mono">
                {totalKgAllTime.toLocaleString('pt-BR')} kg
              </span>
            </div>
          </div>

          <div className="hidden sm:flex p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-between col-span-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportBackup}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                title="Exportar backup JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <label
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition cursor-pointer"
                title="Importar backup JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>
            <span className="text-[10px] text-zinc-500">Backup & Restauração</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'charts' ? (
            <TonnageProgressionChart sessions={history} />
          ) : activeTab === 'rpe' ? (
            <RpeEffortProgressionChart sessions={history} />
          ) : (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <Dumbbell className="w-8 h-8 mx-auto text-zinc-600 stroke-[1.5]" />
                  <p className="text-sm font-medium">Nenhum treino salvo no histórico ainda.</p>
                  <p className="text-xs text-zinc-600">
                    Complete seu treino atual e clique em <strong>"Concluir Treino"</strong> para salvar seu
                    primeiro registro!
                  </p>
                </div>
              ) : (
                history.map((sess) => {
                  const isExpanded = expandedId === sess.id;
                  const totalSetsCount = sess.exercises.reduce((acc, e) => acc + e.sets.length, 0);
                  const completedSetsCount = sess.exercises.reduce(
                    (acc, e) => acc + e.sets.filter((s) => s.completed).length,
                    0
                  );
                  const sessionTonnage = sess.exercises.reduce((acc, e) => {
                    return (
                      acc +
                      e.sets.reduce((sAcc, s) => {
                        if (s.completed && s.actualKg && s.actualReps) {
                          return sAcc + s.actualKg * s.actualReps;
                        }
                        return sAcc;
                      }, 0)
                    );
                  }, 0);

                  const [y, m, d] = sess.date.split('-');
                  const dateFormatted = d && m && y ? `${d}/${m}/${y}` : sess.date;

                  return (
                    <div
                      key={sess.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-850/70 overflow-hidden hover:border-zinc-700 transition"
                    >
                      {/* Session Accordion Item Header */}
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : sess.id)}
                        className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
                            {d || '01'}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm tracking-tight">{sess.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                {dateFormatted}
                              </span>
                              {sess.durationMinutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-zinc-500" />
                                  {sess.durationMinutes} min
                                </span>
                              )}
                              <span className="text-emerald-400 font-semibold">
                                {completedSetsCount}/{totalSetsCount} séries
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {sessionTonnage > 0 && (
                            <span className="hidden sm:inline-block text-xs font-mono font-bold px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              {sessionTonnage.toLocaleString('pt-BR')} kg
                            </span>
                          )}

                          {deleteConfirmId === sess.id ? (
                            <div
                              className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-800 px-2 py-1 rounded-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-[10px] font-bold text-rose-300">Excluir?</span>
                              <button
                                onClick={(e) => executeDeleteSession(sess.id, e)}
                                className="text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded transition"
                              >
                                Sim
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmId(null);
                                }}
                                className="text-[10px] font-medium text-zinc-400 hover:text-white px-1.5 py-0.5 rounded transition"
                              >
                                Não
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(sess.id);
                              }}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition"
                              title="Apagar este registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Session Details */}
                      {isExpanded && (
                        <div className="px-4 py-3 bg-zinc-900/90 border-t border-zinc-800/80 space-y-3 text-xs">
                          {sess.notes && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-zinc-200 text-xs flex items-start gap-2.5">
                              <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider block">
                                  Observações do Treino
                                </span>
                                <p className="text-zinc-200 text-xs whitespace-pre-wrap leading-relaxed">
                                  {sess.notes}
                                </p>
                              </div>
                            </div>
                          )}

                          {sess.exercises.length === 0 && (
                            <div className="text-center py-6">
                              <span className="text-3xl mb-2 block">☕</span>
                              <div className="text-sm font-bold text-zinc-300">Descanso Registrado</div>
                              <div className="text-xs text-zinc-500 mt-1">Recuperação muscular concluída.</div>
                            </div>
                          )}
                          {sess.exercises.map((ex) => (
                            <div key={ex.id} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
                              <span className="font-bold text-zinc-200 block mb-1.5">{ex.name}</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {ex.sets.map((s, idx) => {
                                  const reps = s.actualReps !== undefined ? s.actualReps : s.targetReps;
                                  const kg = s.actualKg !== undefined ? s.actualKg : s.targetKg;
                                  return (
                                    <div
                                      key={s.id || idx}
                                      className={`p-1.5 rounded-md border text-[11px] ${
                                        s.completed
                                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                      }`}
                                    >
                                      <div className="flex justify-between">
                                        <span className="font-bold">Série {idx + 1}:</span>
                                        <span>{reps} reps</span>
                                      </div>
                                      <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                                        <span>{kg ? `${kg} kg` : '—'}</span>
                                        <span>{s.rir !== undefined && s.rir !== null ? `RIR ${s.rir}` : ''}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
