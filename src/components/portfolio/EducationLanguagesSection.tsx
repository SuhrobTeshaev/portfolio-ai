import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Languages } from 'lucide-react';
import { portfolioData, uiTranslations } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

export function EducationLanguagesSection() {
  const { language } = useThemeLanguage();
  const t = uiTranslations[language];

  return (
    <section id="education" className="py-16 ">
      <div className="container w-full max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{t.education}</h2>
            </div>

            <div className="space-y-4">
              {portfolioData.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4"
                >
                  <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-primary text-sm">{edu.institution}</p>
                  <p className="text-muted-foreground text-sm">{edu.period}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Languages className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{t.languages}</h2>
            </div>

            <div className="space-y-4">
              {portfolioData.languages.map((lang, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-elevated p-4 flex justify-between items-center"
                >
                  <span className="font-medium text-foreground">{lang.language}</span>
                  <span className="text-muted-foreground text-sm">{lang.level[language]}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
