import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderGit2, 
  Github, 
  Globe, 
  Activity, 
  Film, 
  BookOpen, 
  MessageSquare, 
  Building 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioData, uiTranslations } from '@/lib/portfolioData';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

export function ProjectsSection() {
  const { language } = useThemeLanguage();
  const t = uiTranslations[language];
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(6);

  const projects = portfolioData.projects;
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const handleToggleShow = () => {
    if (hasMore) {
      setVisibleCount(prev => Math.min(prev + 2, projects.length));
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
    <section id="projects" className="py-16">
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
            {visibleProjects.map((project, index) => {
              const hasError = imageErrors[project.name];
              return (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 6) * 0.1 }}
                  className="glass-card gradient-border overflow-hidden group hover:scale-[1.01] transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image / Fallback */}
                  {(project.image || project.mobileImage || project.logo) && !hasError ? (
                    <div className="h-56 sm:h-64 overflow-hidden border-b border-white/10 flex-shrink-0 relative group-hover:bg-black/10 transition-colors duration-500" style={{background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--accent) / 0.05))'}}>
                      
                      {/* Only Logo */}
                      {project.logo && !project.image && !project.mobileImage && (
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                           <img src={project.logo} alt={project.name} loading="lazy" onError={() => setImageErrors(prev => ({ ...prev, [project.name]: true }))} className="max-w-[80%] max-h-[80%] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      
                      {/* Both Desktop and Mobile Images */}
                      {project.image && project.mobileImage && (
                        <>
                          {/* Desktop view */}
                          <img 
                            src={project.image} 
                            loading="lazy" 
                            onError={() => setImageErrors(prev => ({ ...prev, [project.name]: true }))} 
                            className="hidden sm:block w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                            alt="desktop view" 
                          />
                          {/* Mobile view */}
                          <img 
                            src={project.mobileImage} 
                            loading="lazy" 
                            onError={() => setImageErrors(prev => ({ ...prev, [project.name]: true }))} 
                            className="block sm:hidden w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt="mobile view" 
                          />
                        </>
                      )}

                      {/* Only Desktop Image */}
                      {project.image && !project.mobileImage && (
                        <img
                          src={project.image}
                          alt={project.name}
                          loading="lazy"
                          onError={() => setImageErrors(prev => ({ ...prev, [project.name]: true }))}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      {/* Only Mobile Image */}
                      {!project.image && project.mobileImage && (
                        <img
                          src={project.mobileImage}
                          alt={project.name}
                          loading="lazy"
                          onError={() => setImageErrors(prev => ({ ...prev, [project.name]: true }))}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="h-56 sm:h-64 grid place-items-center border-b border-white/10 text-primary/70 flex-shrink-0" style={{background: 'linear-gradient(135deg, hsl(172 66% 50% / 0.08), hsl(280 70% 60% / 0.08))'}}>
                      {project.name.toLowerCase().includes('clinic') || project.name.toLowerCase().includes('medical') || project.name.toLowerCase().includes('navbat') ? (
                        <Activity className="w-10 h-10" />
                      ) : project.name.toLowerCase().includes('cinema') || project.name.toLowerCase().includes('asar') ? (
                        <Film className="w-10 h-10" />
                      ) : project.name.toLowerCase().includes('editor') || project.name.toLowerCase().includes('diary') ? (
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
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
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
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
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
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
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
            })}
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
        </motion.div>
      </div>
    </section>
  );
}
