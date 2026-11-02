/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  /** Cloudflare Turnstile site key — optional, bot check is skipped when empty */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}
