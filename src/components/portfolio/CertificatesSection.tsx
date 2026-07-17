import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { portfolioData, uiTranslations } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { Button } from '@/components/ui/button';

export function CertificatesSection() {
  const { language } = useThemeLanguage();
  const t = uiTranslations[language];
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(6);

  if (!portfolioData.certificates?.length) {
    return null;
  }

  const certificates = portfolioData.certificates;
  const visibleCertificates = certificates.slice(0, visibleCount);
  const hasMore = visibleCount < certificates.length;

  const handleToggleShow = () => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + 2, certificates.length));
    } else {
      setVisibleCount(6);
      const el = document.getElementById('certificates');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="certificates" className="py-16">
      <div className="container w-full max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="section-title mb-0">{t.certificates}</h2>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {visibleCertificates.map((certificate, index) => {
              const hasError = imageErrors[certificate.name];
              const cardClass = `glass-card overflow-hidden group block hover:scale-[1.02] transition-transform duration-300${certificate.fileUrl ? ' cursor-pointer' : ''}`;

              // Shared card inner content
              const cardContent = (
                <>
                  {/* Image / placeholder area */}
                  <div className="relative">
                    {certificate.image && !hasError ? (
                      <div
                        className="h-48 overflow-hidden"
                        style={{ background: 'hsl(var(--muted) / 0.4)' }}
                      >
                        <img
                          src={certificate.image}
                          alt={certificate.name}
                          loading="lazy"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [certificate.name]: true }))
                          }
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-48 grid place-items-center border-b border-white/10 text-primary/60"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(172 66% 50% / 0.08), hsl(280 70% 60% / 0.08))',
                        }}
                      >
                        <Award className="w-12 h-12" />
                      </div>
                    )}

                    {/* PDF overlay on hover (only when clickable) */}
                    {certificate.fileUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                          <ExternalLink className="w-4 h-4" />
                          {language === 'ru' ? 'Открыть PDF' : 'Open PDF'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {certificate.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
                      </div>
                      {certificate.fileUrl && (
                        <span className="inline-flex items-center gap-1.5 text-primary border border-primary/30 rounded-full px-3 py-1 text-xs font-medium flex-shrink-0">
                          <ExternalLink className="w-3 h-3" />
                          PDF
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {certificate.platform && (
                        <span className="skill-tag">{certificate.platform}</span>
                      )}
                      <span className="skill-tag">{certificate.date}</span>
                    </div>
                  </div>
                </>
              );

              return (
                <motion.div
                  key={`${certificate.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 6) * 0.1 }}
                >
                  {certificate.fileUrl ? (
                    <a
                      href={certificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClass}
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <div className={cardClass}>{cardContent}</div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {certificates.length > 6 && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleToggleShow}
                className="border-primary/30 hover:border-primary text-foreground hover:bg-primary/10 transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                {hasMore ? t.showMore : t.showLess}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
