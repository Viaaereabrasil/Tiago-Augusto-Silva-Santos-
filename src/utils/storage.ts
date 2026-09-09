import { WorkoutSession, WorkoutTemplate, WorkoutScheduleState, DaySchedule } from '../types';
import { INITIAL_WORKOUT_TEMPLATES } from '../data/workoutTemplates';

const CURRENT_SESSION_KEY = 'academia_current_session_v1';
const HISTORY_KEY = 'academia_workout_history_v1';
const TEMPLATES_KEY = 'academia_workout_templates_v1';
const PREFERENCES_KEY = 'academia_user_prefs_v1';
const SCHEDULE_KEY = 'academia_workout_schedule_v1';

export interface UserPreferences {
  defaultRestSeconds: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStartTimerOnCheck: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultRestSeconds: 90,
  soundEnabled: true,
  vibrationEnabled: true,
  autoStartTimerOnCheck: true,
};

export const DEFAULT_ALARM_SETTINGS = {
  enabled: true,
  defaultTime: '18:00',
  daysOfWeek: [1, 2, 3, 4, 5], // Seg a Sex (Plano de 5 dias)
  customDayTimes: {},
  soundPattern: 'intense' as const,
  vibrate: true,
  reminderMinutesBefore: 0,
  snoozeMinutes: 5,
};

export const DEFAULT_WEEKLY_PLAN: Record<number, string> = {
  0: 'rest',         // Domingo - Descanso
  1: 'inferiores-a', // Segunda - Inferiores A (Posterior & Glúteos)
  2: 'superior-a',   // Terça - Superior A (Costas, Peito, Ombros & Tríceps)
  3: 'inferiores-b', // Quarta - Inferiores B (Quadríceps, Adutores & Panturrilha)
  4: 'superior-b',   // Quinta - Superior B (Peito Superior, Dorsais, Deltoides & Braços)
  5: 'inferiores-a', // Sexta - Inferiores A (Foco membros inferiores 3x)
  6: 'rest',         // Sábado - Descanso
};

export const LOWER_FIRST_WEEKLY_PLAN: Record<number, string> = {
  0: 'rest',         // Domingo
  1: 'inferiores-a', // Segunda - Inferiores A
  2: 'superior-a',   // Terça - Superior A
  3: 'inferiores-b', // Quarta - Inferiores B
  4: 'superior-b',   // Quinta - Superior B
  5: 'inferiores-a', // Sexta - Inferiores A
  6: 'rest',         // Sábado
};

export const UPPER_FIRST_WEEKLY_PLAN: Record<number, string> = {
  0: 'rest',         // Domingo
  1: 'superior-a',   // Segunda - Superior A
  2: 'inferiores-a', // Terça - Inferiores A
  3: 'superior-b',   // Quarta - Superior B
  4: 'inferiores-b', // Quinta - Inferiores B
  5: 'superior-a',   // Sexta - Superior A
  6: 'rest',         // Sábado
};

export function loadSchedule(): WorkoutScheduleState {
  try {
    const data = localStorage.getItem(SCHEDULE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const weeklyPlan = { ...DEFAULT_WEEKLY_PLAN, ...(parsed.weeklyPlan || {}) };
      // If user had the old 4-day default where Wednesday was rest and Friday was inferiores-b without custom override,
      // update Wednesday to superior-b and Friday to superior-a if they were uncustomized
      return {
        weeklyPlan,
        customDays: parsed.customDays || {},
        alarm: { ...DEFAULT_ALARM_SETTINGS, ...(parsed.alarm || {}) },
        scheduleMode: parsed.scheduleMode || 'continuous',
        continuousPlan: parsed.continuousPlan || ['inferiores-a', 'superior-a', 'inferiores-b', 'superior-b'],
        continuousStartDate: parsed.continuousStartDate || new Date().toISOString().slice(0, 10),
      };
    }
  } catch (err) {
    console.error('Error loading schedule:', err);
  }
  return {
    scheduleMode: 'continuous',
    weeklyPlan: DEFAULT_WEEKLY_PLAN,
    continuousPlan: ['inferiores-a', 'superior-a', 'inferiores-b', 'superior-b'],
    continuousStartDate: new Date().toISOString().slice(0, 10),
    customDays: {},
    alarm: DEFAULT_ALARM_SETTINGS,
  };
}

export function saveSchedule(schedule: WorkoutScheduleState): void {
  try {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  } catch (err) {
    console.error('Error saving schedule:', err);
  }
}

export function getScheduledTimeForDate(dateStr: string, schedule?: WorkoutScheduleState): string {
  const sched = schedule || loadSchedule();
  if (sched.customDays && sched.customDays[dateStr]?.time) {
    return sched.customDays[dateStr].time!;
  }
  if (sched.alarm?.customDayTimes && sched.alarm.customDayTimes[dateStr]) {
    return sched.alarm.customDayTimes[dateStr];
  }
  return sched.alarm?.defaultTime || '18:00';
}

export function getNextScheduledAlarm(schedule?: WorkoutScheduleState): {
  dateStr: string;
  timeStr: string;
  formattedDisplay: string;
  templateId: string;
  title: string;
  isToday: boolean;
} | null {
  const sched = schedule || loadSchedule();
  const alarm = sched.alarm || DEFAULT_ALARM_SETTINGS;
  if (!alarm.enabled) return null;

  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = String(now.getMonth() + 1).padStart(2, '0');
  const todayD = String(now.getDate()).padStart(2, '0');
  const todayStr = `${todayY}-${todayM}-${todayD}`;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Check next 7 days starting from today
  for (let offset = 0; offset < 7; offset++) {
    const checkDate = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const dayOfWeek = checkDate.getDay();

    const scheduled = getScheduledWorkoutForDate(dateStr, sched);
    if (scheduled.isRest || !scheduled.templateId) continue;

    // Check if this day of week has alarm enabled or custom override
    const isDayActive = alarm.daysOfWeek?.includes(dayOfWeek) || !!sched.customDays[dateStr]?.alarmEnabled;
    if (!isDayActive) continue;

    const timeStr = getScheduledTimeForDate(dateStr, sched);
    const [h, min] = timeStr.split(':').map(Number);
    const targetMinutes = h * 60 + min;

    // If today, only if not passed yet (or if snoozed)
    if (offset === 0 && targetMinutes <= nowMinutes) {
      continue;
    }

    const tpl = loadTemplates().find((t) => t.id === scheduled.templateId);
    const title = tpl ? tpl.title : scheduled.templateId;

    let dayLabel = 'Hoje';
    if (offset === 1) dayLabel = 'Amanhã';
    else if (offset > 1) {
      const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      dayLabel = `${weekdays[dayOfWeek]} (${d}/${m})`;
    }

    return {
      dateStr,
      timeStr,
      formattedDisplay: `${dayLabel} às ${timeStr}`,
      templateId: scheduled.templateId,
      title,
      isToday: offset === 0,
    };
  }

  return null;
}

function addDaysToDateStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDaysDifference(startStr: string, endStr: string): number {
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd, 12, 0, 0);
  const end = new Date(ey, em - 1, ed, 12, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getScheduledWorkoutForDate(dateStr: string, schedule?: WorkoutScheduleState): {
  templateId: string;
  isRest: boolean;
  isCustom: boolean;
  notes?: string;
} {
  const sched = schedule || loadSchedule();
  
  // Check if there is an explicit override for this date
  if (sched.customDays && sched.customDays[dateStr]) {
    const custom = sched.customDays[dateStr];
    return {
      templateId: custom.templateId,
      isRest: custom.templateId === 'rest' || !!custom.isRest,
      isCustom: true,
      notes: custom.notes,
    };
  }

  // Continuous Mode
  if (sched.scheduleMode === 'continuous' && sched.continuousPlan && sched.continuousPlan.length > 0 && sched.continuousStartDate) {
    const diff = getDaysDifference(sched.continuousStartDate, dateStr);
    const history = loadHistory();
    const historyMap = new Map();
    for (const h of history) {
      historyMap.set(h.date, h);
    }
    
    if (diff >= 0) {
      let pointer = 0;
      for (let i = 0; i < diff; i++) {
        const iterDateStr = addDaysToDateStr(sched.continuousStartDate, i);
        const override = sched.customDays[iterDateStr];
        const histSession = historyMap.get(iterDateStr);
        
        const isRestOverride = override && (override.templateId === 'rest' || !!override.isRest);
        const isRestHistory = histSession && (histSession.templateId === 'rest' || (histSession.exercises && histSession.exercises.length === 0));

        if (isRestOverride || isRestHistory) {
          // Rest day override or history -> do not advance pointer (this pushes the schedule forward!)
        } else {
          pointer = (pointer + 1) % sched.continuousPlan.length;
        }
      }
      const planTemplateId = sched.continuousPlan[pointer];
      return {
        templateId: planTemplateId,
        isRest: planTemplateId === 'rest',
        isCustom: false,
      };
    } else {
      let pointer = 0;
      for (let i = -1; i >= diff; i--) {
        const iterDateStr = addDaysToDateStr(sched.continuousStartDate, i);
        const override = sched.customDays[iterDateStr];
        const histSession = historyMap.get(iterDateStr);
        
        const isRestOverride = override && (override.templateId === 'rest' || !!override.isRest);
        const isRestHistory = histSession && (histSession.templateId === 'rest' || (histSession.exercises && histSession.exercises.length === 0));

        if (isRestOverride || isRestHistory) {
          // Rest day override or history -> do not move pointer backwards
        } else {
          pointer = (pointer - 1 + sched.continuousPlan.length) % sched.continuousPlan.length;
        }
      }
      const planTemplateId = sched.continuousPlan[pointer];
      return {
        templateId: planTemplateId,
        isRest: planTemplateId === 'rest',
        isCustom: false,
      };
    }
  }

  // Fallback to weekly plan
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay(); // 0-6
  const planTemplateId = sched.weeklyPlan[dayOfWeek] || 'rest';

  return {
    templateId: planTemplateId,
    isRest: planTemplateId === 'rest',
    isCustom: false,
  };
}

export function parseSessionTimestamp(dateStr: string, startTime?: string): number {
  if (startTime) {
    if (startTime.includes('T')) {
      const parsed = new Date(startTime).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    const parsed = new Date(`${dateStr}T${startTime}`).getTime();
    if (!isNaN(parsed)) return parsed;
  }
  const parsed = new Date(dateStr).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

export function getLastCompletedWorkout(): {
  session: WorkoutSession;
  daysAgo: number;
  formattedDate: string;
} | null {
  const history = loadHistory();
  const completed = history.filter((s) => s.completed || (s.exercises && s.exercises.some((e) => e.sets.some((st) => st.completed))));
  if (completed.length === 0) return null;

  // Sort by date/startTime desc safely
  const sorted = [...completed].sort((a, b) => {
    const timeA = parseSessionTimestamp(a.date, a.startTime);
    const timeB = parseSessionTimestamp(b.date, b.startTime);
    return timeB - timeA;
  });

  const last = sorted[0];
  const lastDate = new Date(`${last.date}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const daysAgo = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const [y, m, d] = last.date.split('-');
  const formattedDate = `${d}/${m}/${y}`;

  return {
    session: last,
    daysAgo,
    formattedDate,
  };
}

export const WORKOUT_ROTATION_ORDER = ['superior-a', 'inferiores-a', 'superior-b', 'inferiores-b'];

export function getNextRecommendedWorkout(): {
  templateId: string;
  reason: string;
  basedOnRotation: boolean;
} {
  const history = loadHistory();
  // Se não tem nenhum treino no histórico, assumimos que hoje (08/09/2026) começa no Inferiores A.
  if (history.length === 0 || !history.some(s => s.completed && WORKOUT_ROTATION_ORDER.includes(s.templateId))) {
    return {
      templateId: 'inferiores-a',
      reason: 'Início da divisão de treino',
      basedOnRotation: true,
    };
  }
  // Find the last completed workout that is part of the rotation
  // history is already sorted by date desc when saved, but let's be sure it's the most recent one
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.endTime || a.date).getTime();
    const dateB = new Date(b.endTime || b.date).getTime();
    return dateB - dateA;
  });
  
  const lastRotationWorkout = sortedHistory.find(s => 
    s.completed && WORKOUT_ROTATION_ORDER.includes(s.templateId)
  );

  if (lastRotationWorkout) {
    const idx = WORKOUT_ROTATION_ORDER.indexOf(lastRotationWorkout.templateId);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % WORKOUT_ROTATION_ORDER.length;
      return {
        templateId: WORKOUT_ROTATION_ORDER[nextIdx],
        reason: `Sequência natural da divisão após ${lastRotationWorkout.title}`,
        basedOnRotation: true,
      };
    }
  }

  return {
    templateId: WORKOUT_ROTATION_ORDER[0],
    reason: 'Início da divisão de treino',
    basedOnRotation: true,
  };
}

export function setTodayScheduledWorkout(templateId: string): WorkoutScheduleState {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const sched = loadSchedule();
  
  const updatedCustom = { ...sched.customDays };
  if (templateId === 'default') {
    delete updatedCustom[todayStr];
  } else {
    updatedCustom[todayStr] = {
      ...(updatedCustom[todayStr] || {}),
      templateId,
      isRest: templateId === 'rest',
    };
  }

  const updated: WorkoutScheduleState = {
    ...sched,
    customDays: updatedCustom,
  };
  saveSchedule(updated);
  return updated;
}

export function applySchedulePreset(preset: 'lower_first' | 'upper_first'): WorkoutScheduleState {
  const sched = loadSchedule();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const weeklyPlan = preset === 'lower_first' ? LOWER_FIRST_WEEKLY_PLAN : UPPER_FIRST_WEEKLY_PLAN;
  const targetTodayTemplate = preset === 'lower_first' ? 'inferiores-a' : 'superior-a';

  const updatedCustom = {
    ...sched.customDays,
    [todayStr]: {
      ...(sched.customDays[todayStr] || {}),
      templateId: targetTodayTemplate,
      isRest: false,
    },
  };

  const updated: WorkoutScheduleState = {
    ...sched,
    weeklyPlan,
    customDays: updatedCustom,
  };

  saveSchedule(updated);
  return updated;
}

export function loadTemplates(): WorkoutTemplate[] {
  try {
    const data = localStorage.getItem(TEMPLATES_KEY);
    if (data) {
      const parsed: WorkoutTemplate[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing default templates (like superior-b and inferiores-b)
        let hasNew = false;
        const merged = [...parsed];
        for (const defaultTpl of INITIAL_WORKOUT_TEMPLATES) {
          const exists = merged.some((t) => t.id === defaultTpl.id);
          if (!exists) {
            merged.push(defaultTpl);
            hasNew = true;
          }
        }
        if (hasNew) {
          saveTemplates(merged);
        }
        return merged;
      }
    }
  } catch (err) {
    console.error('Error loading templates:', err);
  }
  saveTemplates(INITIAL_WORKOUT_TEMPLATES);
  return INITIAL_WORKOUT_TEMPLATES;
}

export function saveTemplates(templates: WorkoutTemplate[]): void {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (err) {
    console.error('Error saving templates:', err);
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(PREFERENCES_KEY);
    if (data) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error loading preferences:', err);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Error saving preferences:', err);
  }
}

export function loadCurrentSession(): WorkoutSession | null {
  try {
    const data = localStorage.getItem(CURRENT_SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading current session:', err);
  }
  return null;
}

export function saveCurrentSession(session: WorkoutSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    } else {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error('Error saving current session:', err);
  }
}

export function loadHistory(): WorkoutSession[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading history:', err);
  }
  return [];
}

export function saveHistory(history: WorkoutSession[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving history:', err);
  }
}

export function addSessionToHistory(session: WorkoutSession): WorkoutSession[] {
  const history = loadHistory();
  const filtered = history.filter((s) => s.id !== session.id);
  const updated = [session, ...filtered];
  saveHistory(updated);
  return updated;
}

export function getLastPerformanceForExercise(exerciseName: string): {
  date: string;
  bestKg?: number;
  totalKg?: number;
  sets: { reps: number; kg?: number; rir?: number | null }[];
} | null {
  const history = loadHistory();
  for (const session of history) {
    const found = session.exercises.find(
      (e) => e.name.trim().toLowerCase() === exerciseName.trim().toLowerCase()
    );
    if (found && found.sets.some((s) => s.completed && (s.actualKg || s.targetKg))) {
      const completedSets = found.sets.filter((s) => s.completed);
      const kgs = completedSets.map((s) => s.actualKg || s.targetKg || 0).filter((k) => k > 0);
      const bestKg = kgs.length > 0 ? Math.max(...kgs) : undefined;
      return {
        date: session.date,
        bestKg,
        sets: completedSets.map((s) => ({
          reps: s.actualReps || s.targetReps,
          kg: s.actualKg ?? s.targetKg,
          rir: s.rir,
        })),
      };
    }
  }
  return null;
}

// Full Backup & Restore Operations (100% Offline & Independent of Cloud)
export interface FullBackupPayload {
  version: number;
  appName: string;
  exportedAt: string;
  metadata: {
    historyCount: number;
    templatesCount: number;
    hasActiveSession: boolean;
  };
  data: {
    history: WorkoutSession[];
    templates: WorkoutTemplate[];
    schedule: WorkoutScheduleState;
    preferences: UserPreferences;
    currentSession: WorkoutSession | null;
  };
}

export function generateFullBackupObject(): FullBackupPayload {
  const history = loadHistory();
  const templates = loadTemplates();
  const schedule = loadSchedule();
  const preferences = loadPreferences();
  const currentSession = loadCurrentSession();

  return {
    version: 1,
    appName: 'Diário de Treino Pro',
    exportedAt: new Date().toISOString(),
    metadata: {
      historyCount: history.length,
      templatesCount: templates.length,
      hasActiveSession: !!currentSession,
    },
    data: {
      history,
      templates,
      schedule,
      preferences,
      currentSession,
    },
  };
}

export function downloadBackupJSON(): {
  filename: string;
  fileSizeBytes: number;
  historyCount: number;
  templatesCount: number;
} {
  const backup = generateFullBackupObject();
  const jsonString = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const filename = `diario-de-treino-backup-${yyyy}-${mm}-${dd}_${hh}h${min}.json`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.setAttribute('style', 'display: none');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    filename,
    fileSizeBytes: blob.size,
    historyCount: backup.metadata.historyCount,
    templatesCount: backup.metadata.templatesCount,
  };
}

export function restoreBackupFromJSON(rawJsonString: string): {
  success: boolean;
  message: string;
  restoredData?: {
    history: WorkoutSession[];
    templates: WorkoutTemplate[];
    schedule: WorkoutScheduleState;
    preferences: UserPreferences;
    currentSession: WorkoutSession | null;
  };
} {
  try {
    const parsed = JSON.parse(rawJsonString);
    if (!parsed) {
      return { success: false, message: 'Arquivo JSON vazio ou inválido.' };
    }

    // Support both structured { data: { history, ... } } and direct format
    const sourceData = parsed.data || parsed;

    if (!sourceData.history && !sourceData.templates) {
      return {
        success: false,
        message: 'O arquivo JSON não contém uma estrutura válida de treino (histórico ou fichas).',
      };
    }

    const history: WorkoutSession[] = Array.isArray(sourceData.history) ? sourceData.history : loadHistory();
    const templates: WorkoutTemplate[] = Array.isArray(sourceData.templates) && sourceData.templates.length > 0
      ? sourceData.templates
      : loadTemplates();
    const schedule: WorkoutScheduleState = sourceData.schedule ? sourceData.schedule : loadSchedule();
    const preferences: UserPreferences = sourceData.preferences
      ? { ...DEFAULT_PREFERENCES, ...sourceData.preferences }
      : loadPreferences();
    const currentSession: WorkoutSession | null = sourceData.currentSession !== undefined
      ? sourceData.currentSession
      : loadCurrentSession();

    // Persist to local storage
    saveHistory(history);
    saveTemplates(templates);
    saveSchedule(schedule);
    savePreferences(preferences);
    if (currentSession) {
      saveCurrentSession(currentSession);
    }

    return {
      success: true,
      message: `Backup restaurado com sucesso! (${history.length} treinos no histórico, ${templates.length} fichas de treino).`,
      restoredData: {
        history,
        templates,
        schedule,
        preferences,
        currentSession,
      },
    };
  } catch (err: any) {
    console.error('Error parsing JSON backup file:', err);
    return {
      success: false,
      message: `Erro ao processar o arquivo: ${err?.message || 'Formato JSON inválido'}`,
    };
  }
}

// Multi-User Account Management (Local Device)
const SAVED_ACCOUNTS_KEY = 'academia_saved_accounts_v1';
const ACTIVE_USER_ID_KEY = 'academia_active_user_id_v1';

export interface SavedUserAccount {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  lastLogin: string;
}

export function getSavedAccounts(): SavedUserAccount[] {
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error loading saved accounts:', err);
  }
  return [];
}

export function saveAccountToList(account: SavedUserAccount): void {
  try {
    const list = getSavedAccounts();
    const filtered = list.filter((a) => a.uid !== account.uid && a.email.toLowerCase() !== account.email.toLowerCase());
    const updated = [account, ...filtered].slice(0, 10); // Keep up to 10 accounts on device
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving account to list:', err);
  }
}

export function removeSavedAccount(uid: string): void {
  try {
    const list = getSavedAccounts();
    const updated = list.filter((a) => a.uid !== uid);
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error removing saved account:', err);
  }
}

export function getActiveUserId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_USER_ID_KEY);
  } catch {
    return null;
  }
}

export function setActiveUserId(uid: string | null): void {
  try {
    if (uid) {
      localStorage.setItem(ACTIVE_USER_ID_KEY, uid);
    } else {
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
    }
  } catch (err) {
    console.error('Error setting active user id:', err);
  }
}

// Reset active local workout state when switching between different user accounts
export function clearCurrentSessionOnUserSwitch(): void {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (err) {
    console.error('Error clearing current session on user switch:', err);
  }
}

