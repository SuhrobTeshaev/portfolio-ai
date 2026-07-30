import React from 'react';
import { Heart, Mail, Send } from 'lucide-react';
import { portfolioData, uiTranslations } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import logoDarkUrl from '../../../public/suhrob_teshaev_header_transparent.svg';
import logoLightUrl from '../../../public/suhrob_teshaev_header_transparent_light.svg';


export function Footer() {
  const {theme,language } = useThemeLanguage();

  const t = uiTranslations[language];
  const data = portfolioData;
  const logoUrl = theme === 'dark' ? logoDarkUrl : logoLightUrl;

  return (
    <footer className="py-12 border-t border-border bg-secondary/10">
      <div className="container max-w-4xl mx-auto px-6 space-y-6 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{t.contact}</h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ru'
              ? 'Свяжитесь со мной любым удобным способом'
              : 'Feel free to reach out via any channel'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <a
            href={`mailto:${data.email}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span>{data.email}</span>
          </a>

          <a
            href={data.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <Send className="w-4 h-4 text-primary" />
            <span>Telegram: @{data.telegram.split('/').pop()}</span>
          </a>
        </div>

        <div className="pt-4 border-t border-border/40">
          <p className="text-muted-foreground text-base flex items-center justify-center gap-1">
            Created by <img src={logoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </p>
        </div>
      </div>
    </footer>
  );
}
