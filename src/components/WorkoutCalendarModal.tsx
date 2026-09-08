import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Flame,
  Dumbbell,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Settings,
  Info,
  CalendarCheck,
  PlusCircle,
  Coffee,
  Award,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Zap,
  Check,
  Smartphone
} from 'lucide-react';
import { WorkoutTemplate, WorkoutSession, WorkoutScheduleState, DaySchedule, WorkoutAlarmSettings } from '../types';
import {
  loadSchedule,
  saveSchedule,
  loadHistory,
  getLastCompletedWorkout,
  getNextRecommendedWorkout,
  getScheduledWorkoutForDate,
  getScheduledTimeForDate,
  DEFAULT_WEEKLY_PLAN,
  DEFAULT_ALARM_SETTINGS
} from '../utils/storage';
import { sounds } from '../utils/audio';

interface WorkoutCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: WorkoutTemplate[];
  onSelectAndStartWorkout: (templateId: string) => void;
  currentActiveSession?: WorkoutSession | null;
  initialTab?: 'calendar' | 'weekly_plan' | 'alarm' | 'stats';
  onTriggerTestAlarm?: () => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAY_NAMES_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const WEEKDAY_NAMES_FULL = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

const QUICK_TIME_PRESETS = [
  { label: '06:00', note: 'Madrugada / Jejum' },
  { label: '07:00', note: 'Manhã Cedo' },
  { label: '08:30', note: 'Meio da Manhã' },
  { label: '12:00', note: 'Almoço' },
  { label: '17:30', note: 'Fim de Tarde' },
  { label: '18:30', note: 'Pós-Trabalho' },
  { label: '19:30', note: 'Noite' },
  { label: '20:30', note: 'Noite Avançada' },
];

export const WorkoutCalendarModal: React.FC<WorkoutCalendarModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectAndStartWorkout,
  currentActiveSession,
  initialTab = 'calendar',
  onTriggerTestAlarm,
}) => {
  const [scheduleState, setScheduleState] = useState<WorkoutScheduleState>(() => loadSchedule());
  const [activeTab, setActiveTab] = useState<'calendar' | 'weekly_plan' | 'alarm' | 'stats'>(initialTab);
  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);

  // Sync initialTab when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setScheduleState(loadSchedule());
      setActiveTab(initialTab);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationStatus(Notification.permission);
      }
    }
  }, [isOpen, initialTab]);

  // Current view date in calendar (defaults to today)
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState<number>(() => today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => today.getMonth()); // 0-11
  
  // Selected day for detail inspect & schedule edit
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const history = useMemo(() => (isOpen ? loadHistory() : []), [isOpen]);
  const lastWorkout = useMemo(() => getLastCompletedWorkout(), [history]);
  const nextWorkout = useMemo(() => getNextRecommendedWorkout(), [history, scheduleState]);

  if (!isOpen) return null;

  const alarmSettings: WorkoutAlarmSettings = scheduleState.alarm || DEFAULT_ALARM_SETTINGS;

  // Calendar calculations
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleGoToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Schedule updates
  const handleUpdateWeeklyPlanDay = (dayIndex: number, templateId: string) => {
    const updated: WorkoutScheduleState = {
      ...scheduleState,
      weeklyPlan: {
        ...scheduleState.weeklyPlan,
        [dayIndex]: templateId,
      },
    };
    setScheduleState(updated);
    saveSchedule(updated);
  };

  const handleUpdateCustomDay = (dateStr: string, templateId: string, notes?: string) => {
    const updatedCustom = { ...scheduleState.customDays };
    if (templateId === 'default') {
      delete updatedCustom[dateStr];
    } else {
      updatedCustom[dateStr] = {
        ...(updatedCustom[dateStr] || {}),
        templateId,
        isRest: templateId === 'rest',
        notes: notes !== undefined ? notes : updatedCustom[dateStr]?.notes,
      };
    }
    const updated: WorkoutScheduleState = {
      ...scheduleState,
      customDays: updatedCustom,
    };
    setScheduleState(updated);
    saveSchedule(updated);
  };

  const handleUpdateDayTime = (dateStr: string, time: string) => {
    const updatedCustom = { ...scheduleState.customDays };
    updatedCustom[dateStr] = {
      ...(updatedCustom[dateStr] || { templateId: getScheduledWorkoutForDate(dateStr, scheduleState).templateId }),
      time,
    };
    const updated: WorkoutScheduleState = {
      ...scheduleState,
      customDays: updatedCustom,
    };
    setScheduleState(updated);
    saveSchedule(updated);
  };

  const handleToggleDayAlarm = (dateStr: string) => {
    const currentCustom = scheduleState.customDays[dateStr];
    const isCurrentlyEnabled = currentCustom?.alarmEnabled ?? true;
    const updatedCustom = { ...scheduleState.customDays };
    updatedCustom[dateStr] = {
      ...(currentCustom || { templateId: getScheduledWorkoutForDate(dateStr, scheduleState).templateId }),
      alarmEnabled: !isCurrentlyEnabled,
    };
    const updated: WorkoutScheduleState = {
      ...scheduleState,
      customDays: updatedCustom,
    };
    setScheduleState(updated);
    saveSchedule(updated);
  };

  const handleUpdateAlarmSettings = (partial: Partial<WorkoutAlarmSettings>) => {
    const updatedAlarm: WorkoutAlarmSettings = {
      ...alarmSettings,
      ...partial,
    };
    const updated: WorkoutScheduleState = {
      ...scheduleState,
      alarm: updatedAlarm,
    };
    setScheduleState(updated);
    saveSchedule(updated);
  };

  const handleToggleAlarmDayOfWeek = (dayIndex: number) => {
    const currentDays = alarmSettings.daysOfWeek || [1, 2, 4, 5];
    const exists = currentDays.includes(dayIndex);
    const newDays = exists
      ? currentDays.filter((d) => d !== dayIndex)
      : [...currentDays, dayIndex].sort();
    handleUpdateAlarmSettings({ daysOfWeek: newDays });
  };

  const handlePlaySoundPreview = (pattern: 'intense' | 'classic' | 'chime' | 'countdown') => {
    if (playingPreview === pattern) {
      sounds.stopAlarm();
      setPlayingPreview(null);
      return;
    }
    sounds.stopAlarm();
    setPlayingPreview(pattern);
    sounds.previewAlarmSound(pattern);
    setTimeout(() => {
      setPlayingPreview((curr) => (curr === pattern ? null : curr));
    }, 2200);
  };

  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationStatus(perm);
        if (perm === 'granted') {
          new Notification('🔔 Lembretes de Treino Ativados!', {
            body: 'Você receberá alertas sonoros e notificações nos horários agendados do seu treino.',
            icon: '/favicon.png',
          });
        }
      } catch (e) {
        console.error('Error requesting notification permission:', e);
      }
    }
  };

  const handleApplyPreset = (presetType: 'start_lower_first' | 'ab_5days_upper' | 'ab_5days_lower' | 'ab_5days_midrest' | 'ab_4days' | 'ab_alt') => {
    let newPlan: Record<number, string>;
    let newAlarmDays: number[];
    const updatedCustom = { ...scheduleState.customDays };

    if (presetType === 'start_lower_first') {
      // Começar com Inferiores: Seg: Inf A, Ter: Sup A, Qua: Inf B, Qui: Sup B, Sex: Inf A
      newPlan = {
        0: 'rest',
        1: 'inferiores-a',
        2: 'superior-a',
        3: 'inferiores-b',
        4: 'superior-b',
        5: 'inferiores-a',
        6: 'rest',
      };
      newAlarmDays = [1, 2, 3, 4, 5];
      // Explicitly set today to inferiores-a
      updatedCustom[todayStr] = {
        ...(updatedCustom[todayStr] || {}),
        templateId: 'inferiores-a',
        isRest: false,
      };
    } else if (presetType === 'ab_5days_upper') {
      // 5 Dias: Seg a Sex (Seg: Sup A, Ter: Inf A, Qua: Sup B, Qui: Inf B, Sex: Sup A, Sáb/Dom: Off)
      newPlan = {
        0: 'rest',
        1: 'superior-a',
        2: 'inferiores-a',
        3: 'superior-b',
        4: 'inferiores-b',
        5: 'superior-a',
        6: 'rest',
      };
      newAlarmDays = [1, 2, 3, 4, 5];
    } else if (presetType === 'ab_5days_lower') {
      // 5 Dias: Seg a Sex (Repetindo Inferiores A na Sexta)
      newPlan = {
        0: 'rest',
        1: 'inferiores-a',
        2: 'superior-a',
        3: 'inferiores-b',
        4: 'superior-b',
        5: 'inferiores-a',
        6: 'rest',
      };
      newAlarmDays = [1, 2, 3, 4, 5];
    } else if (presetType === 'ab_5days_midrest') {
      // 5 Dias com Quarta Off e Treino no Sábado
      newPlan = {
        0: 'rest',
        1: 'inferiores-a',
        2: 'superior-a',
        3: 'rest',
        4: 'inferiores-b',
        5: 'superior-b',
        6: 'inferiores-a',
      };
      newAlarmDays = [1, 2, 4, 5, 6];
    } else if (presetType === 'ab_4days') {
      // 4 Dias: Seg, Ter, Qui, Sex
      newPlan = {
        0: 'rest',
        1: 'inferiores-a',
        2: 'superior-a',
        3: 'rest',
        4: 'inferiores-b',
        5: 'superior-b',
        6: 'rest',
      };
      newAlarmDays = [1, 2, 4, 5];
    } else {
      // 3 Dias: Seg, Qua, Sex
      newPlan = {
        0: 'rest',
        1: 'inferiores-a',
        2: 'rest',
        3: 'superior-a',
        4: 'rest',
        5: 'inferiores-b',
        6: 'rest',
      };
      newAlarmDays = [1, 3, 5];
    }

    const updated: WorkoutScheduleState = {
      ...scheduleState,
      weeklyPlan: newPlan,
      customDays: updatedCustom,
      alarm: {
        ...alarmSettings,
        daysOfWeek: newAlarmDays,
      },
    };
    setScheduleState(updated);
    saveSchedule(updated);
  };

  // Group history by date string 'YYYY-MM-DD'
  const sessionsByDate = history.reduce<Record<string, WorkoutSession[]>>((acc, session) => {
    const date = session.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  // Stats for the viewed month
  const completedThisMonth = Object.keys(sessionsByDate).filter((dateStr) => {
    const [y, m] = dateStr.split('-').map(Number);
    return y === viewYear && m === viewMonth + 1;
  }).length;

  const getTemplateById = (id: string) => templates.find((t) => t.id === id);

  // Selected date details
  const [selY, selM, selD] = selectedDateStr.split('-').map(Number);
  const selectedDateObj = new Date(selY, selM - 1, selD);
  const isSelectedDateToday = selectedDateStr === todayStr;
  const selectedDateSessions = sessionsByDate[selectedDateStr] || [];
  const selectedDateScheduled = getScheduledWorkoutForDate(selectedDateStr, scheduleState);
  const selectedDateTime = getScheduledTimeForDate(selectedDateStr, scheduleState);
  const isSelectedDayAlarmActive = scheduleState.customDays[selectedDateStr]?.alarmEnabled ?? (
    alarmSettings.enabled && (alarmSettings.daysOfWeek?.includes(selectedDateObj.getDay()) || false)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="workout-calendar-modal"
        className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-zinc-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Programação, Calendário & Alarme
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline">
                  Divisão 5 Dias / Semana (Seg a Sex)
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Planeje seus treinos, defina os horários habituais e ative alarmes sonoros.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Top Overview Bar */}
        <div className="p-3.5 sm:p-4 bg-zinc-900/70 border-b border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Card: Último Treino */}
          <div className="p-3.5 bg-zinc-850 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" /> Último Treino Realizado
              </span>
              {lastWorkout ? (
                <div>
                  <h4 className="font-extrabold text-white text-sm">{lastWorkout.session.title}</h4>
                  <p className="text-[11px] text-zinc-400">
                    {lastWorkout.formattedDate} ({lastWorkout.daysAgo === 0 ? 'Hoje' : lastWorkout.daysAgo === 1 ? 'Ontem' : `Há ${lastWorkout.daysAgo} dias`})
                  </p>
                </div>
              ) : (
                <p className="text-zinc-500 text-xs mt-1">Nenhum treino concluído ainda.</p>
              )}
            </div>

            {lastWorkout && (
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Card: Próximo Treino & Alarme Status */}
          <div className="p-3.5 bg-gradient-to-r from-amber-950/30 to-zinc-900 rounded-xl border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Próximo Treino
                </span>
                {alarmSettings.enabled && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-1">
                    <BellRing className="w-2.5 h-2.5" /> ⏰ {alarmSettings.defaultTime}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black text-white truncate mt-0.5">
                {getTemplateById(nextWorkout.templateId)?.title || 'Próximo Treino'}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate">
                {nextWorkout.reason}
              </p>
            </div>

            <button
              id="btn-start-next-workout"
              onClick={() => {
                onSelectAndStartWorkout(nextWorkout.templateId);
                onClose();
              }}
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-500/20 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Iniciar</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/90 px-3 sm:px-6 gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'calendar'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Calendário Mensal</span>
          </button>

          <button
            id="tab-btn-alarm"
            onClick={() => setActiveTab('alarm')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'alarm'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Horários & Alarme</span>
            {alarmSettings.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('weekly_plan')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'weekly_plan'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Divisão Semanal</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Frequência ({completedThisMonth})</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-zinc-900/60">
          {/* TAB 1: MONTHLY CALENDAR VIEW */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Calendar Grid (2 cols on large) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Month Navigator Header */}
                <div className="flex items-center justify-between bg-zinc-850 p-3 sm:p-3.5 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                      title="Mês Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm sm:text-base font-black text-white min-w-[140px] text-center">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </h3>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                      title="Próximo Mês"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleGoToToday}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition"
                  >
                    Ir para Hoje
                  </button>
                </div>

                {/* Weekday Labels */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
                  {WEEKDAY_NAMES_SHORT.map((wd, i) => (
                    <div
                      key={wd}
                      className={`text-[10px] font-black py-1 rounded ${
                        i === 0 || i === 6 ? 'text-zinc-500' : 'text-zinc-400'
                      }`}
                    >
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {/* Empty slots before first day */}
                  {Array.from({ length: startingDayOfWeek }).map((_, idx) => {
                    const prevMonthDay = daysInPrevMonth - startingDayOfWeek + idx + 1;
                    return (
                      <div
                        key={`prev-${idx}`}
                        className="min-h-[65px] sm:min-h-[85px] p-1 sm:p-1.5 rounded-xl bg-zinc-950/30 border border-zinc-800/30 text-zinc-600 flex flex-col justify-between opacity-40 select-none"
                      >
                        <span className="text-[11px] sm:text-xs font-mono">{prevMonthDay}</span>
                      </div>
                    );
                  })}

                  {/* Current month days */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const isToday = dateStr === todayStr;
                    const isSelected = dateStr === selectedDateStr;
                    const daySessions = sessionsByDate[dateStr] || [];
                    const hasCompletedWorkout = daySessions.length > 0;
                    const scheduledInfo = getScheduledWorkoutForDate(dateStr, scheduleState);
                    const scheduledTemplate = getTemplateById(scheduledInfo.templateId);
                    const dayTime = getScheduledTimeForDate(dateStr, scheduleState);

                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => setSelectedDateStr(dateStr)}
                        className={`min-h-[65px] sm:min-h-[85px] p-1 sm:p-1.5 rounded-xl border text-left flex flex-col justify-between transition relative overflow-hidden group ${
                          isSelected
                            ? 'bg-zinc-800 border-amber-400 ring-2 ring-amber-400/30'
                            : isToday
                            ? 'bg-zinc-850 border-amber-500/50 shadow-sm shadow-amber-500/10'
                            : 'bg-zinc-850/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
                        }`}
                      >
                        {/* Top row: day number & today indicator */}
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-[11px] sm:text-xs font-bold font-mono px-1 rounded ${
                              isToday
                                ? 'bg-amber-400 text-zinc-950 font-black'
                                : isSelected
                                ? 'text-amber-300 font-bold'
                                : 'text-zinc-300'
                            }`}
                          >
                            {dayNum}
                          </span>

                          {hasCompletedWorkout ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                          ) : !scheduledInfo.isRest && alarmSettings.enabled ? (
                            <span className="text-[8px] text-amber-400/80 font-mono flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span className="hidden sm:inline">{dayTime}</span>
                            </span>
                          ) : null}
                        </div>

                        {/* Middle & Bottom: Badges */}
                        <div className="mt-0.5 space-y-0.5 w-full overflow-hidden">
                          {hasCompletedWorkout ? (
                            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[8px] sm:text-[9px] font-bold p-0.5 sm:p-1 rounded truncate leading-tight flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">
                                {daySessions[0].title.replace('TREINO ', '')}
                              </span>
                            </div>
                          ) : scheduledInfo.isRest ? (
                            <div className="text-[8px] sm:text-[9px] text-zinc-500 px-1 py-0.5 rounded bg-zinc-800/40 font-medium truncate flex items-center gap-1">
                              <Coffee className="w-2.5 h-2.5 shrink-0 text-zinc-500" />
                              <span className="truncate">Off</span>
                            </div>
                          ) : scheduledTemplate ? (
                            <div className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[8px] sm:text-[9px] font-semibold p-0.5 sm:p-1 rounded truncate leading-tight">
                              {scheduledTemplate.title.replace('TREINO ', '')}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-zinc-400 flex-wrap pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/40" />
                    <span>Realizado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-500/15 border border-cyan-500/30" />
                    <span>Programado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-zinc-800 border border-zinc-700" />
                    <span>Descanso</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                    <span>Hoje</span>
                  </div>
                </div>
              </div>

              {/* Day Inspector & Quick Schedule / Time Editor (Right Side) */}
              <div className="bg-zinc-850 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-4">
                <div className="pb-3 border-b border-zinc-800">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Detalhes & Horário do Dia
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-amber-400" />
                    <span>
                      {WEEKDAY_NAMES_FULL[selectedDateObj.getDay()]}, {selectedDateObj.getDate()} de {MONTH_NAMES[selectedDateObj.getMonth()]}
                    </span>
                  </h3>
                  {isSelectedDateToday && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 mt-1 inline-block">
                      Dia Atual (Hoje)
                    </span>
                  )}
                </div>

                {/* Workout Time for this Day */}
                {!selectedDateScheduled.isRest && (
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Horário do Treino neste dia:</span>
                      </label>
                      <button
                        onClick={() => handleToggleDayAlarm(selectedDateStr)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition flex items-center gap-1 ${
                          isSelectedDayAlarmActive
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                        title="Ativar/Desativar alarme neste dia"
                      >
                        <Bell className="w-3 h-3" />
                        <span>{isSelectedDayAlarmActive ? 'Alarme ON' : 'Alarme OFF'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={selectedDateTime}
                        onChange={(e) => handleUpdateDayTime(selectedDateStr, e.target.value)}
                        className="bg-zinc-950 border border-zinc-700 text-amber-300 font-mono font-bold text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 flex-1"
                      />
                      <span className="text-[11px] text-zinc-400">
                        {isSelectedDayAlarmActive ? '🔔 Alarme tocará' : '🔕 Sem som'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Completed Sessions for this selected day */}
                {selectedDateSessions.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Treino Concluído neste dia:</span>
                    </div>

                    {selectedDateSessions.map((s, idx) => (
                      <div key={idx} className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30 space-y-1">
                        <div className="font-bold text-white text-xs sm:text-sm">{s.title}</div>
                        <div className="text-xs text-zinc-300 flex items-center gap-3">
                          {s.durationMinutes && <span>⏱ {s.durationMinutes} min</span>}
                          <span>🏋️ {s.exercises?.length || 0} exercícios</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-xs text-zinc-400">
                    Nenhum treino concluído registrado nesta data.
                  </div>
                )}

                {/* Schedule Status & Override for this day */}
                <div className="space-y-2.5 pt-1">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Treino Programado para esta data:
                  </label>

                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => handleUpdateCustomDay(selectedDateStr, 'superior-a')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        selectedDateScheduled.templateId === 'superior-a' && !selectedDateScheduled.isRest
                          ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <span>Treino Superior A (Costas, Peito, Ombros)</span>
                      {selectedDateScheduled.templateId === 'superior-a' && !selectedDateScheduled.isRest && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleUpdateCustomDay(selectedDateStr, 'inferiores-a')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        selectedDateScheduled.templateId === 'inferiores-a' && !selectedDateScheduled.isRest
                          ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <span>Treino Inferiores A (Posterior & Glúteos)</span>
                      {selectedDateScheduled.templateId === 'inferiores-a' && !selectedDateScheduled.isRest && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleUpdateCustomDay(selectedDateStr, 'superior-b')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        selectedDateScheduled.templateId === 'superior-b' && !selectedDateScheduled.isRest
                          ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <span>Treino Superior B (Peito Sup, Braços)</span>
                      {selectedDateScheduled.templateId === 'superior-b' && !selectedDateScheduled.isRest && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleUpdateCustomDay(selectedDateStr, 'inferiores-b')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        selectedDateScheduled.templateId === 'inferiores-b' && !selectedDateScheduled.isRest
                          ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <span>Treino Inferiores B (Quadríceps & Adutores)</span>
                      {selectedDateScheduled.templateId === 'inferiores-b' && !selectedDateScheduled.isRest && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleUpdateCustomDay(selectedDateStr, 'rest')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        selectedDateScheduled.isRest
                          ? 'bg-zinc-800 border-zinc-500 text-zinc-200'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      <span>Dia de Descanso / Off</span>
                      {selectedDateScheduled.isRest && (
                        <Coffee className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>

                  {selectedDateScheduled.isCustom && (
                    <button
                      onClick={() => handleUpdateCustomDay(selectedDateStr, 'default')}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restaurar plano semanal padrão</span>
                    </button>
                  )}
                </div>

                {/* Action button to execute this workout */}
                {!selectedDateScheduled.isRest && selectedDateScheduled.templateId && (
                  <div className="pt-2 border-t border-zinc-800">
                    <button
                      id="btn-start-day-workout"
                      onClick={() => {
                        onSelectAndStartWorkout(selectedDateScheduled.templateId);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-amber-500/20"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Iniciar Treino Programado</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ALARMS & TIME SETTINGS */}
          {activeTab === 'alarm' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Master Alarm Toggle Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <BellRing className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Alarme Sonoro & Lembrete de Treino
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Dispara alarme com som motivacional e vibração no horário do seu treino.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer self-end sm:self-center">
                  <input
                    type="checkbox"
                    checked={alarmSettings.enabled}
                    onChange={(e) => handleUpdateAlarmSettings({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500 shadow-inner"></div>
                </label>
              </div>

              {/* Time Configuration Card */}
              <div className="p-4 sm:p-5 bg-zinc-850 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      Horário Habitual de Treino
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Horário padrão em que o alarme tocará nos dias programados.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={alarmSettings.defaultTime}
                      onChange={(e) => handleUpdateAlarmSettings({ defaultTime: e.target.value })}
                      className="bg-zinc-950 border-2 border-amber-500/60 text-amber-300 font-mono font-black text-lg rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Quick Time Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-zinc-400">Sugestões de horários rápidos:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {QUICK_TIME_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handleUpdateAlarmSettings({ defaultTime: preset.label })}
                        className={`p-2 rounded-xl border text-xs font-bold text-left transition flex flex-col justify-between ${
                          alarmSettings.defaultTime === preset.label
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                        }`}
                      >
                        <span className="font-mono text-sm">{preset.label}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">{preset.note}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Days of Week Selection */}
              <div className="p-4 sm:p-5 bg-zinc-850 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-amber-400" />
                  Dias da Semana com Alarme Ativo
                </h4>
                <p className="text-xs text-zinc-400">
                  Selecione os dias em que o alarme deve despertar automaticamente.
                </p>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
                  {WEEKDAY_NAMES_SHORT.map((wd, dayIdx) => {
                    const isActive = alarmSettings.daysOfWeek?.includes(dayIdx);
                    const isRestInSchedule = scheduleState.weeklyPlan[dayIdx] === 'rest';

                    return (
                      <button
                        key={wd}
                        onClick={() => handleToggleAlarmDayOfWeek(dayIdx)}
                        className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-between gap-1 transition font-bold text-xs ${
                          isActive
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] sm:text-xs">{wd}</span>
                        {isActive ? (
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <span className="text-[9px] text-zinc-500 font-normal">
                            {isRestInSchedule ? 'Off' : 'Mudo'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Pattern Selector */}
              <div className="p-4 sm:p-5 bg-zinc-850 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  Tom do Alarme & Som
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'intense', title: '⚡ Alta Energia (Gym Horn)', desc: 'Sequência esportiva de alta motivação' },
                    { id: 'classic', title: '⏰ Relógio Digital', desc: 'Beep clássico de alarme eletrônico' },
                    { id: 'chime', title: '🔔 Chime Harmônico', desc: 'Sinos melódicos e agradáveis' },
                    { id: 'countdown', title: '⏱️ Pulso Progressivo', desc: 'Contagem rítmica crescente' },
                  ].map((sound) => (
                    <div
                      key={sound.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                        alarmSettings.soundPattern === sound.id
                          ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <button
                        onClick={() => handleUpdateAlarmSettings({ soundPattern: sound.id as any })}
                        className="text-left flex-1"
                      >
                        <div className="font-bold text-xs">{sound.title}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{sound.desc}</div>
                      </button>

                      <button
                        onClick={() => handlePlaySoundPreview(sound.id as any)}
                        className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                          playingPreview === sound.id
                            ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                        }`}
                        title={playingPreview === sound.id ? 'Clique para parar o som' : 'Ouvir Tom'}
                      >
                        {playingPreview === sound.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Parar</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Testar</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser / Device Notifications Card */}
              <div className="p-4 sm:p-5 bg-zinc-850 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Notificações no Dispositivo</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {notificationStatus === 'granted'
                        ? '✅ Permissão de notificações ativada!'
                        : 'Ative para receber alertas visuais mesmo com a aba em segundo plano.'}
                    </p>
                  </div>
                </div>

                {notificationStatus !== 'granted' && (
                  <button
                    onClick={handleRequestNotificationPermission}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition active:scale-95 shrink-0"
                  >
                    Permitir Notificações
                  </button>
                )}
              </div>

              {/* Test Full Alarm Button */}
              <div className="pt-2">
                <button
                  id="btn-test-full-alarm"
                  onClick={() => {
                    if (onTriggerTestAlarm) {
                      onTriggerTestAlarm();
                      onClose();
                    } else {
                      sounds.startAlarm(alarmSettings.soundPattern);
                      setTimeout(() => sounds.stopAlarm(), 3000);
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-amber-500/25"
                >
                  <BellRing className="w-4 h-4 animate-bounce" />
                  <span>DISPARAR TESTE DE ALARME AGORA (TELA & SOM)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: WEEKLY SCHEDULE SPLIT PLANNER */}
          {activeTab === 'weekly_plan' && (
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        scheduleState.scheduleMode === 'continuous'
                          ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
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
                      </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Defina quais treinos acontecem em cada dia da semana. O calendário mensal preencherá automaticamente.
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Predefinições Rápidas:</span>
                  <button
                    onClick={() => handleApplyPreset('start_lower_first')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 font-black transition flex items-center gap-1 shadow-sm active:scale-95"
                    title="Configura a divisão começando com Inferiores A e já define o treino de hoje como Inferiores A"
                  >
                    <span>🦵 Começar c/ Inferiores A</span>
                  </button>
                  <button
                    onClick={() => handleApplyPreset('ab_5days_upper')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 font-bold transition flex items-center gap-1"
                    title="Seg a Sex: Superior A, Inferiores A, Superior B, Inferiores B, Superior A (Sáb/Dom Off)"
                  >
                    <span>5x (Repete Sup A)</span>
                  </button>
                  <button
                    onClick={() => handleApplyPreset('ab_5days_lower')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 font-bold transition flex items-center gap-1"
                    title="Seg a Sex: Inferiores A, Superior A, Inferiores B, Superior B, Inferiores A (Sáb/Dom Off)"
                  >
                    <span>5x (Repete Inf A)</span>
                  </button>
                  <button
                    onClick={() => handleApplyPreset('ab_5days_midrest')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 border border-zinc-700 transition"
                    title="Seg, Ter, Qui, Sex, Sáb (Quarta e Domingo Off)"
                  >
                    <span>5x (Qua Off + Sáb)</span>
                  </button>
                  <button
                    onClick={() => handleApplyPreset('ab_4days')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 border border-zinc-700 transition"
                    title="Seg, Ter, Qui, Sex (Quarta, Sáb e Dom Off)"
                  >
                    <span>4x Semana</span>
                  </button>
                  <button
                    onClick={() => handleApplyPreset('ab_alt')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 border border-zinc-700 transition"
                    title="Seg, Qua, Sex (Ter, Qui, Sáb e Dom Off)"
                  >
                    <span>3x Semana</span>
                  </button>
                </div>
              </div>

              {/* Day by day weekly config list */}
              <div className="space-y-2.5">
                {WEEKDAY_NAMES_FULL.map((name, dayIndex) => {
                  const currentPlanTemplateId = scheduleState.weeklyPlan[dayIndex] || 'rest';
                  return (
                    <div
                      key={dayIndex}
                      className="p-3.5 bg-zinc-850 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-amber-400 shrink-0">
                          {WEEKDAY_NAMES_SHORT[dayIndex]}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-white">{name}</div>
                          <div className="text-xs text-zinc-400">
                            {currentPlanTemplateId === 'rest'
                              ? 'Descanso / Recuperação'
                              : getTemplateById(currentPlanTemplateId)?.title || currentPlanTemplateId}
                          </div>
                        </div>
                      </div>

                      <select
                        value={currentPlanTemplateId}
                        onChange={(e) => handleUpdateWeeklyPlanDay(dayIndex, e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
                      >
                        <option value="rest">☕ Dia de Descanso (Off)</option>
                        <option value="superior-a">💪 Treino Superior A (Costas, Peito, Ombros)</option>
                        <option value="inferiores-a">🦵 Treino Inferiores A (Posterior & Glúteos)</option>
                        <option value="superior-b">💪 Treino Superior B (Peito Sup, Dorsais, Braços)</option>
                        <option value="inferiores-b">🦵 Treino Inferiores B (Quadríceps & Adutores)</option>
                      </select>
                    </div>
                  );
                })}
              </div>
              </>
              )}
            </div>
          )}

          {/* TAB 4: STATS & CONSISTENCY */}
          {activeTab === 'stats' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-850 rounded-xl border border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Treinos em {MONTH_NAMES[viewMonth]}
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {completedThisMonth} treinos
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Sessões concluídas no mês selecionado
                  </div>
                </div>

                <div className="p-4 bg-zinc-850 rounded-xl border border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Total Histórico
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {history.length} sessões
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Desde o primeiro registro
                  </div>
                </div>

                <div className="p-4 bg-zinc-850 rounded-xl border border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Média Semanal
                  </div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">
                    {Math.min(4, Math.max(1, Math.round(completedThisMonth / 4)))}x / semana
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Frequência média de estímulo
                  </div>
                </div>
              </div>

              {/* Workout History List */}
              <div className="bg-zinc-850 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Últimas Sessões Gravadas no Calendário
                </h3>

                {history.length === 0 ? (
                  <div className="text-xs text-zinc-400 py-4 text-center">
                    Nenhum treino realizado ainda. Seus treinos aparecerão aqui à medida que você os concluir!
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800">
                    {history.slice(0, 10).map((session) => (
                      <div key={session.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-white text-sm">{session.title}</div>
                          <div className="text-zinc-400 flex items-center gap-2 mt-0.5">
                            <span>📅 {session.date}</span>
                            {session.durationMinutes && <span>⏱ {session.durationMinutes} min</span>}
                            <span>🏋️ {session.exercises?.length || 0} exercícios</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Concluído
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
