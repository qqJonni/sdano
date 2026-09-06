// Аналитика: dataLayer + цели Яндекс.Метрики.
// Названия целей в кабинете Метрики должны совпадать: generate_lead, call, messenger.
export type TrackEvent = 'generate_lead' | 'call' | 'messenger';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    ym?: (id: number, action: string, ...rest: unknown[]) => void;
  }
}

const YM_ID = Number(import.meta.env.PUBLIC_YM_ID) || 0;

export function track(event: TrackEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  const data = { event, ...payload, ts: Date.now() };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);

  // Цель в Яндекс.Метрику (если счётчик подключён)
  if (YM_ID && typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', event);
  }

  console.debug('[track]', event, payload);
}
