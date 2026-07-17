// @ts-expect-error: Deno URL imports are not recognized by standard TypeScript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: { env: { get: (key: string) => string | undefined } };

// Get allowed origin from environment, default to localhost for development
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'http://localhost:8080';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Simple in-memory rate limiter (in production, use Supabase or Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientIp: string, maxRequests = 5, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
}

const portfolioContext = `
# AI Assistant for Developer Portfolio

You are a smart, friendly AI assistant representing Teshazoda Suhrob (Frontend & Mobile Developer). 

## YOUR PRIMARY MISSION:
1. Help users learn about Suhrob's skills, projects, and experience.
2. **DETECT PROJECT REQUESTS**: If a user describes a project they want to build (e.g., "I want an app for...", "I need a website that..."), you MUST generate a detailed Technical Specification (TZ).

## CRITICAL RULES:
1. ALWAYS understand the USER'S INTENT.
2. Respond in the SAME LANGUAGE the user writes in.
3. If the user asks about something else (like weather), be polite and helpful, but try to bring the conversation back to the portfolio naturally if possible.
4. Answer ONLY what is asked. Never mention years of experience, work history, or the full skills list unless the user's question is specifically about that.
5. Do NOT repeat previously stated facts (like duration of experience) in follow-up messages unless the user explicitly asks again.
6. When discussing a specific project, mention ONLY that project's own tech stack and description — do not append general profile info, work history, or experience duration.
7. Keep answers concise and directly relevant to the question asked.

## PROJECT REQUEST HANDLING (LEAD GENERATION):
If the user describes a project:
1. Start with "TECHNICAL SPECIFICATION GENERATED" (this is a signal for the system).
2. Create a clear, detailed TZ (Техническое задание) including:
   - Project Overview
   - Recommended Technology Stack (Suhrob specializes in React, Next.js, Kotlin, Flutter)
   - Suggested Libraries and Tools
   - Potential Optimizations
   - Deployment Recommendations
3. Tell the user: "I've generated a technical specification for your project and sent it directly to Suhrob. He will review it and get back to you soon!"

## DEVELOPER PROFILE:
- Name: Тешазода Сухроб (Teshazoda Suhrob)
- Role: Frontend & Mobile Developer
- Location: Dushanbe, Tajikistan
- Contacts: Telegram https://t.me/suhrobdev, GitHub github.com/SuhrobTeshaev

## WORK HISTORY (mention only if the user asks about experience/background):
- Livo (since March 2024) — Frontend & Mobile Developer. Stack: React, Next.js, Vue.js, Kotlin, Flutter, TypeScript, Supabase. Built web and Android apps, REST API integration, JWT auth, published apps to Google Play.
- BOBO Web Studio (Jan–Mar 2024) — Frontend Developer Intern. Stack: React, Vue.js, MUI.

## SKILLS (mention only the relevant category if asked, never the full list unprompted):
- Frontend: React, Next.js, Vue.js, TypeScript, JavaScript, HTML/CSS
- Mobile: Android (Kotlin), Flutter, HLS, MediaCodec, Google Play Publishing
- Backend & CMS: Laravel, PHP, WordPress, MySQL, REST API
- UI Libraries: MUI, Tailwind CSS, Framer Motion
- Tools: Git, JWT, Postman, Figma

## PROJECTS (describe only the ones the user asks about, using only that project's own stack/description):
- Navbat B2B — clinic management admin panel (React, TypeScript, Tailwind CSS)
- Navbat B2C — client booking website (Next.js, TypeScript, Tailwind CSS)
- Navbat B2C app — client booking Android app (Kotlin, REST API)
- Asarfilm — Flutter cinema app with HLS streaming and MediaCodec (Flutter, Dart, HLS, MediaCodec, REST API)
- DearyDiary — book editor with PDF export (Next.js, React, TypeScript, PDF Generation)
- Livo — corporate website (Next.js, React, TypeScript, Tailwind CSS)
- smsTarget — bulk SMS platform (React.js, JavaScript, REST API)
- ICAP — medical portal (Vue.js, JavaScript, REST API)
- Insight Center — children's clinic website (WordPress, PHP, MySQL)
- Elite Glass — company website (React, Tailwind CSS, TypeScript)
`;

async function sendTelegramNotification(message: string) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

  if (!token || !chatId) {
    console.error('Telegram credentials missing');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
    }
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check rate limit
    const clientIp = getClientIp(req);
    const rateLimitCheck = checkRateLimit(clientIp, 5, 60000);

    if (!rateLimitCheck.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded. Please try again in a minute.',
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate input
    let requestData: {
      messages: { role: string; content: string }[];
      currentTheme: string;
      currentLanguage: string;
    };
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages, currentTheme, currentLanguage } = requestData;

    // Validate required fields
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or empty messages' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid message format' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (msg.role === 'user' && msg.content.length > 2000) {
        return new Response(JSON.stringify({ error: 'Message too long (max 2000 chars)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Validate theme and language
    if (!['light', 'dark'].includes(currentTheme)) {
      return new Response(JSON.stringify({ error: 'Invalid theme' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!['ru', 'en'].includes(currentLanguage)) {
      return new Response(JSON.stringify({ error: 'Invalid language' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let action: { type: string; value: string } | null = null;

    // Theme and Language detection
    const darkPatterns = ['темн', 'dark', 'ночн', 'чёрн', 'черн'];
    const lightPatterns = ['светл', 'light', 'дневн', 'бел', 'яркий'];
    const englishPatterns = ['english', 'англ', 'по-английски', 'in english'];
    const russianPatterns = ['русск', 'russian', 'по-русски', 'на русском'];

    if (darkPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('тем') || lastMessage.includes('theme'))) {
      action = { type: 'theme', value: 'dark' };
    } else if (lightPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('тем') || lastMessage.includes('theme'))) {
      action = { type: 'theme', value: 'light' };
    } else if (englishPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('язык') || lastMessage.includes('switch'))) {
      action = { type: 'language', value: 'en' };
    } else if (russianPatterns.some(p => lastMessage.includes(p)) && (lastMessage.includes('язык') || lastMessage.includes('switch'))) {
      action = { type: 'language', value: 'ru' };
    }

    const systemMessage = `${portfolioContext}

## CURRENT STATE:
- Theme: ${currentTheme}
- Language: ${currentLanguage}
- If theme/language change was requested, confirm it.

Remember: Be concise, technical where needed, and ALWAYS helpful.`;

    const trimmedMessages = messages.slice(-10);

    const geminiMessages = [
      { role: 'user', parts: [{ text: systemMessage }] },
      { role: 'model', parts: [{ text: 'Understood. I am Teshazoda Suhrob\'s AI assistant. I will handle portfolio info and generate technical specifications for project requests.' }] },
      ...trimmedMessages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    ];

    const models = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    let response;
    let lastError;
    let usedModel;

    for (const model of models) {
      try {
        console.log(`Attempting to use model: ${model}`);
        // Use v1beta for gemini-1.5 and gemini-2.0
        const apiVersion = 'v1beta';
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 700,
            },
          }),
        });

        if (response.ok) {
          usedModel = model;
          break;
        } else {
          const errorText = await response.text();
          console.warn(`Model ${model} (${apiVersion}) failed with status ${response.status}: ${errorText}`);
          lastError = { status: response.status, text: errorText };
        }
      } catch (err) {
        console.warn(`Network/Unexpected error with model ${model}:`, err);
        lastError = { status: 500, text: String(err) };
      }
    }

    if (!response || !response.ok) {
      console.error('All Gemini models failed. Last error:', lastError);
      const status = lastError?.status || 500;
      const errorMsg = lastError?.text || 'Unknown error';

      return new Response(JSON.stringify({
        error: `All AI models failed. Last error: ${status} - ${errorMsg}`,
        response: currentLanguage === 'ru'
          ? `Извините, сейчас серверы перегружены. Попробуйте позже.`
          : `Sorry, servers are currently overloaded. Please try again later.`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Detect TZ and notify Suhrob
    if (aiResponse.includes('TECHNICAL SPECIFICATION GENERATED')) {
      const tzContent = aiResponse.split('TECHNICAL SPECIFICATION GENERATED')[1]?.trim();
      const notificationText = `<b>🚀 New Project Request!</b>\n\n<b>User message:</b>\n<i>${messages[messages.length - 1]?.content}</i>\n\n<b>Generated TZ:</b>\n${tzContent}`;
      await sendTelegramNotification(notificationText);
    }

    return new Response(JSON.stringify({ response: aiResponse.replace('TECHNICAL SPECIFICATION GENERATED', '').trim(), action }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
