import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { uiTranslations } from '@/lib/portfolioData';
import { scrollToSection } from '@/lib/scrollToSection';
import MorphicNavbar from '@/components/kokonutui/morphic-navbar';
import logoDarkUrl from '../../../public/suhrob_teshaev_header_transparent.svg';
import logoLightUrl from '../../../public/suhrob_teshaev_header_transparent_light.svg';

// Faint outline in the site's border colour. A filter (not a border) so it wraps
// the morphic bar's joined segments as one shape.
const OUTLINE =
  '[filter:drop-shadow(0_0_1px_hsl(var(--border)))_drop-shadow(0_2px_8px_hsl(0_0%_0%/0.12))]';

// Same surface as the MorphicNavbar segments, so logo and controls read as part of the bar.
// no-gradient-border opts buttons out of the global gradient-border rule in index.css.
const PILL = `no-gradient-border flex h-9 items-center justify-center rounded-xl bg-card text-muted-foreground transition-colors duration-150 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${OUTLINE}`;

const navItems = [
  { id: 'experience', labelKey: 'experience' },
  { id: 'skills', labelKey: 'skills' },
  { id: 'projects', labelKey: 'projects' },
  { id: 'education', labelKey: 'education' },
  { id: 'contact', labelKey: 'contact' },
] as const;

/**
 * Same features as Header (logo → top, section links with scroll spy, language
 * and theme toggles, mobile menu), with the Kokonut morphic bar on desktop.
 */
export function MorphicHeader() {
  const { theme, language, toggleTheme, toggleLanguage } = useThemeLanguage();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = uiTranslations[language];
  const logoUrl = theme === 'dark' ? logoDarkUrl : logoLightUrl;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Back at the hero, no section is active
    const onScroll = () => {
      if (window.scrollY < 200) setActiveSection('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Keyed by href, in display order — the shape MorphicNavbar expects
  const morphicItems = Object.fromEntries(
    navItems.map(({ id, labelKey }) => [`#${id}`, { name: t[labelKey as keyof typeof t] as string }])
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 "
    >
      <div className="container max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${PILL} pl-3 pr-1 shrink-0`}
          aria-label="Suhrob Teshazoda"
        >
          <img src={logoUrl} alt="" className="h-8 w-auto object-contain" />
        </motion.a>

        {/* Desktop Navigation (lg+: the bar needs ~530px); never folds — it fits there */}
        <MorphicNavbar
          items={morphicItems}
          activePath={activeSection ? `#${activeSection}` : ''}
          onNavigate={(href) => scrollToSection(href.slice(1))}
          className={`hidden lg:flex py-0 px-0 ${OUTLINE}`}
        />

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className={`${PILL} gap-1.5 px-3`}
            aria-label={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">{language}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`${PILL} w-9`}
            aria-label={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`${PILL} w-9 lg:hidden`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown — five labels don't fit a phone-wide bar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border glass-effect overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors hover:bg-secondary ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground'
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
