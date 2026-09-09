import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Dumbbell,
  Award,
  Share2,
  History,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  Bell,
  BellRing,
  WifiOff,
  CloudOff,
  ShieldCheck,
  Cloud,
  Smartphone,
  Download,
  Timer,
  Play,
  Pause,
  RotateCw
} from 'lucide-react';
import { WorkoutSession } from '../types';
import { AuthButton } from './AuthButton';
import { soundEngine } from '../utils/audio';
import { parseSessionTimestamp } from '../utils/storage';

interface WorkoutHeaderProps {
  session: WorkoutSession;
  onSelectTemplate: (templateId: string) => void;
  templates: { id: string; title: string; tag: string }[];
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onFinishWorkout: () => void;
  onResetWorkout: () => void;
  onOpenHistory: () => void;
  onOpenProgressionChart?: () => void;
  onOpenWhatsApp: () => void;
  onOpenRirGuide: () => void;
  onOpenExerciseGuide?: () => void;
  onOpenCalendar?: () => void;
  onOpenAlarm?: () => void;
  onOpenPWAInstall?: () => void;
  isPWAInstallable?: boolean;
  nextAlarmDisplay?: string | null;
  authUser?: any;
  isSyncing?: boolean;
  onSyncManual?: () => void;
  isOnline?: boolean;
  pendingSyncCount?: number;
  onOpenOfflineModal?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'register' | 'switch') => void;
  totalSets: number;
  completedSets: number;
  totalTonnage: number;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  session,
  onSelectTemplate,
  templates,
  onDateChange,
  onTimeChange,
  onFinishWorkout,
  onResetWorkout,
  onOpenHistory,
  onOpenProgressionChart,
  onOpenWhatsApp,
  onOpenRirGuide,
  onOpenExerciseGuide,
  onOpenCalendar,
  onOpenAlarm,
  onOpenPWAInstall,
  isPWAInstallable = false,
  nextAlarmDisplay,
  authUser,
  isSyncing,
  onSyncManual,
  isOnline = true,
  pendingSyncCount = 0,
  onOpenOfflineModal,
  onOpenAuthModal,
  totalSets,
  completedSets,
  totalTonnage,
}) => {
  const [liveClockTime, setLiveClockTime] = useState<string>('');

  // Live real-time clock (Hora Certa)
  useEffect(() => {
    const updateLiveClock = () => {
      const now = new Date();
      setLiveClockTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateLiveClock();
    const clockInterval = setInterval(updateLiveClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);


  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md sticky top-0 z-30 shadow-lg">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 py-2.5 sm:py-4">
        {/* Top bar: Brand, Date, Action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-zinc-950 shrink-0 relative overflow-hidden">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 relative z-10">
                  <path d="M4 12a8 8 0 0 1 8-8v8H4z" fill="currentColor" opacity="0.9" />
                  <path d="M12 4a8 8 0 0 1 8 8h-8V4z" fill="currentColor" opacity="0.6" />
                  <path d="M20 12a8 8 0 0 1-8 8v-8h8z" fill="currentColor" opacity="0.3" />
                  <path d="M12 20a8 8 0 0 1-8-8h8v8z" fill="currentColor" opacity="0.75" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" className="text-zinc-950" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>Diário de Treino</span>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Pro
                    </span>
                  </h1>

                  {/* Offline / Pending Sync Status Indicator Badge */}
                  {!isOnline ? (
                    <button
                      id="btn-offline-badge-header"
                      onClick={onOpenOfflineModal}
                      title="Clique para ver o status do Modo Offline e Armazenamento Local"
                      className="px-2 py-0.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[10px] font-bold flex items-center gap-1 transition active:scale-95 animate-pulse"
                    >
                      <WifiOff className="w-3 h-3" />
                      <span>Offline</span>
                      {pendingSyncCount > 0 && (
                        <span className="bg-red-500 text-zinc-950 px-1 rounded-full text-[9px]">
                          {pendingSyncCount}
                        </span>
                      )}
                    </button>
                  ) : pendingSyncCount > 0 ? (
                    <button
                      id="btn-pending-sync-badge-header"
                      onClick={onOpenOfflineModal}
                      title="Você tem alterações locais pendentes de sincronização"
                      className="px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition active:scale-95"
                    >
                      <CloudOff className="w-3 h-3 text-amber-400" />
                      <span>{pendingSyncCount} pendente(s)</span>
                    </button>
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-medium truncate max-w-[200px] sm:max-w-none">Via Aérea Brasil • Alta Performance</p>
              </div>
            </div>

            {/* Mobile Actions Toolbar with spacious auto-wrapping */}
            <div className="flex sm:hidden items-center flex-wrap gap-2">
              {onOpenProgressionChart && (
                <button
                  id="btn-progression-mobile"
                  onClick={onOpenProgressionChart}
                  title="Gráficos de Progressão & Tonelagem"
                  className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition active:scale-90"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              )}
              {onOpenCalendar && (
                <button
                  id="btn-calendar-mobile"
                  onClick={onOpenCalendar}
                  title="Calendário & Programação de Treinos"
                  className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition active:scale-90"
                >
                  <CalendarCheck className="w-4 h-4" />
                </button>
              )}
              <button
                id="btn-whatsapp-mobile"
                onClick={onOpenWhatsApp}
                title="Exportar WhatsApp"
                className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition active:scale-90"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                id="btn-history-mobile"
                onClick={onOpenHistory}
                title="Histórico de Treinos"
                className="p-2 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition active:scale-90"
              >
                <History className="w-4 h-4" />
              </button>
              <AuthButton
                user={authUser}
                isSyncing={isSyncing}
                onSyncManual={onSyncManual}
                isOnline={isOnline}
                pendingSyncCount={pendingSyncCount}
                onOpenOfflineModal={onOpenOfflineModal}
                onOpenAuthModal={onOpenAuthModal}
              />
            </div>
          </div>

          {/* Date Picker, Live Hora Certa & Desktop Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 justify-between sm:justify-end flex-wrap">
            {/* Desktop Offline / Sync Status Details Pill */}
            {!isOnline && (
              <button
                id="btn-offline-details-desktop"
                onClick={onOpenOfflineModal}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold transition active:scale-95"
                title="Modo Offline Ativo - Clique para detalhes"
              >
                <WifiOff className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Modo Local Seguro</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-red-500 text-zinc-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold ml-1">
                    {pendingSyncCount} pendente(s)
                  </span>
                )}
              </button>
            )}

            {isOnline && pendingSyncCount > 0 && (
              <button
                id="btn-pending-details-desktop"
                onClick={onOpenOfflineModal}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition active:scale-95"
                title="Alterações pendentes de sincronização"
              >
                <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                <span>{pendingSyncCount} pendente(s)</span>
              </button>
            )}

            <div className="hidden sm:block">
              <AuthButton
                user={authUser}
                isSyncing={isSyncing}
                onSyncManual={onSyncManual}
                isOnline={isOnline}
                pendingSyncCount={pendingSyncCount}
                onOpenOfflineModal={onOpenOfflineModal}
                onOpenAuthModal={onOpenAuthModal}
              />
            </div>

            {/* Workout Date, Clock & Stopwatch Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/70 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  id="workout-date-input"
                  type="date"
                  value={session.date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none text-zinc-200 cursor-pointer w-[110px] sm:w-auto"
                />
              </div>

              {/* Minimalist Live Clock */}
              <div className="flex items-center justify-center bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-2.5 py-1.5 shadow-sm">
                <span className="font-mono font-bold tracking-wider text-xs text-zinc-300">
                  {liveClockTime || '00:00:00'}
                </span>
              </div>
            </div>
              
              

            {onOpenProgressionChart && (
              <button
                id="btn-progression-desktop"
                onClick={onOpenProgressionChart}
                className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition active:scale-95 shadow-sm"
                title="Ver Gráficos de Tonelagem e Progressão de Força"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Evolução</span>
              </button>
            )}

            {onOpenCalendar && (
              <button
                id="btn-calendar-desktop"
                onClick={onOpenCalendar}
                className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition active:scale-95 shadow-sm"
                title="Programar e Visualizar Calendário de Treinos"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Calendário</span>
              </button>
            )}

            <button
              id="btn-history-desktop"
              onClick={onOpenHistory}
              className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition active:scale-95"
            >
              <History className="w-4 h-4 text-zinc-400" />
              <span>Histórico</span>
            </button>

            <button
              id="btn-whatsapp-desktop"
              onClick={onOpenWhatsApp}
              className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Workout Navigation Tabs with automatic wrapping & comfortable spacing */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-1">
            {templates.map((tpl) => {
              const isActive = session.templateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  id={`tab-template-${tpl.id}`}
                  onClick={() => onSelectTemplate(tpl.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 active:scale-95 ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-zinc-750 border border-zinc-700/80'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-zinc-950' : 'bg-zinc-500'}`} />
                  <span>{tpl.title}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-reset-workout"
              onClick={onResetWorkout}
              title="Limpar checkboxes do treino atual"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reiniciar</span>
            </button>


          </div>
        </div>

        {/* Workout Progress Metrics Banner */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-zinc-800/60 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] sm:text-xs">Séries:</span>
              <span className="font-bold text-zinc-200 text-[11px] sm:text-xs">
                {completedSets}/{totalSets}
              </span>
              <span className="text-amber-400 font-mono font-semibold text-[11px] sm:text-xs">({progressPercent}%)</span>
            </div>

            {totalTonnage > 0 && (
              <button
                id="btn-tonnage-badge-header"
                onClick={onOpenProgressionChart || onOpenHistory}
                className="flex items-center gap-1 pl-2 sm:pl-3 border-l border-zinc-800 text-zinc-300 hover:text-amber-300 transition group cursor-pointer text-[11px] sm:text-xs"
                title="Clique para ver gráficos de progressão de carga e tonelagem"
              >
                <Dumbbell className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 group-hover:scale-110 transition" />
                <span className="hidden sm:inline">Volume:</span>
                <span className="font-bold text-amber-300 font-mono">
                  {totalTonnage.toLocaleString('pt-BR')} kg
                </span>
                <TrendingUp className="w-3 h-3 text-amber-400 opacity-70 group-hover:opacity-100 transition" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-24 sm:w-48 h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
