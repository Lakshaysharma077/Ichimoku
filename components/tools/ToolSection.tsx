'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { IndicatorData } from './IndicatorCard';

interface ToolDocContentProps {
  indicator: IndicatorData;
  sectionId: string;
}

function parseFeatures(features: any): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [features];
    } catch {
      return features.split('\n').filter(Boolean);
    }
  }
  return [];
}

function parseCategories(category: any): string[] {
  if (!category) return [];
  if (Array.isArray(category)) return category;
  if (typeof category === 'string') {
    try {
      const parsed = JSON.parse(category);
      return Array.isArray(parsed) ? parsed : [category];
    } catch {
      return [category];
    }
  }
  return [];
}

function parsePriceLabel(priceLabel: string | undefined): string[] {
  if (!priceLabel) return [];
  return priceLabel.split('|').map((s) => s.trim()).filter(Boolean);
}

/** Render markdown-like text as structured paragraphs */
function renderTextContent(text: string) {
  if (!text) return null;

  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => {
        // Markdown header
        const headerMatch = para.match(/^#{1,4}\s+(.+)/);
        if (headerMatch) {
          return (
            <div key={i} className="tools-field-label" style={{ marginTop: i > 0 ? '24px' : '0' }}>
              {headerMatch[1].replace(/\*\*/g, '')}
            </div>
          );
        }

        // Bullet list
        const lines = para.split('\n');
        const isListBlock = lines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* ') || l.trim() === '');
        if (isListBlock && lines.filter((l) => l.trim()).length > 0) {
          return (
            <ul key={i} className="tools-feature-list">
              {lines.filter((l) => l.trim()).map((line, j) => (
                <li key={j}>{line.replace(/^[-*]\s+/, '').replace(/\*\*([^*]+)\*\*/g, '$1')}</li>
              ))}
            </ul>
          );
        }

        // Numbered list (1. **Label**: Description)
        const isNumberedList = lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === '');
        if (isNumberedList && lines.filter((l) => l.trim()).length > 0) {
          return (
            <div key={i} className="space-y-3">
              {lines.filter((l) => l.trim()).map((line, j) => {
                const content = line.replace(/^\d+\.\s+/, '');
                const boldMatch = content.match(/^\*\*([^*]+)\*\*[:\s]*(.*)/);
                if (boldMatch) {
                  return (
                    <div key={j}>
                      <span className="text-text-primary font-medium text-[13px]">{boldMatch[1]}</span>
                      {boldMatch[2] && <span className="text-text-secondary text-[13px]"> — {boldMatch[2]}</span>}
                    </div>
                  );
                }
                return <p key={j} className="tools-field-body text-[13px]">{content.replace(/\*\*([^*]+)\*\*/g, '$1')}</p>;
              })}
            </div>
          );
        }

        // Regular paragraph
        return <p key={i} className="tools-field-body">{para.replace(/\*\*([^*]+)\*\*/g, '$1')}</p>;
      })}
    </div>
  );
}

/**
 * Right-column content for a single documentation section.
 */
export default function ToolDocContent({ indicator, sectionId }: ToolDocContentProps) {
  const features = parseFeatures(indicator.features);
  const categories = parseCategories(indicator.category);
  const detailHref = `/tools/${indicator.slug || indicator.id}`;

  const accessStatus = indicator.accessStatus || 'Premium';
  const isComplimentary = accessStatus === 'Free';
  const prices = parsePriceLabel(indicator.priceLabel);

  switch (sectionId) {
    case 'overview':
      return (
        <div>
          <div className="tools-section-heading">Overview</div>
          <h2 className="tools-content-title syne">{indicator.name}</h2>
          <p className="tools-field-body mt-4">{indicator.description}</p>
          {indicator.overview && (
            <div className="mt-8">{renderTextContent(indicator.overview)}</div>
          )}
        </div>
      );


    case 'methodology':
      return (
        <div>
          <div className="tools-section-heading">Methodology</div>
          {indicator.howItWorks ? (
            <div className="tools-methodology-block">{renderTextContent(indicator.howItWorks)}</div>
          ) : (
            <p className="tools-field-body text-text-muted">Documentation not yet available.</p>
          )}
        </div>
      );

    case 'features':
      return (
        <div>
          <div className="tools-section-heading">Key Characteristics</div>
          {features.length > 0 ? (
            <ul className="tools-feature-list">
              {features.map((feat, i) => <li key={i}>{feat}</li>)}
            </ul>
          ) : (
            <p className="tools-field-body text-text-muted">Feature list not yet available.</p>
          )}
        </div>
      );

    case 'usage':
      return (
        <div>
          <div className="tools-section-heading">Usage</div>
          {indicator.howToUse ? (
            renderTextContent(indicator.howToUse)
          ) : (
            <p className="tools-field-body text-text-muted">Usage guide not yet available.</p>
          )}
        </div>
      );

    case 'examples':
      return (
        <div>
          <div className="tools-section-heading">Examples</div>
          {(() => {
            let shots: { url: string; title?: string; caption?: string }[] = [];
            if (typeof indicator.screenshots === 'string') {
              try { shots = JSON.parse(indicator.screenshots); } catch { shots = []; }
            } else if (Array.isArray(indicator.screenshots)) {
              shots = indicator.screenshots;
            }

            if (shots.length === 0) {
              return <p className="tools-field-body text-text-muted">No examples available.</p>;
            }

            return (
              <div className="space-y-8">
                {shots.map((shot, i) => (
                  <div key={i}>
                    {shot.title && (
                      <div className="tools-field-label" style={{ marginTop: i > 0 ? '32px' : '0' }}>
                        {shot.title}
                      </div>
                    )}
                    <div className="border border-border overflow-hidden mt-2">
                      <img src={shot.url} alt={shot.title || `Example ${i + 1}`} className="w-full h-auto" loading="lazy" />
                    </div>
                    {shot.caption && (
                      <p className="text-[12px] text-text-muted mt-2 leading-relaxed">{shot.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      );

    case 'access':
      return (
        <div>
          <div className="tools-section-heading">Access</div>
          {isComplimentary ? (
            <div className="tools-price-line">Complimentary</div>
          ) : accessStatus === 'Coming Soon' ? (
            <div className="tools-price-line">Coming Soon</div>
          ) : accessStatus === 'Deprecated' ? (
            <div className="tools-price-line">Discontinued</div>
          ) : accessStatus === 'Beta' ? (
            <div className="tools-price-line">Trial Access</div>
          ) : prices.length > 0 ? (
            <div>{prices.map((price, i) => <div key={i} className="tools-price-line">{price}</div>)}</div>
          ) : (
            <div className="tools-price-line">Contact for pricing</div>
          )}

          <div className="tools-field-label" style={{ marginTop: '32px' }}>Documentation</div>
          <Link href={detailHref} className="tools-link">
            <span>View full documentation</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {indicator.tvUrl && (
            <>
              <div className="tools-field-label">TradingView</div>
              <a href={indicator.tvUrl} target="_blank" rel="noopener noreferrer" className="tools-link">
                <span>Access script on TradingView</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </>
          )}
        </div>
      );

    default:
      return null;
  }
}
