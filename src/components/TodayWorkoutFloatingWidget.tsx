import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Flame,
  Coffee,
  ArrowRight,
  RefreshCw,
  BellRing,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { WorkoutSession, WorkoutTemplate } from '../types';
import {
  getScheduledWorkoutForDate,
  getScheduledTimeForDate,
  loadSchedule,
  loadHistory,
  setTodayScheduledWorkout,
  applySchedulePreset
} from '../utils/storage';
import { sounds } from '../utils/audio';

interface TodayWorkoutFloatingWidgetProps {
  currentSession: WorkoutSession;
  templates: WorkoutTemplate[];
  onQuickStart: (templateId: string) => void;
  onOpenCalendar?: (tab?: 'calendar' | 'weekly_plan' | 'alarm') => void;
  completedSets: number;
  totalSets: number;
  soundEnabled?: boolean;
}

export const TodayWorkoutFloatingWidget: React.FC<TodayWorkoutFloatingWidgetProps> = ({
  currentSession,
  templates,
  onQuickStart,
  onOpenCalendar,
  completedSets,
  totalSets,
  soundEnabled = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showQuickChange, setShowQuickChange] = useState<boolean>(false);
  const [todayDateStr, setTodayDateStr] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [justStarted, setJustStarted] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Update today's date
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      setTodayDateStr(`${y}-${m}-${d}`);
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine today's scheduled workout
  const schedule = loadSchedule();
  const scheduledToday = getScheduledWorkoutForDate(todayDateStr, schedule);
  const scheduledTime = getScheduledTimeForDate(todayDateStr, schedule);

  const matchedTemplate = templates.find((t) => t.id === scheduledToday.templateId);
  const isRestDay = scheduledToday.isRest || scheduledToday.templateId === 'rest';

  // Check if today's workout has already been recorded in history
  const history = loadHistory();
  const isTodayHistoryCompleted = history.some(
    (s) => s.date === todayDateStr && (s.completed || (s.exercises && s.exercises.some((e) => e.sets.some((st) => st.completed))))
  );

  // Check if the current active session corresponds to today's scheduled workout
  const isCurrentActiveSameAsToday =
    currentSession.templateId === scheduledToday.templateId && currentSession.date === todayDateStr;

  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const isCurrentlyInProgress = isCurrentActiveSameAsToday && completedSets > 0 && !currentSession.completed;

  // Day of week display
  const now = new Date();
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const dayOfWeekName = dayNames[now.getDay()];
  const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;

  const handleStart = (templateId: string) => {
    if (soundEnabled) {
      sounds.playStartWorkout();
    }
    setJustStarted(true);
    onQuickStart(templateId);

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setJustStarted(false);
    }, 2000);
  };

  const handleQuickSwitchToday = (templateId: string) => {
    setTodayScheduledWorkout(templateId);
    if (soundEnabled) {
      sounds.playClick();
    }
    setNotificationMsg(`Hoje reconfigurado para: ${templates.find(t => t.id === templateId)?.title || templateId}`);
    setTimeout(() => setNotificationMsg(null), 3500);
    setShowQuickChange(false);
  };

  const handleQuickApplyLowerFirst = () => {
    applySchedulePreset('lower_first');
    if (soundEnabled) {
      sounds.playSuccess();
    }
    setNotificationMsg('Divisão semanal reorganizada com sucesso: Foco Inferiores iniciado hoje!');
    setTimeout(() => setNotificationMsg(null), 3500);
    setShowQuickChange(false);
  };

  return (
    <section
      id="today-workout-widget"
      aria-label="Treino Agendado de Hoje"
      className="w-full transition-all duration-300"
    >
      {/* Main Inline Card */}
      <div className="bg-zinc-900/90 border border-amber-500/40 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
        {/* Top Bar / Header */}
        <div className="px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>

            <div className="flex items-center gap-1.5 text-xs font-black tracking-wide text-white uppercase">
              <span className="text-amber-400 font-extrabold">Treino de Hoje</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 font-bold normal-case">{dayOfWeekName} ({formattedDate})</span>
            </div>

            {scheduledTime && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-amber-300 border border-amber-500/30"
                title={`Horário planejado para este treino: ${scheduledTime}. Altere no Calendário ou na aba de Alarmes.`}
              >
                <Clock className="w-2.5 h-2.5 text-amber-400" />
                <span>Horário: {scheduledTime}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              id="btn-widget-quick-reorganize"
              onClick={() => setShowQuickChange(!showQuickChange)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                showQuickChange ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-800'
              }`}
              title="Trocar treino de hoje ou reorganizar divisão"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mudar Treino</span>
            </button>

            {onOpenCalendar && (
              <button
                type="button"
                id="btn-widget-open-calendar"
                onClick={() => onOpenCalendar('calendar')}
                className="px-2 py-1 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 text-[11px] font-semibold transition flex items-center gap-1"
                title="Ver ou alterar no Calendário"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendário</span>
              </button>
            )}

            <button
              type="button"
              id="btn-toggle-collapse-widget"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title={isCollapsed ? 'Expandir' : 'Recolher'}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Feedback notification if quick modified */}
        {notificationMsg && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-3.5 py-1.5 text-xs text-emerald-300 font-bold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Quick Change Drawer */}
        {showQuickChange && (
          <div className="p-3 bg-zinc-950/80 border-b border-zinc-800/90 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-300">Escolha o Treino para Hoje:</span>
              <button
                type="button"
                onClick={handleQuickApplyLowerFirst}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded border border-amber-500/30 transition flex items-center gap-1"
                title="Ajusta a semana toda para começar com Inferiores"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reorganizar: Começar com Inferiores</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {templates.map((tpl) => {
                const isSelected = scheduledToday.templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleQuickSwitchToday(tpl.id)}
                    className={`p-2 rounded-xl border text-left transition flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold ring-1 ring-amber-400'
                        : 'bg-zinc-850 hover:bg-zinc-800 border-zinc-750 text-zinc-300 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold truncate">{tpl.title}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />}
                    </div>
                    <span className="text-[9px] text-zinc-400 truncate">{tpl.subtitle || tpl.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsed Mode View */}
        {isCollapsed ? (
          <div className="px-3.5 py-2 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                {isRestDay ? <Coffee className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
              </div>
              <span className="font-bold text-white truncate">
                {isRestDay ? 'Descanso Programado' : (matchedTemplate?.title || scheduledToday.templateId)}
              </span>
            </div>

            {!isRestDay && matchedTemplate && (
              <button
                type="button"
                id="btn-quick-start-collapsed"
                onClick={() => handleStart(matchedTemplate.id)}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 shrink-0 transition active:scale-95 shadow-md shadow-amber-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isCurrentlyInProgress ? 'Continuar' : 'Iniciar Rápido'}</span>
              </button>
            )}
          </div>
        ) : (
          /* Expanded Full View */
          <div className="p-3 sm:p-3.5 space-y-2.5">
            {/* Scheduled Content */}
            {isRestDay ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <span>Descanso / Recuperação</span>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-semibold">
                        Off Day
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      {scheduledToday.notes || 'Dia planejado para descanso muscular e recuperação física.'}
                    </p>
                  </div>
                </div>

                {/* Option to choose a workout even on rest day */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-quick-start-inferiores"
                    onClick={() => {
                      const lower = templates.find(t => t.id === 'inferiores-a') || templates[0];
                      handleQuickSwitchToday(lower.id);
                      handleStart(lower.id);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shrink-0 flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-500/20"
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>Iniciar Treino de Inferiores</span>
                  </button>
                </div>
              </div>
            ) : matchedTemplate ? (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-white text-xs sm:text-sm truncate">
                          {matchedTemplate.title}
                        </h4>
                        {matchedTemplate.tag && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold uppercase shrink-0">
                            {matchedTemplate.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {matchedTemplate.subtitle || `${matchedTemplate.exercises.length} exercícios planejados`}
                      </p>
                    </div>
                  </div>

                  {/* Prominent Quick Start Button */}
                  <button
                    type="button"
                    id="btn-quick-start-today-widget"
                    onClick={() => handleStart(matchedTemplate.id)}
                    className={`py-2 px-3.5 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-lg ${
                      isCurrentlyInProgress
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                        : isTodayHistoryCompleted
                        ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 shadow-none'
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 shadow-amber-500/30 ring-2 ring-amber-400/50 animate-pulse'
                    }`}
                  >
                    {justStarted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        <span>Carregado!</span>
                      </>
                    ) : isCurrentlyInProgress ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Continuar</span>
                      </>
                    ) : isTodayHistoryCompleted ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refazer</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current stroke-[2.5]" />
                        <span>Iniciar Rápido</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Bar / Extra Details */}
                {isCurrentlyInProgress && (
                  <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-[10px] text-zinc-400">
                    <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-emerald-400 shrink-0">
                      {completedSets}/{totalSets} séries ({progressPercent}%)
                    </span>
                  </div>
                )}

                {!isCurrentlyInProgress && isTodayHistoryCompleted && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Treino de hoje já concluído no histórico.</span>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback if template ID not found */
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-xs">Treino Programado: {scheduledToday.templateId}</h4>
                  <p className="text-[10px] text-zinc-400">Selecione uma ficha para iniciar</p>
                </div>
                {templates.length > 0 && (
                  <button
                    type="button"
                    id="btn-quick-start-fallback"
                    onClick={() => handleStart(templates[0].id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
