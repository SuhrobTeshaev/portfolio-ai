import React from 'react';
import { ThemeLanguageProvider, useThemeLanguage } from '@/contexts/ThemeLanguageContext';
// Temporarily replaced by MorphicHeader — switch back by swapping the two below
// import { Header } from '@/components/layout/Header';
import { MorphicHeader } from '@/components/layout/MorphicHeader';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/portfolio/HeroSection'; // eager — above the fold
import { LazySection } from '@/components/LazySection';
import { ChatWindow } from '@/components/chat/ChatWindow';
import SplashCursor from '@/components/react-bits/SplashCursor';

/**
 * Fluid cursor trail painted behind the page (z-index -1): above the body's
 * background colour/gradients, below every section. Light mode needs the
 * subtractive ink so the colours stay visible on a pale page.
 */
function SplashBackground() {
  const { theme } = useThemeLanguage();
  return (
    <SplashCursor rainbow size={1} force={1} swirl={3} trail={1} clickSplash theme={theme} zIndex={-1} />
  );
}

/**
 * Section registry — DRY: every section defined once.
 * skeletonHeight approximates real section height → zero CLS / layout shift.
 */
const SECTIONS = [
  {
    id: 'experience',
    factory: () =>
      import('@/components/portfolio/ExperienceSection').then((m) => ({
        default: m.ExperienceSection,
      })),
    skeletonHeight: '520px',
  },
  {
    id: 'skills',
    factory: () =>
      import('@/components/portfolio/SkillsSection').then((m) => ({ default: m.SkillsSection })),
    skeletonHeight: '360px',
  },
  {
    id: 'projects',
    factory: () =>
      import('@/components/portfolio/ProjectsSection').then((m) => ({
        default: m.ProjectsSection,
      })),
    skeletonHeight: '680px',
  },
  {
    id: 'certificates',
    factory: () =>
      import('@/components/portfolio/CertificatesSection').then((m) => ({
        default: m.CertificatesSection,
      })),
    skeletonHeight: '560px',
  },
  {
    id: 'education',
    factory: () =>
      import('@/components/portfolio/EducationLanguagesSection').then((m) => ({
        default: m.EducationLanguagesSection,
      })),
    skeletonHeight: '380px',
  },
  {
    id: 'contact',
    factory: () =>
      import('@/components/portfolio/ContactSection').then((m) => ({ default: m.ContactSection })),
    skeletonHeight: '440px',
  },
] as const;

const Index = () => (
  <ThemeLanguageProvider>
    {/* No bg here — the body paints the background, so the splash shows through */}
    <SplashBackground />
    <div className="min-h-screen max-w-[1200px] mx-auto">
      {/* <Header /> */}
      <MorphicHeader />

      <main className="pt-16">
        {/* Hero is eagerly loaded — it is always above the fold */}
        <HeroSection />

        {/* All below-the-fold sections are code-split + intersection-lazy */}
        {SECTIONS.map(({ id, factory, skeletonHeight }) => (
          <LazySection key={id} id={id} factory={factory} skeletonHeight={skeletonHeight} />
        ))}
      </main>

      <Footer />
      <ChatWindow />
    </div>
  </ThemeLanguageProvider>
);

export default Index;
