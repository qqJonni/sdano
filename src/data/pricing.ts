// Конфиг ценообразования калькулятора. Правится централизованно.

export interface Option {
  id: string;
  label: string;
  hint?: string;
}

// Шаг 1 — тип объекта (коэффициент типа)
export const objectTypes: (Option & { k: number })[] = [
  { id: 'kvartira', label: 'Квартира', k: 1.0 },
  { id: 'studiya', label: 'Студия', k: 1.0 },
  { id: 'novostroyka', label: 'Новостройка', k: 1.0 },
  { id: 'dom', label: 'Частный дом', k: 1.1 },
];

// Шаг 2 — быстрые пресеты площади
export const areaPresets = [30, 45, 60, 90];

// Шаг 3 — формат (базовая ставка ₽/м²)
export const formats: (Option & { rate: number })[] = [
  { id: 'kosmeticheskiy', label: 'Косметический', rate: 4500, hint: 'Обновление отделки без перепланировки' },
  { id: 'kapitalnyy', label: 'Капитальный', rate: 8900, hint: 'Замена коммуникаций, выравнивание' },
  { id: 'pod-klyuch', label: 'Под ключ', rate: 12500, hint: 'Полный цикл: черновая + чистовая' },
  { id: 'dizaynerskiy', label: 'Дизайнерский', rate: 18000, hint: 'Индивидуальный проект и материалы' },
];

// Шаг 4 — состояние (коэффициент состояния)
export const conditions: (Option & { k: number })[] = [
  { id: 'chernovaya', label: 'Черновая (новостройка)', k: 1.0 },
  { id: 'vtorichka', label: 'Вторичка «под демонтаж»', k: 1.1 },
  { id: 'kosmetika', label: 'Косметика поверх', k: 0.95 },
];

export interface QuizSelection {
  type?: string;
  area?: number;
  format?: string;
  condition?: string;
}

export interface PriceRange {
  from: number;
  to: number;
  base: number;
}

// база = площадь × ставка × коэф.типа × коэф.состояния
// диапазон = от база×0.9 до база×1.15, округление до тысяч
export function calcPrice(sel: QuizSelection): PriceRange | null {
  const type = objectTypes.find((t) => t.id === sel.type);
  const fmt = formats.find((f) => f.id === sel.format);
  const cond = conditions.find((c) => c.id === sel.condition);
  const area = Number(sel.area);
  if (!type || !fmt || !cond || !Number.isFinite(area) || area <= 0) return null;

  const base = area * fmt.rate * type.k * cond.k;
  const round = (n: number) => Math.round(n / 1000) * 1000;
  return {
    base: round(base),
    from: round(base * 0.9),
    to: round(base * 1.15),
  };
}

export function formatMoney(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽';
}
