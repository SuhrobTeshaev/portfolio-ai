import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { createHash } from 'crypto';

// Yandex Metrika hosts (incl. Webvisor), per https://yandex.com/support/metrica/en/code/install-counter-csp
const YANDEX_HOSTS = [
  ...['ru', 'az', 'by', 'co.il', 'com', 'com.am', 'com.ge', 'com.tr', 'ee', 'fr', 'kg', 'kz', 'lt', 'lv', 'md', 'tj', 'tm', 'uz'].map(
    (tld) => `mc.yandex.${tld}`
  ),
  'mc.webvisor.com',
  'mc.webvisor.org',
];
const YANDEX_HTTPS = YANDEX_HOSTS.map((h) => `https://${h}`);
const YANDEX_WSS = YANDEX_HOSTS.map((h) => `wss://${h}`);
const TURNSTILE = 'https://challenges.cloudflare.com';

/**
 * Injects a Content-Security-Policy <meta> into the built index.html (GitHub Pages
 * can't send headers). Build-only: the dev server relies on inline scripts for HMR.
 * Inline scripts (the Metrika snippet) are allowed by hash, not 'unsafe-inline'.
 */
function cspPlugin(supabaseUrl: string | undefined): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
          // JSON-LD is data, not script — CSP doesn't apply to it
          .filter(([, attrs]) => !attrs.includes('application/ld+json'))
          .map(([, , body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`);

        const supabase = supabaseUrl ? new URL(supabaseUrl).origin : 'https://*.supabase.co';

        const policy = [
          "default-src 'self'",
          ["script-src 'self'", ...inlineScripts, TURNSTILE, 'https://yastatic.net', ...YANDEX_HTTPS].join(' '),
          // 'unsafe-inline' for styles: React/framer-motion set style attributes
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          ["img-src 'self' data: blob:", ...YANDEX_HTTPS].join(' '),
          ["connect-src 'self'", supabase, 'https://yastatic.net', ...YANDEX_HTTPS, ...YANDEX_WSS].join(' '),
          ['frame-src blob:', TURNSTILE, ...YANDEX_HTTPS].join(' '),
          ['child-src blob:', TURNSTILE, ...YANDEX_HTTPS].join(' '),
          "worker-src 'self' blob:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          'upgrade-insecure-requests',
        ].join('; ');

        return html.replace(
          /<meta charset="UTF-8" \/>/,
          (charset) => `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`
        );
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    server: {
      host: '::',
      port: 8080,
    },
    plugins: [react(), cspPlugin(env.VITE_SUPABASE_URL)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: '/portfolio-ai/',
  };
});
