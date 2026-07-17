import React, { Suspense, lazy, ComponentType, useRef } from 'react';
import { useLazySection } from '@/hooks/useLazySection';

// ─── Skeleton (SRP: renders a CLS-preventing placeholder) ─────────────────────
interface SectionSkeletonProps {
  /** Reserve vertical space equal to section height to prevent layout shift */
  height?: string;
}

export function SectionSkeleton({ height = '320px' }: SectionSkeletonProps) {
  return (
    <div className="w-full mx-auto px-6 py-8" style={{ minHeight: height }} aria-hidden="true">
      <div
        className="w-full h-full rounded-2xl animate-pulse"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur))',
          WebkitBackdropFilter: 'blur(var(--glass-blur))',
          border: '1px solid var(--glass-border)',
          minHeight: height,
        }}
      />
    </div>
  );
}

// ─── LazySection (OCP: open for extension via factory prop) ───────────────────
interface LazySectionProps {
  /** Dynamic import factory — same signature as React.lazy expects */
  factory: () => Promise<{ default: ComponentType }>;
  /** Skeleton min-height — prevents CLS / layout jumps while loading */
  skeletonHeight?: string;
}

/**
 * Combines three concerns into a single declarative unit:
 *   1. IntersectionObserver  — delays JS execution until near-viewport
 *   2. React.lazy + Suspense — splits JS into per-section chunks
 *   3. SectionSkeleton       — holds space so layout never jumps (zero CLS)
 */
export function LazySection({ factory, skeletonHeight }: LazySectionProps) {
  const [ref, isVisible] = useLazySection();

  // Stable ref — factory is declared inline in Index, so we capture it once
  const ComponentRef = useRef<ComponentType | null>(null);
  if (!ComponentRef.current) {
    ComponentRef.current = lazy(factory);
  }
  const Component = ComponentRef.current;

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={<SectionSkeleton height={skeletonHeight} />}>
          <Component />
        </Suspense>
      ) : (
        <SectionSkeleton height={skeletonHeight} />
      )}
    </div>
  );
}
