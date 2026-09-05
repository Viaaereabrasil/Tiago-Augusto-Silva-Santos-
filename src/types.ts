export interface WorkoutSet {
  id: string;
  targetReps: number;
  targetKg?: number;
  actualReps?: number;
  actualKg?: number;
  rir?: number | null; // 0 = falha (0 na reserva), 2 = 2 na reserva, etc.
  type?: 'warmup' | 'feeder' | 'working' | 'top_set';
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'peito' | 'costas' | 'ombros' | 'triceps' | 'biceps' | 'pernas' | 'gluteos' | 'panturrilha' | 'core';
  equipment: 'cabo' | 'barra' | 'halter' | 'maquina' | 'corporal';
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  exercises: Exercise[];
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO string or HH:mm
  endTime?: string;
  durationMinutes?: number;
  exercises: Exercise[];
  completed: boolean;
  notes?: string;
}

export interface WorkoutHistory {
  sessions: WorkoutSession[];
}

export interface DaySchedule {
  templateId: string; // template ID or 'rest'
  notes?: string;
  isRest?: boolean;
  time?: string; // Specific time for this day e.g. "07:30"
  alarmEnabled?: boolean;
}

export interface WorkoutAlarmSettings {
  enabled: boolean;
  defaultTime: string; // e.g. "18:00"
  daysOfWeek: number[]; // e.g. [1, 2, 3, 4, 5, 6] (0 = Dom, 1 = Seg, ...)
  customDayTimes?: Record<string, string>; // 'YYYY-MM-DD' -> "07:30"
  soundPattern: 'intense' | 'classic' | 'chime' | 'countdown';
  vibrate: boolean;
  reminderMinutesBefore: number; // 0 = exactly at time, 5, 10, 15
  snoozeMinutes: number; // e.g. 5
  snoozedUntil?: string | null; // ISO or date string
  lastTriggeredSlot?: string; // date-hour-slot to prevent repeat loops
}

export interface WorkoutScheduleState {
  // Day of week mapping: 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  weeklyPlan: Record<number, string>; // templateId or 'rest'
  // Date-specific overrides: 'YYYY-MM-DD' -> DaySchedule
  customDays: Record<string, DaySchedule>;
  // Global & recurring alarm settings
  alarm?: WorkoutAlarmSettings;
}
