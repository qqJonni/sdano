// Объекты портфолио — заглушки для каталога и /portfolio/[project].
// Фото пока плейсхолдеры (public/placeholder/*). Заменить реальными (TODO).
export interface Project {
  slug: string;
  title: string;
  area: string; // площадь
  district: string;
  format: string; // формат ремонта
  duration: string;
  cover: string; // путь к обложке (плейсхолдер)
  before?: string;
  after?: string;
  summary: string;
}

export const projects: Project[] = [
  {
    slug: 'kvartira-72-gorki',
    title: 'Квартира 72 м² в ЖК «Горки»',
    area: '72 м²',
    district: 'Мотовилихинский район',
    format: 'Под ключ',
    duration: '3,5 месяца',
    cover: '/placeholder/project-1.svg',
    before: '/placeholder/before-1.svg',
    after: '/placeholder/after-1.svg',
    summary:
      'Ремонт под ключ с перепланировкой: объединили кухню-гостиную, тёплые полы, встроенное хранение.',
  },
  {
    slug: 'studiya-32-ekvator',
    title: 'Студия 32 м² в ЖК «Экватор»',
    area: '32 м²',
    district: 'Свердловский район',
    format: 'Под ключ',
    duration: '2 месяца',
    cover: '/placeholder/project-2.svg',
    before: '/placeholder/before-2.svg',
    after: '/placeholder/after-2.svg',
    summary: 'Компактная студия для сдачи: практичные материалы, скрытое хранение, нейтральная палитра.',
  },
  {
    slug: 'dom-140-sputnik',
    title: 'Дом 140 м² в пригороде',
    area: '140 м²',
    district: 'Пермский район',
    format: 'Ремонт дома',
    duration: '6 месяцев',
    cover: '/placeholder/project-3.svg',
    before: '/placeholder/before-3.svg',
    after: '/placeholder/after-3.svg',
    summary: 'Отделка коттеджа под ключ: инженерия, лестница, панорамное остекление, авторский надзор.',
  },
  {
    slug: 'kvartira-54-medovyy',
    title: 'Квартира 54 м² в ЖК «Медовый»',
    area: '54 м²',
    district: 'Индустриальный район',
    format: 'Капитальный',
    duration: '3 месяца',
    cover: '/placeholder/project-4.svg',
    before: '/placeholder/before-4.svg',
    after: '/placeholder/after-4.svg',
    summary: 'Капитальный ремонт двушки: замена коммуникаций, тёплый минимализм, бронзовые акценты.',
  },
];
