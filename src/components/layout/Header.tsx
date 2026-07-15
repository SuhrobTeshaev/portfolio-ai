import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { uiTranslations } from '@/lib/portfolioData';

const navItems = [
  { id: 'experience', labelKey: 'experience' },
  { id: 'skills', labelKey: 'skills' },
  { id: 'projects', labelKey: 'projects' },
  { id: 'education', labelKey: 'education' },
  { id: 'contact', labelKey: 'contact' },
] as const;

export function Header() {
  const { theme, language, toggleTheme, toggleLanguage } = useThemeLanguage();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = uiTranslations[language];

  useEffect(() => {
    const sections = ['experience', 'skills', 'projects', 'education', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-border"
    >
      <div className="container max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="cursor-pointer flex items-center"
        >
          <img 
            src="/suhrob_teshaev_header_transparent.svg" 
            alt="Suhrob Teshaev Logo" 
            className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 hover:scale-105 "
          />
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === item.id ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              {t[item.labelKey as keyof typeof t]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative"
          >
            <Globe className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded px-1">
              {language}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border glass-effect overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors hover:bg-secondary ${
                    activeSection === item.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  {t[item.labelKey as keyof typeof t]}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
