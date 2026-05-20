'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import SectionDivider from '@/components/shared/SectionDivider';
import { useContent } from '@/hooks/useContent';
import EditableElement from '@/components/admin/EditableElement';
import EditableList from '@/components/admin/EditableList';
import { useThemeStore } from '@/store/themeStore';

export default function IchimokuPage() {
  const ichimoku = useContent('ichimoku');
  const { theme } = useThemeStore();

  const getChartImg = () => {
    if (theme === 'signature') return '/ichimokuedgeth.png';
    if (theme === 'dark') return '/ichimokuchardark.png';
    return '/ichimokuchart.png';
  };
  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]">


      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-4xl lg:text-[56px] text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              <EditableElement section="ichimoku" path={['hero', 'heading']} content={ichimoku.hero.heading} />
            </h1>
            <p className="shippori-mincho text-4xl lg:text-[56px] text-text-muted mb-8 leading-none transform scale-y-[1.1] origin-left">
              <EditableElement section="ichimoku" path={['hero', 'japanese']} content={ichimoku.hero.japanese} />
            </p>
          </div>
          <p className="text-xl txt-body max-w-3xl leading-relaxed">
            <EditableElement section="ichimoku" path={['hero', 'description']} content={ichimoku.hero.description} />
          </p>
        </ScrollReveal>
      </div>

      {/* Meaning & Origin Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32 relative">
        <ScrollReveal>
          <div className="relative p-8 md:p-12 bg-bg-secondary/40 border border-border rounded-3xl backdrop-blur-md overflow-hidden">
            {/* Background Kanji Watermark */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-[0.03] text-[20vw] pointer-events-none font-serif select-none leading-none">
              一目均衡表
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
              {/* Left Column: Heading, Translation & Purpose */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <h2 className="syne font-bold text-3xl md:text-4xl text-text-primary uppercase mb-4 tracking-tight">
                    <EditableElement section="ichimoku" path={['meaningSection', 'heading']} content={ichimoku.meaningSection.heading} />
                  </h2>
                  <div className="mb-8">
                    <p className="txt-label mb-2">
                      <EditableElement section="ichimoku" path={['meaningSection', 'subheading']} content={ichimoku.meaningSection.subheading} />
                    </p>
                    <p className="shippori text-3xl text-accent font-bold tracking-wider mb-6">
                      <EditableElement section="ichimoku" path={['meaningSection', 'japaneseText']} content={ichimoku.meaningSection.japaneseText} />
                    </p>
                    
                    <div className="p-5 bg-bg-primary/80 border border-border/80 rounded-2xl shadow-lg relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <p className="txt-label mb-3">
                        <EditableElement section="ichimoku" path={['meaningSection', 'translationLabel']} content={ichimoku.meaningSection.translationLabel} />
                      </p>
                      <ul className="space-y-2">
                        {ichimoku.meaningSection.translations.map((trans: string, idx: number) => (
                          <li key={idx} className="text-lg font-bold text-text-primary italic">
                            <EditableElement section="ichimoku" path={['meaningSection', 'translations', idx.toString()]} content={trans} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 lg:mt-auto pt-6 border-t border-border/40">
                  <p className="text-base txt-body leading-relaxed font-sans">
                    <EditableElement section="ichimoku" path={['meaningSection', 'purpose']} content={ichimoku.meaningSection.purpose} />
                  </p>
                </div>
              </div>

              {/* Right Column: Character Meaning & Formula Breakdown */}
              <div className="lg:col-span-7 space-y-8">
                {/* Character meanings grid */}
                <div>
                  <h3 className="syne font-bold text-lg text-text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <EditableElement section="ichimoku" path={['meaningSection', 'characterTitle']} content={ichimoku.meaningSection.characterTitle} />
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ichimoku.meaningSection.characters.map((char: any, idx: number) => (
                      <div key={idx} className="p-6 bg-bg-primary/40 border border-border rounded-2xl hover:border-accent/40 hover:bg-bg-primary/60 transition-all duration-300 group">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="shippori text-3xl font-extrabold text-accent group-hover:scale-110 transition-transform duration-300 origin-left">
                            <EditableElement section="ichimoku" path={['meaningSection', 'characters', idx.toString(), 'char']} content={char.char} />
                          </span>
                          <span className="txt-label">
                            <EditableElement section="ichimoku" path={['meaningSection', 'characters', idx.toString(), 'name']} content={char.name} />
                          </span>
                        </div>
                        <p className="text-sm txt-muted leading-normal">
                          <EditableElement section="ichimoku" path={['meaningSection', 'characters', idx.toString(), 'desc']} content={char.desc} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mathematical breakdown */}
                <div className="p-6 bg-bg-primary/60 border border-border rounded-2xl relative overflow-hidden">
                  <h3 className="txt-label mb-4">
                    <EditableElement section="ichimoku" path={['meaningSection', 'breakdownTitle']} content={ichimoku.meaningSection.breakdownTitle} />
                  </h3>
                  
                  {/* Flow breakdown */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                    {ichimoku.meaningSection.breakdowns.map((b: any, idx: number) => (
                      <React.Fragment key={idx}>
                        <div className="flex items-center gap-3">
                          <span className="shippori text-2xl font-bold text-accent">
                            <EditableElement section="ichimoku" path={['meaningSection', 'breakdowns', idx.toString(), 'key']} content={b.key} />
                          </span>
                          <span className="txt-label whitespace-nowrap">
                            (= <EditableElement section="ichimoku" path={['meaningSection', 'breakdowns', idx.toString(), 'val']} content={b.val} />)
                          </span>
                        </div>
                        {idx < ichimoku.meaningSection.breakdowns.length - 1 && (
                          <span className="hidden sm:inline text-text-muted/60 text-lg font-mono">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <p className="text-sm text-text-primary font-bold leading-relaxed border-t border-border/40 pt-4 font-mono">
                    <EditableElement section="ichimoku" path={['meaningSection', 'conclusion']} content={ichimoku.meaningSection.conclusion} />
                  </p>
                </div>

                {/* Why This Matters Callout */}
                <div className="p-6 bg-accent/[0.02] border-l-2 border-accent rounded-r-2xl space-y-3">
                  <h4 className="syne font-bold text-sm text-accent uppercase tracking-wider">
                    <EditableElement section="ichimoku" path={['meaningSection', 'whyTitle']} content={ichimoku.meaningSection.whyTitle} />
                  </h4>
                  <p className="text-sm txt-body leading-relaxed font-sans">
                    <EditableElement section="ichimoku" path={['meaningSection', 'whyText1']} content={ichimoku.meaningSection.whyText1} />
                  </p>
                  <p className="text-sm txt-muted leading-relaxed font-sans italic">
                    <EditableElement section="ichimoku" path={['meaningSection', 'whyText2']} content={ichimoku.meaningSection.whyText2} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <SectionDivider />

      {/* 5 Components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <ScrollReveal>
          <h2 className="syne font-bold text-3xl text-text-primary uppercase mb-12">
            <EditableElement section="ichimoku" path={['componentsSection', 'heading']} content={ichimoku.componentsSection.heading} />
          </h2>
        </ScrollReveal>

        <EditableList
          section="ichimoku"
          path={['componentsSection', 'items']}
          items={ichimoku.componentsSection.items as any}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-16"
          newItemTemplate={{ name: 'New Component', kanji: '新', eng: 'New English', color: '#FFFFFF' }}
          renderItem={(item: any, i: number) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="h-[140px] p-5 bg-bg-secondary border border-border rounded-xl group hover:border-accent transition-all duration-200 flex flex-col justify-between w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base lg:text-lg text-text-primary font-bold tracking-tight">
                    <EditableElement section="ichimoku" path={['componentsSection', 'items', i.toString(), 'name']} content={item.name} />
                  </span>
                  <div className="w-10 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                </div>
                <div>
                  <span className="shippori-mincho text-xs text-text-muted mb-1.5 block">
                    <EditableElement section="ichimoku" path={['componentsSection', 'items', i.toString(), 'kanji']} content={item.kanji} />
                  </span>
                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest block italic">
                    &quot;<EditableElement section="ichimoku" path={['componentsSection', 'items', i.toString(), 'eng']} content={item.eng} />&quot;
                  </span>
                </div>
              </div>
            </ScrollReveal>
          )}
        />

        <ScrollReveal delay={0.6}>
          <div className="mt-12">
            <div className="max-w-2xl w-full p-3 bg-bg-secondary/60 backdrop-blur-md border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/20 transition-all duration-200">
              <div className="rounded-2xl overflow-hidden bg-bg-primary transition-colors duration-200">
                <img 
                  src={getChartImg()} 
                  alt="Ichimoku Chart — Five Lines Visualization"
                  className="w-full h-auto block transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <SectionDivider />

      {/* The Cloud */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <h2 className="syne font-bold text-4xl text-text-primary mb-8 uppercase">
              <EditableElement section="ichimoku" path={['cloudSection', 'heading']} content={ichimoku.cloudSection.heading} />
            </h2>
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                <EditableElement section="ichimoku" path={['cloudSection', 'description']} content={ichimoku.cloudSection.description} />
              </p>
              <ul className="space-y-4">
                <EditableList
                  section="ichimoku"
                  path={['cloudSection', 'rules']}
                  items={ichimoku.cloudSection.rules as any}
                  newItemTemplate={{ icon: "●", label: "New Rule", desc: "Description", color: "text-text-muted" }}
                  renderItem={(rule: any, i: number) => (
                    <li key={i} className="flex gap-4">
                      <span className={`font-bold ${rule.color}`}>{rule.icon}</span>
                      <span>
                        <strong><EditableElement section="ichimoku" path={['cloudSection', 'rules', i.toString(), 'label']} content={rule.label} />:</strong> 
                        <EditableElement section="ichimoku" path={['cloudSection', 'rules', i.toString(), 'desc']} content={rule.desc} />
                      </span>
                    </li>
                  )}
                />
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="aspect-video bg-bg-tertiary rounded-3xl border border-border p-8 relative overflow-hidden flex flex-col justify-center">
              {/* Simplified Cloud Diagram */}
              <div className="relative h-40">
                {/* Span A */}
                <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full text-emerald-500">
                  <path d="M0 60 Q 50 40, 100 50 T 200 30 T 300 40 T 400 20" fill="transparent" stroke="currentColor" strokeWidth="2" />
                </svg>
                {/* Span B */}
                <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full text-rose-500">
                  <path d="M0 80 Q 50 60, 100 70 T 200 50 T 300 60 T 400 40" fill="transparent" stroke="currentColor" strokeWidth="2" />
                </svg>
                {/* Cloud Fill */}
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />

                {/* Price Line */}
                <motion.svg
                  viewBox="0 0 400 100"
                  className="absolute inset-0 w-full h-full text-text-primary"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                >
                  <path d="M0 90 L 50 70 L 100 80 L 150 40 L 200 50 L 250 10 L 300 20 L 400 5" fill="transparent" stroke="currentColor" strokeWidth="3" />
                </motion.svg>
              </div>
              <div className="mt-8 flex justify-center gap-12 text-[10px] font-mono text-text-muted uppercase tracking-widest">
                {(ichimoku as any).cloudSection?.legend?.map((item: any, i: number) => (
                  <span key={i} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <EditableElement section="ichimoku" path={['cloudSection', 'legend', i.toString(), 'label']} content={item.label} />
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Settings Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <ScrollReveal>
          <h2 className="syne font-bold text-3xl text-text-primary mb-12 uppercase">
            <EditableElement section="ichimoku" path={['settingsSection', 'heading']} content={ichimoku.settingsSection.heading} />
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-secondary text-text-muted font-mono uppercase text-[10px] tracking-widest border-b border-border">
                <tr>
                  {(ichimoku as any).settingsSection?.table?.headers.map((header: string, i: number) => (
                    <th key={i} className="px-8 py-6">
                      <EditableElement section="ichimoku" path={['settingsSection', 'table', 'headers', i.toString()]} content={header} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-secondary">
                {(ichimoku as any).settingsSection?.table?.rows.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-bg-tertiary/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-text-primary">
                      <EditableElement section="ichimoku" path={['settingsSection', 'table', 'rows', i.toString(), 'style']} content={row.style} />
                    </td>
                    <td className="px-8 py-6 font-mono">
                      <EditableElement section="ichimoku" path={['settingsSection', 'table', 'rows', i.toString(), 'tk']} content={row.tk.toString()} />
                    </td>
                    <td className="px-8 py-6 font-mono">
                      <EditableElement section="ichimoku" path={['settingsSection', 'table', 'rows', i.toString(), 'kj']} content={row.kj.toString()} />
                    </td>
                    <td className="px-8 py-6 font-mono">
                      <EditableElement section="ichimoku" path={['settingsSection', 'table', 'rows', i.toString(), 's2']} content={row.s2.toString()} />
                    </td>
                    <td className="px-8 py-6 font-mono">
                      <EditableElement section="ichimoku" path={['settingsSection', 'table', 'rows', i.toString(), 'cs']} content={row.cs.toString()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>

      {/* SEO Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <h2 className="syne font-bold text-3xl text-text-primary mb-8 uppercase">
            <EditableElement section="ichimoku" path={['seoSection', 'heading']} content={ichimoku.seoSection.heading} />
          </h2>
          <div className="text-text-secondary space-y-6">
            {ichimoku.seoSection.paragraphs.map((p: string, i: number) => (
              <EditableElement key={i} section="ichimoku" path={['seoSection', 'paragraphs', i.toString()]} content={p} as="p" className="leading-relaxed" />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
