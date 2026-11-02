const HEADER_OFFSET = 80;
const MAX_ATTEMPTS = 5;

/**
 * Smooth-scrolls to a section, then re-aligns while lazy sections above it
 * load and grow past their skeleton height (otherwise the scroll undershoots).
 */
export function scrollToSection(id: string, attempt = 0) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: attempt === 0 ? 'smooth' : 'auto' });

  if (attempt >= MAX_ATTEMPTS) return;
  setTimeout(() => {
    const drift = el.getBoundingClientRect().top - HEADER_OFFSET;
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (Math.abs(drift) > 4 && !atBottom) scrollToSection(id, attempt + 1);
  }, 700);
}
