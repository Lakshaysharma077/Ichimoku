'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Button from '@/components/ui/Button';
import { Youtube, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import EditableElement from '@/components/admin/EditableElement';

export default function EducationPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const education = useContent('education');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-24 relative overflow-hidden">

      
      <div className="max-w-2xl mx-auto px-4 sm:px-8 text-center relative z-10">
        <ScrollReveal>
          <div className="inline-flex p-6 bg-rose-500/10 rounded-full mb-8">
            <Youtube className="w-12 h-12 text-rose-500" />
          </div>
          
          <h1 className="syne font-extrabold text-4xl lg:text-[56px] text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
            <EditableElement section="education" path={['hero', 'heading']} content={education.hero.heading} />
          </h1>
          
          <p className="text-xl text-text-secondary leading-relaxed mb-12">
            <EditableElement section="education" path={['hero', 'description']} content={education.hero.description} />
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white flex gap-2 items-center">
              <Youtube className="w-5 h-5" /> 
              <EditableElement section="education" path={['buttons', 'youtube']} content={education.buttons.youtube} />
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="flex gap-2 items-center">
                <ArrowLeft className="w-4 h-4" /> 
                <EditableElement section="education" path={['buttons', 'back']} content={education.buttons.back} />
              </Button>
            </Link>
          </div>

          <div className="max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder={education.form.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <Button type="submit">
                  <EditableElement section="education" path={['form', 'button']} content={education.form.button} />
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 font-bold text-sm uppercase tracking-widest"
              >
                <EditableElement section="education" path={['form', 'success']} content={education.form.success} />
              </motion.div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
