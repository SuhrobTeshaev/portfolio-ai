import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, Send, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { getTotalExperience } from '@/lib/dateUtils';
import { ContactDock } from './ContactDock';

import avatar from '/public/photo.png';

export function HeroSection() {
  const { language } = useThemeLanguage();
  const data = portfolioData;

  const totalExperience = getTotalExperience(data.experience, language);

  const dynamicSummary =
    language === 'ru'
      ? `Frontend и Mobile разработчик, опыт — ${totalExperience}. ${data.summary.ru}`
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
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-40 h-40 mx-auto rounded-full overflow-hidden glow-effect border-2 border-primary"
          >
            <img src={avatar} alt={data.name[language]} className="w-full h-full object-cover" />
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            >
              {data.name[language]}
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
              <a
                href={
                  language === 'ru'
                    ? `${import.meta.env.BASE_URL}SuhrobTeshazoda_CV.pdf`
                    : `${import.meta.env.BASE_URL}SuhrobTeshaevCV_en.pdf`
                }
                download={language === 'ru' ? 'SuhrobTeshazoda_CV.pdf' : 'SuhrobTeshazoda_CV_en.pdf'}
              >
                <Download className="w-5 h-5" />
                <span>{language === 'ru' ? 'Скачать резюме' : 'Download CV'}</span>
              </a>
            </Button>
          </motion.div>

          {/* Social Contact Dock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center pt-4"
          >
            {/* The dock is ~414px wide — shrink it to fit phone screens */}
            <ContactDock className="max-[440px]:scale-[0.82]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
