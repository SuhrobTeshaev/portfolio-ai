import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { supabase } from '@/integrations/supabase/client';

const contactTranslations = {
  ru: {
    title: 'Связаться со мной',
    subtitle: 'Отправьте сообщение, и я отвечу вам в ближайшее время.',
    nameLabel: 'Ваше имя *',
    namePlaceholder: 'Иван Иванов',
    contactLabel: 'Контакт для связи (опционально)',
    contactPlaceholder: 'Telegram, email или телефон',
    messageLabel: 'Сообщение *',
    messagePlaceholder: 'Опишите ваш вопрос или предложение...',
    sendButton: 'Отправить сообщение',
    sendingButton: 'Отправка...',
    successMessage: 'Сообщение отправлено! Я отвечу вам в ближайшее время.',
    errorMessage: 'Ошибка отправки. Попробуйте написать мне напрямую.',
    requiredFields: 'Пожалуйста, заполните все обязательные поля.',
    rateLimited: 'Слишком много запросов. Попробуйте через 10 минут.',
  },
  en: {
    title: 'Get in Touch',
    subtitle: "Send a message and I'll get back to you as soon as possible.",
    nameLabel: 'Your Name *',
    namePlaceholder: 'John Doe',
    contactLabel: 'Contact Info (optional)',
    contactPlaceholder: 'Telegram, email or phone number',
    messageLabel: 'Message *',
    messagePlaceholder: 'Describe your question or proposal...',
    sendButton: 'Send Message',
    sendingButton: 'Sending...',
    successMessage: "Message sent! I'll get back to you soon.",
    errorMessage: 'Failed to send. Please write to me directly.',
    requiredFields: 'Please fill in all required fields.',
    rateLimited: 'Too many requests. Please try again in 10 minutes.',
  },
};

export function ContactSection() {
  const { language } = useThemeLanguage();
  const t = contactTranslations[language];

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: '',
    website: '', // honeypot
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg(null);

    // Honeypot: silently succeed — bots won't notice
    if (formData.website) {
      setStatus('success');
      setFormData({ name: '', contact: '', message: '', website: '' });
      return;
    }

    // Client-side validation
    if (!formData.name.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMsg(t.requiredFields);
      return;
    }

    try {
      const { error, data } = await supabase.functions.invoke('portfolio-contact', {
        body: {
          name: formData.name,
          contact: formData.contact,
          message: formData.message,
          website: formData.website,
        },
      });

      // supabase-js wraps non-2xx as an error; check for 429 specifically
      if (error) {
        const is429 =
          error.message?.includes('429') ||
          (error as { status?: number }).status === 429 ||
          (data as { error?: string } | null)?.error?.toLowerCase().includes('too many');

        throw new Error(is429 ? t.rateLimited : t.errorMessage);
      }

      setStatus('success');
      setFormData({ name: '', contact: '', message: '', website: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.errorMessage;
      console.error('Contact form error:', err);
      setStatus('error');
      setErrorMsg(message);
    }
  };

  return (
    <section id="contact" className="py-16 ">
      <div className="container w-full max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-3 justify-center">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">{t.title}</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">{t.subtitle}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card gradient-border p-6 md:p-8 max-w-2xl mx-auto w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot — hidden from humans, visible to bots */}
              <div className="absolute -top-[9999px] -left-[9999px]" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-sm font-medium">
                  {t.nameLabel}
                </Label>
                <Input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  required
                  disabled={status === 'sending'}
                  className="glass-input"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact-info" className="text-sm font-medium">
                  {t.contactLabel}
                </Label>
                <Input
                  id="contact-info"
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder={t.contactPlaceholder}
                  disabled={status === 'sending'}
                  className="glass-input"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sm font-medium">
                  {t.messageLabel}
                </Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.messagePlaceholder}
                  required
                  rows={5}
                  disabled={status === 'sending'}
                  className="glass-input resize-none"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-4">
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{t.successMessage}</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'sending' ? t.sendingButton : t.sendButton}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
