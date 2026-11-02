// @ts-expect-error: Deno URL imports are not recognized by standard TypeScript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error: Deno URL imports are not recognized by standard TypeScript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { escapeHtml, getClientIp, isRateLimited, jsonResponse, corsHeaders, verifyTurnstile } from '../_shared/security.ts';

declare const Deno: { env: { get: (key: string) => string | undefined } };

// max 3 messages per IP in 10 minutes, 30 from everyone
const CONTACT_LIMIT = { windowMs: 10 * 60_000, perIp: 3, global: 30 };

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const clientIp = getClientIp(req);

    // 1. Parse and Validate Payload
    let requestData: { name?: unknown; contact?: unknown; message?: unknown; website?: unknown; turnstileToken?: unknown };
    try {
      requestData = await req.json();
    } catch (e) {
      return jsonResponse({ error: 'Invalid JSON' }, 400);
    }

    const { name, contact, message, website, turnstileToken } = requestData;

    // Honeypot check: if website is not empty, ignore bot and return 200 OK
    if (website) {
      console.log(`Honeypot filled by bot from IP ${clientIp ?? 'unknown'}. Silently ignoring.`);
      return jsonResponse({ success: true, message: 'Message sent successfully' });
    }

    // Validation
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return jsonResponse({ error: 'Name is required and must be under 100 characters.' }, 400);
    }

    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
      return jsonResponse({ error: 'Message is required and must be under 2000 characters.' }, 400);
    }

    if (contact != null && contact !== '' && (typeof contact !== 'string' || contact.length > 200)) {
      return jsonResponse({ error: 'Contact info must be under 200 characters.' }, 400);
    }

    if (!(await verifyTurnstile(turnstileToken, clientIp))) {
      return jsonResponse({ error: 'Bot verification failed' }, 403);
    }

    // 2. Rate limiting — only valid submissions count
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    if (await isRateLimited(supabase, 'contact', clientIp, CONTACT_LIMIT)) {
      return jsonResponse({ error: 'Too many requests. Please try again in 10 minutes.' }, 429);
    }

    // 3. Validate Telegram Credentials
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured');
      return jsonResponse({ error: 'Server configuration error.' }, 500);
    }

    // 4. Send message to Telegram
    const formattedContact =
      typeof contact === 'string' && contact.trim().length > 0 ? contact.trim() : 'не указан';
    const telegramMessage = `📩 <b>Новое сообщение с портфолио</b>\n\n👤 <b>Имя:</b> ${escapeHtml(name.trim())}\n📞 <b>Контакт:</b> ${escapeHtml(formattedContact)}\n💬 <b>Сообщение:</b>\n${escapeHtml(message.trim())}`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
      throw new Error('Failed to send message to Telegram.');
    }

    return jsonResponse({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return jsonResponse({ error: 'Internal server error.' }, 500);
  }
});
