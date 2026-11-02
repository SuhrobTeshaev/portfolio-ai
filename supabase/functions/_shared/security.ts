// Shared helpers for the public (verify_jwt = false) edge functions.

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- supabase-js is imported from esm.sh, no local types
type SupabaseClient = any;

declare const Deno: { env: { get: (key: string) => string | undefined } };

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'http://localhost:8080';

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Telegram parse_mode HTML rejects raw <, > and & — escape all untrusted text
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Verifies a Cloudflare Turnstile token. Disabled (always true) until
 * TURNSTILE_SECRET_KEY is set, so the site keeps working before setup.
 * Missing/invalid tokens fail closed; a Cloudflare outage fails open.
 */
export async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) return true;
  if (typeof token !== 'string' || !token || token.length > 2048) return false;

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    if (!data.success) console.warn('Turnstile rejected token:', data['error-codes']);
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verification unavailable:', err);
    return true;
  }
}

/**
 * The first x-forwarded-for entry is client-controlled, so prefer headers set by
 * the proxy. Spoofing is still possible in theory — global caps below bound the damage.
 */
export function getClientIp(req: Request): string | null {
  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0];
  return ip?.trim() || null;
}

export interface RateLimitRule {
  windowMs: number;
  /** Max requests per IP inside the window */
  perIp: number;
  /** Max requests from everyone inside the window — caps abuse even with spoofed IPs */
  global: number;
}

const RETENTION_MS = 24 * 60 * 60 * 1000;

/**
 * Persistent rate limiter backed by `edge_rate_limits` (survives cold starts,
 * unlike an in-memory Map). Records the hit when allowed. Fails open on DB errors.
 */
export async function isRateLimited(
  supabase: SupabaseClient,
  scope: string,
  ip: string | null,
  rule: RateLimitRule
): Promise<boolean> {
  const since = new Date(Date.now() - rule.windowMs).toISOString();

  try {
    await supabase
      .from('edge_rate_limits')
      .delete()
      .lt('created_at', new Date(Date.now() - RETENTION_MS).toISOString());

    const { count: globalCount, error: globalError } = await supabase
      .from('edge_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('scope', scope)
      .gte('created_at', since);
    if (globalError) throw globalError;
    if ((globalCount ?? 0) >= rule.global) return true;

    // Requests without an IP share one bucket, so they only get the global cap
    if (ip) {
      const { count: ipCount, error: ipError } = await supabase
        .from('edge_rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('scope', scope)
        .eq('ip', ip)
        .gte('created_at', since);
      if (ipError) throw ipError;
      if ((ipCount ?? 0) >= rule.perIp) return true;
    }

    const { error: insertError } = await supabase
      .from('edge_rate_limits')
      .insert([{ scope, ip: ip ?? 'unknown' }]);
    if (insertError) throw insertError;
  } catch (err) {
    console.error(`Rate limit check failed for scope "${scope}":`, err);
  }

  return false;
}
