export interface Project {
  name: string;
  description: {
    ru: string;
    en: string;
  };
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
  mobileImage?: string;
  logo?: string;
  /** Extra screenshots/artwork; the card shows them as switchable thumbnails over the cover */
  gallery?: string[];
  /** Short muted looping clip shown instead of the cover; `image` becomes its poster */
  video?: string;
  /** Still being built — the card shows an "in progress" badge */
  inProgress?: boolean;
  /** 'contain' keeps the whole cover visible (for transparent artwork and screenshots) */
  imageFit?: 'cover' | 'contain';
}

export interface PortfolioData {
  name: {
    ru: string;
    en: string;
  };
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  summary: {
    ru: string;
    en: string;
  };
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: {
      ru: string;
      en: string;
    };
    technologies: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  languages: {
    language: {
      ru: string;
      en: string;
    };
    level: {
      ru: string;
      en: string;
    };
  }[];
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
  certificates?: {
    name: string;
    issuer: string;
    platform: string;
    date: string;
    image?: string;
    fileUrl?: string;
  }[];
  projects: Project[];
  /** Personal pet projects — shown as their own block under the commercial projects */
  petProjects: Project[];
}

const basePath = import.meta.env.BASE_URL;

import gitImage from '../../public/git.png';
import navbatImage from '../../public/navbat.png';
import navbatb2cImage from '../../public/navbatB2C.png';
import navbatb2cAppImage from '../../public/navbatApp.webp';
import asarMobileImage from '../../public/AsarMobile.webp';
import asarStepsImage from '../../public/AsarSteps.webp';
import dearyImage from '../../public/deary.png';
import livoImage from '../../public/livo.png';
import targetHeroImage from '../../public/targetHero.webp';
import targetStartMobileImage from '../../public/targetStartMobile.webp';
import insightImage from '../../public/insight.png';
import goImage from '../../public/Go1.png';
import MetaFrontDevImage from '../../public/front1.png';

import MetaJsImage from '../../public/js.png';
import MetaHtmlCssImage from '../../public/html.png';
import reactAdvancedImage from '../../public/Advanced React.png';
import EliteGlassImage from '../../public/glass.png';

// Pet projects
import snowokMotion from '../../public/projects/snowok-motion.mp4';
import snowokPoster from '../../public/projects/snowok-motion-poster.webp';
import snowokCover from '../../public/projects/snowok-cover.webp';
import snowokEmotions from '../../public/projects/snowok-emotions.webp';
import snowok3dHappy from '../../public/projects/snowok-3d-happy.webp';
import snowok3dWink from '../../public/projects/snowok-3d-wink.webp';
import lifeosCover from '../../public/projects/lifeos-cover.webp';
import lifeosToday from '../../public/projects/lifeos-today.webp';
import lifeosTasks from '../../public/projects/lifeos-tasks.webp';
import lifeosMoney from '../../public/projects/lifeos-money.webp';
import lifeosStudy from '../../public/projects/lifeos-study.webp';
import lifeosClock from '../../public/projects/lifeos-clock.webp';
import tuyMotion from '../../public/projects/tuy-motion.mp4';
import tuyPoster from '../../public/projects/tuy-motion-poster.webp';
import tuyBuild from '../../public/projects/tuy-build.webp';
import tuyCabinet from '../../public/projects/tuy-cabinet.webp';
import tuyAdmin from '../../public/projects/tuy-admin.webp';
import safycloBanner from '../../public/projects/safyclo-banner.webp';
import safycloAbaya from '../../public/projects/safyclo-abaya.webp';
import safycloOlive from '../../public/projects/safyclo-olive.webp';

export const portfolioData: PortfolioData = {
  name: { ru: 'Тешазода Сухроб', en: 'Suhrob Teshazoda' },
  title: 'Frontend & Mobile Developer',
  location: 'Душанбе, Таджикистан',
  email: 'suhrobtesha@gmail.com',
  github: 'github.com/SuhrobTeshaev',
  linkedin: 'linkedin.com/in/suhrob-teshazoda',
  telegram: 'https://t.me/suhrobdev',
  summary: {
    ru: 'Специализируюсь на React, Next.js, Vue.js и нативной разработке на Kotlin. Работаю с Flutter для кроссплатформенной разработки. Ориентирован на создание продакшен-решений с фокусом на стабильность и поддержку после релиза.',
    en: 'Specializing in React, Next.js, Vue.js and native Kotlin development. Working with Flutter for cross-platform development. Focused on production-ready solutions with emphasis on stability and post-release support.',
  },
  experience: [
    {
      company: 'Livo',
      role: 'Frontend & Mobile Developer',
      startDate: '2024-03-01',
      description: {
        ru: 'Разработка веб-приложений на React и Next.js. Создание Android приложений на Kotlin. Работа с Flutter для кроссплатформенной разработки. Интеграция REST API, работа с JWT авторизацией и обработка ошибок. Полный цикл публикации приложений в Google Play.',
        en: 'Development of web applications using React and Next.js. Building Android applications with Kotlin. Working with Flutter for cross-platform development. REST API integration, JWT authentication and error handling. Full cycle of publishing apps to Google Play.',
      },
      technologies: ['React', 'Next.js', 'Vue.js', 'Kotlin', 'Flutter', 'TypeScript', 'Supabase'],
    },
    {
      company: 'BOBO Web Studio',
      role: 'Frontend Developer Intern',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      description: {
        ru: 'Стажировка в веб-студии. Разработка пользовательских интерфейсов с использованием React и Vue.js. Работа с UI-библиотеками (MUI). Вёрстка адаптивных компонентов. Интеграция с backend API.',
        en: 'Internship at web studio. Development of user interfaces using React and Vue.js. Working with UI libraries (MUI). Responsive component design. Backend API integration.',
      },
      technologies: ['JavaScript', 'React', 'Vue.js', 'HTML/CSS', 'MUI'],
    },
  ],
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript (ES6+)', 'HTML/CSS'],
    },
    {
      category: 'Mobile',
      items: ['Android (Kotlin)', 'Flutter', 'HLS', 'MediaCodec', 'Google Play Publishing'],
    },
    {
      category: 'Backend & CMS',
      items: ['Laravel', 'PHP', 'WordPress', 'MySQL', 'REST API'],
    },
    {
      category: 'UI Libraries',
      items: ['MUI', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      category: 'Tools',
      items: ['Git', 'JWT', 'VS Code', 'Postman', 'Figma'],
    },
  ],
  languages: [
    { language: { ru: 'Таджикский', en: 'Tajik' }, level: { ru: 'Родной', en: 'Native' } },
    { language: { ru: 'Русский', en: 'Russian' }, level: { ru: 'Свободный', en: 'Fluent' } },
    { language: { ru: 'Английский', en: 'English' }, level: { ru: 'Средний (B1)', en: 'Intermediate (B1)' } },
  ],
  education: [
    {
      institution: 'Томский политехнический Университет',
      degree: 'Электроэнергетика и электротехника (Системы и сети)',
      period: '2017 - 2021',
    },
  ],
  certificates: [
    {
      name: 'Version Control',
      issuer: 'Meta / Coursera',
      platform: 'Coursera',
      date: '2026',
      image: gitImage,
      fileUrl: basePath + 'git.pdf',
    },
    {
      name: 'Introduction to Front-End Development',
      issuer: 'Meta / Coursera',
      platform: 'Coursera',
      date: '2026',
      image: MetaFrontDevImage,
      fileUrl: basePath + 'front.pdf',
    },
    {
      name: 'Programming with JavaScript',
      issuer: 'Meta / Coursera',
      platform: 'Coursera',
      date: '2026',
      image: MetaJsImage,
      fileUrl: basePath + 'js.pdf',
    },
    {
      name: 'HTML and CSS in Depth',
      issuer: 'Meta / Coursera',
      platform: 'Coursera',
      date: '2026',
      image: MetaHtmlCssImage,
      fileUrl: basePath + 'html.pdf',
    },
    {
      name: 'Advanced React',
      issuer: 'Meta / Coursera',
      platform: 'Coursera',
      date: '2026',
      image: reactAdvancedImage,
      fileUrl: basePath + 'React Edvance.pdf',
    },
    {
      name: 'Functions, Methods, and Interfaces in Go',
      issuer: 'University of California, Irvine / Coursera',
      platform: 'Coursera',
      date: '2024',
      image: goImage,
      fileUrl: basePath + 'go1.pdf',
    },
  ],
  projects: [
    {
      name: 'Navbat - B2B',
      description: {
        ru: 'Комплексная система управления клиниками. Админка для партнёров',
        en: 'Comprehensive clinic management system. Partner admin panel.',
      },
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      link: 'https://navbat.tj',
      logo: navbatImage,
    },
    {
      name: 'Navbat - B2C',
      description: {
        ru: 'Клиентский вебсайт для записи в клиники.',
        en: 'Client website for booking appointments in clinics.',
      },
      technologies: ['next.js', 'typescript', 'tailwindcss'],
      link: 'https://navbat.tj',
      image: navbatb2cImage,
    },
    {
      name: 'Navbat - B2C приложение',
      description: {
        ru: 'Клиентское приложение для записи в клиники.',
        en: 'Client application for booking appointments in clinics.',
      },
      technologies: ['android', 'kotlin', 'rest api'],
      link: 'https://play.google.com/store/apps/details?id=tj.navbat.application&hl=ru&pli=1',
      mobileImage: navbatb2cAppImage,
    },
    {
      name: 'Asarfilm - Cinema Platform',
      description: {
        ru: 'Мобильное приложение кино-платформы на Flutter с поддержкой HLS стриминга, переключением качества видео и работой с MediaCodec.',
        en: 'Mobile cinema platform app built with Flutter featuring HLS streaming, video quality switching and MediaCodec integration.',
      },
      technologies: ['Flutter', 'Dart', 'HLS', 'MediaCodec', 'REST API'],
      mobileImage: asarMobileImage,
      image: asarStepsImage,
    },
    {
      name: 'DearyDiary - Book Editor Platform',
      description: {
        ru: 'Вебсайт для написания книг с выбором обложки, бумаги, шрифтов. Полноценный редактор (подобный Word) и генерация книги в PDF.',
        en: 'Website for writing books with cover, paper, and font selection. Full-featured Word-like editor and PDF generation.',
      },
      image: dearyImage,
      technologies: ['Next.js', 'React', 'TypeScript', 'PDF Generation'],
      link: 'https://dearydiary.world/',
    },
    {
      name: 'Livo - Corporate Website',
      description: {
        ru: 'Корпоративный вебсайт, разработанный на Next.js.',
        en: 'Corporate website built with Next.js.',
      },
      image: livoImage,
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      link: 'https://livo.tj',
    },
    {
      name: 'smsTarget - Bulk SMS Service',
      description: {
        ru: 'Платформа массовой рассылки SMS. Система управления кампаниями, таргетинг и аналитика.',
        en: 'Bulk SMS platform. Campaign management system, targeting and analytics.',
      },
      technologies: ['React.js', 'JavaScript', 'REST API', 'HTML/CSS'],
      link: 'https://sms.colibri.tj',
      image: targetHeroImage,
      mobileImage: targetStartMobileImage,
    },
    {
      name: 'ICAP',
      description: {
        ru: 'Медицинский проект и портал, разработанный с использованием Vue.js.',
        en: 'Medical project and portal developed using Vue.js.',
      },
      technologies: ['Vue.js', 'JavaScript', 'HTML/CSS', 'REST API'],
    },
    {
      name: 'Insight Center',
      description: {
        ru: 'Сайт детской клиники на WordPress. Информация о различных процедурах (войта, логопедия и т.д.), адаптивный дизайн.',
        en: "Children's clinic website on WordPress. Information about various procedures (Voita, speech therapy, etc.), responsive design.",
      },
      image: insightImage,
      technologies: ['WordPress', 'PHP', 'HTML/CSS', 'MySQL'],
      link: 'https://insightcenter.tj',
    },
    {
      name: 'Landing Pages & Admin Panels',
      description: {
        ru: 'Множество небольших сайтов: от лендингов до админ-панелей, сайтов недвижимости и туристических платформ.',
        en: 'Multiple smaller websites: from landing pages to admin panels, real estate sites, and travel platforms.',
      },
      technologies: ['React', 'Vue.js', 'WordPress', 'HTML/CSS', 'JavaScript'],
    },
    {
      name: 'Elite Glass',
      description: {
        ru: 'Премиальные стеклянные решения',
        en: 'Premium glass solutions',
      },
      image: EliteGlassImage,
      technologies: ['React', 'Tailwind CSS', 'TypeScript'],
      link: 'https://eliteglass.tj/',
    },
  ],
  petProjects: [
    {
      name: 'Снежок (Snowok)',
      description: {
        ru: '«Снежок — тайны гор»: детская Android-игра про снежного барса для детей 3–6 лет. Готова первая миссия «Путь к водопаду»: выбрать, посчитать, обвести, сопоставить. Снежок реагирует на ответы, мир вокруг меняется. Персонаж — своя 3D-модель с ригом, рендер через Filament.',
        en: '"Snowok: Secrets of the Mountains", an Android game for kids aged 3–6 about a snow leopard cub. The first mission, "Path to the Waterfall", is playable: choose, count, trace, match. Snowok reacts to every answer and the world changes around him. The character is a custom rigged 3D model rendered with Filament.',
      },
      technologies: ['Kotlin', 'Jetpack Compose', 'Filament', 'Blender', 'Gradle'],
      image: snowokPoster,
      video: snowokMotion,
      inProgress: true,
      gallery: [snowokPoster, snowokCover, snowokEmotions, snowok3dHappy, snowok3dWink],
    },
    {
      name: 'Life OS',
      description: {
        ru: 'Приложение для тайм-менеджмента: задачи с повтором и вечерним переносом, привычки со стриками, фокус-таймер на перекидных часах, учёт долгов и расходов, 600 английских фраз с тестами. Android-оболочка с виджетами, ярлыками и плиткой «Фокус 25». Работает офлайн.',
        en: 'Time-management app: tasks with repeats and evening carry-over, habits with streaks, a focus timer on a flip clock, debts and expenses, 600 English phrases with tests. Android shell with home-screen widgets, shortcuts and a "Focus 25" tile. Works offline.',
      },
      technologies: ['JavaScript', 'HTML/CSS', 'IndexedDB', 'Android', 'Java'],
      image: lifeosCover,
      imageFit: 'contain',
      inProgress: true,
      gallery: [lifeosCover, lifeosToday, lifeosTasks, lifeosMoney, lifeosStudy, lifeosClock],
    },
    {
      name: 'Туй — Платформа для свадеб',
      description: {
        ru: 'Платформа «Свадьба под ключ»: каталог тойхон и исполнителей, сравнение, «Моя свадьба», чат и отзывы. Кабинет исполнителя с заявками, календарём и финансами, модули кондитера и курьера. Админка с модерацией, спорами и журналом. Вход по номеру телефона.',
        en: 'Turnkey wedding platform: catalog of venues and vendors, comparison, "My wedding", chat and reviews. Vendor dashboard with requests, calendar and finances, plus confectioner and courier modules. Admin panel with moderation, disputes and an audit log. Phone-number sign-in.',
      },
      technologies: ['Next.js', 'React', 'TypeScript', 'Laravel', 'PostgreSQL'],
      image: tuyPoster,
      video: tuyMotion,
      inProgress: true,
      gallery: [tuyPoster, tuyBuild, tuyCabinet, tuyAdmin],
    },
    {
      name: 'SAFYCLO',
      description: {
        ru: 'Платформа дизайнерского дома modest-одежды: интернет-магазин с галереей до 10 фото на товар, студия индивидуального пошива, Kanban-панель производства для цеха и REST API. Цены в сомони, полная адаптация под телефон.',
        en: 'Platform for a modest-fashion design house: online store with up to 10 photos per item, made-to-measure studio, a Kanban production board for the workshop and a REST API. Prices in somoni, fully responsive.',
      },
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'Laravel', 'PHP'],
      image: safycloBanner,
      inProgress: true,
      gallery: [safycloBanner, safycloAbaya, safycloOlive],
    },
  ],
};

export const uiTranslations = {
  ru: {
    greeting: 'Привет! Я AI-ассистент',
    greetingSubtitle:
      'Спросите меня о навыках, опыте или проектах. Я также могу изменить тему или язык сайта!',
    placeholder: 'Напишите сообщение...',
    send: 'Отправить',
    experience: 'Опыт работы',
    skills: 'Навыки',
    projects: 'Проекты',
    petProjects: 'Пет-проекты',
    petProjectsNote: 'Развиваю в свободное время — проекты ещё в работе',
    inProgress: 'В разработке',
    education: 'Образование',
    languages: 'Языки',
    contact: 'Контакты',
    certificates: 'Сертификаты',
    present: 'Настоящее время',
    themeChanged: 'Тема изменена!',
    languageChanged: 'Язык изменён!',
    askAnything: 'Спросите что угодно о моём опыте, навыках или проектах',
    showMore: 'Показать еще',
    showLess: 'Свернуть',
    suggestedQuestions: [
      'Расскажи о своём опыте',
      'Какие технологии ты знаешь?',
      'Покажи проекты',
      'Смени тему на светлую',
      'Switch to English',
    ],
  },
  en: {
    greeting: "Hi! I'm an AI Assistant",
    greetingSubtitle:
      'Ask me about skills, experience, or projects. I can also change the theme or language!',
    placeholder: 'Type a message...',
    send: 'Send',
    experience: 'Experience',
    skills: 'Skills',
    projects: 'Projects',
    petProjects: 'Pet projects',
    petProjectsNote: 'Built in my spare time — still in progress',
    inProgress: 'In progress',
    education: 'Education',
    languages: 'Languages',
    contact: 'Contact',
    certificates: 'Certificates',
    present: 'Present',
    themeChanged: 'Theme changed!',
    languageChanged: 'Language changed!',
    askAnything: 'Ask anything about my experience, skills, or projects',
    showMore: 'Show more',
    showLess: 'Show less',
    suggestedQuestions: [
      'Tell me about your experience',
      'What technologies do you know?',
      'Show me your projects',
      'Switch to dark theme',
      'Переключи на русский',
    ],
  },
};
