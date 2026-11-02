import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedQuestions } from './SuggestedQuestions';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { portfolioData, uiTranslations } from '@/lib/portfolioData';
import { getTotalExperience } from '@/lib/dateUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTurnstile } from '@/hooks/useTurnstile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWindow() {
  const { language, setTheme, setLanguage, theme } = useThemeLanguage();
  const t = uiTranslations[language];

  const [messages, setMessages] = useState<Message[]>([]);
  const [turnstileRef, getTurnstileToken] = useTurnstile();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleAction = (action: { type: string; value?: string }) => {
    if (action.type === 'theme') {
      const newTheme = action.value as 'light' | 'dark';
      setTheme(newTheme);
      toast.success(t.themeChanged);
    } else if (action.type === 'language') {
      const newLang = action.value as 'ru' | 'en';
      setLanguage(newLang);
      toast.success(uiTranslations[newLang].languageChanged);
    }
  };

  const getLocalAiResponse = (query: string, lang: 'ru' | 'en') => {
    // Match whole words / word stems — substring checks made 'experience' trigger the 'en' language switch
    const words = query.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    const has = (...stems: string[]) => stems.some((s) => words.some((w) => w.startsWith(s)));
    const is = (...exact: string[]) => exact.some((e) => words.includes(e));

    // Theme controls
    if (has('светл', 'light')) {
      return {
        response: lang === 'ru' ? 'Переключаю тему на светлую! ☀️' : 'Switching to light theme! ☀️',
        action: { type: 'theme', value: 'light' },
      };
    }
    if (has('тёмн', 'темн', 'dark')) {
      return {
        response: lang === 'ru' ? 'Переключаю тему на тёмную! 🌙' : 'Switching to dark theme! 🌙',
        action: { type: 'theme', value: 'dark' },
      };
    }

    // Language controls
    if (has('english', 'англ') || is('en')) {
      return {
        response: 'Switching language to English! 🇬🇧',
        action: { type: 'language', value: 'en' },
      };
    }
    if (has('русск', 'russian') || is('ru')) {
      return {
        response: 'Переключаю язык на русский! 🇷🇺',
        action: { type: 'language', value: 'ru' },
      };
    }

    // Experience
    if (has('опыт', 'experience', 'раб', 'work')) {
      return {
        response:
          lang === 'ru'
            ? `Сухроб — Frontend & Mobile разработчик, опыт: ${getTotalExperience(portfolioData.experience, lang)}.\n• Livo (Frontend & Mobile Developer): React, Next.js, Vue.js, Kotlin, Flutter.\n• BOBO Web Studio (Frontend Intern): React, Vue.js, UI библиотеки.\nОриентирован на создание стабильных продакшен-решений!`
            : `Suhrob is a Frontend & Mobile Developer with ${getTotalExperience(portfolioData.experience, lang)} of experience.\n• Livo (Frontend & Mobile Developer): React, Next.js, Vue.js, Kotlin, Flutter.\n• BOBO Web Studio (Frontend Intern): React, Vue.js, UI libraries.\nFocused on production-ready solutions and post-release support!`,
      };
    }

    // Skills
    if (has('навык', 'skill', 'стек', 'stack', 'технол')) {
      return {
        response:
          lang === 'ru'
            ? `Стек технологий:\n• Frontend: React, Next.js, Vue.js, TypeScript, Tailwind CSS, MUI\n• Mobile: Kotlin (Native Android), Flutter\n• Backend & CMS: Laravel, PHP, WordPress, Supabase, REST API\n• Инструменты: Git, Figma, Postman`
            : `Tech Stack:\n• Frontend: React, Next.js, Vue.js, TypeScript, Tailwind CSS, MUI\n• Mobile: Kotlin (Native Android), Flutter\n• Backend & CMS: Laravel, PHP, WordPress, Supabase, REST API\n• Tools: Git, Figma, Postman`,
      };
    }

    // Projects
    if (has('проект', 'project')) {
      return {
        response:
          lang === 'ru'
            ? `Главные проекты Сухроба:\n1. Navbat (B2B / B2C) — Медицинская система управления клиниками и Android приложение.\n2. Asarfilm — Cinema платформа на Flutter с HLS стримингом.\n3. DearyDiary — Редактор книг с выбором обложек и генерацией PDF.\n4. Livo — Корпоративный сайт на Next.js.\n\nПет-проекты (в разработке):\n• Снежок — тайны гор — детская Android-игра со своим 3D-персонажем, готова первая миссия (Kotlin, Compose, Filament).\n• Life OS — тайм-менеджмент: задачи, привычки, фокус-таймер, финансы, английский.\n• Туй — платформа «Свадьба под ключ» (Next.js, Laravel).\n• SAFYCLO — магазин и цех дома modest-одежды (Next.js, Laravel).`
            : `Key projects built by Suhrob:\n1. Navbat (B2B / B2C) — Clinic management platform & Android app.\n2. Asarfilm — Cinema streaming platform in Flutter with HLS.\n3. DearyDiary — Word-like book editor with PDF generator.\n4. Livo — Corporate website built with Next.js.\n\nPet projects (in progress):\n• Snowok — kids' Android game with a custom 3D character, first mission playable (Kotlin, Compose, Filament).\n• Life OS — time management: tasks, habits, focus timer, finances, English.\n• Tuy — turnkey wedding platform (Next.js, Laravel).\n• SAFYCLO — store and workshop for a modest-fashion house (Next.js, Laravel).`,
      };
    }

    // Contact
    if (has('контакт', 'contact', 'напис', 'связат', 'telegram', 'email')) {
      return {
        response:
          lang === 'ru'
            ? `Связаться с Сухробом:\n• Telegram: https://t.me/suhrobdev\n• Email: suhrobtesha@gmail.com\n• GitHub: github.com/SuhrobTeshaev\n• LinkedIn: linkedin.com/in/suhrob-teshazoda`
            : `You can reach out to Suhrob via:\n• Telegram: https://t.me/suhrobdev\n• Email: suhrobtesha@gmail.com\n• GitHub: github.com/SuhrobTeshaev\n• LinkedIn: linkedin.com/in/suhrob-teshazoda`,
      };
    }

    // Default friendly response
    return {
      response:
        lang === 'ru'
          ? `Я AI-ассистент портфолио Сухроба! Задайте любой вопрос об опыте работы, навыках, проектах или контактах, либо попросите сменить тему или язык сайта.`
          : `I'm Suhrob's Portfolio AI Assistant! Ask me anything about work experience, skills, projects, contact info, or ask to change the site theme or language.`,
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const turnstileToken = await getTurnstileToken();
      const { data, error } = await supabase.functions.invoke('portfolio-chat', {
        body: {
          // Server rejects long histories and only uses the last 10 messages anyway
          messages: [...messages, userMessage].slice(-10),
          turnstileToken,
          currentTheme: theme,
          currentLanguage: language,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });

      if (error) throw error;

      if (data.action) {
        handleAction(data.action);
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.warn('Supabase edge function unreachable, using local AI fallback:', error);
      const localResult = getLocalAiResponse(text, language);
      if (localResult.action) {
        handleAction(localResult.action);
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: localResult.response }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center glow-effect ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.greeting}</h3>
                  <p className="text-xs text-muted-foreground">{t.askAnything}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">{t.greetingSubtitle}</p>
                  <SuggestedQuestions
                    questions={t.suggestedQuestions}
                    onSelect={handleSuggestedQuestion}
                  />
                </div>
              )}

              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  isLatest={index === messages.length - 1}
                />
              ))}

              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {/* Turnstile shows a challenge here only if Cloudflare needs interaction */}
            <div ref={turnstileRef} className="flex justify-center empty:hidden" />

            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  className="flex-1 ym-disable-keys ym-hide-content"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
