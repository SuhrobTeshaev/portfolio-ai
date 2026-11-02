import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  Github,
  Globe,
  Activity,
  Film,
  BookOpen,
  MessageSquare,
  Building,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioData, uiTranslations, type Project } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

export function ProjectsSection() {
  const { language } = useThemeLanguage();
  const t = uiTranslations[language];
  const [visibleCount, setVisibleCount] = useState(6);

  const projects = portfolioData.projects;
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const handleToggleShow = () => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + 2, projects.length));
    } else {
      setVisibleCount(6);
      // Smooth scroll back to section top when collapsing
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-16">
      <div className="container w-full max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <FolderGit2 className="w-6 h-6 text-primary" />
            <h2 className="section-title mb-0">{t.projects}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>

          {projects.length > 6 && (
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

          {/* Pet projects — own block, always fully shown */}
          {portfolioData.petProjects.length > 0 && (
            <div className="space-y-6 pt-8">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{t.petProjects}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.petProjectsNote}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioData.petProjects.map((project, index) => (
                  <ProjectCard key={project.name} project={project} index={index} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const { language } = useThemeLanguage();
  const [hasError, setHasError] = useState(false);
  const [active, setActive] = useState(0);

  const gallery = project.gallery ?? [];
  // Slide 0 is the cover rendered by the usual logic below; other slides are shown whole
  const slide = active > 0 ? gallery[active] : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.1 }}
      className="glass-card gradient-border overflow-hidden group hover:scale-[1.01] transition-all duration-300 flex flex-col h-full"
    >
      {/* Image / Fallback */}
      {(project.image || project.mobileImage || project.logo) && !hasError ? (
        <div
          className="h-56 sm:h-64 overflow-hidden border-b border-white/10 flex-shrink-0 relative group-hover:bg-black/10 transition-colors duration-500"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--accent) / 0.05))',
          }}
        >
          {/* Gallery slide (anything after the cover) — shown whole, never cropped */}
          {slide && (
            <img
              key={slide}
              src={slide}
              alt={`${project.name} — ${active + 1}`}
              onError={() => setHasError(true)}
              className="absolute inset-0 h-full w-full object-contain p-3 animate-in fade-in duration-300"
            />
          )}

          {/* Only Logo */}
          {!slide && project.logo && !project.image && !project.mobileImage && (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={project.logo}
                alt={project.name}
                loading="lazy"
                onError={() => setHasError(true)}
                className="max-w-[80%] max-h-[80%] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          )}

          {/* Both Desktop and Mobile Images */}
          {!slide && project.image && project.mobileImage && (
            <>
              {/* Desktop view */}
              <img
                src={project.image}
                loading="lazy"
                onError={() => setHasError(true)}
                className="hidden sm:block w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                alt="desktop view"
              />
              {/* Mobile view */}
              <img
                src={project.mobileImage}
                loading="lazy"
                onError={() => setHasError(true)}
                className="block sm:hidden w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="mobile view"
              />
            </>
          )}

          {/* Motion clip (its poster is project.image) */}
          {!slide && project.video && (
            <ProjectVideo src={project.video} poster={project.image} label={project.name} />
          )}

          {/* Only Desktop Image */}
          {!slide && !project.video && project.image && !project.mobileImage && (
            <img
              src={project.image}
              alt={project.name}
              loading="lazy"
              onError={() => setHasError(true)}
              className={`h-full w-full ${
                project.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover'
              } group-hover:scale-105 transition-transform duration-500`}
            />
          )}

          {/* Only Mobile Image */}
          {!slide && !project.image && project.mobileImage && (
            <img
              src={project.mobileImage}
              alt={project.name}
              loading="lazy"
              onError={() => setHasError(true)}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          <GalleryThumbs
            gallery={gallery}
            active={active}
            onSelect={setActive}
            name={project.name}
          />
        </div>
      ) : (
        <div
          className="h-56 sm:h-64 grid place-items-center border-b border-white/10 text-primary/70 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, hsl(172 66% 50% / 0.08), hsl(280 70% 60% / 0.08))',
          }}
        >
          {project.name.toLowerCase().includes('clinic') ||
          project.name.toLowerCase().includes('medical') ||
          project.name.toLowerCase().includes('navbat') ? (
            <Activity className="w-10 h-10" />
          ) : project.name.toLowerCase().includes('cinema') ||
            project.name.toLowerCase().includes('asar') ? (
            <Film className="w-10 h-10" />
          ) : project.name.toLowerCase().includes('editor') ||
            project.name.toLowerCase().includes('diary') ? (
            <BookOpen className="w-10 h-10" />
          ) : project.name.toLowerCase().includes('sms') ? (
            <MessageSquare className="w-10 h-10" />
          ) : project.name.toLowerCase().includes('estate') ? (
            <Building className="w-10 h-10" />
          ) : (
            <FolderGit2 className="w-10 h-10" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4 justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h3 className="text-lg font-bold text-foreground">{project.name}</h3>
            {project.inProgress && <InProgressBadge />}
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {project.description[language]}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span key={tech} className="skill-tag text-[10px] px-2 py-0.5">
                {tech}
              </span>
            ))}
          </div>

          {/* Buttons */}
          {(project.link || project.github) && (
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              {project.link && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs flex items-center gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 flex-1"
                >
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{language === 'ru' ? 'Перейти' : 'Visit'}</span>
                  </a>
                </Button>
              )}

              {project.github && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs flex items-center gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 flex-1"
                >
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface GalleryThumbsProps {
  gallery: string[];
  active: number;
  onSelect: (i: number) => void;
  name: string;
}

/** Small switchable previews in the bottom-left corner of the image area */
function GalleryThumbs({ gallery, active, onSelect, name }: GalleryThumbsProps) {
  if (gallery.length < 2) return null;
  return (
    <div className="absolute left-2 bottom-2 z-10 flex gap-1 rounded-lg bg-card/70 p-1 backdrop-blur-md border border-border/50">
      {gallery.map((src, i) => (
        <button
          key={src}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${name}: ${i + 1} / ${gallery.length}`}
          aria-pressed={i === active}
          className={`no-gradient-border h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-md bg-muted transition-all duration-200 ${
            i === active ? 'ring-2 ring-primary opacity-100' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}

interface ProjectVideoProps {
  src: string;
  poster?: string;
  label: string;
}

/**
 * Muted looping clip that only downloads and plays while the card is on screen.
 * With "reduce motion" turned on it stays on the poster.
 */
function ProjectVideo({ src, poster, label }: ProjectVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — the poster stays */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="h-full w-full object-cover"
    />
  );
}

/** Small pill next to the title of a project that is still being built */
function InProgressBadge() {
  const { language } = useThemeLanguage();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      {uiTranslations[language].inProgress}
    </span>
  );
}
