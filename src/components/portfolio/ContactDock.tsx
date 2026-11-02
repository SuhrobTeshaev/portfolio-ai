import React, { useRef, useState, useCallback } from 'react';
import { Github, Linkedin, Send, Mail, Globe, MessageSquare, FileText } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { portfolioData } from '@/lib/portfolioData';
import { scrollToSection } from '@/lib/scrollToSection';

export interface DockItem {
  letter: string;
  label: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  href: string;
  brandColor: string;
  iconColor?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  download?: string | boolean;
}

interface ContactDockProps {
  items?: DockItem[];
  className?: string;
}

export function ContactDock({ items, className = '' }: ContactDockProps) {
  const { language } = useThemeLanguage();
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rafId = useRef<number | null>(null);

  const cvFile =
    language === 'ru'
      ? `${import.meta.env.BASE_URL}SuhrobTeshazoda_CV.pdf`
      : `${import.meta.env.BASE_URL}SuhrobTeshaevCV_en.pdf`;

  const defaultItems: DockItem[] = [
    {
      letter: 'C',
      label: 'GitHub',
      labelEn: 'GitHub',
      icon: Github,
      href: `https://${portfolioData.github}`,
      brandColor: '#24292e',
      iconColor: '#181717',
    },
    {
      letter: 'O',
      label: 'Проекты',
      labelEn: 'Projects',
      icon: Globe,
      href: '#projects',
      brandColor: '#06b6d4',
      iconColor: '#0284c7',
      onClick: (e) => {
        e.preventDefault();
        scrollToSection('projects');
      },
    },
    {
      letter: 'N',
      label: 'LinkedIn',
      labelEn: 'LinkedIn',
      icon: Linkedin,
      href: `https://${portfolioData.linkedin}`,
      brandColor: '#0a66c2',
      iconColor: '#0a66c2',
    },
    {
      letter: 'T',
      label: 'Telegram',
      labelEn: 'Telegram',
      icon: Send,
      href: portfolioData.telegram,
      brandColor: '#229ed9',
      iconColor: '#0088cc',
    },
    {
      letter: 'A',
      label: 'Email',
      labelEn: 'Email',
      icon: Mail,
      href: `mailto:${portfolioData.email}`,
      brandColor: '#ea4335',
      iconColor: '#ea4335',
    },
    {
      letter: 'C',
      label: 'Написать',
      labelEn: 'Contact Me',
      icon: MessageSquare,
      href: '#contact',
      brandColor: '#10b981',
      iconColor: '#10b981',
      onClick: (e) => {
        e.preventDefault();
        scrollToSection('contact');
      },
    },
    {
      letter: 'T',
      label: 'Скачать CV',
      labelEn: 'Download CV',
      icon: FileText,
      href: cvFile,
      download: language === 'ru' ? 'SuhrobTeshazoda_CV.pdf' : 'SuhrobTeshazoda_CV_en.pdf',
      brandColor: '#8b5cf6',
      iconColor: '#7c3aed',
    },
  ];

  const dockItems = items || defaultItems;
  const itemCount = dockItems.length;

  const updateDock = useCallback(
    (mouseX: number) => {
      if (!dockRef.current) return;

      const baseWidth = 48; // crisp 48px width
      const baseGap = 8;
      const maxDistance = 140;
      const maxScale = 1.45;

      const scales: number[] = new Array(itemCount).fill(1);
      let closestIdx: number | null = null;
      let minDistance = Infinity;

      itemRefs.current.forEach((itemEl, idx) => {
        if (!itemEl) return;
        const rect = itemEl.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - itemCenterX);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }

        if (distance < maxDistance) {
          const cosVal = (Math.cos((distance / maxDistance) * Math.PI) + 1) / 2;
          scales[idx] = 1 + (maxScale - 1) * cosVal;
        } else {
          scales[idx] = 1;
        }
      });

      // Calculate crisp horizontal offsets without overlapping
      const scaledCenters: number[] = new Array(itemCount).fill(0);
      const unscaledCenters: number[] = new Array(itemCount).fill(0);

      unscaledCenters[0] = baseWidth / 2;
      for (let i = 1; i < itemCount; i++) {
        unscaledCenters[i] = unscaledCenters[i - 1] + baseWidth + baseGap;
      }
      const unscaledTotalWidth = unscaledCenters[itemCount - 1] + baseWidth / 2;

      scaledCenters[0] = (scales[0] * baseWidth) / 2;
      for (let i = 1; i < itemCount; i++) {
        scaledCenters[i] =
          scaledCenters[i - 1] +
          ((scales[i - 1] + scales[i]) * baseWidth) / 2 +
          baseGap;
      }
      const scaledTotalWidth = scaledCenters[itemCount - 1] + (scales[itemCount - 1] * baseWidth) / 2;
      const centerShift = (scaledTotalWidth - unscaledTotalWidth) / 2;

      itemRefs.current.forEach((itemEl, idx) => {
        if (!itemEl) return;
        const targetX = scaledCenters[idx] - centerShift - unscaledCenters[idx];
        const scale = scales[idx];
        const zIndex = Math.round(scale * 10) + (idx === closestIdx ? 25 : 0);

        itemEl.style.setProperty('--x', `${targetX.toFixed(2)}px`);
        itemEl.style.setProperty('--scale', scale.toFixed(3));
        itemEl.style.zIndex = `${zIndex}`;
      });

      if (closestIdx !== null && minDistance < 35) {
        setHoveredIndex(closestIdx);
      } else if (minDistance >= 130) {
        setHoveredIndex(null);
      }
    },
    [itemCount]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mouseX = e.clientX;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => updateDock(mouseX));
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setHoveredIndex(null);

    itemRefs.current.forEach((itemEl) => {
      if (itemEl) {
        itemEl.style.setProperty('--x', '0px');
        itemEl.style.setProperty('--scale', '1');
        itemEl.style.zIndex = '1';
      }
    });
  };

  return (
    <div
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`contact-dock-wrapper inline-block ${className}`}
    >
      <ul className="contact-dock flex items-end justify-center gap-2 p-3.5 rounded-2xl bg-white/80 dark:bg-[#0b0d14]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_12px_40px_rgba(31,38,135,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-visible select-none transition-colors duration-300">
        {dockItems.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIndex === idx;
          const labelText = language === 'ru' ? item.label : item.labelEn;

          return (
            <li
              key={idx}
              ref={(el) => (itemRefs.current[idx] = el)}
              className={`key-item relative flex flex-col items-center cursor-pointer ${
                isHovered ? 'is-active' : ''
              }`}
              style={
                {
                  '--brand': item.brandColor,
                  '--x': '0px',
                  '--scale': 1,
                  '--flip': isHovered ? '180deg' : '0deg',
                } as React.CSSProperties
              }
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              {/* Tooltip */}
              <div className="key__tip opacity-0 pointer-events-none transition-all duration-200">
                {labelText}
              </div>

              {/* Clickable link area */}
              <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                download={item.download ? item.download : undefined}
                onClick={item.onClick}
                aria-label={labelText}
                className="key__hit block w-12 h-12 relative outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Brand glow behind active key */}
                <span
                  className="key__glow absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                  style={{
                    background: item.brandColor,
                    filter: 'blur(10px)',
                    opacity: isHovered ? 0.55 : 0,
                  }}
                />

                {/* 3D Keycap container */}
                <div className="key__cap w-full h-full relative">
                  {/* Running gradient border around each keycard */}
                  <div className="key__border-glow" />

                  {/* Front side: Adaptive Letter keycap */}
                  <div className="key__face key__face--letter absolute inset-0 rounded-xl flex items-center justify-center font-mono font-bold text-lg md:text-xl text-slate-800 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100 dark:from-[#2e3244] dark:to-[#1a1c26] border border-slate-200/90 dark:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_16px_rgba(0,0,0,0.6)]">
                    {item.letter}
                  </div>

                  {/* Back side: Crisp White Card face with SVG icon */}
                  <div
                    className="key__face key__face--icon absolute inset-0 rounded-xl flex items-center justify-center bg-white dark:bg-white text-slate-900 border border-slate-200 dark:border-slate-300 shadow-[0_6px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    style={{
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Icon
                      className="w-6 h-6 transition-transform duration-200"
                      style={{ color: item.iconColor || item.brandColor }}
                    />
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
