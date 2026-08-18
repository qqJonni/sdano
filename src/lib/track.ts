// Заготовка целей аналитики. В ТЗ №3 прокинем в Яндекс.Метрику (ym) и свяжем с целями.
// Пока пишем в window.dataLayer и в консоль.
export type TrackEvent = 'generate_lead' | 'call' | 'messenger';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const data = { event, ...payload, ts: Date.now() };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
  // Наглядно в консоли на этапе разработки
  console.debug('[track]', event, payload);
  // TODO ТЗ №3: if (typeof window.ym === 'function') window.ym(COUNTER_ID, 'reachGoal', event);
}
