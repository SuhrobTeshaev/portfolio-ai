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
  certificates?: {
    name: string;
    issuer: string;
    platform: string;
    date: string;
    image?: string;
    fileUrl?: string;
  }[];
  projects: {
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
  }[];
}

import gitImage from '../../public/git.png';
import navbatImage from '../../public/navbat.png';
import asarMobileImage from '../../public/AsarMobile.webp';
import asarStepsImage from '../../public/AsarSteps.webp';
import dearyImage from '../../public/deary.png';
import livoImage from '../../public/livo.png';
import targetHeroImage from '../../public/targetHero.webp';
import targetStartMobileImage from '../../public/targetStartMobile.webp';
import insightImage from '../../public/insight.png';

export const portfolioData: PortfolioData = {
  name: "Тешазода Сухроб",
  title: "Frontend & Mobile Developer",
  location: "Душанбе, Таджикистан",
  email: "suhrobtesha@gmail.com",
  github: "github.com/SuhrobTeshaev",
  linkedin: "linkedin.com/in/suhrob-teshazoda",
  telegram: "https://t.me/suhrobdev",
  summary: {
    ru: "Frontend и Mobile разработчик, специализируюсь на React, Next.js, Vue.js и нативной разработке на Kotlin. Работаю с Flutter для кроссплатформенной разработки. Ориентирован на создание продакшен-решений с фокусом на стабильность и поддержку после релиза.",
    en: "Frontend & Mobile Developer specializing in React, Next.js, Vue.js and native Kotlin development. Working with Flutter for cross-platform development. Focused on production-ready solutions with emphasis on stability and post-release support."
  },
  experience: [
    {
      company: "Livo",
      role: "Frontend & Mobile Developer",
      startDate: "2024-03-01",
      description: {
        ru: "Разработка веб-приложений на React и Next.js. Создание Android приложений на Kotlin. Работа с Flutter для кроссплатформенной разработки. Интеграция REST API, работа с JWT авторизацией и обработка ошибок. Полный цикл публикации приложений в Google Play.",
        en: "Development of web applications using React and Next.js. Building Android applications with Kotlin. Working with Flutter for cross-platform development. REST API integration, JWT authentication and error handling. Full cycle of publishing apps to Google Play."
      },
      technologies: ["React", "Next.js", "Vue.js", "Kotlin", "Flutter", "TypeScript", "Supabase"]
    },
    {
      company: "BOBO Web Studio",
      role: "Frontend Developer Intern",
      startDate: "2024-01-01",
      endDate: "2024-03-01",
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
      institution: "Томский политехнический Университет",
      degree: "Электроэнергетика и электротехника (Системы и сети)",
      period: "2017 - 2021"
    }
  ],
  certificates: [
    {
      name: "Version Control",
      issuer: "Meta / Coursera",
      platform: "Coursera",
      date: "2026",
      image: gitImage
    },
    {
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta / Coursera",
      platform: "Coursera",
      date: "2024",
      image: "/certificates/meta-front-end.jpg",
      fileUrl: "/certificates/meta-front-end.pdf"
    },
    {
      name: "IT Support Professional Certificate",
      issuer: "Google / Coursera",
      platform: "Coursera",
      date: "2023",
      image: "/certificates/google-it-support.jpg",
      fileUrl: "/certificates/google-it-support.pdf"
    }
  ],
  projects: [
    {
      name: "Navbat - Clinic Management System",
      description: {
        ru: "Комплексная система управления клиниками. Админка для партнёров (React), клиентский вебсайт (Next.js), лендинг (Next.js) и клиентское мобильное приложение на Kotlin.",
        en: "Comprehensive clinic management system. Partner admin panel (React), client website (Next.js), landing page (Next.js), and client mobile app built with Kotlin."
      },
      technologies: ["React", "Next.js", "Kotlin", "TypeScript", "Tailwind CSS"],
      link: "https://navbat.tj",
      logo: navbatImage
    },
    {
      name: "Asarfilm - Cinema Platform",
      description: {
        ru: "Мобильное приложение кино-платформы на Flutter с поддержкой HLS стриминга, переключением качества видео и работой с MediaCodec.",
        en: "Mobile cinema platform app built with Flutter featuring HLS streaming, video quality switching and MediaCodec integration."
      },
      technologies: ["Flutter", "Dart", "HLS", "MediaCodec", "REST API"],
      mobileImage: asarMobileImage,
      image: asarStepsImage
    },
    {
      name: "DearyDiary - Book Editor Platform",
      description: {
        ru: "Вебсайт для написания книг с выбором обложки, бумаги, шрифтов. Полноценный редактор (подобный Word) и генерация книги в PDF.",
        en: "Website for writing books with cover, paper, and font selection. Full-featured Word-like editor and PDF generation."
      },
      image: dearyImage,
      technologies: ["Next.js", "React", "TypeScript", "PDF Generation"],
      link: "https://dearydiary.world/",
    },
    {
      name: "Livo - Corporate Website",
      description: {
        ru: "Корпоративный вебсайт, разработанный на Next.js.",
        en: "Corporate website built with Next.js."
      },
      image: livoImage,
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      link: "https://livo.tj"
    },
    {
      name: "smsTarget - Bulk SMS Service",
      description: {
        ru: "Платформа массовой рассылки SMS. Система управления кампаниями, таргетинг и аналитика.",
        en: "Bulk SMS platform. Campaign management system, targeting and analytics."
      },
      technologies: ["React.js", "JavaScript", "REST API", "HTML/CSS"],
      link: "https://sms.colibri.tj",
      image: targetHeroImage,
      mobileImage: targetStartMobileImage
    },
    {
      name: "ICAP",
      description: {
        ru: "Медицинский проект и портал, разработанный с использованием Vue.js.",
        en: "Medical project and portal developed using Vue.js."
      },
      technologies: ["Vue.js", "JavaScript", "HTML/CSS", "REST API"]
    },
    {
      name: "Insight Center",
      description: {
        ru: "Сайт детской клиники на WordPress. Информация о различных процедурах (войта, логопедия и т.д.), адаптивный дизайн.",
        en: "Children's clinic website on WordPress. Information about various procedures (Voita, speech therapy, etc.), responsive design."
      },
      image: insightImage,
      technologies: ["WordPress", "PHP", "HTML/CSS", "MySQL"],
      link: "https://insightcenter.tj"
    },
    {
      name: "Landing Pages & Admin Panels",
      description: {
        ru: "Множество небольших сайтов: от лендингов до админ-панелей, сайтов недвижимости и туристических платформ.",
        en: "Multiple smaller websites: from landing pages to admin panels, real estate sites, and travel platforms."
      },
      technologies: ["React", "Vue.js", "WordPress", "HTML/CSS", "JavaScript"]
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
    certificates: "Сертификаты",
    present: "Настоящее время",
    themeChanged: "Тема изменена!",
    languageChanged: "Язык изменён!",
    askAnything: "Спросите что угодно о моём опыте, навыках или проектах",
    showMore: "Показать еще",
    showLess: "Свернуть",
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
    certificates: "Certificates",
    present: "Present",
    themeChanged: "Theme changed!",
    languageChanged: "Language changed!",
    askAnything: "Ask anything about my experience, skills, or projects",
    showMore: "Show more",
    showLess: "Show less",
    suggestedQuestions: [
      "Tell me about your experience",
      "What technologies do you know?",
      "Show me your projects",
      "Switch to dark theme",
      "Переключи на русский"
    ]
  }
};
