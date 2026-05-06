'use client';

import { useState } from 'react';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Accordion from '@/components/ui/Accordion';
import { Search } from 'lucide-react';

const faqCategories = ["All", "Getting Started", "Billing & Pricing", "Indicators", "Technical", "Ichimoku Trading"];

const faqs = [
  {
    id: "q1",
    category: "Getting Started",
    question: "Do I need TradingView to use Ichimoku Edge indicators?",
    answer: "Yes. All our indicators are Pine Script v5 scripts built for TradingView. You will need at minimum a TradingView Free account. However, a TradingView Pro account is recommended to access multiple layouts and additional indicators simultaneously."
  },
  {
    id: "q2",
    category: "Getting Started",
    question: "How do I add an indicator to my TradingView chart?",
    answer: "After subscribing, you'll receive an invite link to our TradingView published scripts. Click 'Add to Favorite Indicators' on the script page. Then, on any chart, click the Indicators button → Favorites → select the Ichimoku Edge indicator you want to apply."
  },
  {
    id: "q3",
    category: "Getting Started",
    question: "Do you offer a free trial?",
    answer: "Yes! All paid plans include a 14-day full-access free trial. You can access every premium indicator without entering a credit card. The trial starts when you create your account."
  },
  {
    id: "q4",
    category: "Getting Started",
    question: "What is the 'Samurai Vision' philosophy?",
    answer: "Samurai Vision is our core trading approach: disciplined, structured, systematic. We use the Ichimoku system not as a standalone indicator but as a complete market analysis framework — reading cloud position, TK cross momentum, and Chikou confirmation together. No guessing. No overtrading."
  },
  {
    id: "q5",
    category: "Billing & Pricing",
    question: "Is billing in CAD or USD?",
    answer: "All card payments via Stripe are processed in Canadian Dollars (CAD). Crypto payments are accepted in BTC, ETH, or USDT at the equivalent CAD value at time of payment."
  },
  {
    id: "q6",
    category: "Billing & Pricing",
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. Cancel anytime from your account dashboard with one click. You will retain full access until the end of your current billing period. No cancellation fees. No questions asked."
  },
  {
    id: "q7",
    category: "Billing & Pricing",
    question: "Is there a refund policy?",
    answer: "Given the 14-day free trial, we do not offer refunds after a payment is processed. If you have concerns before subscribing, contact us and we will gladly extend your trial period."
  },
  {
    id: "q8",
    category: "Billing & Pricing",
    question: "Do you offer a discount for yearly billing?",
    answer: "Yes — choosing yearly billing saves you 20% compared to monthly. Crypto payments also receive an additional 3% discount."
  },
  {
    id: "q9",
    category: "Indicators",
    question: "How many charts can I use the indicators on?",
    answer: "Your subscription covers one TradingView account. You can use all indicators on unlimited charts within that account. If you need multi-seat access, contact us for team pricing."
  },
  {
    id: "q10",
    category: "Indicators",
    question: "Do you update the indicators regularly?",
    answer: "Yes. All indicators are actively maintained. Major TradingView platform updates are addressed within 2-4 weeks. Feature updates and improvements are pushed monthly and announced in Discord."
  },
  {
    id: "q11",
    category: "Indicators",
    question: "Are the indicators compatible with crypto, forex, and stocks?",
    answer: "Yes. All Ichimoku Edge indicators work on any asset class available on TradingView — including cryptocurrency, forex pairs, stocks, indices, commodities, and futures."
  },
  {
    id: "q12",
    category: "Technical",
    question: "What TradingView plan do I need?",
    answer: "Minimum: TradingView Free (Basic). Recommended: TradingView Pro or Pro+ for multiple indicators, saved layouts, and more chart windows."
  },
  {
    id: "q13",
    category: "Technical",
    question: "Do indicators repaint?",
    answer: "No. All signals are confirmed on bar close. We specifically design our alerts to fire only on confirmed candle closes to avoid false signals from intra-bar repainting. This is clearly documented in each indicator's description."
  },
  {
    id: "q14",
    category: "Ichimoku Trading",
    question: "What is the best timeframe for Ichimoku trading?",
    answer: "Ichimoku works on all timeframes but is most reliable on the 4H and 1D charts where price action is less noisy. Our Multi-Timeframe Dashboard lets you check alignment across 1H, 4H, and 1D simultaneously — one of the most powerful use cases of our toolset."
  },
  {
    id: "q15",
    category: "Ichimoku Trading",
    question: "Can beginners use these indicators?",
    answer: "Yes, though we recommend completing our free YouTube education series first. Our Ichimoku Edge Pro indicator includes built-in signal labels and interpretations on-chart, making it much easier to understand than raw Ichimoku lines. The dashboard tells you what the cloud is saying — you focus on the trade."
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-40 pb-24 relative overflow-hidden">
      <KanjiWatermark kanji="知識" className="bottom-10 right-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tighter leading-[0.9]">
              Frequently Asked Questions
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              「よくある質問」
            </p>
          </ScrollReveal>
        </div>

        {/* Search Bar */}
        <ScrollReveal delay={0.1}>
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-2xl py-4 pl-12 pr-6 text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </ScrollReveal>

        {/* Categories */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-accent text-bg-primary' 
                    : 'bg-bg-secondary text-text-muted hover:text-text-primary border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="bg-bg-primary border border-border rounded-3xl p-8 min-h-[400px]">
            {filteredFaqs.length > 0 ? (
              <Accordion items={filteredFaqs} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-text-muted font-mono uppercase tracking-widest">No results for "{searchQuery}".</p>
                <button 
                  onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
                  className="mt-4 text-accent hover:underline text-sm font-bold uppercase tracking-widest"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
