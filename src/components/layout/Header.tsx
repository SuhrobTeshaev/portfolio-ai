import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

export function Header() {
  const { theme, language, toggleTheme, toggleLanguage } = useThemeLanguage();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-border"
    >
      <div className="container max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-bold text-xl gradient-text"
        >
          Portfolio
        </motion.div>

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
        </div>
      </div>
    </motion.header>
  );
}
