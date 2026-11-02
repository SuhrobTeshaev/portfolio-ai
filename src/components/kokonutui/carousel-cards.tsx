/**
 * @author: @dorianbaffier
 * @description: Momentum Rail. A card rail you can flick with the mouse: the
 * release velocity projects an end point, a spring snaps to the nearest card
 * and the ends rubber-band. Scroll position drives a cover-flow depth and the
 * centered card's details with CSS scroll-driven animations.
 * @version: 2.0.0
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 *
 * Adapted for the portfolio (Tailwind 3, React 18):
 * - generic cards (image, title, subtitle, tags, badge, link) instead of the
 *   travel demo (scenes, favourites, price, rating);
 * - one fixed card size: the image keeps a set aspect ratio and is contained,
 *   titles are clamped to two lines, so every card has the same height;
 * - v4-only utilities (w-(--x), @container variants) and React 19's
 *   <style precedence> replaced with plain CSS below;
 * - colours follow the site theme tokens.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export interface RailItem {
  id: string;
  title: string;
  subtitle?: string;
  /** Image URL, shown whole (contained) inside the fixed-ratio frame. */
  image?: string;
  imageAlt?: string;
  /** Small label over the image, top-left. */
  badge?: string;
  /** Chips under the subtitle (revealed on the centered card). */
  tags?: string[];
  href?: string;
  /** Opens `href` in a new tab. */
  external?: boolean;
  /** Shown over the image on hover when the card has an `href`. */
  actionLabel?: string;
  /** Icon for cards without an image. */
  placeholder?: ReactNode;
}

export interface CarouselCardsProps {
  items: RailItem[];
  /** Heading rendered above the rail, next to the arrows. */
  heading?: ReactNode;
  /** Accessible name of the rail. */
  label: string;
  /** Image frame aspect ratio as width / height. */
  aspectRatio?: number;
  labels?: { previous: string; next: string };
  className?: string;
}

/*
 * Depth runs off the main thread: each card is a view timeline on the inline
 * axis (0% entering on the right, 50% centered, 100% leaving on the left).
 * Browsers without scroll-driven animations get flat cards with every detail
 * visible. Reduced motion keeps only the details fade.
 *
 * Card width follows the rail's own width (container query on the scroller).
 */
const RAIL_CSS = `
.kokonutui-rail-scroller { container-type: inline-size; }
.kokonutui-rail-track { --rail-card: 16rem; }
@container (min-width: 28rem) { .kokonutui-rail-track { --rail-card: 18rem; } }
@container (min-width: 48rem) { .kokonutui-rail-track { --rail-card: 21rem; } }
.kokonutui-rail-track { padding-inline: calc(50cqw - var(--rail-card) / 2); }
.kokonutui-rail-card { width: var(--rail-card); }
@keyframes kokonutui-rail-tilt {
  0% { transform: perspective(900px) translateZ(-180px) rotateY(-14deg); }
  50% { transform: perspective(900px) translateZ(0) rotateY(0deg); }
  100% { transform: perspective(900px) translateZ(-180px) rotateY(14deg); }
}
@keyframes kokonutui-rail-details {
  0%, 32% { opacity: 0; transform: translate3d(0, 6px, 0); }
  45%, 55% { opacity: 1; transform: translate3d(0, 0, 0); }
  68%, 100% { opacity: 0; transform: translate3d(0, 6px, 0); }
}
@supports (animation-timeline: view()) {
  .kokonutui-rail-card { view-timeline: --kokonutui-rail inline; }
  .kokonutui-rail-details {
    animation: kokonutui-rail-details linear both;
    animation-timeline: --kokonutui-rail;
  }
  @media (prefers-reduced-motion: no-preference) {
    .kokonutui-rail-tilt {
      animation: kokonutui-rail-tilt linear both;
      animation-timeline: --kokonutui-rail;
    }
  }
}
`;

/* ------------------------------------------------------------------ */
/* Card                                                               */
/* ------------------------------------------------------------------ */

const STRETCHED =
  "outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']";

const RailCard = ({ item, aspectRatio }: { item: RailItem; aspectRatio: number }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = item.image && !imageFailed;

  return (
    <li className="kokonutui-rail-card flex-none snap-center">
      <div className="kokonutui-rail-tilt group/rail-card glass-card relative h-full overflow-hidden !rounded-2xl ring-primary ring-offset-2 ring-offset-background group-has-[[data-rail-link]:focus-visible]/rail-card:ring-2">
        <div
          className="relative overflow-hidden border-b border-border bg-muted/40"
          style={{ aspectRatio }}
        >
          {showImage ? (
            <img
              alt={item.imageAlt ?? ''}
              className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover/rail-card:scale-[1.03]"
              decoding="async"
              draggable={false}
              loading="lazy"
              onError={() => setImageFailed(true)}
              src={item.image}
            />
          ) : (
            <div className="grid h-full place-items-center text-primary/60">{item.placeholder}</div>
          )}
          {item.badge && (
            <span className="absolute top-3 left-3 rounded-md bg-card/90 px-1.5 py-0.5 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
              {item.badge}
            </span>
          )}
          {item.href && item.actionLabel && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/rail-card:opacity-100">
              <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg">
                {item.actionLabel}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Two-line slot whatever the title length, so all cards match */}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-foreground">
            {item.href ? (
              // The link is stretched over the whole card
              <a
                className={STRETCHED}
                data-rail-link=""
                draggable={false}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h3>
          {item.subtitle && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.subtitle}</p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="kokonutui-rail-details mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="skill-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

/* ------------------------------------------------------------------ */
/* Momentum: drag, project, spring to a card, rubber-band at the ends. */
/* ------------------------------------------------------------------ */

const STIFFNESS = 170;
const DAMPING = 26; // about 2·√170: critically damped, so no bounce at the card
const DECELERATION = 0.997; // UIScrollView's normal rate, per ms
const DRAG_THRESHOLD = 4;

const rubber = (overshoot: number, size: number) =>
  Math.sign(overshoot) * (1 - 1 / ((Math.abs(overshoot) * 0.55) / size + 1)) * size;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

interface RailState {
  mode: 'idle' | 'pressing' | 'dragging' | 'spring';
  pointerId: number;
  startX: number;
  startPos: number;
  pos: number;
  vel: number;
  target: number;
  samples: { t: number; x: number }[];
  raf: number;
  last: number;
  suppressClick: boolean;
  /** The press caught a moving rail, so letting go must settle it. */
  caught: boolean;
}

const maxScroll = (scroller: HTMLElement) => scroller.scrollWidth - scroller.clientWidth;

const snapPoints = (scroller: HTMLElement, track: HTMLUListElement) => {
  const max = maxScroll(scroller);
  return Array.from(track.children, (child) => {
    const card = child as HTMLElement;
    const center = track.offsetLeft + card.offsetLeft + card.offsetWidth / 2;
    return clamp(center - scroller.clientWidth / 2, 0, max);
  });
};

const nearestIndex = (points: number[], pos: number) => {
  let best = 0;
  for (let i = 1; i < points.length; i++) {
    if (Math.abs(points[i] - pos) < Math.abs(points[best] - pos)) {
      best = i;
    }
  }
  return best;
};

// Release velocity in px/ms from the last 100ms of samples; a pause before
// letting go means no flick.
const releaseVelocity = (samples: RailState['samples'], now: number) => {
  const first = samples[0];
  const last = samples[samples.length - 1] ?? first;
  const dt = last.t - first.t;
  if (dt <= 0 || now - last.t > 60) {
    return 0;
  }
  return -(last.x - first.x) / dt;
};

function useMomentumRail(
  scrollerRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLUListElement | null>,
  onIndex: (index: number) => void
) {
  const state = useRef<RailState>({
    mode: 'idle',
    pointerId: -1,
    startX: 0,
    startPos: 0,
    pos: 0,
    vel: 0,
    target: 0,
    samples: [],
    raf: 0,
    last: 0,
    suppressClick: false,
    caught: false,
  });
  const onIndexRef = useRef(onIndex);
  onIndexRef.current = onIndex;

  // Write a virtual position: the in-range part scrolls natively, the rest
  // becomes a damped translate on the track (the rubber band).
  const apply = useCallback(
    (pos: number) => {
      const scroller = scrollerRef.current;
      const track = trackRef.current;
      if (!(scroller && track)) {
        return;
      }
      const inRange = clamp(pos, 0, maxScroll(scroller));
      scroller.scrollLeft = inRange;
      const over = pos - inRange;
      track.style.transform =
        Math.abs(over) > 0.1
          ? `translate3d(${(-rubber(over, scroller.clientWidth)).toFixed(2)}px,0,0)`
          : '';
    },
    [scrollerRef, trackRef]
  );

  // Native scroll snap is off while JS owns the position.
  const setFree = useCallback(
    (free: boolean) => {
      const scroller = scrollerRef.current;
      if (scroller) {
        scroller.dataset.free = String(free);
      }
    },
    [scrollerRef]
  );

  const step = useCallback(
    (now: number) => {
      const s = state.current;
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      // Semi-implicit Euler substeps keep the spring stable at any frame rate.
      const h = dt / 4;
      for (let i = 0; i < 4; i++) {
        const accel = -STIFFNESS * (s.pos - s.target) - DAMPING * s.vel;
        s.vel += accel * h;
        s.pos += s.vel * h;
      }
      if (Math.abs(s.pos - s.target) < 0.5 && Math.abs(s.vel) < 8) {
        s.pos = s.target;
        s.vel = 0;
        s.mode = 'idle';
        apply(s.target);
        setFree(false);
        return;
      }
      apply(s.pos);
      s.raf = requestAnimationFrame(step);
    },
    [apply, setFree]
  );

  const springTo = useCallback(
    (target: number, velocity: number) => {
      const s = state.current;
      const scroller = scrollerRef.current;
      if (!scroller) {
        return;
      }
      cancelAnimationFrame(s.raf);
      // A spring, drag or caught press carries its own virtual position,
      // overshoot included.
      if (s.mode === 'idle') {
        s.pos = scroller.scrollLeft;
      }
      s.target = target;
      s.vel = velocity;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        s.mode = 'idle';
        s.pos = target;
        apply(target);
        setFree(false);
        return;
      }
      s.mode = 'spring';
      setFree(true);
      s.last = performance.now();
      s.raf = requestAnimationFrame(step);
    },
    [apply, scrollerRef, setFree, step]
  );

  const goTo = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      const track = trackRef.current;
      if (!(scroller && track)) {
        return;
      }
      const s = state.current;
      const points = snapPoints(scroller, track);
      const i = clamp(index, 0, points.length - 1);
      springTo(points[i], s.mode === 'spring' ? s.vel : 0);
    },
    [scrollerRef, springTo, trackRef]
  );

  const currentIndex = useCallback(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!(scroller && track)) {
      return 0;
    }
    const s = state.current;
    const pos = s.mode === 'spring' ? s.target : scroller.scrollLeft;
    return nearestIndex(snapPoints(scroller, track), pos);
  }, [scrollerRef, trackRef]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!(scroller && track)) {
      return;
    }
    const s = state.current;
    let scrollRaf = 0;

    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        onIndexRef.current(nearestIndex(snapPoints(scroller, track), scroller.scrollLeft));
      });
    };

    const suppressNextClick = () => {
      s.suppressClick = true;
      setTimeout(() => {
        s.suppressClick = false;
      }, 0);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) {
        return;
      }
      if ((e.target as Element).closest('button:not([data-rail-link])')) {
        return;
      }
      cancelAnimationFrame(s.raf);
      // Catching a moving rail keeps its virtual position, overshoot included.
      s.caught = s.mode === 'spring';
      s.pos = s.caught ? s.pos : scroller.scrollLeft;
      s.mode = 'pressing';
      s.pointerId = e.pointerId;
      s.startX = e.clientX;
      s.startPos = s.pos;
      s.samples = [{ t: e.timeStamp, x: e.clientX }];
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) {
        return;
      }
      const dx = e.clientX - s.startX;
      if (s.mode === 'pressing' && Math.abs(dx) > DRAG_THRESHOLD) {
        s.mode = 'dragging';
        scroller.setPointerCapture(e.pointerId);
        scroller.dataset.dragging = 'true';
        setFree(true);
      }
      if (s.mode !== 'dragging') {
        return;
      }
      s.pos = s.startPos - dx;
      apply(s.pos);
      s.samples.push({ t: e.timeStamp, x: e.clientX });
      while (s.samples.length > 2 && e.timeStamp - s.samples[0].t > 100) {
        s.samples.shift();
      }
    };

    const onRelease = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) {
        return;
      }
      s.pointerId = -1;
      if (s.mode !== 'dragging') {
        if (s.caught) {
          // A rail caught mid-flight (or mid-rubber-band) and let go
          // settles on the nearest card instead of freezing there. Like a
          // native list, the tap that stopped it does not open a card.
          suppressNextClick();
          const points = snapPoints(scroller, track);
          springTo(points[nearestIndex(points, s.pos)], 0);
          return;
        }
        // A press that never became a drag hands back to native snapping.
        s.mode = 'idle';
        setFree(false);
        return;
      }
      scroller.dataset.dragging = 'false';
      suppressNextClick();
      const v = releaseVelocity(s.samples, e.timeStamp);
      const projected = s.pos + (v * DECELERATION) / (1 - DECELERATION);
      const points = snapPoints(scroller, track);
      springTo(points[nearestIndex(points, projected)], v * 1000);
    };

    // A drag that ends over a card must not follow its link.
    const onClickCapture = (e: MouseEvent) => {
      if (s.suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        s.suppressClick = false;
      }
    };

    // Wheel or touch takes over from a running spring.
    const onNativeInput = () => {
      if (s.mode !== 'spring') {
        return;
      }
      cancelAnimationFrame(s.raf);
      s.mode = 'idle';
      apply(clamp(s.pos, 0, maxScroll(scroller)));
      setFree(false);
    };

    // Arrow keys step one card; Home and End jump to the ends.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target !== scroller) {
        return;
      }
      const last = track.children.length - 1;
      const index = nearestIndex(
        snapPoints(scroller, track),
        s.mode === 'spring' ? s.target : scroller.scrollLeft
      );
      let next = -1;
      switch (e.key) {
        case 'ArrowLeft':
          next = index - 1;
          break;
        case 'ArrowRight':
          next = index + 1;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = last;
          break;
        default:
          return;
      }
      e.preventDefault();
      goTo(next);
    };

    scroller.addEventListener('keydown', onKeyDown);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('pointerdown', onPointerDown);
    scroller.addEventListener('pointermove', onPointerMove);
    scroller.addEventListener('pointerup', onRelease);
    scroller.addEventListener('pointercancel', onRelease);
    scroller.addEventListener('lostpointercapture', onRelease);
    scroller.addEventListener('click', onClickCapture, true);
    scroller.addEventListener('wheel', onNativeInput, { passive: true });
    scroller.addEventListener('touchstart', onNativeInput, { passive: true });
    return () => {
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(s.raf);
      scroller.removeEventListener('keydown', onKeyDown);
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('pointerdown', onPointerDown);
      scroller.removeEventListener('pointermove', onPointerMove);
      scroller.removeEventListener('pointerup', onRelease);
      scroller.removeEventListener('pointercancel', onRelease);
      scroller.removeEventListener('lostpointercapture', onRelease);
      scroller.removeEventListener('click', onClickCapture, true);
      scroller.removeEventListener('wheel', onNativeInput);
      scroller.removeEventListener('touchstart', onNativeInput);
    };
  }, [apply, goTo, scrollerRef, setFree, springTo, trackRef]);

  return { goTo, currentIndex };
}

/* ------------------------------------------------------------------ */
/* Rail                                                               */
/* ------------------------------------------------------------------ */

// `aria-disabled` rather than `disabled` at the ends, so focus stays put.
// no-gradient-border opts out of the global button rule in index.css.
const ARROW_CLASS =
  'no-gradient-border grid size-9 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-[background-color,color,opacity] duration-150 ease-out hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:text-foreground';

export default function CarouselCards({
  items,
  heading,
  label,
  aspectRatio = 4 / 3,
  labels = { previous: 'Previous', next: 'Next' },
  className,
}: CarouselCardsProps) {
  const scrollerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const { goTo, currentIndex } = useMomentumRail(scrollerRef, trackRef, setActive);

  const step = (delta: number) => goTo(currentIndex() + delta);

  return (
    <section aria-label={label} aria-roledescription="carousel" className={cn('w-full', className)}>
      <div className="mb-2 flex items-end justify-between gap-4">
        <div className="min-w-0">{heading}</div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Hidden on phones, where it would collide with a large heading */}
          <span
            aria-live="polite"
            className="mr-1 hidden text-xs tabular-nums text-muted-foreground sm:inline"
          >
            <span className="sr-only">Card </span>
            {String(active + 1).padStart(2, '0')}
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> of </span>
            {String(items.length).padStart(2, '0')}
          </span>
          <button
            aria-disabled={active === 0}
            aria-label={labels.previous}
            className={ARROW_CLASS}
            onClick={() => step(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            aria-disabled={active === items.length - 1}
            aria-label={labels.next}
            className={ARROW_CLASS}
            onClick={() => step(1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <section
        aria-label={label}
        className="kokonutui-rail-scroller relative snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-6 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary data-[dragging=true]:cursor-grabbing data-[free=true]:snap-none [&::-webkit-scrollbar]:hidden [@media(pointer:fine)]:cursor-grab [@media(pointer:fine)]:select-none"
        ref={scrollerRef}
        tabIndex={0}
      >
        <ul className="kokonutui-rail-track relative flex w-max items-stretch gap-5" ref={trackRef}>
          {items.map((item) => (
            <RailCard aspectRatio={aspectRatio} item={item} key={item.id} />
          ))}
        </ul>
      </section>

      <style>{RAIL_CSS}</style>
    </section>
  );
}
