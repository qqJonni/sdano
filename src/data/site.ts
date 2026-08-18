// NAP, контакты и реквизиты SDANO. Публичные данные — можно в коде/git.
// ВАЖНО: клиентские кнопки Telegram ведут на личный аккаунт (t.me/lvovvaleriy).
// Доставка заявок ботом в группу — через env TELEGRAM_CHAT_ID, здесь её нет.
export interface SiteConfig {
  name: string;
  legalName: string;
  city: string;
  region: string;
  phone: string;
  phoneHref: string;
  email: string;
  telegram: { handle: string; url: string };
  max: { label: string; url: string };
  address: string;
  workHours: string;
  requisites: {
    inn: string;
    ogrnip: string;
    bank: string;
    bik: string;
    corr: string; // корреспондентский счёт
    account: string; // расчётный счёт
    legalAddress?: string;
  };
}

export const site: SiteConfig = {
  name: 'SDANO',
  legalName: 'Индивидуальный предприниматель Львов Валерий Вадимович',
  city: 'Пермь',
  region: 'Пермский край',
  phone: '+7 (982) 435-72-07',
  phoneHref: 'tel:+79824357207',
  email: 'sdano-perm@mail.ru',
  telegram: { handle: '@lvovvaleriy', url: 'https://t.me/lvovvaleriy' },
  max: { label: 'MAX', url: 'https://web.max.ru/25573352' },
  address: 'г. Пермь',
  workHours: 'Пн–Вс, 9:00–21:00',
  requisites: {
    inn: '590699729804',
    ogrnip: '324595800065909', // из договора — проверить перед публикацией
    bank: 'Филиал «Центральный» Банка ВТБ (ПАО)',
    bik: '044525411',
    corr: '30101810145250000411',
    account: '40802810716100001717',
  },
};

// Главное меню (шапка)
export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: 'Ремонт', href: '/#formaty' },
  { label: 'Цены', href: '/#calc' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Технология', href: '/#tehnologiya' },
  { label: 'Отзывы', href: '/otzyvy' },
  { label: 'Контакты', href: '/kontakty' },
];

// Меню футера
export const footerNav: NavItem[] = [
  { label: 'Форматы ремонта', href: '/#formaty' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Отзывы', href: '/otzyvy' },
  { label: 'О компании', href: '/o-kompanii' },
  { label: 'Гарантия', href: '/garantiya' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/kontakty' },
  { label: 'Реквизиты', href: '/rekvizity' },
  { label: 'Политика ПД', href: '/politika' },
];
