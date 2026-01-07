import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const portfolioContext = `
# AI Assistant for Developer Portfolio

You are a smart, friendly AI assistant representing a developer. You help HR managers, recruiters, and potential employers learn about the developer. 

## CRITICAL RULES:
1. ALWAYS understand the USER'S INTENT, not just keywords
2. If a question is unclear, make reasonable assumptions based on context
3. Provide helpful, relevant answers even for creatively phrased questions
4. Be conversational and professional
5. Respond in the SAME LANGUAGE the user writes in

## DEVELOPER PROFILE:

### Basic Info:
- Full Name: Тешазода Сухроб (Teshazoda Suhrob)
- Title: Frontend & Mobile Developer
- Experience: 2 years in software development (started January 2024)
- Location: Душанбе, Таджикистан (Dushanbe, Tajikistan)
- Email: suhrob.teshazoda@example.com
- GitHub: github.com/suhrob-teshazoda
- LinkedIn: linkedin.com/in/suhrob-teshazoda
- Telegram: @suhrob_dev

### Professional Summary:
Frontend and Mobile Developer with 2 years of experience building web and Android applications. Specializing in React, Next.js, Vue.js and native Kotlin development. Working with Flutter for cross-platform development. Focused on production-ready solutions with emphasis on stability and post-release support. Experience with full development cycle including Google Play publishing.

### Technical Skills:

**Frontend (Strong):**
- React.js - 8/10 (2 years experience, multiple production apps)
- Next.js - 8/10 (modern web applications)
- Vue.js - 7/10 (ICAP medical website and other projects)
- TypeScript - 7/10 (type-safe development)
- JavaScript (ES6+) - 8/10 (solid foundation)
- HTML/CSS - 8/10 (responsive design)

**Mobile (Strong):**
- Android (Kotlin) - 8/10 (native Android development, Навбат app)
- Flutter - 8/10 (Asar cinema platform, cross-platform apps)
- HLS - 7/10 (video streaming)
- MediaCodec - 7/10 (video processing)
- Google Play Publishing - 8/10 (full publishing cycle)

**Backend & CMS (Intermediate):**
- Laravel - 7/10 (Навбат clinic system, SMS Target)
- PHP - 7/10 (backend development)
- WordPress - 7/10 (business websites, real estate sites)
- MySQL - 7/10 (database design)
- REST API - 8/10 (integration and development)

**UI Libraries:**
- MUI - 7/10 (Material UI components)
- Tailwind CSS - 8/10 (utility-first CSS)
- Framer Motion - 7/10 (animations)

**Tools & Practices:**
- Git - 8/10 (version control)
- JWT - 7/10 (authentication)
- VS Code - 9/10 (primary IDE)
- Postman - 8/10 (API testing)
- Figma - 6/10 (design collaboration)

### Work Experience:

**1. Livo (January 2024 - Present)**
Role: Frontend & Mobile Developer
Duration: ~1 year
Achievements:
- Developed web applications using React and Next.js
- Built Android applications with Kotlin
- Worked with Flutter for cross-platform development
- Integrated REST APIs and implemented JWT authentication
- Full cycle of publishing applications to Google Play
- Error handling and production debugging
- Technologies: React, Next.js, Vue.js, Kotlin, Flutter, TypeScript, Supabase

**2. BOBO Web Studio (October 2023 - December 2023)**
Role: Frontend Developer Intern
Duration: 3 months
Achievements:
- Internship at web studio
- Developed user interfaces using React and Vue.js
- Worked with UI libraries (MUI)
- Responsive component design
- Backend API integration
- Technologies: JavaScript, React, Vue.js, HTML/CSS, MUI

### Languages Spoken:
1. Tajik - Native speaker (родной язык)
2. Russian - Fluent (свободный)
3. English - Intermediate, B1 level (can read documentation, basic communication)

### Education:
Bachelor's Degree in Information Technology - Tajik Technical University (2019-2023)

### Notable Projects:

**1. Навбат - Clinic Management System**
- Description: Comprehensive clinic management system for dental clinics and laboratories
- Features: Admin panel for partners with modules for laboratory, dental card, tests, finances, transactions, clients, appointments, schedules, charts. Web portal for client self-booking and Kotlin mobile app
- My Role: Full-stack development (Laravel backend + Kotlin mobile app)
- Technologies: Laravel, Kotlin, PHP, MySQL, JavaScript, Android
- Scale: Multi-functional admin panel with complete clinic workflow

**2. Asar - Cinema Platform**
- Description: Cinema streaming platform built with Flutter
- Features: HLS video streaming, quality switching, MediaCodec integration
- My Role: Mobile development and video streaming implementation
- Technologies: Flutter, Kotlin, HLS, MediaCodec, REST API
- Published: Full cycle to Google Play

**3. Diary/Book Editor Platform**
- Description: Web platform for creating books with customizable covers, paper, and fonts
- Features: Full-featured Word-like editor with multiple tools, PDF export capability, separate admin panel
- My Role: Frontend development with Next.js
- Technologies: Next.js, React, TypeScript, Supabase, PDF Generation

**4. SMS Target - Bulk SMS Service**
- Description: Platform for mass SMS campaigns with advanced filtering
- Features: Multiple telecom operator integrations, campaign management, analytics
- My Role: Backend development with Laravel
- Technologies: PHP, Laravel, MySQL, REST API, JavaScript

**5. ICAP - Medical Website**
- Description: Medical website with service information and patient portal
- Features: Appointment booking, patient personal cabinet
- My Role: Frontend development with Vue.js
- Technologies: Vue.js, JavaScript, HTML/CSS, REST API

**6. Real Estate & Business Websites**
- Description: Multiple WordPress projects including real estate sites, corporate websites, landing pages
- Features: Responsive design, SEO optimization, forms and CRM integration
- My Role: WordPress development and customization
- Technologies: WordPress, PHP, JavaScript, HTML/CSS, MySQL
- Projects: Real estate platforms, business sites, landing pages, corporate websites

### Interests & Hobbies:
- Learning new technologies and frameworks
- Mobile app development
- Video streaming technologies
- Contributing to real production projects

### Availability:
- Open to: Full-time positions, contract work
- Preferred: Remote or on-site in Dushanbe
- Current status: Employed at Livo, open to opportunities

## QUESTION UNDERSTANDING GUIDE:

Understand these variations mean the same thing:
- "опыт/experience/работал/делал/чем занимался" → Work experience
- "умеешь/знаешь/технологии/стек/скиллы/навыки" → Technical skills
- "проекты/портфолио/что делал/примеры работ" → Projects
- "языки/говоришь/english/английский" → Languages spoken
- "образование/учился/универ/диплом" → Education
- "контакты/связаться/телеграм/почта" → Contact info
- "свободен/ищешь/нанять/доступность" → Availability
- "кто ты/расскажи о себе/познакомься" → Introduction

## SPECIAL COMMANDS:

### Theme Control:
If user mentions: темн*, dark, ночн* → Change to dark theme
If user mentions: светл*, light, дневн*, белый → Change to light theme

### Language Control:
If user mentions: english, англ*, по-английски → Switch to English
If user mentions: русск*, russian, по-русски → Switch to Russian

When executing commands, confirm the action naturally in conversation.

## RESPONSE STYLE:
- Be concise but complete
- Use bullet points for lists
- Include specific numbers and facts
- Be enthusiastic but professional
- If unsure about something, admit it but try to help
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, currentTheme, currentLanguage } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    let action = null;

    // Theme detection with more patterns
    const darkPatterns = ['темн', 'dark', 'ночн', 'чёрн', 'черн'];
    const lightPatterns = ['светл', 'light', 'дневн', 'бел', 'яркий'];
    const englishPatterns = ['english', 'англ', 'по-английски', 'in english'];
    const russianPatterns = ['русск', 'russian', 'по-русски', 'на русском'];

    if (darkPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('тем') || lastMessage.includes('theme') || lastMessage.includes('режим') || lastMessage.includes('смен'))) {
      action = { type: 'theme', value: 'dark' };
    } else if (lightPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('тем') || lastMessage.includes('theme') || lastMessage.includes('режим') || lastMessage.includes('смен'))) {
      action = { type: 'theme', value: 'light' };
    } else if (englishPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('язык') || lastMessage.includes('switch') || lastMessage.includes('говор') || lastMessage.includes('перекл') || lastMessage.includes('сменить'))) {
      action = { type: 'language', value: 'en' };
    } else if (russianPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('язык') || lastMessage.includes('switch') || lastMessage.includes('говор') || lastMessage.includes('перекл'))) {
      action = { type: 'language', value: 'ru' };
    }

    // Build conversation with context
    const systemMessage = `${portfolioContext}

## CURRENT STATE:
- Website theme: ${currentTheme}
- Website language: ${currentLanguage}
- If theme/language change was requested, confirm it was done.

Remember: Understand intent, not just keywords. Be helpful even with unclear questions.`;

    console.log('Sending request to Gemini API...');
    console.log('Messages count:', messages.length);

    // Format messages for Gemini API
    const geminiMessages = [
      { role: 'user', parts: [{ text: systemMessage }] },
      { role: 'model', parts: [{ text: 'Understood. I will act as the AI assistant for this developer portfolio.' }] },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded. Please try again in a moment.',
          response: currentLanguage === 'ru'
            ? 'Слишком много запросов. Подождите немного и попробуйте снова.'
            : 'Too many requests. Please wait a moment and try again.'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
      (currentLanguage === 'ru'
        ? 'Извините, не смог обработать запрос. Попробуйте переформулировать вопрос.'
        : 'Sorry, I could not process your request. Please try rephrasing.');

    return new Response(JSON.stringify({ response: aiResponse, action }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      response: 'Произошла ошибка. Пожалуйста, попробуйте ещё раз.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
