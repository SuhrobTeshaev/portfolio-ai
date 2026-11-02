import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { portfolioData, uiTranslations } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import CarouselCards, { type RailItem } from '@/components/kokonutui/carousel-cards';

// Certificate scans are ~1056×815 — the frame uses that ratio so none is cropped
const CERTIFICATE_RATIO = 1056 / 815;

export function CertificatesSection() {
  const { language } = useThemeLanguage();
  const t = uiTranslations[language];

  if (!portfolioData.certificates?.length) {
    return null;
  }

  const items: RailItem[] = portfolioData.certificates.map((certificate, index) => ({
    id: `${certificate.name}-${index}`,
    title: certificate.name,
    subtitle: certificate.issuer,
    image: certificate.image,
    imageAlt: certificate.name,
    badge: certificate.fileUrl ? 'PDF' : undefined,
    tags: [certificate.platform, certificate.date].filter(Boolean),
    href: certificate.fileUrl,
    external: true,
    actionLabel: language === 'ru' ? 'Открыть PDF' : 'Open PDF',
    placeholder: <Award className="w-12 h-12" />,
  }));

  return (
    <section className="py-16">
      <div className="container w-full max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CarouselCards
            items={items}
            label={t.certificates}
            aspectRatio={CERTIFICATE_RATIO}
            labels={
              language === 'ru'
                ? { previous: 'Предыдущий', next: 'Следующий' }
                : { previous: 'Previous', next: 'Next' }
            }
            heading={
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="section-title mb-0">{t.certificates}</h2>
              </div>
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
