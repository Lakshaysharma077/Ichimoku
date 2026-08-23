import { Indicator } from "@/store/adminStore";

export const seedIndicators: Indicator[] = [
  {
    id: "ichimoku-kinko-hyo",
    name: "Ichimoku Kinkō Hyō - (一目均衡表)",
    slug: "ichimoku-kinko-hyo",
    description: "The complete, institutional-grade Ichimoku Kinkō Hyō suite for TradingView. Features classic Tenkan/Kijun/Span lines, multi-component flat level equilibrium detection with confluence merging, conditional forward projections, multi-language support, and real-time structural status tables.",
    thumbnail: "/ichimokuedgeth.png",
    screenshots: [
      {
        url: "https://s3.tradingview.com/4/4EpIOEMu_big.png",
        title: "Ichimoku Kinkō Hyō System Overview",
        caption: "Complete Ichimoku Cloud layout with Tenkan-sen, Kijun-sen, Senkou Spans, Chikou Span, and dynamic equilibrium flat levels."
      },
      {
        url: "/ichimokuedgeth.png",
        title: "Equilibrium Flat Levels & Confluence",
        caption: "Detailed view showing Tenkan, Kijun, and Senkou Span B flat level support/resistance projections across key market zones."
      },
      {
        url: "/ichimokuchart.png",
        title: "Real-time Structure & Projection Table",
        caption: "In-depth status matrix displaying price position relative to Kumo, Chikou Span historical alignment, and forward projections."
      }
    ],
    overview: "Ichimoku Kinkō Hyō (一目均衡表, 'One-Look Equilibrium Chart') is Goichi Hosoda’s timeless technical analysis system, engineered to provide instant clarity on trend direction, momentum, equilibrium zones, and future support/resistance.\n\nDeveloped specifically by Ichimoku Edge in Pine Script v5, this indicator elevates the classic 5-line system with institutional enhancements: multi-component flat level detection, near-flat tolerance merging, conditional forward projections assuming no new highs/lows, and an on-chart structural relationship table.",
    howItWorks: "The indicator computes and plots the 5 foundational Ichimoku equilibrium lines together with advanced algorithmic structural modules:\n\n1. **Tenkan-sen (転換線 / Conversion Line)**: Midpoint of the 9-period highest high and lowest low. Gauges immediate short-term momentum.\n2. **Kijun-sen (基準線 / Base Line)**: Midpoint of the 26-period highest high and lowest low. Represents medium-term trend equilibrium and dynamic support/resistance.\n3. **Senkou Span A (先行スパンA / Leading Span A)**: Midpoint of Tenkan-sen and Kijun-sen projected 26 periods into the future.\n4. **Senkou Span B (先行スパンB / Leading Span B)**: Midpoint of the 52-period highest high and lowest low projected 26 periods into the future.\n5. **Chikou Span (遅行スパン / Lagging Span)**: Current closing price projected 26 periods backwards for historical obstacle clearance.\n6. **Kumo (Cloud)**: The dynamic region bounded between Senkou Span A and B, acting as a forward-looking equilibrium barrier.\n7. **Flat Levels & Confluence Engine**: Detects horizontal spans where Kijun-sen or Senkou Span B remain flat for multiple bars, marking strong institutional equilibrium prices. Optional multi-source confluence detection merges nearby levels within user-defined tolerance.\n8. **Forward Projection Rays**: Conditionally projects equilibrium levels forward based on the rule that without a new high or low, future lines remain mathematically fixed.",
    features: [
      "Full 5-component Ichimoku Kinkō Hyō Pine Script v5 implementation",
      "Individual and multi-component Flat Level Equilibrium detection",
      "Near-Flat merging with customizable percentage tolerance",
      "Conditional Forward Projection Lines (No New High/Low assumption)",
      "On-chart Real-time Status Table (Price vs Kumo, Chikou vs Price, Structure & Projection)",
      "Multi-language label terminology (Romanized Japanese, Japanese Kanji, English)",
      "Adjustable distance units (Percentage %, Pips, Points)",
      "Adaptive color modes for high-contrast light and midnight dark themes",
      "Ray-to-right and full horizontal extension modes for structural levels",
      "Nearest vs Strongest level selection and ranking algorithm"
    ],
    howToUse: "### 1. Add to TradingView\nClick the 'Access Script on TradingView' button, then click 'Add to Favorite Scripts' on the TradingView indicator page. In TradingView charts, open Indicators (/) and click the script.\n\n### 2. Identifying Trend & Equilibrium\n- **Bullish Bias**: Price trades cleanly above the Kumo Cloud with Tenkan-sen above Kijun-sen, and Chikou Span clear of historical price action.\n- **Bearish Bias**: Price trades below the Kumo Cloud with Tenkan-sen below Kijun-sen.\n- **Equilibrium & Reversion**: Watch when price stretches far from the Kijun-sen or approaches flat Senkou Span B levels.\n\n### 3. Using Flat Level Confluence\nEnable 'Show flat levels' in indicator settings. Look for levels where both Kijun-sen and Senkou Span B flatten at identical or near-identical prices. These multi-component confluence levels act as high-probability magnets and structural pivots.\n\n### 4. Reading the On-Chart Matrix Table\nCheck the top-right matrix table at a glance for:\n- Current Price location relative to Cloud top/bottom\n- Chikou Span clearance against past price candles\n- Forward Kumo twist direction and conditional projections",
    badgeType: "PREMIUM",
    price: "$22/mo",
    tvUrl: "https://www.tradingview.com/script/4EpIOEMu-Ichimoku-Kinko-Hyo/",
    category: ["ICHIMOKU", "CORE", "EQUILIBRIUM", "PINE SCRIPT V5"],
    status: "Published",
    sortOrder: 1,
    rating: 5.0,
    numRatings: 72,
  },
];
