'use client';

import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function DisclaimerPage() {
  const sections = [
    {
      title: "Educational Purposes Only",
      content: "Ichimoku Edge provides educational content, technical analysis tools, indicators, screeners, market commentary, and related resources for informational and educational purposes only. Nothing on this website, inside our tools, in our indicators, in our community, or in any related content should be considered financial advice, investment advice, trading advice, tax advice, legal advice, or any other form of professional advice. Ichimoku Edge does not tell you what to buy, sell, hold, trade, or invest in. All trading and investment decisions are your sole responsibility."
    },
    {
      title: "No Financial Advice",
      content: "Ichimoku Edge is not a financial adviser, investment adviser, broker, dealer, portfolio manager, or financial planner. We do not provide personalized investment recommendations and we do not assess your personal financial situation, objectives, risk tolerance, or trading experience. Any analysis, chart example, trading setup, indicator output, screener result, alert, strategy explanation, or educational material shared by Ichimoku Edge is general in nature and is not tailored to any individual person. You should always conduct your own research and, where appropriate, consult a qualified financial professional before making any trading or investment decision."
    },
    {
      title: "Trading Risk Disclaimer",
      content: "Trading and investing involve significant risk. You may lose part or all of your capital. Markets can be volatile, unpredictable, and affected by economic, political, technical, regulatory, and liquidity-related factors. You should never trade with money you cannot afford to lose. Before trading financial markets, including stocks, forex, futures, commodities, indices, cryptocurrencies, or any other asset class, you should carefully consider whether trading is suitable for your financial situation and risk tolerance. Past performance does not guarantee future results. No trading method, indicator, screener, strategy, or analytical framework can guarantee profits or prevent losses."
    },
    {
      title: "Indicators, Screeners, and Technical Tools",
      content: "The indicators, screeners, alerts, and technical tools provided by Ichimoku Edge are designed to assist with market analysis. They are not automatic trading systems and should not be interpreted as guaranteed buy or sell signals. Indicator outputs, screener results, alerts, projections, backtests, and chart examples are analytical tools only. They may help structure your analysis, but they do not remove risk and should not replace your own judgment. No indicator can predict future price movement with certainty. The performance of any tool may vary depending on the market, asset class, timeframe, volatility, liquidity, spread, data source, and market conditions. You are fully responsible for how you use Ichimoku Edge tools in your own trading process."
    },
    {
      title: "No Trading Signals or Recommendations",
      content: "Ichimoku Edge does not provide personalized trading signals, investment recommendations, or instructions to enter or exit trades. Any examples of trade setups, chart scenarios, support and resistance areas, Ichimoku signals, risk/reward structures, stop-loss areas, or potential targets are provided only to demonstrate technical analysis concepts. They should not be understood as instructions to place a trade or as recommendations to copy a specific position. You are solely responsible for your entries, exits, position sizing, risk management, and trading decisions."
    },
    {
      title: "Ichimoku Analysis and Market Commentary",
      content: "Ichimoku Edge focuses on Ichimoku Kinkō Hyō, technical analysis, market structure, and related analytical frameworks. Any market views, chart interpretations, or educational examples shared by Ichimoku Edge represent our own analytical perspective. They are not predictions, guarantees, or personalized advice. Markets can move against any analysis. A valid technical setup can fail. You should always apply your own judgment, risk management, and independent research."
    },
    {
      title: "Backtesting and Hypothetical Results",
      content: "Any backtests, historical examples, simulated results, strategy statistics, equity curves, or performance illustrations shown by Ichimoku Edge are hypothetical and for educational purposes only. Hypothetical performance has limitations. It does not represent live trading and may not account for real-world factors such as slippage, spreads, commissions, liquidity, execution delay, order fills, data differences, or changing market conditions. No representation is made that any account will achieve profits or losses similar to those shown in any example, backtest, or simulation."
    },
    {
      title: "Alerts and Automation",
      content: "Ichimoku Edge tools may include alerts, notifications, webhook-compatible features, or integrations with third-party platforms such as TradingView. Alerts are provided for informational and educational purposes only. Alert delivery is not guaranteed and may be delayed, interrupted, duplicated, or fail due to technical issues, platform limitations, internet connectivity, third-party services, or other factors outside our control. Ichimoku Edge does not execute trades, manage accounts, monitor your portfolio, or control any brokerage activity. You are fully responsible for how you use alerts, webhooks, automation tools, or third-party integrations."
    },
    {
      title: "Market Data and Platform Differences",
      content: "Market data, chart data, calculations, and indicator outputs may vary between platforms, brokers, exchanges, data providers, and timeframes. Results may differ due to differences in pricing data, candles, time zones, session settings, liquidity, spreads, contract specifications, corporate actions, rounding, or calculation methods. If you compare Ichimoku Edge tools with TradingView, broker platforms, exchanges, or other charting services, results may not always match exactly. All market data and tool outputs should be independently verified before making any trading decision."
    },
    {
      title: "TradingView Disclosure",
      content: "Some Ichimoku Edge indicators and tools may be built for or used on TradingView. TradingView\u00AE is a registered trademark of TradingView, Inc. Ichimoku Edge is not affiliated with, endorsed by, sponsored by, or officially connected with TradingView, Inc. Any use of TradingView charts, scripts, or platform features is subject to TradingView\u2019s own terms of service and policies. Ichimoku Edge retains all applicable intellectual property rights related to its indicator logic, tool design, educational content, branding, and proprietary materials."
    },
    {
      title: "Testimonials and Community Content",
      content: "Testimonials, user feedback, comments, or community posts may not be representative of typical results and should not be considered a guarantee of performance, profitability, or success. Trading results vary greatly between individuals depending on experience, discipline, risk management, psychology, market conditions, and many other factors. Opinions, trade ideas, or analysis shared by community members do not necessarily represent the views of Ichimoku Edge and should not be treated as financial advice or trading recommendations."
    },
    {
      title: "Limitation of Liability",
      content: "By using this website, our indicators, screeners, educational content, alerts, community, or any related service, you acknowledge that trading and investing involve risk and that you are solely responsible for your own decisions. Ichimoku Edge, its owner, team members, affiliates, partners, or service providers shall not be liable for any loss, damage, cost, or expense arising from your use of our website, tools, indicators, screeners, alerts, educational materials, market commentary, or community content. This includes, but is not limited to, trading losses, investment losses, missed opportunities, technical errors, data inaccuracies, service interruptions, alert failures, platform issues, or reliance on any information provided by Ichimoku Edge."
    },
    {
      title: "Acceptance of This Disclaimer",
      content: "By using Ichimoku Edge, you confirm that you have read, understood, and accepted this disclaimer. If you do not agree with this disclaimer, you should not use this website, our indicators, screeners, alerts, educational materials, community, or related services."
    }
  ];

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">
      <KanjiWatermark kanji="免責" className="bottom-10 left-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Risks Disclaimer
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              免責事項
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              Please understand the significant risks involved in financial trading before using our tools.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-12 bg-bg-secondary/50 border border-border rounded-3xl p-8 sm:p-12">
          {sections.map((section, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="space-y-4">
                <h2 className="syne font-bold text-2xl text-text-primary uppercase tracking-tight">{section.title}</h2>
                <p className="text-text-secondary leading-relaxed">{section.content}</p>
              </div>
            </ScrollReveal>
          ))}
          
          <ScrollReveal delay={0.6}>
            <div className="pt-8 border-t border-border">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Last Updated: May 2026</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
