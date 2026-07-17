import React from 'react';
import { ThemeLanguageProvider } from '@/contexts/ThemeLanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/portfolio/HeroSection'; // eager — above the fold
import { LazySection } from '@/components/LazySection';
import { ChatWindow } from '@/components/chat/ChatWindow';

/**
 * Section registry — DRY: every section defined once.
 * skeletonHeight approximates real section height → zero CLS / layout shift.
 */
const SECTIONS = [
  {
    id: 'experience-lazy',
    factory: () =>
      import('@/components/portfolio/ExperienceSection').then((m) => ({
        default: m.ExperienceSection,
      })),
    skeletonHeight: '520px',
  },
  {
    id: 'skills-lazy',
    factory: () =>
      import('@/components/portfolio/SkillsSection').then((m) => ({ default: m.SkillsSection })),
    skeletonHeight: '360px',
  },
  {
    id: 'projects-lazy',
    factory: () =>
      import('@/components/portfolio/ProjectsSection').then((m) => ({
        default: m.ProjectsSection,
      })),
    skeletonHeight: '680px',
  },
  {
    id: 'certificates-lazy',
    factory: () =>
      import('@/components/portfolio/CertificatesSection').then((m) => ({
        default: m.CertificatesSection,
      })),
    skeletonHeight: '560px',
  },
  {
    id: 'education-lazy',
    factory: () =>
      import('@/components/portfolio/EducationLanguagesSection').then((m) => ({
        default: m.EducationLanguagesSection,
      })),
    skeletonHeight: '380px',
  },
  {
    id: 'contact-lazy',
    factory: () =>
      import('@/components/portfolio/ContactSection').then((m) => ({ default: m.ContactSection })),
    skeletonHeight: '440px',
  },
] as const;

const Index = () => (
  <ThemeLanguageProvider>
    <div className="min-h-screen max-w-[1200px] mx-auto bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero is eagerly loaded — it is always above the fold */}
        <HeroSection />

        {/* All below-the-fold sections are code-split + intersection-lazy */}
        {SECTIONS.map(({ id, factory, skeletonHeight }) => (
          <LazySection key={id} factory={factory} skeletonHeight={skeletonHeight} />
        ))}
      </main>

      <Footer />
      <ChatWindow />
    </div>
  </ThemeLanguageProvider>
);

export default Index;
