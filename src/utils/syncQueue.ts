export interface PendingSyncItem {
  id: string;
  type: 'session' | 'templates' | 'schedule' | 'delete_session';
  data: any;
  timestamp: number;
  description: string;
}

const SYNC_QUEUE_KEY = 'academia_pending_sync_queue_v1';

// In-memory subscribers for queue updates
const listeners = new Set<(count: number, items: PendingSyncItem[]) => void>();

export function getPendingQueue(): PendingSyncItem[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading pending sync queue:', err);
    return [];
  }
}

export function getPendingQueueCount(): number {
  return getPendingQueue().length;
}

function notifySubscribers() {
  const items = getPendingQueue();
  listeners.forEach((listener) => {
    try {
      listener(items.length, items);
    } catch (e) {
      console.error('Error in sync queue subscriber:', e);
    }
  });
}

export function subscribeToSyncQueue(callback: (count: number, items: PendingSyncItem[]) => void): () => void {
  listeners.add(callback);
  // initial call
  const items = getPendingQueue();
  callback(items.length, items);
  return () => {
    listeners.delete(callback);
  };
}

export function addToPendingQueue(item: {
  type: 'session' | 'templates' | 'schedule' | 'delete_session';
  data: any;
  description: string;
}): void {
  try {
    const current = getPendingQueue();
    // If updating same session or schedule, replace or update existing item
    let filtered = current;
    if (item.type === 'session' && item.data?.id) {
      filtered = current.filter((i) => !(i.type === 'session' && i.data?.id === item.data.id));
    } else if (item.type === 'schedule') {
      filtered = current.filter((i) => i.type !== 'schedule');
    } else if (item.type === 'templates') {
      filtered = current.filter((i) => i.type !== 'templates');
    }

    const newItem: PendingSyncItem = {
      id: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: item.type,
      data: item.data,
      timestamp: Date.now(),
      description: item.description,
    };

    const updated = [...filtered, newItem];
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
    notifySubscribers();
  } catch (err) {
    console.error('Error adding to sync queue:', err);
  }
}

export function removeFromPendingQueue(id: string): void {
  try {
    const current = getPendingQueue();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
    notifySubscribers();
  } catch (err) {
    console.error('Error removing from sync queue:', err);
  }
}

export function clearPendingQueue(): void {
  try {
    localStorage.removeItem(SYNC_QUEUE_KEY);
    notifySubscribers();
  } catch (err) {
    console.error('Error clearing sync queue:', err);
  }
}
