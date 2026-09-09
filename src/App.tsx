import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Dumbbell, 
  Plus, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  History, 
  Flame, 
  Layers, 
  Settings, 
  Info, 
  Scale, 
  Calculator,
  RotateCcw,
  Zap,
  TrendingUp,
  MessageCircle,
  FileText,
  HelpCircle,
  Coffee
} from 'lucide-react';
import { WorkoutSession, Exercise, WorkoutSet, WorkoutTemplate } from './types';
import { INITIAL_WORKOUT_TEMPLATES } from './data/workoutTemplates';
import { 
  loadTemplates, 
  saveTemplates,
  loadCurrentSession, 
  saveCurrentSession, 
  addSessionToHistory, 
  loadPreferences, 
  savePreferences, 
  UserPreferences,
  parseSessionTimestamp
} from './utils/storage';
import { sounds } from './utils/audio';
import { WorkoutHeader } from './components/WorkoutHeader';
import { ExerciseCard } from './components/ExerciseCard';
import { DailyDecision } from './components/DailyDecision';
import { WorkoutPostSummary } from './components/WorkoutPostSummary';
import { RestTimerModal } from './components/RestTimerModal';
import { PlateCalculatorModal } from './components/PlateCalculatorModal';
import { RirGuideModal } from './components/RirGuideModal';
import { ShareWhatsAppModal } from './components/ShareWhatsAppModal';
import { HistoryView } from './components/HistoryView';
import { OneRepMaxModal } from './components/OneRepMaxModal';
import { SettingsModal } from './components/SettingsModal';
import { AddExerciseModal } from './components/AddExerciseModal';
import { ExerciseGuideModal } from './components/ExerciseGuideModal';
import { ExerciseFocusModal } from './components/ExerciseFocusModal';
import { WorkoutCalendarModal } from './components/WorkoutCalendarModal';
import { WorkoutAlarmModal } from './components/WorkoutAlarmModal';
import {
  getLastCompletedWorkout,
  getNextRecommendedWorkout,
  getNextScheduledAlarm,
  loadSchedule,
  saveSchedule,
  getScheduledWorkoutForDate,
  getScheduledTimeForDate,
  DEFAULT_ALARM_SETTINGS
} from './utils/storage';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  syncUserProfile,
  syncCloudDataOnLogin,
  saveSessionToCloud,
  saveTemplatesToCloud,
  saveScheduleToCloud,
  isOnline,
  testFirestoreConnection,
  processPendingSyncQueue,
} from './lib/firestoreSync';
import {
  getPendingQueue,
  getPendingQueueCount,
  subscribeToSyncQueue,
  PendingSyncItem,
} from './utils/syncQueue';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { TodayWorkoutFloatingWidget } from './components/TodayWorkoutFloatingWidget';
import { PWAInstallModal } from './components/PWAInstallModal';
import { AuthModal } from './components/AuthModal';
import { ToolsModal } from './components/ToolsModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { CalendarCheck, Play, Video, BellRing, Bell, WifiOff, CloudOff, RefreshCw, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';

export default function App() {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'switch'>('login');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => loadTemplates());
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());
  
  // Offline & Sync Queue states
  const [isOnlineState, setIsOnlineState] = useState<boolean>(() => isOnline());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => getPendingQueueCount());
  const [pendingItems, setPendingItems] = useState<PendingSyncItem[]>(() => getPendingQueue());
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const [syncToastMessage, setSyncToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'warn' } | null>(null);

  // Current active workout session
  const [currentSession, setCurrentSession] = useState<WorkoutSession>(() => {
    const saved = loadCurrentSession();
    if (saved) return saved;

    // Create session from first template
    const initialTpl = INITIAL_WORKOUT_TEMPLATES[0];
    const today = new Date().toISOString().slice(0, 10);
    return {
      id: `session-${Date.now()}`,
      templateId: initialTpl.id,
      title: initialTpl.title,
      date: today,
      startTime: new Date().toISOString(),
      exercises: JSON.parse(JSON.stringify(initialTpl.exercises)),
      completed: false,
    };
  });

  // Modals state
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(preferences.defaultRestSeconds);
  const [showPlateCalc, setShowPlateCalc] = useState<boolean>(false);
  const [plateCalcTarget, setPlateCalcTarget] = useState<{ name: string; kg: number }>({ name: '', kg: 50 });
  const [showRirGuide, setShowRirGuide] = useState<boolean>(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showToolsModal, setShowToolsModal] = useState<boolean>(false);
  const [historyModalTab, setHistoryModalTab] = useState<'charts' | 'list'>('charts');
  const [show1RmModal, setShow1RmModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showPWAInstallModal, setShowPWAInstallModal] = useState<boolean>(false);
  const { isInstallable, isInstalled, install: installApp } = usePWAInstall();
  const [showAddExerciseModal, setShowAddExerciseModal] = useState<boolean>(false);
  const [showExerciseGuideModal, setShowExerciseGuideModal] = useState<boolean>(false);
  const [guideModalInitialTab, setGuideModalInitialTab] = useState<'execucao' | 'video' | 'setup' | 'dicas' | 'erros'>('execucao');
  const [selectedExerciseForGuide, setSelectedExerciseForGuide] = useState<string | undefined>(undefined);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [calendarInitialTab, setCalendarInitialTab] = useState<'calendar' | 'weekly_plan' | 'alarm' | 'stats'>('calendar');
  const [workoutFinishedCelebration, setWorkoutFinishedCelebration] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [focusExerciseIndex, setFocusExerciseIndex] = useState<number | null>(null);

  // Alarm state & background monitor
  const [showAlarmModal, setShowAlarmModal] = useState<boolean>(false);
  const [alarmModalData, setAlarmModalData] = useState<{
    templateId: string;
    title: string;
    scheduledTime: string;
    soundPattern: 'intense' | 'classic' | 'chime' | 'countdown';
  }>({
    templateId: 'superior-a',
    title: 'Treino Superior A',
    scheduledTime: '18:00',
    soundPattern: 'intense',
  });
  const [lastTriggeredSlot, setLastTriggeredSlot] = useState<string>('');
  const [snoozedTimeSlot, setSnoozedTimeSlot] = useState<string | null>(null);
  const [nextAlarmInfo, setNextAlarmInfo] = useState<{
    dateStr: string;
    timeStr: string;
    formattedDisplay: string;
    templateId: string;
    title: string;
    isToday: boolean;
  } | null>(() => getNextScheduledAlarm());

  // Listen to Network Connection changes & Sync Queue
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnlineState(true);
      setSyncToastMessage({ text: 'Conexão restabelecida! Verificando nuvem...', type: 'info' });
      
      if (authUser) {
        setIsSyncing(true);
        try {
          const res = await processPendingSyncQueue(authUser.uid);
          if (res.syncedCount > 0) {
            setSyncToastMessage({
              text: `✅ ${res.syncedCount} registro(s) sincronizado(s) com o Firebase!`,
              type: 'success',
            });
          }
        } catch (err) {
          console.error('Auto sync queue error:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    const handleOffline = () => {
      setIsOnlineState(false);
      setSyncToastMessage({
        text: '⚠️ Modo Offline ativado: seus treinos continuam sendo salvos localmente com 100% de segurança.',
        type: 'warn',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribeQueue = subscribeToSyncQueue((count, items) => {
      setPendingSyncCount(count);
      setPendingItems(items);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeQueue();
    };
  }, [authUser]);

  // Auto-dismiss temporary toast messages
  useEffect(() => {
    if (!syncToastMessage) return;
    const timer = setTimeout(() => {
      setSyncToastMessage(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [syncToastMessage]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          await syncUserProfile(user);
          const synced = await syncCloudDataOnLogin(user.uid, (updated) => {
            if (updated.templates) setTemplates(updated.templates);
          });
          if (synced.templates) setTemplates(synced.templates);
          
          // Refresh active session for new user
          const savedSession = loadCurrentSession();
          if (savedSession) {
            setCurrentSession(savedSession);
          } else if (synced.templates && synced.templates.length > 0) {
            const firstTpl = synced.templates[0];
            const today = new Date().toISOString().slice(0, 10);
            setCurrentSession({
              id: `session-${Date.now()}`,
              templateId: firstTpl.id,
              title: firstTpl.title,
              date: today,
              startTime: new Date().toISOString(),
              exercises: JSON.parse(JSON.stringify(firstTpl.exercises)),
              completed: false,
            });
          }
        } catch (err) {
          console.error('Error during cloud login sync:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Manual Sync trigger
  const handleManualSync = async () => {
    if (!authUser) return;
    setIsSyncing(true);
    try {
      const synced = await syncCloudDataOnLogin(authUser.uid);
      if (synced.templates) setTemplates(synced.templates);
      const queueRes = await processPendingSyncQueue(authUser.uid);
      if (queueRes.syncedCount > 0) {
        setSyncToastMessage({
          text: `✅ ${queueRes.syncedCount} item(ns) sincronizado(s) com sucesso!`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Manual sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Background Alarm Checker (evaluates every 5 seconds)
  useEffect(() => {
    const checkAlarm = () => {
      const schedule = loadSchedule();
      const alarm = schedule.alarm || DEFAULT_ALARM_SETTINGS;
      const next = getNextScheduledAlarm(schedule);
      setNextAlarmInfo(next);

      if (!alarm.enabled) return;

      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const todayDateStr = `${y}-${m}-${d}`;
      const dayOfWeek = now.getDay();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hours}:${minutes}`;

      const currentSlotKey = `${todayDateStr}-${currentHHMM}`;
      if (lastTriggeredSlot === currentSlotKey) {
        return; // Already triggered in this minute
      }

      const scheduled = getScheduledWorkoutForDate(todayDateStr, schedule);
      if (scheduled.isRest || !scheduled.templateId) return;

      // Check if alarm is active for today
      const isDayActive = alarm.daysOfWeek?.includes(dayOfWeek) || !!schedule.customDays[todayDateStr]?.alarmEnabled;
      if (!isDayActive) return;

      const scheduledTime = getScheduledTimeForDate(todayDateStr, schedule);
      const isSnoozedDue = snoozedTimeSlot === currentHHMM;
      const isTimeDue = currentHHMM === scheduledTime;

      if (isTimeDue || isSnoozedDue) {
        setLastTriggeredSlot(currentSlotKey);
        setSnoozedTimeSlot(null);

        const tpl = templates.find((t) => t.id === scheduled.templateId) || templates[0];
        setAlarmModalData({
          templateId: scheduled.templateId,
          title: tpl ? tpl.title : scheduled.templateId,
          scheduledTime,
          soundPattern: alarm.soundPattern || 'intense',
        });
        setShowAlarmModal(true);

        // Also trigger browser Notification if supported & permitted
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('⏰ HORA DO TREINO! 🔥', {
              body: `Está na hora do seu ${tpl ? tpl.title : 'Treino de hoje'}. Mantenha a disciplina!`,
              icon: '/favicon.png',
            });
          } catch {
            // ignore notification failure
          }
        }
      }
    };

    checkAlarm();
    const interval = setInterval(checkAlarm, 5000);
    return () => clearInterval(interval);
  }, [lastTriggeredSlot, snoozedTimeSlot, templates]);

  const handleOpenCalendarWithTab = (tab: 'calendar' | 'weekly_plan' | 'alarm' | 'stats' = 'calendar') => {
    setCalendarInitialTab(tab);
    setShowCalendarModal(true);
  };

  const handleTriggerManualAlarmTest = () => {
    const today = new Date().toISOString().slice(0, 10);
    const scheduled = getScheduledWorkoutForDate(today);
    const tpl = templates.find((t) => t.id === (scheduled.templateId || 'superior-a')) || templates[0];
    const schedTime = getScheduledTimeForDate(today);
    const schedule = loadSchedule();

    setAlarmModalData({
      templateId: tpl.id,
      title: tpl.title,
      scheduledTime: schedTime,
      soundPattern: schedule.alarm?.soundPattern || 'intense',
    });
    setShowAlarmModal(true);
  };

  const handleAlarmSnooze = (minutes = 5) => {
    const now = new Date(Date.now() + minutes * 60 * 1000);
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setSnoozedTimeSlot(`${h}:${m}`);
  };

  const handleStartWorkoutFromAlarm = (templateId: string) => {
    handleSelectTemplate(templateId);
    setShowAlarmModal(false);
  };

  // Status for banner
  const lastWorkout = getLastCompletedWorkout();
  const nextWorkout = getNextRecommendedWorkout();

  const handleOpenExerciseGuide = (exerciseName?: string, tab: 'execucao' | 'video' | 'setup' | 'dicas' | 'erros' = 'execucao') => {
    setSelectedExerciseForGuide(exerciseName);
    setGuideModalInitialTab(tab);
    setShowExerciseGuideModal(true);
  };

  const handleOpenHistoryWithTab = (tab: 'charts' | 'list' = 'charts') => {
    setHistoryModalTab(tab);
    setShowHistoryModal(true);
  };

  // Auto-save current session to local storage
  useEffect(() => {
    saveCurrentSession(currentSession);
  }, [currentSession]);

  // Handle switching templates
  const handleSelectTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId) || templates[0];
    if (tpl) {
      const today = currentSession.date || new Date().toISOString().slice(0, 10);
      const newSession: WorkoutSession = {
        id: `session-${Date.now()}`,
        templateId: tpl.id,
        title: tpl.title,
        date: today,
        startTime: new Date().toISOString(),
        exercises: JSON.parse(JSON.stringify(tpl.exercises)),
        completed: false,
      };
      setCurrentSession(newSession);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDateChange = (newDate: string) => {
    setCurrentSession((prev) => ({ ...prev, date: newDate }));
  };

  const handleTimeChange = (newTime: string) => {
    setCurrentSession((prev) => {
      // newTime is "HH:mm". Update the startTime but preserve the Date if possible, or just set as HH:mm
      // Let's create a new Date string by taking the current date + new time
      const parts = newTime.split(':');
      if (parts.length === 2) {
        let d = new Date(prev.startTime);
        if (isNaN(d.getTime())) d = new Date();
        d.setHours(parseInt(parts[0], 10));
        d.setMinutes(parseInt(parts[1], 10));
        return { ...prev, startTime: d.toISOString() };
      }
      return { ...prev, startTime: newTime };
    });
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setCurrentSession((prev) => {
      const newExercises = prev.exercises.map((e) => (e.id === updatedExercise.id ? updatedExercise : e));
      return { ...prev, exercises: newExercises };
    });
  };

  const handleNotesChange = (notes: string) => {
    setCurrentSession((prev) => ({
      ...prev,
      notes,
    }));
  };

  const handleAppendQuickNote = (tag: string) => {
    setCurrentSession((prev) => {
      const existing = prev.notes?.trim() || '';
      if (!existing) {
        return { ...prev, notes: tag };
      }
      if (existing.includes(tag)) {
        return prev;
      }
      return { ...prev, notes: `${existing} • ${tag}` };
    });
  };

  const handleSetCompletedToggle = (set: WorkoutSet, completed: boolean) => {
    if (completed) {
      if (preferences.soundEnabled) {
        sounds.playSetCheck();
      }
      if (preferences.autoStartTimerOnCheck) {
        // Top sets / failure sets usually get 120s rest, feeder 60-90s
        const suggestedRest = set.rir === 0 ? 120 : set.rir === 2 ? 90 : preferences.defaultRestSeconds;
        setTimerSeconds(suggestedRest);
        setShowRestTimer(true);
      }
    }
  };

  const handleAddCustomExercise = (exercise: Exercise) => {
    setCurrentSession((prev) => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  };

  const handleResetWorkout = () => {
    setShowResetConfirmModal(true);
  };

  const executeResetWorkout = () => {
    setCurrentSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => ({ ...s, completed: false })),
      })),
    }));
    setShowResetConfirmModal(false);
  };

  const handleLogRestDay = () => {
    const today = new Date().toISOString().slice(0, 10);
    const endTime = new Date().toISOString();
    const restSession: WorkoutSession = {
      id: `session-rest-${Date.now()}`,
      templateId: 'rest',
      title: 'DIA DE DESCANSO',
      date: today,
      startTime: endTime,
      endTime: endTime,
      exercises: [],
      completed: true,
      durationMinutes: 0,
      notes: 'Recuperação muscular',
    };
    
    addSessionToHistory(restSession);
    
    // Save to Firestore if authenticated
    if (authUser) {
      saveSessionToCloud(authUser.uid, restSession);
    }
    
    setWorkoutFinishedCelebration(true);
  };

  const handleFinishWorkout = () => {
    const isEditingPast = currentSession.completed === true;
    const endTime = isEditingPast && currentSession.endTime ? currentSession.endTime : new Date().toISOString();
    const startTime = parseSessionTimestamp(currentSession.date, currentSession.startTime);
    const calculatedDuration = startTime > 0 ? Math.max(1, Math.round((Date.now() - startTime) / 60000)) : 45;
    const durationMins = isEditingPast && currentSession.durationMinutes ? currentSession.durationMinutes : calculatedDuration;

    const completedSession: WorkoutSession = {
      ...currentSession,
      completed: true,
      endTime,
      durationMinutes: durationMins,
    };

    addSessionToHistory(completedSession);
    setCurrentSession(completedSession);
    setWorkoutFinishedCelebration(true);

    // Save to Firestore if authenticated
    if (authUser) {
      saveSessionToCloud(authUser.uid, completedSession);
    }

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (preferences.soundEnabled) {
        sounds.playTimerDone();
      }
    } catch {
      // ignore
    }
  };

  const handleResetFactoryData = () => {
    setTemplates(INITIAL_WORKOUT_TEMPLATES);
    saveTemplates(INITIAL_WORKOUT_TEMPLATES);
    const initialTpl = INITIAL_WORKOUT_TEMPLATES[0];
    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      templateId: initialTpl.id,
      title: initialTpl.title,
      date: new Date().toISOString().slice(0, 10),
      startTime: new Date().toISOString(),
      exercises: JSON.parse(JSON.stringify(initialTpl.exercises)),
      completed: false,
    };
    setCurrentSession(newSession);
  };

  // Metrics
  const totalSets = currentSession.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  const completedSets = currentSession.exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.completed).length,
    0
  );
  const totalTonnage = currentSession.exercises.reduce((acc, e) => {
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans pb-[160px]">
      {/* Primary Sticky Header */}
      <WorkoutHeader
        session={currentSession}
        onSelectTemplate={handleSelectTemplate}
        templates={templates.map((t) => ({ id: t.id, title: t.title, tag: t.tag }))}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        onFinishWorkout={handleFinishWorkout}
        onResetWorkout={handleResetWorkout}
        onOpenHistory={() => handleOpenHistoryWithTab('list')}
        onOpenProgressionChart={() => handleOpenHistoryWithTab('charts')}
        onOpenWhatsApp={() => setShowWhatsAppModal(true)}
        onOpenRirGuide={() => setShowRirGuide(true)}
        onOpenExerciseGuide={() => handleOpenExerciseGuide()}
        onOpenCalendar={() => handleOpenCalendarWithTab('calendar')}
        onOpenAlarm={() => handleOpenCalendarWithTab('alarm')}
        onOpenPWAInstall={() => setShowPWAInstallModal(true)}
        isPWAInstallable={isInstallable}
        nextAlarmDisplay={nextAlarmInfo?.formattedDisplay || null}
        authUser={authUser}
        isSyncing={isSyncing}
        onSyncManual={handleManualSync}
        isOnline={isOnlineState}
        pendingSyncCount={pendingSyncCount}
        onOpenOfflineModal={() => setShowOfflineModal(true)}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setShowAuthModal(true);
        }}
        totalSets={totalSets}
        completedSets={completedSets}
        totalTonnage={totalTonnage}
      />

      {/* Floating Status Notification Toast */}
      {syncToastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`p-3 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold ${
            syncToastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : syncToastMessage.type === 'warn'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
          }`}>
            <span>{syncToastMessage.text}</span>
            <button
              onClick={() => setSyncToastMessage(null)}
              className="text-zinc-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {workoutFinishedCelebration ? (
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
      <main className="max-w-5xl mx-auto w-full px-2.5 sm:px-4 pt-3 sm:pt-6 pb-24 sm:pb-28 flex-1 space-y-3 sm:space-y-4">
        {/* Today's Scheduled Workout & Quick Start Card (Inline) */}
        <TodayWorkoutFloatingWidget
          currentSession={currentSession}
          templates={templates}
          onQuickStart={handleSelectTemplate}
          onOpenCalendar={handleOpenCalendarWithTab}
          completedSets={completedSets}
          totalSets={totalSets}
          soundEnabled={preferences.soundEnabled}
        />

        {/* Offline Mode Active Alert Banner */}
        {!isOnlineState && (
          <div
            id="offline-alert-banner"
            className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-zinc-900 border border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <WifiOff className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>Modo Offline Ativo</span>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 uppercase font-black text-amber-200">
                    Local Seguro
                  </span>
                </h4>
                <p className="text-[11px] sm:text-xs text-zinc-300">
                  Sem conexão com o Firebase. Você pode continuar registrando séries e treinos normalmente.
                  {pendingSyncCount > 0 ? (
                    <span className="text-amber-400 font-bold ml-1">
                      ({pendingSyncCount} registro(s) com alerta de pendente de sincronização).
                    </span>
                  ) : (
                    ' Tudo protegido na memória local.'
                  )}
                </p>
              </div>
            </div>

            <button
              id="btn-open-offline-details-banner"
              onClick={() => setShowOfflineModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition active:scale-95 shadow-md shadow-amber-500/20 self-end sm:self-center shrink-0"
            >
              Ver Detalhes
            </button>
          </div>
        )}

        {/* Online with Pending Sync Alert Banner */}
        {isOnlineState && pendingSyncCount > 0 && (
          <div
            id="pending-sync-alert-banner"
            className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <CloudOff className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>Pendente de Sincronização</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                    {pendingSyncCount} {pendingSyncCount === 1 ? 'item' : 'itens'}
                  </span>
                </h4>
                <p className="text-[11px] sm:text-xs text-zinc-300">
                  Existem treinos ou alterações salvos localmente aguardando envio para o Firebase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                id="btn-sync-pending-banner"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
              </button>
              <button
                onClick={() => setShowOfflineModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold transition active:scale-95"
              >
                Detalhes
              </button>
            </div>
          </div>
        )}

        {/* Workout Complete Celebration Banner */}
        {workoutFinishedCelebration && (
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-zinc-900 border border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm sm:text-base">Treino Concluído com Sucesso! 🔥</h3>
                <p className="text-[11px] sm:text-xs text-zinc-300">
                  {completedSets} séries • Volume de {totalTonnage.toLocaleString('pt-BR')} kg levantados.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Exportar WhatsApp</span>
              </button>
              <button
                onClick={() => setWorkoutFinishedCelebration(false)}
                className="px-2.5 py-1.5 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-400 text-xs font-semibold transition"
              >
                Dispensar
              </button>
            </div>
          </div>
        )}

        {/* Schedule & Sequence Tracker Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border border-zinc-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-zinc-400 text-xs">Último:</span>
                <span className="font-bold text-zinc-200 truncate text-xs">
                  {lastWorkout ? lastWorkout.session.title : 'Nenhum'}
                </span>
                {lastWorkout && (
                  <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {lastWorkout.daysAgo === 0 ? 'Hoje' : lastWorkout.daysAgo === 1 ? 'Ontem' : `Há ${lastWorkout.daysAgo}d`}
                  </span>
                )}
                <span className="text-zinc-600 hidden sm:inline">•</span>
                <span className="font-semibold text-amber-400 text-xs">Próximo:</span>
                <span className="font-black text-amber-300 text-xs">
                  {templates.find((t) => t.id === nextWorkout.templateId)?.title || 'Superior A'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                {nextWorkout.reason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto justify-end flex-wrap">
            {currentSession.templateId !== nextWorkout.templateId && (
              <button
                id="btn-switch-to-next"
                onClick={() => handleSelectTemplate(nextWorkout.templateId)}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Carregar Próximo</span>
              </button>
            )}

            <button
              id="btn-log-rest-day"
              onClick={handleLogRestDay}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Registrar um dia de descanso no histórico"
            >
              <Coffee className="w-4 h-4 text-zinc-400" />
              <span>Descanso</span>
            </button>

            <button
              id="btn-open-alarm-banner"
              onClick={() => handleOpenCalendarWithTab('alarm')}
              className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Ajustar horário e alarme de treino"
            >
              <BellRing className="w-4 h-4" />
              <span>{nextAlarmInfo ? nextAlarmInfo.timeStr : 'Alarme'}</span>
            </button>

            <button
              id="btn-open-calendar-banner"
              onClick={() => handleOpenCalendarWithTab('calendar')}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Calendário</span>
            </button>
          </div>
        </div>

        {/* Quick Tools & Info Banner with Generous Spacing & Automatic Wrapping */}
        <div className="p-3 sm:p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl sm:rounded-2xl flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-1">
            <button
              id="btn-open-exercise-guide-banner"
              onClick={() => handleOpenExerciseGuide(undefined, 'execucao')}
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-2 transition font-bold shadow-sm text-xs active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Guia de Exercícios</span>
            </button>

            <button
              id="btn-open-video-guide-banner"
              onClick={() => handleOpenExerciseGuide(undefined, 'video')}
              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center gap-2 transition font-bold shadow-sm text-xs active:scale-95"
            >
              <Video className="w-4 h-4 text-rose-400" />
              <span>Vídeos</span>
            </button>

            <button
              id="btn-open-tonnage-chart-banner"
              onClick={() => handleOpenHistoryWithTab('charts')}
              className="px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 flex items-center gap-2 transition font-bold shadow-sm text-xs active:scale-95"
            >
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Evolução</span>
            </button>

            <button
              id="btn-open-rir-banner"
              onClick={() => setShowRirGuide(true)}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-2 transition font-semibold text-xs active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>Sensação RIR</span>
            </button>

            <button
              id="btn-open-1rm"
              onClick={() => setShow1RmModal(true)}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-2 transition font-semibold text-xs active:scale-95"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>1RM Máximo</span>
            </button>

            <button
              id="btn-open-rest-timer"
              onClick={() => setShowRestTimer(true)}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-2 transition font-semibold text-xs active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Timer Descanso</span>
            </button>
          </div>

          <button
            id="btn-open-settings"
            onClick={() => setShowSettingsModal(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1.5 text-xs font-semibold shrink-0 active:scale-95"
            title="Configurações do Aplicativo"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configurações</span>
          </button>
        </div>

        {/* Decisão do Dia - Ocultado a pedido do usuário */}
        <div className="hidden">
          <DailyDecision exercises={currentSession.exercises} />
        </div>

        {/* List of Exercises */}
        <div className="space-y-3 sm:space-y-4">
          {currentSession.exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-zinc-900/40 rounded-3xl border border-zinc-800 border-dashed text-center">
              <span className="text-4xl mb-4">☕</span>
              <h3 className="text-xl font-bold text-white mb-2">Dia de Descanso</h3>
              <p className="text-sm text-zinc-400 max-w-sm">
                Nenhum exercício programado. Clique em "Concluir Treino" no topo para registrar o descanso no seu histórico.
              </p>
            </div>
          ) : (
            currentSession.exercises.map((exercise, idx) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                exerciseIndex={idx}
                onUpdateExercise={handleUpdateExercise}
                onOpenPlateCalc={(name, defaultKg) => {
                  setPlateCalcTarget({ name, kg: defaultKg });
                  setShowPlateCalc(true);
                }}
                onSetCompletedToggle={handleSetCompletedToggle}
                onOpenRirInfo={() => setShowRirGuide(true)}
                onOpenExerciseGuide={(name, tab) => handleOpenExerciseGuide(name, tab || 'execucao')}
                onOpenVideo={(name) => handleOpenExerciseGuide(name, 'video')}
                onOpenFocusMode={(focusIdx) => setFocusExerciseIndex(focusIdx)}
              />
            ))
          )}
        </div>

        {/* Add Exercise CTA button */}
        <div className="pt-1 sm:pt-2">
          <button
            id="btn-add-exercise"
            onClick={() => setShowAddExerciseModal(true)}
            className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-dashed border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-zinc-400 hover:text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Exercício a este Treino</span>
          </button>
        </div>

        {/* Workout Session Free-Text Notes / Observations Card */}
        <div
          id="workout-session-notes-card"
          className="rounded-xl sm:rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 p-3 sm:p-5 shadow-xl space-y-2.5 sm:space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                  Observações do Treino
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                    Auto-save
                  </span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400">
                  Registre percepções corporais, fadiga ou lembretes.
                </p>
              </div>
            </div>

            {currentSession.notes && currentSession.notes.trim().length > 0 && (
              <button
                id="btn-clear-session-notes"
                onClick={() => handleNotesChange('')}
                className="text-[10px] sm:text-[11px] text-zinc-500 hover:text-rose-400 transition"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Quick Tag Chips with automatic wrapping and generous spacing */}
          <div className="flex flex-wrap items-center gap-2 py-1">
            {[
              '⚡ Fadiga elevada',
              '📈 Aumentar carga',
              '🎯 Boa execução',
              '🔥 Bom pump',
              '⚠️ Atenção articulação',
              '⏱️ Treino rápido',
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAppendQuickNote(tag)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/90 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 border border-zinc-700/60 transition active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              id="input-session-notes"
              value={currentSession.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Ex.: Fadiga elevada no final; aumentar carga (+2kg) na próxima; aquecimento no ombro foi ótimo..."
              rows={2}
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/60 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 pt-0.5">
            <span>
              {currentSession.notes?.length || 0} caracteres
            </span>
            <span className="text-zinc-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Salvo em localStorage</span>
            </span>
          </div>
        </div>

        <div className="mt-8 mb-4 text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600">Powered by Netlify</span>
        </div>
      </main>

            {/* Floating Concluir Button (Placed above bottom nav) */}
      <div className="fixed bottom-[72px] sm:bottom-[80px] inset-x-0 px-4 z-20 pointer-events-none flex justify-center">
        <button
          id="btn-nav-finish"
          onClick={handleFinishWorkout}
          className={`pointer-events-auto w-full max-w-[360px] px-6 py-3.5 sm:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-2xl ${
            currentSession.exercises.length === 0
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-zinc-950 shadow-emerald-500/20'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-amber-500/20'
          }`}
        >
          {currentSession.exercises.length === 0 ? <Coffee className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{currentSession.exercises.length === 0 ? 'Concluir Descanso' : `Concluir Treino (${completedSets}/${totalSets})`}</span>
        </button>
      </div>

      {/* New Minimalist Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-black border-t border-zinc-900 px-4 py-2 sm:py-3 z-[100] safe-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => {
              setShowHistoryModal(false);
              setShowToolsModal(false);
              setShowSettingsModal(false);
            }}
            className={`p-3 flex flex-col items-center justify-center transition ${(!showHistoryModal && !showToolsModal && !showSettingsModal) ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Dumbbell className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => {
              setShowHistoryModal(true);
              setShowToolsModal(false);
              setShowSettingsModal(false);
            }}
            className={`p-3 flex flex-col items-center justify-center transition ${showHistoryModal ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <CalendarCheck className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => {
              setShowToolsModal(true);
              setShowHistoryModal(false);
              setShowSettingsModal(false);
            }}
            className={`p-3 flex flex-col items-center justify-center transition ${showToolsModal ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Layers className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => {
              setShowSettingsModal(true);
              setShowHistoryModal(false);
              setShowToolsModal(false);
            }}
            className={`p-3 flex flex-col items-center justify-center transition ${showSettingsModal ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Settings className="w-[26px] h-[26px] stroke-[1.5]" />
          </button>
        </div>
      </nav>
      </>
      )}

      {/* Modals */}
      <ToolsModal
        isOpen={showToolsModal}
        onClose={() => setShowToolsModal(false)}
        onOpenAlarm={() => handleOpenCalendarWithTab('alarm')}
        onOpenTimer={() => setShowRestTimer(true)}
        onOpenPlates={() => {
          setPlateCalcTarget({ name: 'Barra Olímpica', kg: 50 });
          setShowPlateCalc(true);
        }}
      />
      <RestTimerModal
        initialSeconds={timerSeconds}
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        soundEnabled={preferences.soundEnabled}
      />

      <PlateCalculatorModal
        isOpen={showPlateCalc}
        onClose={() => setShowPlateCalc(false)}
        exerciseName={plateCalcTarget.name}
        initialTotalKg={plateCalcTarget.kg}
      />

      <RirGuideModal
        isOpen={showRirGuide}
        onClose={() => setShowRirGuide(false)}
      />

      <ShareWhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        session={currentSession}
      />

      <HistoryView
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        initialTab={historyModalTab}
        userId={authUser?.uid}
        onLoadSession={(sess) => {
          setCurrentSession(sess);
          setShowHistoryModal(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <OneRepMaxModal
        isOpen={show1RmModal}
        onClose={() => setShow1RmModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        preferences={preferences}
        onSavePreferences={(prefs) => {
          setPreferences(prefs);
          savePreferences(prefs);
        }}
        onResetFactoryData={handleResetFactoryData}
        authUser={authUser}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        onOpenPWAInstall={() => setShowPWAInstallModal(true)}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setShowAuthModal(true);
        }}
        onBackupRestored={(restoredData) => {
          if (restoredData.templates) setTemplates(restoredData.templates);
          if (restoredData.preferences) setPreferences(restoredData.preferences);
          if (restoredData.currentSession) setCurrentSession(restoredData.currentSession);
          setSyncToastMessage({
            text: '📦 Backup JSON restaurado com sucesso!',
            type: 'success',
          });
        }}
      />

      <AddExerciseModal
        isOpen={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        onAdd={handleAddCustomExercise}
      />

      <ExerciseGuideModal
        isOpen={showExerciseGuideModal}
        onClose={() => setShowExerciseGuideModal(false)}
        initialExerciseName={selectedExerciseForGuide}
        initialTab={guideModalInitialTab}
      />

      {focusExerciseIndex !== null && currentSession.exercises[focusExerciseIndex] && (
        <ExerciseFocusModal
          isOpen={focusExerciseIndex !== null}
          onClose={() => setFocusExerciseIndex(null)}
          exercise={currentSession.exercises[focusExerciseIndex]}
          exerciseIndex={focusExerciseIndex}
          totalExercises={currentSession.exercises.length}
          onUpdateExercise={handleUpdateExercise}
          onNextExercise={() => {
            if (focusExerciseIndex < currentSession.exercises.length - 1) {
              setFocusExerciseIndex(focusExerciseIndex + 1);
            }
          }}
          onPrevExercise={() => {
            if (focusExerciseIndex > 0) {
              setFocusExerciseIndex(focusExerciseIndex - 1);
            }
          }}
          onOpenPlateCalc={(name, defaultKg) => {
            setPlateCalcTarget({ name, kg: defaultKg });
            setShowPlateCalc(true);
          }}
          onOpenExerciseGuide={(name, tab) => handleOpenExerciseGuide(name, tab || 'execucao')}
          onOpenVideo={(name) => handleOpenExerciseGuide(name, 'video')}
          onSetCompletedToggle={handleSetCompletedToggle}
          soundEnabled={preferences.soundEnabled}
        />
      )}

      <WorkoutCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        templates={templates}
        onSelectAndStartWorkout={handleSelectTemplate}
        onEditSession={(sess) => {
          setCurrentSession(sess);
          setShowCalendarModal(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentActiveSession={currentSession}
        initialTab={calendarInitialTab}
        onTriggerTestAlarm={handleTriggerManualAlarmTest}
      />

      <WorkoutAlarmModal
        isOpen={showAlarmModal}
        onClose={() => setShowAlarmModal(false)}
        onStartWorkout={handleStartWorkoutFromAlarm}
        onSnooze={handleAlarmSnooze}
        workoutTitle={alarmModalData.title}
        templateId={alarmModalData.templateId}
        scheduledTime={alarmModalData.scheduledTime}
        soundPattern={alarmModalData.soundPattern}
      />

      <OfflineSyncModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        isOnline={isOnlineState}
        pendingItems={pendingItems}
        isSyncing={isSyncing}
        onSyncManual={handleManualSync}
        authUser={authUser}
      />

      <PWAInstallModal
        isOpen={showPWAInstallModal}
        onClose={() => setShowPWAInstallModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
        onAuthSuccess={(email) => {
          setSyncToastMessage({
            text: `Conectado com sucesso: ${email}!`,
            type: 'success',
          });
        }}
      />

      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reiniciar Treino Atual?</h3>
                <p className="text-xs text-zinc-400">Desmarcar séries concluídas</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Deseja desmarcar todas as séries concluídas deste treino atual? Os pesos e metas serão mantidos.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={executeResetWorkout}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition shadow-lg shadow-amber-500/20"
              >
                Sim, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
