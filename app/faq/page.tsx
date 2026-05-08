'use client';

import { useState } from 'react';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Accordion from '@/components/ui/Accordion';
import { Search } from 'lucide-react';

const faqCategories = ["All", "Getting Started", "Ichimoku Trading", "Technical", "Billing & Pricing", "Indicators"];

const faqs = [
  {
    id: "q1",
    categories: ["Getting Started", "Ichimoku Trading"],
    question: "What is Ichimoku Edge?",
    answer: "Ichimoku Edge is a suite of TradingView tools built around the Ichimoku Kinkō Hyō system. The goal is to make Ichimoku analysis clearer, more structured, and easier to apply in real market conditions through clean visuals, dashboards, alerts, projections, and multi-timeframe tools."
  },
  {
    id: "q2",
    categories: ["Getting Started", "Ichimoku Trading"],
    question: "What is the \"Samurai Vision\" philosophy?",
    answer: "Samurai Vision is our core trading approach: disciplined, structured, and systematic. We use Ichimoku not as a simple standalone indicator, but as a complete market analysis framework: cloud position, Tenkan/Kijun momentum, Chikou confirmation, trend structure, and key equilibrium levels working together. No guessing. No overtrading. Structure first."
  },
  {
    id: "q3",
    categories: ["Getting Started", "Technical"],
    question: "Which platform are Ichimoku Edge indicators built on?",
    answer: "Ichimoku Edge indicators and strategies are built for the TradingView platform. You will need a TradingView account to use them. If you do not have one, you can create an account on TradingView here: https://www.tradingview.com/pricing/?share_your_love=ujgrcmzmke"
  },
  {
    id: "q4",
    categories: ["Getting Started", "Technical"],
    question: "Do I need a paid TradingView subscription?",
    answer: "Not always. Some Ichimoku Edge features may work on a free TradingView account, but a paid TradingView plan may be useful or necessary depending on how many indicators, alerts, layouts, charts, or screeners you want to use. For the best experience, a paid TradingView plan is recommended, especially if you use multiple tools or multi-timeframe analysis."
  },
  {
    id: "q5",
    categories: ["Getting Started", "Technical"],
    question: "Where do I find my TradingView username?",
    answer: "Your TradingView username is shown on your TradingView profile. It is not always the same as your email address. Please make sure you send your correct TradingView username when requesting access."
  },
  {
    id: "q6",
    categories: ["Technical", "Billing & Pricing"],
    question: "What happens if I change my TradingView username?",
    answer: "If you change your TradingView username, contact support with both your old and new TradingView usernames. Your access will need to be manually updated."
  },
  {
    id: "q7",
    categories: ["Technical"],
    question: "What if the indicator does not appear in my TradingView account?",
    answer: "First, make sure you are logged into the correct TradingView account. Then open TradingView, go to Indicators, and check your Invite-only scripts section. If the indicator still does not appear, contact support with your TradingView username and the email address used for your subscription."
  },
  {
    id: "q8",
    categories: ["Billing & Pricing", "Getting Started"],
    question: "Do you offer a trial version?",
    answer: "Yes. Subscription indicators include a 14-day trial period. This allows you to test the tools before committing to a paid subscription."
  },
  {
    id: "q9",
    categories: ["Billing & Pricing"],
    question: "What currency can I pay with?",
    answer: "Prices are displayed in USD. If you pay in another currency, the payment system will automatically apply the exchange rate and charge the equivalent amount in USD."
  },
  {
    id: "q10",
    categories: ["Billing & Pricing"],
    question: "Can I pay with cryptocurrency?",
    answer: "Yes. You can pay with cryptocurrency using USDT or USDC only. Several blockchain networks may be available, such as Tron, Arbitrum, and Ethereum. The exact payment address and network are shown during the checkout process. Always make sure you send the correct token on the correct network."
  },
  {
    id: "q11",
    categories: ["Billing & Pricing"],
    question: "Do you offer a discount for yearly billing?",
    answer: "Yes. Annual plans include 2 months free compared to monthly billing."
  },
  {
    id: "q12",
    categories: ["Billing & Pricing"],
    question: "Can I cancel my subscription anytime and get a refund?",
    answer: "Yes, you can cancel your subscription anytime. For monthly plans, your access continues until the end of your current billing period. Monthly payments are not refunded once the billing period has started. For annual plans, refunds may be handled on a prorated basis depending on how much of the subscription period has already been used."
  },
  {
    id: "q13",
    categories: ["Getting Started", "Indicators", "Ichimoku Trading"],
    question: "Can beginners use these indicators?",
    answer: "Yes. Beginners can use Ichimoku Edge indicators, but we recommend starting with our free educational content first so you understand the logic behind the system. The Ichimoku Edge Pro indicator includes built-in signal labels and on-chart interpretations, making it easier to understand than raw Ichimoku lines alone. The dashboard also helps you focus on higher-potential trading opportunities instead of trying to read every chart manually."
  },
  {
    id: "q14",
    categories: ["Ichimoku Trading", "Indicators"],
    question: "Does Ichimoku Edge work on stocks, crypto, forex, indices, and commodities?",
    answer: "Yes. Ichimoku can be applied to many liquid markets, including stocks, crypto, forex, indices, futures, and commodities. However, market conditions matter. Ichimoku generally works best when there is enough liquidity, clean price structure, and meaningful trend movement."
  },
  {
    id: "q15",
    categories: ["Indicators", "Ichimoku Trading"],
    question: "What timeframes do Ichimoku Edge indicators work on?",
    answer: "Ichimoku Edge indicators can be used on any timeframe, from intraday charts to daily, weekly, and monthly charts. Lower timeframes can produce more noise, while higher timeframes often provide cleaner structure."
  },
  {
    id: "q16",
    categories: ["Ichimoku Trading"],
    question: "Is Ichimoku better for day trading or swing trading?",
    answer: "Ichimoku can be used for both day trading and swing trading. However, it often shines in swing trading and structured trend analysis. On very low timeframes, market noise increases. On higher timeframes, Ichimoku structure is usually cleaner and more reliable. For intraday trading, multi-timeframe confirmation becomes especially important."
  },
  {
    id: "q17",
    categories: ["Ichimoku Trading"],
    question: "Can Ichimoku only be used as a trend-following system?",
    answer: "No. Although Ichimoku Kinkō Hyō is often classified as a trend-following system, it can also be used for different trading approaches. This includes trend continuation trading, correction or counter-trend trading, breakout trading, and level-to-level trading. The key is to understand market structure, not just follow signals mechanically."
  },
  {
    id: "q18",
    categories: ["Ichimoku Trading", "Getting Started"],
    question: "What about the time, price, and wave theories from Goichi Hosoda?",
    answer: "Goichi Hosoda's original work also included time theory, price observation theory, and wave theory. At this stage, these concepts are not the main priority for the website or indicators. They are also not required to trade Ichimoku profitably. Ichimoku Edge currently focuses first on the core structure of the system: trend, momentum, cloud analysis, equilibrium levels, Chikou confirmation, and multi-timeframe context. These advanced Hosoda theories may be introduced later as the platform evolves and other milestones are reached."
  },
  {
    id: "q19",
    categories: ["Technical", "Indicators"],
    question: "Do Ichimoku Edge indicators repaint?",
    answer: "The core Ichimoku calculations do not repaint when based on confirmed candle data. However, live candles can change while they are still forming. If a feature uses the current live candle, values may update until that candle closes. Once the candle is closed, signals based on closed-candle confirmation are fixed. For more conservative analysis, use closed-candle confirmation."
  },
  {
    id: "q20",
    categories: ["Technical", "Indicators"],
    question: "What is the difference between live candle mode and closed candle mode?",
    answer: "Live candle mode updates immediately as the current candle moves. This gives faster information, but values can change before the candle closes. Closed candle mode uses the last completed candle. This is slower, but more stable, and is often better for confirmation-based trading."
  },
  {
    id: "q21",
    categories: ["Technical", "Indicators"],
    question: "Do you update the indicators regularly?",
    answer: "Yes. Indicators are updated when necessary to improve performance, optimize script logic, fix bugs, and maintain compatibility with the latest TradingView Pine Script version. Minor updates may happen regularly. Larger updates may also be released when they add meaningful value to the Ichimoku Edge system."
  },
  {
    id: "q22",
    categories: ["Technical", "Indicators"],
    question: "Can I request a new feature or improvement?",
    answer: "Yes. You can suggest improvements or new features for existing indicators. Feature requests are considered when they add value to the Ichimoku system, are technically feasible within TradingView and Pine Script limitations, and fit the overall logic of the tool. We may accept or decline requests depending on timing, feasibility, and whether the feature benefits the broader Ichimoku Edge user base."
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.categories.includes(activeCategory);
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Map the internal data format to the Accordion item format
  const accordionItems = filteredFaqs.map(faq => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <div className="pt-40 pb-24 relative overflow-hidden">
      <KanjiWatermark kanji="知識" className="bottom-10 right-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Frequently Asked Questions
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              よくある質問
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
            {accordionItems.length > 0 ? (
              <Accordion items={accordionItems} />
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
