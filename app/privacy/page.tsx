'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';
import { useContent } from '@/hooks/useContent';
import EditableElement from '@/components/admin/EditableElement';
import EditableList from '@/components/admin/EditableList';

export default function PrivacyPage() {
  const legal = useContent('legal');
  const privacy = legal.privacy;

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-4xl lg:text-[56px] text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              <EditableElement section="legal" path={['privacy', 'title']} content={privacy.title} />
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              <EditableElement section="legal" path={['privacy', 'description']} content={privacy.description} />
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-12 bg-bg-secondary/50 border border-border rounded-3xl p-8 sm:p-12">
          <EditableList
            section="legal"
            path={['privacy', 'sections']}
            items={[...privacy.sections]}
            newItemTemplate={{ title: "New Privacy Section", content: "Privacy details go here." }}
            renderItem={(section: any, i: number) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="space-y-4">
                  <h2 className="syne font-bold text-2xl text-text-primary uppercase tracking-tight">
                    <EditableElement section="legal" path={['privacy', 'sections', i.toString(), 'title']} content={section.title} />
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    <EditableElement section="legal" path={['privacy', 'sections', i.toString(), 'content']} content={section.content} as="span" />
                  </p>
                </div>
              </ScrollReveal>
            )}
          />

          <ScrollReveal delay={0.6}>
            <div className="pt-8 border-t border-border">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
                <EditableElement section="legal" path={['lastUpdated']} content={legal.lastUpdated} />
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
