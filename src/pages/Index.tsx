import React from 'react';
import { ThemeLanguageProvider } from '@/contexts/ThemeLanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { ExperienceSection } from '@/components/portfolio/ExperienceSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { EducationLanguagesSection } from '@/components/portfolio/EducationLanguagesSection';
import { ChatWindow } from '@/components/chat/ChatWindow';

const Index = () => {
  return (
    <ThemeLanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <HeroSection />
          <ExperienceSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationLanguagesSection />
        </main>
        <Footer />
        <ChatWindow />
      </div>
    </ThemeLanguageProvider>
  );
};

export default Index;
