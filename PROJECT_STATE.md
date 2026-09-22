# SDANO — состояние проекта (передача в сессию)

> Документ-контекст для новой сессии Claude, которая ведёт проект. Актуально на 2026-09-11, коммит `343b5fa` (ветка `main`).

## 1. О проекте
Сайт **SDANO** — ремонт квартир и домов под ключ в Перми. Цель: поток заявок.
Стиль: премиум-редакция, тёмно-зелёный + бронза + айвори, знак «галочка в квадрате».
- Прод: **https://sdano-perm.ru** (живой, HTTPS).
- Репозиторий: **https://github.com/qqJonni/sdano** (публичный), ветка `main`.
- Рабочая папка: `/Users/valeriy/Desktop/sdano`.
- Регион продвижения: Пермь. Компания: ИП Львов Валерий Вадимович.

## 2. Стек и версии (важные нюансы)
- **Astro 5** (`^5.6.1`), `output: 'static'` + адаптер **`@astrojs/node` (standalone)** — деплой на свой VPS. Раньше был `@astrojs/vercel@8` (остался в deps, но НЕ используется — активен node-адаптер в `astro.config.mjs`).
- **Tailwind v3** (`@astrojs/tailwind`). ⚠️ Цвета заданы как `rgb(var(--x-rgb) / <alpha-value>)` в `tailwind.config.mjs` + канальные переменные в `global.css` — иначе НЕ работают модификаторы прозрачности (`bg-ink/50` и т.п.).
- **TypeScript strict**. Шрифты self-host в `public/fonts` (Cormorant 600 + Manrope variable), Google Fonts убраны, preload кириллицы в `BaseLayout`.
- `@astrojs/sitemap`, `astro-icon`.
- ⚠️ Версии адаптеров: `@astrojs/node@^9` и (если вернётесь на Vercel) `@astrojs/vercel@^8` — совместимы с Astro 5. Их «latest» (10.x/11.x) требуют Astro 7 — НЕ ставить.
- Node на проде и локально: v20. Сборка ~200 фото ест память (на VPS 956МБ есть swap 2ГБ).

## 3. Структура
```
src/
  layouts/BaseLayout.astro   # head, мета, OG, JSON-LD, Яндекс.Метрика, шрифты
  layouts/SiteLayout.astro   # BaseLayout + Header/Footer/Floating/MobileCTABar + трекинг кликов
  components/                # Header, Footer, Calculator, LeadForm, CallbackForm,
                             # PortfolioCard, HeroCarousel, Section, Button, PageHero, ...
  data/                      # site.ts, services.ts, segments.ts, complexes.ts,
                             # projects.ts, posts.ts, pricing.ts, reviews.ts
  lib/                       # lead.ts (submitLead+UTM), track.ts (цели), schema.ts (JSON-LD),
                             # portfolioPhotos.ts (glob фото объектов)
  pages/                     # index, uslugi/[slug], remont/[segment], zhk/[complex],
                             # portfolio/index + [project], blog/index + [post],
                             # otzyvy, o-kompanii, garantiya, kontakty, rekvizity,
                             # politika, spasibo, 404, design-system, api/lead.ts
  assets/portfolio/<slug>/   # фото объектов + description.md (см. п.5)
  assets/hero/               # фото hero-карусели (авто-подтягиваются)
public/                      # fonts, og/default.jpg (1200x630), robots.txt, llms.txt,
                             # favicon.svg, logo.svg, placeholder/
```
Данные-файлы (`src/data/*.ts`) — единый источник: правишь их → меняются страницы, меню, генерация роутов.

## 4. Ключевые данные (`src/data`)
- `site.ts` — NAP/реквизиты: телефон `+7 (982) 435-72-07`, email `sdano-perm@mail.ru`, Telegram `t.me/lvovvaleriy` (клиентская кнопка), MAX `web.max.ru/25573352`, адрес «г. Пермь, ул. Серебристая, 7», ИНН `590699729804`, ОГРНИП `324595800065909` (⚠️ проверить перед публикацией), банковские реквизиты. Меню (mainNav/footerNav).
- `services.ts` — услуги (`/uslugi/[slug]`): pod-klyuch (от 18 000 ₽/м²), kapitalnyy (от 20 000), kosmeticheskiy (от 6 000), dizayn-proekt (от 1 500), remont-domov (от 15 000). Поля: lead/body/includes/faq/relatedSegments.
- `segments.ts` — SEO-сегменты (`/remont/[segment]`): студия/новостройка/вторичка/1-3-комнатные/дом/коттедж/таунхаус. Тип `FAQItem`.
- `complexes.ts` — реальные ЖК Перми (`/zhk/[complex]`): Гулливер, Авиатор, Альпийские горки, Медовый, Погода, Доминант, Триумф Квартал, Астра. ⚠️ районы проставлены ориентировочно — проверить.
- `projects.ts` — **13 объектов портфолио** (реальные ЖК/адреса Перми, площади, комнаты, стиль). ⚠️ есть неиспользуемая папка `dom-140-sputnik` (5 фото + desc), которой НЕТ в projects.ts → не отображается (решить: вернуть или удалить).
- `posts.ts` — 5 статей блога (оригинальные тексты; абзац с `## ` → h2).
- `reviews.ts` — отзывы по slug объекта, общий модуль (главная берёт первые 3, `/otzyvy` — все 13).
- `pricing.ts` — конфиг калькулятора (ставки ₽/м², коэффициенты типа/состояния, `calcPrice`).

## 5. Контент портфолио (как наполнять — самообслуживание)
- У каждого объекта папка `src/assets/portfolio/<slug>/` (имя = slug из `projects.ts`). Фото кладутся туда, подтягиваются автоматически (`portfolioPhotos.ts`, glob), порядок по имени файла (`1.jpg, 2.jpg…`).
- Описание по зонам — файл `description.md` в папке объекта. Формат: `## Зона`, затем `![](./N.jpg)` и текст. Несколько `![]()` подряд без пустой строки = ряд фото одинаковой высоты; пустая строка между текстами = абзацы. Инструкция: `src/assets/portfolio/_HOWTO.md`.
- ⚠️ Расширение в `![](./N.jpg)` должно ТОЧНО совпадать с файлом (`.webp` ≠ `.jpg`, регистр важен), и число ссылок ≤ числу файлов — иначе сборка падает `ImageNotFound`.
- Фото — со стока Pexels (свободная лицензия) как временная «рыба»; часть объектов заполнял пользователь. Клик по фото на странице объекта → лайтбокс (листание, Esc). Карточки в каталоге и на главной — слайдеры (свайп/стрелки/прогресс-бар), на главной показываются первые 4.
- ⚠️ Юридически: НЕ использовать фото/тексты конкурентов (копирайт + недобросовестная конкуренция). Только свои фото/рендеры, лицензионный сток или ИИ-генерация; тексты — оригинальные.

## 6. Заявки (воронки)
- Формы и квиз шлют POST на серверный роут **`src/pages/api/lead.ts`** (`export const prerender = false`).
- Клиент: `src/lib/lead.ts` (`submitLead` — собирает UTM в sessionStorage, referrer, путь).
- Эндпоинт: honeypot, валидация имени/телефона, rate-limit по IP (реальный IP из `X-Forwarded-For` за nginx), отправка в **Telegram** (Bot API) + дубль на **почту через Resend** (опционально). Успех → редирект `/spasibo`.
- Аналитика: `src/lib/track.ts` → `dataLayer` + цели Метрики `ym(...,'reachGoal',event)`: `generate_lead`, `call`, `messenger`. Клики tel:/мессенджеры трекаются в `SiteLayout`.

## 7. SEO/GEO (ТЗ №3 — сделано)
- Уникальные title/description + canonical на всех роутах; `noindex,follow` на `/spasibo` и `/design-system`.
- OG/Twitter + брендовая `public/og/default.jpg` (1200×630); у портфолио — превью объекта.
- **Schema.org** (`src/lib/schema.ts`): глобально `GeneralContractor`; на страницах `Service`+`Offer`, `BreadcrumbList`, `FAQPage`, `CreativeWork`, `Article`. ⚠️ Фейковый `AggregateRating`/`Review` НЕ ставить, пока нет реальных отзывов.
- `sitemap-index.xml` (`@astrojs/sitemap`, исключены noindex), `public/robots.txt` (+ИИ-боты, Host, Sitemap), `public/llms.txt`.
- **Яндекс.Метрика**: код в `BaseLayout`, грузится только при заданной env `PUBLIC_YM_ID` (публичная, build-time — при изменении нужна ПЕРЕСБОРКА). Сейчас счётчика нет.

## 8. Деплой (прод — свой VPS)
- Сервер: **Ubuntu 26.04, IP `159.194.234.218`** (не Beget-хостинг, отдельный VPS). Node 20, nginx, certbot, swap 2ГБ.
- Приложение: `/var/www/sdano` (git clone из репо). Сервис **systemd `sdano`** запускает `node dist/server/entry.mjs` (env из `/var/www/sdano/.env`, `HOST=127.0.0.1 PORT=4321`). Автозапуск включён.
- **nginx** — реверс-прокси `:80/:443` → `127.0.0.1:4321`, редирект http→https.
- **TLS**: Let's Encrypt на `sdano-perm.ru` + `www` (до 08.12.2026, авто-продление certbot.timer).
- **DNS**: домен на nameservers Beget (cp.beget.com). A-записи apex и www → `159.194.234.218`. ⚠️ Домен пришлось отвязать от шаред-хостинга Beget (их фронт-прокси перехватывал).
- **Обновление сайта**: `ssh root@159.194.234.218 '/var/www/sdano/deploy.sh'` (git pull → npm ci → build → restart). Скрипт лежит на сервере.
- Доступ по SSH: вход по паролю запрещать; ключ деплоя генерировался в прошлой сессии (session-local, для новой сессии — сгенерировать новый ключ и добавить в `~/.ssh/authorized_keys` на сервере под своим паролем). ⚠️ Claude не вводит root-пароль — только доступ по ключу.

## 9. Секреты / env
- Локально: `/Users/valeriy/Desktop/sdano/.env` (в `.gitignore`). На сервере: `/var/www/sdano/.env`.
- Ключи: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (группа «SDANO» = `-5499547486`), `RESEND_API_KEY`, `LEAD_EMAIL_TO=sdano-perm@mail.ru`, `LEAD_EMAIL_FROM`, `PUBLIC_YM_ID`, (+ `HOST/PORT` на сервере).
- Статус: Telegram-доставка РАБОТАЕТ (токен+chat_id заданы на сервере). `RESEND_API_KEY` и `PUBLIC_YM_ID` — ПУСТЫ (почтовый дубль и Метрика выключены).
- ⚠️ `TELEGRAM_BOT_TOKEN` ранее светился в переписке — перед публичным запуском перевыпустить в @BotFather (`/revoke`) и обновить в обоих `.env` + `systemctl restart sdano`.
- Секреты в чат не присылать; в код не хардкодить — только env.

## 10. Что сделано
- **ТЗ №1** — каркас, дизайн-система, все роуты, hero-карусель, шапка/меню/футер.
- **ТЗ №2** — калькулятор-квиз, формы, приём заявок (Telegram+почта), UTM, track().
- **ТЗ №3** — SEO/GEO техбаза (Метрика, Schema, мета/OG, sitemap/robots/llms).
- Наполнение портфолио (13 объектов, фото+описания по зонам), отзывы, реальные ЖК, политика ПД по 152-ФЗ, карта Яндекса в контактах.
- Деплой на VPS с HTTPS. Фикс мобильного бургер-меню (было «прозрачное» из-за backdrop-blur у header — меню вынесено из `<header>`).

## 11. Что осталось / TODO
- Задать `PUBLIC_YM_ID` (создать счётчик Метрики, завести цели `generate_lead/call/messenger`) → добавить в `.env` и ПЕРЕСОБРАТЬ.
- Задать `RESEND_API_KEY` для дублей заявок на почту (или SMTP mail.ru).
- Перевыпустить токен бота; сменить root-пароль сервера, отключить вход по паролю.
- Проверить реальные районы ЖК в `complexes.ts` и ОГРНИП в `site.ts`.
- Решить судьбу папки `dom-140-sputnik` (не в projects.ts).
- **ТЗ №4** — реальные тексты/фото/отзывы; после появления реальных отзывов добавить `Review`/`AggregateRating` в Schema.
- Запуск: Яндекс.Бизнес/Вебмастер (подтвердить права, регион «Пермь», отправить sitemap), 2ГИС/справочники, замер видимости в ИИ-ассистентах.

## 12. Частые команды
```bash
# локально
cd ~/Desktop/sdano && npm run dev          # http://localhost:4321
npm run dev:host                            # доступ по сети (телефон): http://<IP-мака>:4321
npm run build                               # прод-сборка

# деплой на прод
git add -A && git commit -m "…" && git push
ssh root@159.194.234.218 '/var/www/sdano/deploy.sh'
```

## 13. Стиль работы (пожелания по проекту)
- Отвечать по-русски. После правок — собирать (`npm run build`) и проверять; критичные вещи проверять в браузере (мобилка тоже).
- Коммит-трейлер: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Не выдумывать отзывы/рейтинги; не использовать чужой контент.
