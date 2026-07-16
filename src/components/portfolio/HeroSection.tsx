import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, Send, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { getTotalExperience } from '@/lib/dateUtils';

export function HeroSection() {
  const { language } = useThemeLanguage();
  const data = portfolioData;

  const totalExperience = getTotalExperience(data.experience, language);

  const dynamicSummary = language === 'ru'
    ? `Frontend и Mobile разработчик с ${totalExperience} опыта. ${data.summary.ru}`
    : `Frontend & Mobile Developer with ${totalExperience} of experience. ${data.summary.en}`;

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20">
      <div className="container w-full max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {/* Avatar placeholder */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground glow-effect"
          >
            {data.name.split(' ').map(n => n[0]).join('')}
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            >
              {data.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl gradient-text font-medium"
            >
              {data.title}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <MapPin className="w-4 h-4" />
            <span>{data.location}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {dynamicSummary}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2" 
              asChild
            >
              <a href={data.telegram} target="_blank" rel="noopener noreferrer">
                <Send className="w-5 h-5" />
                <span>{language === 'ru' ? 'Написать мне' : 'Contact me'}</span>
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-primary/30 hover:border-primary text-foreground hover:bg-primary/10 hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2" 
              asChild
            >
              <a href="/SuhrobTeshaevCV.pdf" download="SuhrobTeshaevCV.pdf">
                <Download className="w-5 h-5" />
                <span>{language === 'ru' ? 'Скачать резюме' : 'Download CV'}</span>
              </a>
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <a
              href={`mailto:${data.email}`}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" style={{background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)'}}
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={`https://${data.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" style={{background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)'}}
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={`https://...`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('contact');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" style={{background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)'}}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={data.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" style={{background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)'}}
              aria-label="Telegram"
            >
              <Send className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
