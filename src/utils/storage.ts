export const RETENTION_DAYS = 30;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

interface RetainedEnvelope<T> {
  value: T;
  expiresAt: number;
}

export function getRetainedItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as RetainedEnvelope<T> | T;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'expiresAt' in parsed &&
      'value' in parsed
    ) {
      const envelope = parsed as RetainedEnvelope<T>;
      if (Date.now() > envelope.expiresAt) {
        localStorage.removeItem(key);
        return fallback;
      }
      return envelope.value;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

export function setRetainedItem<T>(key: string, value: T): void {
  try {
    const envelope: RetainedEnvelope<T> = {
      value,
      expiresAt: Date.now() + RETENTION_MS,
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // ignore storage errors
  }
}

export function getReturnByDateLabel(fromDate = new Date()): string {
  const target = new Date(fromDate.getTime() + RETENTION_MS);
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
