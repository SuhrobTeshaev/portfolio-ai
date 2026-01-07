export interface PortfolioData {
  name: string;
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
    period: string;
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
    language: string;
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
  projects: {
    name: string;
    description: {
      ru: string;
      en: string;
    };
    technologies: string[];
    link?: string;
  }[];
}

export const portfolioData: PortfolioData = {
  name: "Тешазода Сухроб",
  title: "Frontend & Mobile Developer",
  location: "Душанбе, Таджикистан",
  email: "suhrob.teshazoda@example.com",
  github: "github.com/suhrob-teshazoda",
  linkedin: "linkedin.com/in/suhrob-teshazoda",
  telegram: "@suhrob_dev",
  summary: {
    ru: "Frontend и Mobile разработчик с 2 годами опыта создания веб-приложений и Android приложений. Специализируюсь на React, Next.js, Vue.js и нативной разработке на Kotlin. Работаю с Flutter для кроссплатформенной разработки. Ориентирован на создание продакшен-решений с фокусом на стабильность и поддержку после релиза.",
    en: "Frontend & Mobile Developer with 2 years of experience building web and Android applications. Specializing in React, Next.js, Vue.js and native Kotlin development. Working with Flutter for cross-platform development. Focused on production-ready solutions with emphasis on stability and post-release support."
  },
  experience: [
    {
      company: "Livo",
      role: "Frontend & Mobile Developer",
      period: "Январь 2024 - Настоящее время",
      description: {
        ru: "Разработка веб-приложений на React и Next.js. Создание Android приложений на Kotlin. Работа с Flutter для кроссплатформенной разработки. Интеграция REST API, работа с JWT авторизацией и обработка ошибок. Полный цикл публикации приложений в Google Play.",
        en: "Development of web applications using React and Next.js. Building Android applications with Kotlin. Working with Flutter for cross-platform development. REST API integration, JWT authentication and error handling. Full cycle of publishing apps to Google Play."
      },
      technologies: ["React", "Next.js", "Vue.js", "Kotlin", "Flutter", "TypeScript", "Supabase"]
    },
    {
      company: "BOBO Web Studio",
      role: "Frontend Developer Intern",
      period: "Октябрь 2023 - Декабрь 2023",
      description: {
        ru: "Стажировка в веб-студии. Разработка пользовательских интерфейсов с использованием React и Vue.js. Работа с UI-библиотеками (MUI). Вёрстка адаптивных компонентов. Интеграция с backend API.",
        en: "Internship at web studio. Development of user interfaces using React and Vue.js. Working with UI libraries (MUI). Responsive component design. Backend API integration."
      },
      technologies: ["JavaScript", "React", "Vue.js", "HTML/CSS", "MUI"]
    }
  ],
  skills: [
    {
      category: "Frontend",
      items: ["React", "Next.js", "Vue.js", "TypeScript", "JavaScript (ES6+)", "HTML/CSS"]
    },
    {
      category: "Mobile",
      items: ["Android (Kotlin)", "Flutter", "HLS", "MediaCodec", "Google Play Publishing"]
    },
    {
      category: "Backend & CMS",
      items: ["Laravel", "PHP", "WordPress", "MySQL", "REST API"]
    },
    {
      category: "UI Libraries",
      items: ["MUI", "Tailwind CSS", "Framer Motion"]
    },
    {
      category: "Tools",
      items: ["Git", "JWT", "VS Code", "Postman", "Figma"]
    }
  ],
  languages: [
    { language: "Таджикский", level: { ru: "Родной", en: "Native" } },
    { language: "Русский", level: { ru: "Свободный", en: "Fluent" } },
    { language: "English", level: { ru: "Средний (B1)", en: "Intermediate (B1)" } }
  ],
  education: [
    {
      institution: "Таджикский Технический Университет",
      degree: "Бакалавр Информационных Технологий",
      period: "2019 - 2023"
    }
  ],
  projects: [
    {
      name: "Навбат - Clinic Management System",
      description: {
        ru: "Многофункциональная система управления клиниками. Админ-панель для партнёров с модулями: лаборатория, карточка зубов, анализы, финансы, транзакции, клиенты, запись, расписание, графики. Веб-портал для самостоятельной записи клиентов и мобильное приложение на Kotlin.",
        en: "Comprehensive clinic management system. Admin panel for partners with modules: laboratory, dental card, tests, finances, transactions, clients, appointments, schedules, charts. Web portal for client self-booking and Kotlin mobile app."
      },
      technologies: ["Laravel", "Kotlin", "PHP", "MySQL", "JavaScript", "Android"]
    },
    {
      name: "Asar - Cinema Platform",
      description: {
        ru: "Кино-платформа на Flutter с поддержкой HLS стриминга, переключением качества видео и работой с MediaCodec. Полный цикл публикации в Google Play.",
        en: "Cinema platform built with Flutter featuring HLS streaming, video quality switching and MediaCodec integration. Full Google Play publishing cycle."
      },
      technologies: ["Flutter", "Kotlin", "HLS", "MediaCodec", "REST API"]
    },
    {
      name: "Diary/Book Editor Platform",
      description: {
        ru: "Веб-платформа для создания книг с выбором обложки, бумаги, шрифтов. Полноценный редактор как Word с множеством инструментов. Возможность экспорта в PDF. Отдельная админ-панель для управления.",
        en: "Web platform for book creation with cover, paper, and font selection. Full-featured Word-like editor with multiple tools. PDF export capability. Separate admin panel."
      },
      technologies: ["Next.js", "React", "TypeScript", "Supabase", "PDF Generation"]
    },
    {
      name: "SMS Target - Bulk SMS Service",
      description: {
        ru: "Платформа массовой рассылки SMS с множеством фильтров и интеграцией нескольких операторов связи. Система управления кампаниями и аналитика.",
        en: "Bulk SMS platform with advanced filtering and multiple telecom operator integrations. Campaign management and analytics system."
      },
      technologies: ["PHP", "Laravel", "MySQL", "REST API", "JavaScript"]
    },
    {
      name: "ICAP - Medical Website",
      description: {
        ru: "Медицинский веб-сайт на Vue.js с информацией о услугах, записью на приём и личным кабинетом пациентов.",
        en: "Medical website built with Vue.js featuring service information, appointment booking and patient portal."
      },
      technologies: ["Vue.js", "JavaScript", "HTML/CSS", "REST API"]
    },
    {
      name: "Real Estate & Business Websites",
      description: {
        ru: "Разработка сайтов недвижимости, корпоративных сайтов, лендингов и бизнес-сайтов на WordPress. Адаптивная вёрстка, SEO-оптимизация, интеграция форм и CRM.",
        en: "Development of real estate websites, corporate sites, landing pages and business websites using WordPress. Responsive design, SEO optimization, forms and CRM integration."
      },
      technologies: ["WordPress", "PHP", "JavaScript", "HTML/CSS", "MySQL"]
    }
  ]
};

export const uiTranslations = {
  ru: {
    greeting: "Привет! Я AI-ассистент",
    greetingSubtitle: "Спросите меня о навыках, опыте или проектах. Я также могу изменить тему или язык сайта!",
    placeholder: "Напишите сообщение...",
    send: "Отправить",
    experience: "Опыт работы",
    skills: "Навыки",
    projects: "Проекты",
    education: "Образование",
    languages: "Языки",
    contact: "Контакты",
    present: "Настоящее время",
    themeChanged: "Тема изменена!",
    languageChanged: "Язык изменён!",
    askAnything: "Спросите что угодно о моём опыте, навыках или проектах",
    suggestedQuestions: [
      "Расскажи о своём опыте",
      "Какие технологии ты знаешь?",
      "Покажи проекты",
      "Смени тему на светлую",
      "Switch to English"
    ]
  },
  en: {
    greeting: "Hi! I'm an AI Assistant",
    greetingSubtitle: "Ask me about skills, experience, or projects. I can also change the theme or language!",
    placeholder: "Type a message...",
    send: "Send",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    education: "Education",
    languages: "Languages",
    contact: "Contact",
    present: "Present",
    themeChanged: "Theme changed!",
    languageChanged: "Language changed!",
    askAnything: "Ask anything about my experience, skills, or projects",
    suggestedQuestions: [
      "Tell me about your experience",
      "What technologies do you know?",
      "Show me your projects",
      "Switch to dark theme",
      "Переключи на русский"
    ]
  }
};
