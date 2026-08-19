// Объекты портфолио — заглушки для каталога и /portfolio/[project].
// Фото пока плейсхолдеры (public/placeholder/*). Заменить реальными (TODO).
export interface Project {
  slug: string;
  title: string;
  area: string; // площадь
  rooms?: string; // комнатность, напр. «2 комнаты» / «Студия»
  district: string;
  complex?: string; // ЖК, напр. «ЖК «Горки»»
  style?: string; // стиль интерьера
  format: string; // формат ремонта
  duration: string;
  cover: string; // обложка-заглушка для карточки каталога (если в папке объекта нет фото)
  summary: string;
}

export const projects: Project[] = [
  {
    slug: 'kvartira-72-gorki',
    title: 'Квартира 72 м² в ЖК «Горки»',
    area: '72 м²',
    rooms: '2 комнаты',
    district: 'Мотовилихинский район',
    complex: 'ЖК «Горки»',
    style: 'Современный',
    format: 'Под ключ',
    duration: '5 месяцев',
    cover: '/placeholder/project-1.svg',
    summary:
      'Ремонт под ключ: тёплые полы, встроенное хранение.',
  },
  {
    slug: 'studiya-32-ekvator',
    title: 'Студия 32 м² в ЖК «Экватор»',
    area: '32 м²',
    rooms: 'Студия',
    district: 'Свердловский район',
    complex: 'ЖК «Экватор»',
    style: 'Минимализм',
    format: 'Под ключ',
    duration: '2 месяца',
    cover: '/placeholder/project-2.svg',
    summary: 'Компактная студия для сдачи: практичные материалы, скрытое хранение, нейтральная палитра.',
  },
  {
    slug: 'dom-140-sputnik',
    title: 'Дом 140 м² в пригороде',
    area: '140 м²',
    rooms: '4 комнаты',
    district: 'Пермский район',
    style: 'Современная классика',
    format: 'Ремонт дома',
    duration: '6 месяцев',
    cover: '/placeholder/project-3.svg',
    summary: 'Отделка коттеджа под ключ: инженерия, лестница, панорамное остекление, авторский надзор.',
  },
  {
    slug: 'kvartira-54-medovyy',
    title: 'Квартира 54 м² в ЖК «Медовый»',
    area: '54 м²',
    rooms: '2 комнаты',
    district: 'Индустриальный район',
    complex: 'ЖК «Медовый»',
    style: 'Тёплый минимализм',
    format: 'Капитальный',
    duration: '3 месяца',
    cover: '/placeholder/project-4.svg',
    summary: 'Капитальный ремонт двушки: замена коммуникаций, тёплый минимализм, бронзовые акценты.',
  },
];
