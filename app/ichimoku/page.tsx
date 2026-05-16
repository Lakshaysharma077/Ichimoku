'use client';

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
    <div className="pt-40 pb-24 relative overflow-hidden">


      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-4xl lg:text-6xl text-text-primary mb-2 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              <EditableElement section="ichimoku" path={['hero', 'heading']} content={ichimoku.hero.heading} />
            </h1>
            <p className="shippori-mincho text-4xl lg:text-6xl text-text-muted mb-8 leading-none transform scale-y-[1.1] origin-left">
              <EditableElement section="ichimoku" path={['hero', 'japanese']} content={ichimoku.hero.japanese} />
            </p>
          </div>
          <p className="text-xl text-text-secondary max-w-3xl leading-relaxed">
            <EditableElement section="ichimoku" path={['hero', 'description']} content={ichimoku.hero.description} />
          </p>
        </ScrollReveal>
      </div>

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          newItemTemplate={{ name: 'New Component', kanji: '新', eng: 'New English', color: '#FFFFFF' }}
          renderItem={(item: any, i: number) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="h-full p-8 bg-bg-secondary border border-border rounded-2xl group hover:border-accent transition-all duration-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl text-text-primary font-bold">
                    <EditableElement section="ichimoku" path={['componentsSection', 'items', i.toString(), 'name']} content={item.name} />
                  </span>
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <span className="shippori-mincho text-sm text-text-muted mb-3 block">
                  <EditableElement section="ichimoku" path={['componentsSection', 'items', i.toString(), 'kanji']} content={item.kanji} />
                </span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block italic">
                  &quot;<EditableElement section="ichimoku" path={['componentsSection', 'items', i.toString(), 'eng']} content={item.eng} />&quot;
                </span>
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
          <div className="prose prose-invert prose-p:text-text-secondary prose-p:leading-relaxed space-y-6">
            {ichimoku.seoSection.paragraphs.map((p: string, i: number) => (
              <EditableElement key={i} section="ichimoku" path={['seoSection', 'paragraphs', i.toString()]} content={p} as="p" />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
