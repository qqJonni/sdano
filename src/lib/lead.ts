// Клиентский помощник отправки заявок. Используется всеми формами и квизом.
import { track } from './track';

export interface Utm {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadInput {
  name: string;
  phone: string;
  formType: string; // 'Калькулятор' | 'Обратный звонок' | 'Форма сметы' | ...
  source?: string; // произвольная метка места (блок/страница)
  quizData?: Record<string, unknown>;
  honeypot?: string; // скрытое поле-ловушка
}

export interface LeadResult {
  ok: boolean;
  error?: string;
}

const UTM_KEYS: (keyof Utm)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

const SS_UTM = 'sdano_utm';
const SS_REF = 'sdano_ref';

// UTM запоминаем при ПЕРВОМ заходе (первый источник), чтобы не терять атрибуцию.
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const fresh: Utm = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) fresh[k] = v.slice(0, 200);
    }
    if (Object.keys(fresh).length && !sessionStorage.getItem(SS_UTM)) {
      sessionStorage.setItem(SS_UTM, JSON.stringify(fresh));
    }
    if (document.referrer && !sessionStorage.getItem(SS_REF)) {
      const ref = new URL(document.referrer);
      // не записываем собственный домен как referrer
      if (ref.host !== window.location.host) {
        sessionStorage.setItem(SS_REF, document.referrer);
      }
    }
  } catch {
    /* sessionStorage может быть недоступен — молча пропускаем */
  }
}

function readUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(SS_UTM) || '{}');
  } catch {
    return {};
  }
}

function readReferrer(): string {
  try {
    return sessionStorage.getItem(SS_REF) || document.referrer || '';
  } catch {
    return document.referrer || '';
  }
}

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const payload = {
    name: input.name?.trim() ?? '',
    phone: input.phone?.trim() ?? '',
    formType: input.formType,
    source: input.source ?? '',
    quizData: input.quizData ?? null,
    honeypot: input.honeypot ?? '',
    utm: readUtm(),
    referrer: readReferrer(),
    page: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
  };

  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data: LeadResult = await res.json().catch(() => ({ ok: false, error: 'bad_response' }));
    if (res.ok && data.ok) {
      track('generate_lead', { formType: input.formType });
      return { ok: true };
    }
    return { ok: false, error: data.error || `http_${res.status}` };
  } catch (e) {
    return { ok: false, error: 'network' };
  }
}

// Инициализация атрибуции — вызвать один раз при загрузке страницы.
if (typeof window !== 'undefined') {
  captureAttribution();
}
