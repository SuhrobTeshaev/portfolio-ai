import { useCallback, useEffect, useRef } from 'react';

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TOKEN_TIMEOUT_MS = 15_000;

let scriptPromise: Promise<TurnstileApi> | null = null;

// Loads the Cloudflare script once, on first use — no third-party JS until it's needed
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () =>
        window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing'));
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error('Failed to load Turnstile'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * Invisible Cloudflare Turnstile. Returns [containerRef, getToken]:
 * attach the ref to an empty div (a challenge appears there only if Cloudflare
 * needs interaction), and await getToken() before each protected request.
 * getToken() resolves null when Turnstile isn't configured or fails — the
 * server decides whether that is acceptable.
 */
export function useTurnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<{ id: string; container: HTMLElement } | null>(null);
  const pendingRef = useRef<((token: string | null) => void) | null>(null);

  const settle = (token: string | null) => {
    pendingRef.current?.(token);
    pendingRef.current = null;
  };

  const getToken = useCallback(async (): Promise<string | null> => {
    const container = containerRef.current;
    if (!SITE_KEY || !container) return null;

    let api: TurnstileApi;
    try {
      api = await loadTurnstile();
    } catch (err) {
      console.warn(err);
      return null;
    }

    // Re-render if the container was remounted (e.g. chat window reopened)
    if (widgetRef.current && widgetRef.current.container !== container) {
      api.remove(widgetRef.current.id);
      widgetRef.current = null;
    }

    return new Promise<string | null>((resolve) => {
      settle(null);
      pendingRef.current = resolve;
      setTimeout(() => settle(null), TOKEN_TIMEOUT_MS);

      if (!widgetRef.current) {
        const id = api.render(container, {
          sitekey: SITE_KEY,
          execution: 'execute',
          appearance: 'interaction-only',
          callback: (token: string) => settle(token),
          'error-callback': () => settle(null),
          'expired-callback': () => settle(null),
        });
        widgetRef.current = { id, container };
      } else {
        // Tokens are single-use — reset before asking for a new one
        api.reset(widgetRef.current.id);
      }
      api.execute(widgetRef.current.id);
    });
  }, []);

  useEffect(
    () => () => {
      if (widgetRef.current) window.turnstile?.remove(widgetRef.current.id);
      settle(null);
    },
    []
  );

  return [containerRef, getToken] as const;
}
