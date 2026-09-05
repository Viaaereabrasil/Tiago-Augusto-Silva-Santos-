import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  getDocFromServer,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { WorkoutSession, WorkoutTemplate, WorkoutScheduleState } from '../types';
import {
  loadHistory,
  saveHistory,
  loadTemplates,
  saveTemplates,
  loadSchedule,
  saveSchedule,
  loadCurrentSession,
  saveCurrentSession,
  parseSessionTimestamp,
  getActiveUserId,
  setActiveUserId,
  clearCurrentSessionOnUserSwitch,
} from '../utils/storage';
import {
  addToPendingQueue,
  getPendingQueue,
  removeFromPendingQueue,
  clearPendingQueue,
  getPendingQueueCount,
} from '../utils/syncQueue';

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Test Firestore live connection
export async function testFirestoreConnection(): Promise<boolean> {
  if (!isOnline()) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message?.toLowerCase().includes('offline')) {
      return false;
    }
    // If permission or document not found, Firestore is still reachable
    return isOnline();
  }
}

// 1. Sync User Profile
export async function syncUserProfile(user: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }) {
  if (!user || !user.uid) return;
  try {
    if (!isOnline()) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        displayName: user.displayName || 'Atleta',
        email: user.email || '',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not sync user profile to cloud (offline or network error):', err);
  }
}

// 2. Initial Migration / Cloud Sync when User Logs In
export async function syncCloudDataOnLogin(userId: string, onUpdate?: (data: {
  history?: WorkoutSession[];
  templates?: WorkoutTemplate[];
  schedule?: WorkoutScheduleState;
}) => void): Promise<{
  history: WorkoutSession[];
  templates: WorkoutTemplate[];
  schedule: WorkoutScheduleState;
}> {
  try {
    const prevUserId = getActiveUserId();
    const isUserSwitch = !!(prevUserId && prevUserId !== userId);
    if (isUserSwitch) {
      clearCurrentSessionOnUserSwitch();
    }
    setActiveUserId(userId);

    if (!isOnline()) {
      return {
        history: loadHistory(),
        templates: loadTemplates(),
        schedule: loadSchedule(),
      };
    }

    // 1. Fetch Cloud History
    const historyCol = collection(db, 'users', userId, 'history');
    const historySnap = await getDocs(historyCol);
    let cloudHistory: WorkoutSession[] = [];
    historySnap.forEach((docSnap) => {
      cloudHistory.push(docSnap.data() as WorkoutSession);
    });

    // 2. Fetch Cloud Templates
    const templatesCol = collection(db, 'users', userId, 'templates');
    const templatesSnap = await getDocs(templatesCol);
    let cloudTemplates: WorkoutTemplate[] = [];
    templatesSnap.forEach((docSnap) => {
      cloudTemplates.push(docSnap.data() as WorkoutTemplate);
    });

    // 3. Fetch Cloud Schedule
    const scheduleDocRef = doc(db, 'users', userId, 'schedule', 'current');
    const scheduleSnap = await getDoc(scheduleDocRef);
    let cloudSchedule: WorkoutScheduleState | null = scheduleSnap.exists()
      ? (scheduleSnap.data() as WorkoutScheduleState)
      : null;

    // Merge strategy:
    const localHistory = loadHistory();
    const localTemplates = loadTemplates();
    const localSchedule = loadSchedule();

    let mergedHistory: WorkoutSession[] = [];
    if (isUserSwitch) {
      // If switching accounts, do NOT contaminate new user with previous user's history!
      mergedHistory = cloudHistory.sort((a, b) => {
        const tA = parseSessionTimestamp(a.date, a.startTime);
        const tB = parseSessionTimestamp(b.date, b.startTime);
        return tB - tA;
      });
      saveHistory(mergedHistory);
    } else {
      // Same user or initial account sync
      const historyMap = new Map<string, WorkoutSession>();
      localHistory.forEach((item) => historyMap.set(item.id, item));
      cloudHistory.forEach((item) => historyMap.set(item.id, item));
      mergedHistory = Array.from(historyMap.values()).sort((a, b) => {
        const tA = parseSessionTimestamp(a.date, a.startTime);
        const tB = parseSessionTimestamp(b.date, b.startTime);
        return tB - tA;
      });

      saveHistory(mergedHistory);
      for (const item of mergedHistory) {
        const existsInCloud = cloudHistory.some((c) => c.id === item.id);
        if (!existsInCloud) {
          await setDoc(doc(db, 'users', userId, 'history', item.id), item, { merge: true });
        }
      }
    }

    // Merge Templates
    let mergedTemplates = localTemplates;
    if (cloudTemplates.length > 0) {
      const tplMap = new Map<string, WorkoutTemplate>();
      localTemplates.forEach((t) => tplMap.set(t.id, t));
      cloudTemplates.forEach((t) => tplMap.set(t.id, t));
      mergedTemplates = Array.from(tplMap.values());
      saveTemplates(mergedTemplates);
    } else {
      for (const tpl of localTemplates) {
        await setDoc(doc(db, 'users', userId, 'templates', tpl.id), tpl, { merge: true });
      }
    }

    // Merge Schedule
    let mergedSchedule = localSchedule;
    if (cloudSchedule) {
      mergedSchedule = {
        weeklyPlan: { ...localSchedule.weeklyPlan, ...cloudSchedule.weeklyPlan },
        customDays: { ...localSchedule.customDays, ...cloudSchedule.customDays },
        alarm: { ...localSchedule.alarm, ...cloudSchedule.alarm },
      };
      saveSchedule(mergedSchedule);
    } else {
      await setDoc(scheduleDocRef, { ...localSchedule, userId, updatedAt: new Date().toISOString() }, { merge: true });
    }

    // Also process any pending queue items
    await processPendingSyncQueue(userId);

    if (onUpdate) {
      onUpdate({
        history: mergedHistory,
        templates: mergedTemplates,
        schedule: mergedSchedule,
      });
    }

    return {
      history: mergedHistory,
      templates: mergedTemplates,
      schedule: mergedSchedule,
    };
  } catch (err) {
    console.error('Error synchronizing cloud data:', err);
    return {
      history: loadHistory(),
      templates: loadTemplates(),
      schedule: loadSchedule(),
    };
  }
}

// 3. Process the Pending Sync Queue (drain offline pending items)
export async function processPendingSyncQueue(userId: string): Promise<{
  success: boolean;
  syncedCount: number;
  remainingCount: number;
}> {
  if (!userId || !isOnline()) {
    return { success: false, syncedCount: 0, remainingCount: getPendingQueueCount() };
  }

  const queue = getPendingQueue();
  if (queue.length === 0) {
    return { success: true, syncedCount: 0, remainingCount: 0 };
  }

  let syncedCount = 0;

  for (const item of queue) {
    try {
      if (item.type === 'session') {
        const docRef = doc(db, 'users', userId, 'history', item.data.id);
        await setDoc(docRef, { ...item.data, userId, updatedAt: new Date().toISOString() }, { merge: true });
        removeFromPendingQueue(item.id);
        syncedCount++;
      } else if (item.type === 'templates') {
        for (const tpl of item.data) {
          const docRef = doc(db, 'users', userId, 'templates', tpl.id);
          await setDoc(docRef, { ...tpl, userId, updatedAt: new Date().toISOString() }, { merge: true });
        }
        removeFromPendingQueue(item.id);
        syncedCount++;
      } else if (item.type === 'schedule') {
        const docRef = doc(db, 'users', userId, 'schedule', 'current');
        await setDoc(docRef, { ...item.data, userId, updatedAt: new Date().toISOString() }, { merge: true });
        removeFromPendingQueue(item.id);
        syncedCount++;
      } else if (item.type === 'delete_session') {
        const docRef = doc(db, 'users', userId, 'history', item.data.id);
        await deleteDoc(docRef);
        removeFromPendingQueue(item.id);
        syncedCount++;
      }
    } catch (err) {
      console.error('Failed to sync queue item:', item, err);
      // Stop loop if network dropped again
      if (!isOnline()) break;
    }
  }

  return {
    success: true,
    syncedCount,
    remainingCount: getPendingQueueCount(),
  };
}

// 4. Cloud persistence hooks for CRUD with automatic offline queue fallback
export async function saveSessionToCloud(userId: string, session: WorkoutSession) {
  if (!userId) return;
  if (!isOnline()) {
    addToPendingQueue({
      type: 'session',
      data: session,
      description: `Treino ${session.title} (${session.date})`,
    });
    return;
  }
  try {
    const docRef = doc(db, 'users', userId, 'history', session.id);
    await setDoc(docRef, { ...session, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Network error saving session to cloud, queued for later sync:', err);
    addToPendingQueue({
      type: 'session',
      data: session,
      description: `Treino ${session.title} (${session.date})`,
    });
  }
}

export async function deleteSessionFromCloud(userId: string, sessionId: string) {
  if (!userId) return;
  if (!isOnline()) {
    addToPendingQueue({
      type: 'delete_session',
      data: { id: sessionId },
      description: `Exclusão de Treino (${sessionId})`,
    });
    return;
  }
  try {
    const docRef = doc(db, 'users', userId, 'history', sessionId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Network error deleting session from cloud, queued for later sync:', err);
    addToPendingQueue({
      type: 'delete_session',
      data: { id: sessionId },
      description: `Exclusão de Treino (${sessionId})`,
    });
  }
}

export async function saveTemplatesToCloud(userId: string, templates: WorkoutTemplate[]) {
  if (!userId) return;
  if (!isOnline()) {
    addToPendingQueue({
      type: 'templates',
      data: templates,
      description: `Rotinas e Fichas de Treino (${templates.length} fichas)`,
    });
    return;
  }
  try {
    for (const tpl of templates) {
      const docRef = doc(db, 'users', userId, 'templates', tpl.id);
      await setDoc(docRef, { ...tpl, userId, updatedAt: new Date().toISOString() }, { merge: true });
    }
  } catch (err) {
    console.warn('Network error saving templates to cloud, queued for later sync:', err);
    addToPendingQueue({
      type: 'templates',
      data: templates,
      description: `Rotinas e Fichas de Treino (${templates.length} fichas)`,
    });
  }
}

export async function saveScheduleToCloud(userId: string, schedule: WorkoutScheduleState) {
  if (!userId) return;
  if (!isOnline()) {
    addToPendingQueue({
      type: 'schedule',
      data: schedule,
      description: 'Programação de Treino e Alarme',
    });
    return;
  }
  try {
    const docRef = doc(db, 'users', userId, 'schedule', 'current');
    await setDoc(docRef, { ...schedule, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Network error saving schedule to cloud, queued for later sync:', err);
    addToPendingQueue({
      type: 'schedule',
      data: schedule,
      description: 'Programação de Treino e Alarme',
    });
  }
}
