import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'http://localhost:8080';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const clientIp = getClientIp(req);

    // 1. Rate Limiting Check: max 3 requests in 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    // Clean up old rate limit records
    try {
      await supabase
        .from('contact_rate_limits')
        .delete()
        .lt('created_at', tenMinutesAgo);
    } catch (err) {
      console.error('Failed to clean up old rate limits:', err);
    }

    // Count recent requests from this IP
    const { count, error: countError } = await supabase
      .from('contact_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip', clientIp)
      .gte('created_at', tenMinutesAgo);

    if (countError) {
      console.error('Error querying rate limit:', countError);
    } else if (count !== null && count >= 3) {
      return new Response(JSON.stringify({
        error: 'Too many requests. Please try again in 10 minutes.',
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Parse and Validate Payload
    let requestData: any;
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, contact, message, website } = requestData;

    // Honeypot check: if website is not empty, ignore bot and return 200 OK
    if (website) {
      console.log(`Honeypot filled by bot from IP ${clientIp}. Silently ignoring.`);
      return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return new Response(JSON.stringify({ error: 'Name is required and must be under 100 characters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
      return new Response(JSON.stringify({ error: 'Message is required and must be under 2000 characters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (contact && (typeof contact !== 'string' || contact.length > 200)) {
      return new Response(JSON.stringify({ error: 'Contact info must be under 200 characters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Log rate limit entry for this request
    const { error: insertError } = await supabase
      .from('contact_rate_limits')
      .insert([{ ip: clientIp }]);

    if (insertError) {
      console.error('Error logging rate limit entry:', insertError);
    }

    // 4. Validate Telegram Credentials
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Send message to Telegram
    const formattedContact = contact && contact.trim().length > 0 ? contact.trim() : 'не указан';
    const telegramMessage = `📩 <b>Новое сообщение с портфолио</b>\n\n👤 <b>Имя:</b> ${name.trim()}\n📞 <b>Контакт:</b> ${formattedContact}\n💬 <b>Сообщение:</b>\n${message.trim()}`;

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

    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
