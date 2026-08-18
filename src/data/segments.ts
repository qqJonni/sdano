// SEO-сегменты — источник для хаба внутренних ссылок и /remont/[segment].
export interface Segment {
  slug: string;
  title: string; // H1 посадочной
  menuLabel: string; // короткая подпись в хабе
  group: 'kvartira' | 'komnaty' | 'dom';
  intro: string;
}

export const segments: Segment[] = [
  // Тип квартиры
  {
    slug: 'remont-studii',
    title: 'Ремонт квартиры-студии в Перми',
    menuLabel: 'Студия',
    group: 'kvartira',
    intro: 'Ремонт студий под ключ: зонирование, компактные решения, фиксированная смета.',
  },
  {
    slug: 'remont-novostroyki',
    title: 'Ремонт квартиры в новостройке',
    menuLabel: 'Новостройка',
    group: 'kvartira',
    intro: 'Ремонт квартир в новостройке от застройщика — с черновой до готовой к жизни.',
  },
  {
    slug: 'remont-vtorichki',
    title: 'Ремонт квартиры на вторичном рынке',
    menuLabel: 'Вторичка',
    group: 'kvartira',
    intro: 'Ремонт вторичного жилья с заменой коммуникаций и перепланировкой.',
  },
  // Комнатность
  {
    slug: 'remont-1-komnatnoy',
    title: 'Ремонт однокомнатной квартиры',
    menuLabel: '1-комнатная',
    group: 'komnaty',
    intro: 'Ремонт 1-комнатной квартиры под ключ в Перми.',
  },
  {
    slug: 'remont-2-komnatnoy',
    title: 'Ремонт двухкомнатной квартиры',
    menuLabel: '2-комнатная',
    group: 'komnaty',
    intro: 'Ремонт 2-комнатной квартиры под ключ в Перми.',
  },
  {
    slug: 'remont-3-komnatnoy',
    title: 'Ремонт трёхкомнатной квартиры',
    menuLabel: '3-комнатная',
    group: 'komnaty',
    intro: 'Ремонт 3-комнатной квартиры под ключ в Перми.',
  },
  // Тип дома
  {
    slug: 'remont-doma',
    title: 'Ремонт частного дома в Перми',
    menuLabel: 'Частный дом',
    group: 'dom',
    intro: 'Внутренняя отделка частных домов под ключ.',
  },
  {
    slug: 'remont-kottedzha',
    title: 'Ремонт коттеджа под ключ',
    menuLabel: 'Коттедж',
    group: 'dom',
    intro: 'Ремонт коттеджей с инженерией и авторским надзором.',
  },
  {
    slug: 'remont-taunhausa',
    title: 'Ремонт таунхауса',
    menuLabel: 'Таунхаус',
    group: 'dom',
    intro: 'Ремонт таунхаусов под ключ в Перми и пригороде.',
  },
];

export const segmentGroups: { key: Segment['group']; title: string }[] = [
  { key: 'kvartira', title: 'По типу жилья' },
  { key: 'komnaty', title: 'По комнатности' },
  { key: 'dom', title: 'Дома и коттеджи' },
];
