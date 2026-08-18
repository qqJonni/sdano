import type { APIRoute } from 'astro';

// Серверный роут по требованию (деплоится на Vercel как serverless-функция).
export const prerender = false;

// Секреты — только из окружения. process.env на Vercel; import.meta.env — для локального astro dev.
const env = (key: string): string =>
  (process.env[key] ?? (import.meta.env as Record<string, string | undefined>)[key] ?? '').trim();

// --- Простой rate-limit по IP (в памяти инстанса) ---
const RATE_MS = 10_000;
const lastHit = new Map<string, number>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const prev = lastHit.get(ip) || 0;
  // подчистка старых записей, чтобы Map не рос бесконечно
  if (lastHit.size > 500) {
    for (const [k, t] of lastHit) if (now - t > RATE_MS) lastHit.delete(k);
  }
  if (now - prev < RATE_MS) return true;
  lastHit.set(ip, now);
  return false;
}

// --- Валидация ---
function normalizePhone(raw: string): string | null {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.length < 10) return null;
  // РФ: 8XXXXXXXXXX -> 7XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (digits.length === 10) digits = '7' + digits; // без кода страны
  return '+' + digits;
}

function prettyPhone(normalized: string): string {
  // +7XXXXXXXXXX -> +7 (XXX) XXX-XX-XX
  const m = normalized.match(/^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+7 (${m[1]}) ${m[2]}-${m[3]}-${m[4]}` : normalized;
}

function esc(s: string): string {
  // HTML-экранирование для Telegram parse_mode=HTML и письма
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TYPE_LABEL: Record<string, string> = {
  kvartira: 'Квартира',
  studiya: 'Студия',
  novostroyka: 'Новостройка',
  dom: 'Частный дом',
};
const FORMAT_LABEL: Record<string, string> = {
  kosmeticheskiy: 'Косметический',
  kapitalnyy: 'Капитальный',
  'pod-klyuch': 'Под ключ',
  dizaynerskiy: 'Дизайнерский',
};
const CONDITION_LABEL: Record<string, string> = {
  chernovaya: 'Черновая',
  vtorichka: 'Вторичка под демонтаж',
  kosmetika: 'Косметика поверх',
};

function money(n: unknown): string {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n ?? '');
  return num.toLocaleString('ru-RU') + ' ₽';
}

function summarizeQuiz(q: Record<string, any> | null): string {
  if (!q) return '';
  const parts: string[] = [];
  if (q.type) parts.push(TYPE_LABEL[q.type] || q.type);
  if (q.area) parts.push(`${q.area} м²`);
  if (q.format) parts.push(FORMAT_LABEL[q.format] || q.format);
  if (q.condition) parts.push(CONDITION_LABEL[q.condition] || q.condition);
  let line = parts.join(', ');
  if (q.priceFrom && q.priceTo) line += ` → ${money(q.priceFrom)}–${money(q.priceTo)}`;
  return line;
}

function utmSummary(utm: Record<string, string> | undefined, referrer: string): string {
  if (utm && Object.keys(utm).length) {
    return [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean).join(' / ');
  }
  if (referrer) return `реферер: ${referrer}`;
  return 'прямой';
}

function mskTime(): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date()) + ' МСК';
}

async function sendTelegram(text: string): Promise<void> {
  const token = env('TELEGRAM_BOT_TOKEN');
  const chatId = env('TELEGRAM_CHAT_ID');
  if (!token || !chatId) throw new Error('telegram_env_missing');
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`telegram_${res.status}:${body.slice(0, 200)}`);
  }
}

async function sendEmail(subject: string, html: string): Promise<void> {
  const key = env('RESEND_API_KEY');
  const to = env('LEAD_EMAIL_TO');
  const from = env('LEAD_EMAIL_FROM');
  if (!key || !to || !from) return; // почта опциональна — просто пропускаем
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`resend_${res.status}:${body.slice(0, 200)}`);
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  let data: Record<string, any>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }

  // 1) honeypot — тихо ок, ничего не шлём
  if (data.honeypot && String(data.honeypot).trim() !== '') {
    return json({ ok: true });
  }

  // 2) валидация
  const name = String(data.name || '').trim();
  const phone = normalizePhone(String(data.phone || ''));
  if (name.length < 2) return json({ ok: false, error: 'bad_name' }, 400);
  if (!phone) return json({ ok: false, error: 'bad_phone' }, 400);

  // 3) rate-limit
  const ip = clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

  const formType = String(data.formType || 'Заявка');
  const quiz = (data.quizData as Record<string, any> | null) || null;
  const quizLine = summarizeQuiz(quiz);
  const src = utmSummary(data.utm, String(data.referrer || ''));
  const page = String(data.page || '');
  const when = mskTime();
  const phonePretty = prettyPhone(phone);

  // 4) Telegram (приоритет)
  const tgLines = [
    '🔔 <b>Новая заявка — SDANO</b>',
    `Тип: ${esc(formType)}`,
    `Имя: ${esc(name)}`,
    `Телефон: ${esc(phonePretty)}`,
    quizLine ? `Расчёт: ${esc(quizLine)}` : '',
    `Источник: ${esc(src)}`,
    page ? `Страница: ${esc(page)}` : '',
    `Время: ${esc(when)}`,
  ].filter(Boolean);

  try {
    await sendTelegram(tgLines.join('\n'));
  } catch (e) {
    console.error('[lead] telegram error:', (e as Error).message);
    return json({ ok: false, error: 'telegram_failed' }, 502);
  }

  // 5) Почта (не валит заявку при ошибке)
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#1C1B19">
      <h2 style="color:#23423A;margin:0 0 12px">🔔 Новая заявка — SDANO</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#6B675F">Тип</td><td>${esc(formType)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B675F">Имя</td><td>${esc(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B675F">Телефон</td><td><a href="tel:${esc(phone)}">${esc(phonePretty)}</a></td></tr>
        ${quizLine ? `<tr><td style="padding:4px 12px 4px 0;color:#6B675F">Расчёт</td><td>${esc(quizLine)}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;color:#6B675F">Источник</td><td>${esc(src)}</td></tr>
        ${page ? `<tr><td style="padding:4px 12px 4px 0;color:#6B675F">Страница</td><td>${esc(page)}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;color:#6B675F">Время</td><td>${esc(when)}</td></tr>
      </table>
    </div>`;
  try {
    await sendEmail(`Заявка SDANO — ${name} (${phonePretty})`, html);
  } catch (e) {
    console.error('[lead] email error (не критично):', (e as Error).message);
  }

  return json({ ok: true });
};

// GET — заглушка для проверки, что роут жив.
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true, hint: 'POST JSON to submit a lead' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
