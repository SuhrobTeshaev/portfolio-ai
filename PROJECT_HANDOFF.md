# Portfolio AI: передача проекта

Снимок состояния на 2026-11-02. Файл написан для нового чата с Claude, чтобы продолжить работу без потери контекста. Значения ключей и токенов сюда намеренно не включены.

**Как читать:** факты о коде проверены на дату снимка. Перед работой сверь их с репозиторием и с `git status`. Если код и файл расходятся, верь коду.

## 1. Коротко

Личное портфолио Сухроба Тешазоды (Frontend & Mobile Developer, Душанбе): одностраничный сайт на React с AI-чатом на Gemini и формой контактов с отправкой в Telegram.

- **Репозиторий:** https://github.com/SuhrobTeshaev/portfolio-ai (ветки `main` и `gh-pages`)
- **Локальная папка:** `D:\pet_projects\portfolio-ai` (Windows)
- **Запуск:** `npm run dev`, затем http://localhost:8080/portfolio-ai/ (слэш и путь обязательны)

## 2. Самое важное сейчас

1. **Правки сессии не закоммичены.** Последний коммит: `68aff36 fix logo,hero,cv`. Вся работа ниже лежит только в рабочей папке. Часть незакоммиченных правок (`ContactDock.tsx`, `index.css`, `button.tsx`) начата владельцем ещё до этой сессии. Не откатывай рабочую папку и не делай `git reset`/`git checkout .`.
2. **Опубликованный сайт устарел.** На GitHub Pages всё ещё старая сборка, новых правок там нет.
3. **Supabase-проект на паузе.** `supabase projects list` показывает `portfolio` как `INACTIVE`, его домен не резолвится. Владелец говорил, что восстановил проект, но API этого не подтверждал, и он собирался проверить дашборд сам. Вопрос открыт. Пока проект на паузе:
   - форма контактов показывает ошибку, сообщения не доходят;
   - чат отвечает локальными заготовками;
   - миграция и новые версии функций не применены.

## 3. Стек

| Что | Версия и детали |
|---|---|
| Фреймворк | React 18.3, TypeScript 5.8 (`strict: false`), Vite 5.4 (SWC) |
| Стили | Tailwind **3.4** (не v4), shadcn/ui, `tailwindcss-animate` |
| Анимация | framer-motion 12 (пакета `motion` нет и он не нужен) |
| Бэкенд | Supabase Edge Functions (Deno), Postgres, supabase-js 2.90 |
| Внешние сервисы | Gemini API, Telegram Bot API, Cloudflare Turnstile (готов, выключен), Яндекс Метрика |
| Деплой | `npm run deploy` (`gh-pages -d dist`) |
| Окружение | Node 20.11, Supabase CLI установлен и залогинен |

`base` в Vite и `basename` в роутере жёстко заданы как `/portfolio-ai/`.

## 4. Структура

```text
index.html                       мета-теги, JSON-LD, Метрика
vite.config.ts                   плагин, добавляющий CSP только при сборке
components.json                  shadcn + реестр @kokonutui
PROJECT_HANDOFF.md               этот файл
.cursorrules                     профиль разработчика и стиль общения
.claude/launch.json              серверы превью: dev (8080), preview (4173)
public/                          картинки, PDF сертификатов и резюме
src/
  pages/Index.tsx                сборка страницы, реестр ленивых секций, фон SplashCursor
  lib/portfolioData.ts           ВЕСЬ контент сайта и переводы интерфейса
  lib/dateUtils.ts               расчёт стажа
  lib/scrollToSection.ts         прокрутка с доводкой под ленивые секции
  contexts/ThemeLanguageContext  тема и язык, хук useThemeLanguage
  hooks/useTurnstile.ts          невидимый виджет Turnstile
  components/
    LazySection.tsx              IntersectionObserver + lazy; якорный id живёт здесь
    layout/MorphicHeader.tsx     текущая шапка
    layout/Header.tsx            старая шапка, закомментирована в Index.tsx
    layout/Footer.tsx
    portfolio/                   секции и ContactDock
    chat/ChatWindow.tsx          чат и его локальные ответы
    kokonutui/                   morphic-navbar, carousel-cards (адаптированы)
    react-bits/                  SplashCursor, SideRays (.jsx + .css, код как есть)
    ui/                          shadcn; большая часть не используется
  integrations/supabase/client.ts  клиент без сессии (авторизации на сайте нет)
supabase/
  config.toml                    project_id = bldchdmqxsukjtdwwpou
  functions/_shared/security.ts  CORS, escapeHtml, IP, лимитер, Turnstile
  functions/portfolio-chat/      Gemini + уведомления о заявках
  functions/portfolio-contact/   форма в Telegram
  migrations/20261028000000_edge_rate_limits.sql   новая, НЕ применена
```

## 5. Как устроены ключевые части

**Страница.** Баннер грузится сразу, секции `experience`, `skills`, `projects`, `certificates`, `education`, `contact` лениво. Якорный `id` стоит на обёртке `LazySection`, а не на `<section>`, чтобы ссылки работали до загрузки секции. Для прокрутки используй `scrollToSection(id)`: обычный `scrollIntoView` не доезжает, потому что секции по пути растут.

**Контент.** Всё в `portfolioData.ts`. Поля `name` и `languages[].language` двуязычные (`{ ru, en }`). Промпт чата в `portfolio-chat/index.ts` и локальные ответы в `ChatWindow.tsx` дублируют часть данных: при смене контента правь и их.

**Чат.** Клиент отправляет последние 10 сообщений. Сервер проверяет:
- не больше 20 сообщений, `user` до 2000 символов, `assistant` до 4000, всего до 20 000;
- последнее сообщение от `user`.

Модели перебираются по порядку: `gemini-3.5-flash`, `gemini-2.5-flash`, `gemini-flash-latest`. Заявка распознаётся, если ответ начинается с маркера `TECHNICAL SPECIFICATION GENERATED`. Если функция недоступна, `ChatWindow` отвечает локально.

**Лимиты** (таблица `edge_rate_limits`, RLS без политик, доступ только через service role):

| Область | На один IP | На всех |
|---|---|---|
| chat | 10 в минуту | 120 в минуту |
| lead (уведомления о заявках) | 2 в час | 20 в час |
| contact | 3 за 10 минут | 30 за 10 минут |

При ошибке базы лимитер пропускает запросы. Пока миграция не применена, лимиты фактически выключены.

**CSP.** `<meta>` добавляется плагином только в прод-сборку, inline-скрипт Метрики разрешён по хэшу. Новый внешний домен нужно добавить в `vite.config.ts`, иначе браузер его заблокирует.

**Turnstile.** Включается при наличии ключей. Без `TURNSTILE_SECRET_KEY` сервер не проверяет токен. Неверный токен даёт 403, недоступность Cloudflare пропускается.

**Визуальные эффекты.**
- `SplashCursor` стоит фоном на `z-index: -1`, поэтому у обёртки страницы нет `bg-background`: фон рисует `body`.
- `SideRays` лежит слоем в карточке формы, форма поверх (`relative z-10`).
- Оба компонента получают тему: в светлой включён свой режим (`theme="light"` и `lightMode`).

## 6. Переменные окружения

Только имена. `.env` в `.gitignore`.

**Клиент (`.env`):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, `VITE_TURNSTILE_SITE_KEY` (пока не задан).

**Секреты Supabase:** заданы `ALLOWED_ORIGIN`, `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Не задан `TURNSTILE_SECRET_KEY`. Значение `ALLOWED_ORIGIN` неизвестно: CLI показывает только хэш. Оно должно совпадать с доменом сайта, иначе браузер заблокирует запросы к функциям.

**Supabase-проекты.** Рабочий: `portfolio`, ref `bldchdmqxsukjtdwwpou`, к нему привязан CLI и обращается сайт. Есть похожий `portfolio-ai` (`jpjvlesunvnmtebkfrrv`): это **не** он, не деплой туда.

## 7. Проверки на дату снимка

| Проверка | Результат |
|---|---|
| `npx tsc -p tsconfig.app.json --noEmit` | без ошибок |
| `npx eslint .` | 3 ошибки (`ui/command.tsx`, `ui/textarea.tsx`, `tailwind.config.ts`) и 10 предупреждений, все старые или некритичные |
| `npx vite build` | проходит, главный JS около 685 KB (217 KB gzip), `dist` 19 MB |
| Тесты, CI | нет |

**Что ни разу не запускалось по-настоящему:**
- новые версии edge-функций и миграция;
- Turnstile с настоящими ключами (клиент проверен только тестовым ключом Cloudflare, серверная проверка на моке);
- лимитер на реальной базе (только на моке);
- существование модели `gemini-3.5-flash`;
- карусель сертификатов в светлой теме;
- брызги курсора в светлой теме;
- полная прод-сборка со всеми последними компонентами на предмет нарушений CSP.

## 8. Что делать дальше

1. **Закоммитить работу.** Сначала показать владельцу, что войдёт. Коммитить только по его просьбе. Файлы `vite.config.ts.timestamp-*.mjs` не включать.
2. **Supabase.** Убедиться, что статус `portfolio` стал `ACTIVE_HEALTHY`. Если нет, предложить восстановление через дашборд или Management API (только с явного согласия). Затем строго по порядку:
   ```bash
   supabase db push
   supabase functions deploy portfolio-chat
   supabase functions deploy portfolio-contact
   ```
   Миграция удаляет старую таблицу `contact_rate_limits`, в ней только короткоживущие записи лимитов. Перед применением посмотри `supabase migration list`. Настоящее сообщение в Telegram отправлять только с согласия владельца.
3. **Домен (нужно решение владельца).** Мета-теги, sitemap и robots указывают на `suhrob-portfolio.vercel.app`, а деплой настроен на GitHub Pages `suhrobteshaev.github.io/portfolio-ai/`. Оба адреса отвечают 200. Какой основной, не решено. После выбора поправить canonical, og:url, og:image, JSON-LD, sitemap, robots и `ALLOWED_ORIGIN`.
4. **Опубликовать сайт:** `npm run deploy` (только по просьбе владельца).
5. **Turnstile:** получить ключи в Cloudflare, добавить, проверить.

**Необязательно, по желанию владельца:**
- сжать картинки (`glass.png` 1.5 MB, `photo.png` 962 KB при показе 160×160, сертификаты по 490 KB);
- убрать неиспользуемые компоненты `ui/` и пакеты (`react-query`, `recharts`, `react-hook-form`, `zod`, `cmdk`, `vaul`, `embla` и другие), главный бандл тяжёлый;
- почистить репозиторий: `vite.config.ts.timestamp-*`, `.vite/deps_temp*`, `supabase/.temp` в git, два lock-файла (`bun.lockb` и `package-lock.json`), пустой `deno.json`, имя пакета `vite_react_shadcn_ts`;
- обновить `<html lang>` при смене языка;
- добавить тесты и CI;
- удалить `Header.tsx`, если новая шапка остаётся окончательно.

**Проверить владельцу:** имя внутри PDF-резюме (файл `SuhrobTeshaevCV_en.pdf` скачивается под новым именем, содержимое не проверялось); существует ли Twitter `@suhrobdev`, иначе убрать теги `twitter:site` и `twitter:creator`.

## 9. Решения и договорённости

**Уже решено, не пересматривать без просьбы:**
- Имя: «Тешазода Сухроб» на русском, **Suhrob Teshazoda** на английском. Адрес `github.com/SuhrobTeshaev` настоящий, менять нельзя.
- Telegram: **suhrobdev**.
- Elite Glass: одна запись со ссылкой на eliteglass.tj. Навбат B2B ведёт на navbat.tj.
- Анимация `@kokonutui/ink-background` в баннере **удалена по просьбе владельца**, не возвращать.
- Шапка заменена на `MorphicHeader` «временно», старая закомментирована. Панель **не сворачивается** при прокрутке там, где пункты помещаются (`compact` выключен). Ниже 1024px бургер-меню.
- Все цвета и фоны должны совпадать с токенами сайта (`card`, `muted-foreground`, `primary`), а не с цветами из демо компонентов.
- Карточки сертификатов одного размера: 1056/815, сертификат не обрезается.
- React Native в мета-тегах заменён на Next.js и Kotlin: его нет в навыках.

**Как работать с владельцем:**
- Общение на русском. Коротко, конкретно, без воды, с объяснением «почему так». Он сам разработчик уровня Middle (подробнее в `.cursorrules`).
- Обычно он присылает команду `npx shadcn add ...` и код компонента с задачей, где его применить. Важны внешний вид («красиво», одного размера) и то, чтобы цвета совпадали с сайтом.
- Не коммитить, не деплоить и не отправлять реальные сообщения без явной просьбы.
- Проверять изменения в браузере, а не только сборкой.

## 10. Подводные камни

- **`npx shadcn add` часто даёт нерабочий код.** Многие компоненты из реестров написаны под Next.js, Tailwind v4 и React 19. Сначала прочитай код, затем адаптируй: заменить `next/*` на обычные ссылки, `motion/react` на `framer-motion`, `w-(--x)` и `@container/...` на обычный CSS, убрать `<style precedence>`, заменить `.at()` (в `lib` указан ES2020), заменить `zinc` и `orange` токенами сайта.
- **Глобальное правило для кнопок.** `button:not(.no-gradient-border):not(.fixed)` в `index.css` задаёт `position: relative` и `overflow: hidden`. Это ломает абсолютно позиционированные кнопки сторонних компонентов. Лекарство: класс `no-gradient-border`.
- **`@import` в CSS** должен стоять первой строкой `index.css`. Когда он стоял после `@tailwind`, шрифты не грузились вообще.
- **Размер при монтировании.** В dev-режиме блок в момент эффекта может иметь нулевую высоту. Из-за этого WebGL-компонент уже ронял всю страницу в белый экран. Прод-сборка этого не показала, поэтому проверяй и `npm run dev`, и сборку.
- **Панель превью в Claude Desktop** работает примерно на 2 кадрах в секунду, когда она не в фокусе. Анимации там выглядят сломанными или не доигрывают, а снимки могут попасть на середину появления. Состояние проверяй через DOM и вычисленные стили.
- **Скролл в тестах.** Ленивые секции растут, поэтому прокрутка до `#certificates` с первого раза не доезжает. Прокручивай в несколько шагов. Секция проектов и сертификатов смещается после загрузки.
- **Ключи в списках.** `ProjectsSection` использует `project.name` как React-ключ, поэтому названия проектов должны быть уникальными.
- **Windows и Git Bash.** В репозитории смешаны LF и CRLF, многострочные замены в файлах сначала проверяй.
- **Тема общая.** Она хранится в `localStorage` (`portfolio-theme`). Если переключаешь её в тесте, верни обратно.

## 11. Контент сайта

Полный и актуальный источник: `src/lib/portfolioData.ts`.

**Профиль:** Frontend & Mobile Developer, Душанбе. suhrobtesha@gmail.com, github.com/SuhrobTeshaev, linkedin.com/in/suhrob-teshazoda, t.me/suhrobdev.

**Опыт:** стаж считается автоматически от 2024-01-01.
- Livo, Frontend & Mobile Developer, с марта 2024: React, Next.js, Vue.js, Kotlin, Flutter, TypeScript, Supabase.
- BOBO Web Studio, Frontend Developer Intern, январь – март 2024: JavaScript, React, Vue.js, HTML/CSS, MUI.

**Навыки:**
- Frontend: React, Next.js, Vue.js, TypeScript, JavaScript, HTML/CSS.
- Mobile: Android (Kotlin), Flutter, HLS, MediaCodec, Google Play Publishing.
- Backend и CMS: Laravel, PHP, WordPress, MySQL, REST API.
- UI: MUI, Tailwind CSS, Framer Motion.
- Tools: Git, JWT, VS Code, Postman, Figma.

**Проекты (11):** Navbat B2B, Navbat B2C (сайт), Navbat B2C (Android), Asarfilm, DearyDiary, Livo, smsTarget, ICAP, Insight Center, Landing Pages & Admin Panels, Elite Glass.

**Сертификаты (6, Coursera):** Version Control, Introduction to Front-End Development, Programming with JavaScript, HTML and CSS in Depth, Advanced React (все Meta, 2026); Functions, Methods, and Interfaces in Go (UC Irvine, 2024).

**Образование:** Томский политехнический университет, электроэнергетика и электротехника, 2017–2021.

**Языки:** таджикский (родной), русский (свободный), английский (B1).
