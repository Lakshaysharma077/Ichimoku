/**
 * Centralized Content System for Ichimoku Edge
 * Use this file to update any static text on the website without touching the UI code.
 */

export const staticContent = {
  // Navigation Bar
  navbar: {
    logo: {
      text: "ICHIMOKU",
      subtext: "EDGE"
    },
    links: [
      { name: 'Home', href: '/' },
      { name: 'Ichimoku', href: '/ichimoku' },
      {
        name: 'Resources',
        href: '/education',
        dropdown: [
          { name: 'Education Hub', href: '/education' },
          { name: 'Glossary', href: '/glossary' },
          { name: 'FAQ', href: '/faq' },
        ]
      },
      { name: 'Tools', href: '/tools' },
      { name: 'Pricing', href: '/pricing' },
    ],
    loginButton: 'LOGIN / REGISTER',
  },

  // Home Page - Hero Section
  hero: {
    tagline: 'Professional Trading Tools — Since 2021',
    headline: ['See', 'the', 'Market', 'Clearly.'],
    description: 'The Ichimoku Edge indicator suite transforms complex Ichimoku Kinko Hyo signals into instant, actionable intelligence. Built for traders who value discipline over noise.',
    buttons: {
      primary: { text: 'Start Free Trial', href: '/pricing' },
      secondary: { text: 'View Indicators', href: '/tools' }
    },
    trustBadges: {
      rating: '★★★★★',
      traders: 'Trusted by 1,200+ traders on TradingView',
      platform: 'Available on TradingView Pine Script v5'
    },
    mockup: {
      badge: 'ICHIMOKU EDGE PRO',
      stats: [
        { label: "Cloud Signal", value: "BULLISH ▲", sub: "Strong Confirmation" },
        { label: "TK Cross", value: "ACTIVE", sub: "Bullish Breakout" },
        { label: "Kumo Twist", value: "3 BARS", sub: "Recent Change" },
      ],
      chikouLabel: "Chikou Span"
    }
  },

  // Home Page - Stats Bar
  stats: [
    { value: 1200, label: 'Active Traders', suffix: '+' },
    { value: 12, label: 'Indicators & Scripts', suffix: '+' },
    { value: 4.9, label: 'TradingView Rating', suffix: '★' },
    { value: 14, label: 'Free Trial, No Card', suffix: ' Days' },
  ],

  // Home Page - Philosophy Section
  philosophy: {
    label: 'HOME',
    heading: 'Trading demands the discipline of a Samurai.',
    paragraphs: [
      'The Ichimoku system was not built for guessing. It was built for clarity. Like a Samurai who sees the battlefield before the enemy moves, the Ichimoku Edge indicator reveals market structure before price confirms.',
      'We do not chase signals. We read the cloud, the baseline, and the conversion line together — as a unified system. No indicator overload. No noise. Just structure.',
      'Samurai Vision means you act from a position of knowledge, not fear. Every entry has a reason. Every exit has a plan.'
    ],
    pillars: [
      { icon: '⚔', title: 'Discipline', text: 'Follow the system, not your emotions.' },
      { icon: '🎯', title: 'Structure', text: 'The cloud never lies. The trend is clear.' },
      { icon: '⏱', title: 'Speed', text: 'Dashboards built to save you hours daily.' },
    ]
  },

  // Home Page - Dashboard Previews
  dashboard: {
    heading: 'Time-Saving Dashboards',
    japaneseHeading: '時間節約ダッシュボード',
    subtitle: 'One glance. Full market context.',
    previews: [
      { title: "Multi-Timeframe Ichimoku Table", badge: "LIVE PREVIEW" },
      { title: "Trend Strength Meter", badge: "LIVE PREVIEW" },
      { title: "Signal Alert Panel", badge: "LIVE PREVIEW" },
    ],
    featureSection: {
      heading: "Premium Indicator Visuals",
      description: "Experience crystal-clear signals on your TradingView charts. Our suite is designed to adapt to your workspace—whether you trade in high-contrast light or midnight dark themes.",
      features: [
        "Clean TK Cross Identification",
        "Dynamic Kumo Cloud Transparency",
        "Adaptive Background Coloring",
        "Institutional-Grade Typography"
      ],
      button: "Explore All Tools →"
    }
  },

  // Footer
  footer: {
    brand: {
      name: "Ichimoku Edge",
      tagline: "Educational tools only. Trading involves risk. Not financial advice.",
      copyright: "2026 ICHIMOKU EDGE. ALL RIGHTS RESERVED.",
      logo: "/logo_final.png"
    },
    sections: [
      {
        title: "Platform",
        links: [
          { name: 'Home', href: '/' },
          { name: 'Ichimoku', href: '/ichimoku' },
          { name: 'Tools', href: '/tools' },
          { name: 'Resources', href: '/education' },
          { name: 'Pricing', href: '/pricing' },
        ]
      },
      {
        title: "Legal",
        links: [
          { name: 'Terms of Service', href: '/terms' },
          { name: 'Risk Disclaimer', href: '/disclaimer' },
          { name: 'Privacy Policy', href: '/privacy' },
          { name: 'Refund Policy', href: '/refund' },
          { name: 'Cookie Policy', href: '/cookies' },
        ]
      },
      {
        title: "Support",
        links: [
          { name: 'FAQ', href: '/faq' },
          { name: 'Contact Us', href: '#' },
          { name: 'Report an Issue', href: '#' },
        ]
      }
    ],
    settings: {
      title: "Settings",
      themeLabel: "Display Mode"
    },
    socials: {
      tradingview: "https://www.tradingview.com/u/IchimokuEdge/",
      youtube: "https://www.youtube.com/@IchimokuEdge",
      x: "https://x.com/IchimokuEdge",
      discord: "#"
    }
  },

  // Ichimoku Page
  ichimoku: {
    hero: {
      heading: "Ichimoku Kinkō Hyō",
      japanese: "一目均衡表",
      description: "Ichimoku Kinkō Hyō, commonly known as the Ichimoku Cloud, is a versatile charting system that identifies trend direction, gauges momentum, and reveals support and resistance levels. It offers a \"single glance\" view of the market."
    },
    componentsSection: {
      heading: "The Five Lines of Ichimoku",
      items: [
        { name: 'Tenkan-Sen', kanji: '転換線', eng: 'Conversion Line', desc: '9-period midpoint of the high and low.', color: '#00B4D8' },
        { name: 'Kijun-Sen', kanji: '基準線', eng: 'Base Line', desc: '26-period midpoint of the high and low.', color: '#EF4444' },
        { name: 'Senkou Span A', kanji: '先行スパンA', eng: 'Leading Span A', desc: 'Average of Tenkan and Kijun, plotted 26 periods ahead.', color: '#10B981' },
        { name: 'Senkou Span B', kanji: '先行スパンB', eng: 'Leading Span B', desc: '52-period midpoint, plotted 26 periods ahead.', color: '#F59E0B' },
        { name: 'Chikou Span', kanji: '遅行スパン', eng: 'Lagging Span', desc: 'Closing price plotted 26 periods behind.', color: '#94A3B8' },
      ],
      image: "/ichimoku-guide.png"
    },
    cloudSection: {
      heading: "How to Read the Cloud",
      description: "The Kumo (Cloud) is the heart of the system. Formed by Senkou Span A and B, it represents a dynamic zone of support and resistance.",
      rules: [
        { icon: "▲", label: "Price Above Cloud:", desc: "Strong Bullish Sentiment.", color: "text-emerald-500" },
        { icon: "●", label: "Price Inside Cloud:", desc: "Neutral / Consolidation Zone.", color: "text-text-muted" },
        { icon: "▼", label: "Price Below Cloud:", desc: "Strong Bearish Sentiment.", color: "text-rose-500" },
      ],
      legend: [
        { label: "Span A", color: "bg-emerald-500" },
        { label: "Span B", color: "bg-rose-500" },
        { label: "Price", color: "bg-text-primary" },
      ],
      image: "/ichimoku-cloud.png"
    },
    settingsSection: {
      heading: "Ichimoku Settings",
      table: {
        headers: ["Style", "Conversion (TK)", "Base (KJ)", "Leading B (S2)", "Lagging (CS)"],
        rows: [
          { style: 'Classic (Original)', tk: 9, kj: 26, s2: 52, cs: 26 },
          { style: 'Modern (Stock)', tk: 10, kj: 30, s2: 60, cs: 30 },
          { style: 'Crypto-Adapted', tk: 20, kj: 60, s2: 120, cs: 30 },
        ]
      }
    },
    seoSection: {
      heading: "What is Ichimoku Kinkō Hyō?",
      paragraphs: [
        "Developed in the late 1930s by Goichi Hosoda, a Japanese journalist who used to be known as Ichimoku Sanjin, Ichimoku Kinkō Hyō translates to \"one-look equilibrium chart.\" Hosoda spent 30 years perfecting the system before releasing it to the public in 1968.",
        "Unlike traditional technical indicators that focus on a single aspect of market behavior, Ichimoku is a comprehensive framework. It provides a holistic view of price action, trend strength, and potential reversal points. Many traders find it superior to standard moving average crossovers because it accounts for the element of time, not just price.",
        "The system is built on five distinct lines, each calculated based on the midpoints of highs and lows over specific periods. This focus on midpoints rather than closing prices makes the system more sensitive to market volatility and helps filter out noise.",
        "In modern trading, Ichimoku has become a staple for institutional traders in Japan and is rapidly gaining popularity among Western forex and crypto traders. Its ability to define trend and support/resistance simultaneously makes it an essential tool for any disciplined trader seeking market clarity."
      ]
    }
  },

  // Glossary Page
  glossary: {
    heading: "Ichimoku Glossary",
    toggleLabels: {
      label: "Version Select",
      main: "Main",
      extended: "Extended"
    },
    tableHeaders: [
      "Romanized Japanese",
      "Japanese",
      "English Translation"
    ],
    footerLabel: "Showing {count} Terms",
    mainWords: [
      "Ichimoku Kinkō Hyō",
      "Tenkan-sen",
      "Kijun-sen",
      "Senkō Span A",
      "Senkō Span B",
      "Chikō Span",
      "Kumo"
    ],
    data: [
      { romanized: "Ichimoku Kinkō Hyō", japanese: "一目均衡表", english: "One-Glance Equilibrium Chart" },
      { romanized: "Tenkan-sen", japanese: "転換線", english: "Conversion Line" },
      { romanized: "Kijun-sen", japanese: "基準線", english: "Base Line" },
      { romanized: "Senkō Span A", japanese: "先行スパンA", english: "Leading Span A" },
      { romanized: "Senkō Span B", japanese: "先行スパンB", english: "Leading Span B" },
      { romanized: "Chikō Span", japanese: "遅行スパン", english: "Lagging Span" },
      { romanized: "Kumo", japanese: "雲", english: "Cloud" },
      { romanized: "Kumo no nejire", japanese: "雲のねじれ", english: "Cloud Twist" },
      { romanized: "Kumo-nuke", japanese: "雲抜け", english: "Cloud Breakout" },
      { romanized: "Tenkan-sen to Kijun-sen no kurosu", japanese: "転換線と基準線のクロス", english: "Tenkan-Kijun Cross" },
      { romanized: "Kōten", japanese: "好転", english: "Bullish Turn / Positive Turn" },
      { romanized: "Gyakuten", japanese: "逆転", english: "Bearish Turn / Reversal" },
      { romanized: "Kijun-sen hanpatsu", japanese: "基準線反発", english: "Kijun Bounce" },
      { romanized: "Tenkan-sen hanpatsu", japanese: "転換線反発", english: "Tenkan Bounce" },
      { romanized: "Jōshō-gumo", japanese: "上昇雲", english: "Bullish Cloud / Rising Cloud" },
      { romanized: "Kakō-gumo", japanese: "下降雲", english: "Bearish Cloud / Falling Cloud" },
      { romanized: "Taira na kumo", japanese: "平らな雲", english: "Flat Cloud" },
      { romanized: "Kinkō", japanese: "均衡", english: "Equilibrium / Balance" },
      { romanized: "Torendo", japanese: "トレンド", english: "Trend" },
      { romanized: "Ikioi", japanese: "勢い", english: "Momentum / Force" },
      { romanized: "Shiji-sen", japanese: "支持線", english: "Support Line" },
      { romanized: "Teikō-sen", japanese: "抵抗線", english: "Resistance Line" },
      { romanized: "Jōshō torendo", japanese: "上昇トレンド", english: "Uptrend" },
      { romanized: "Kakō torendo", japanese: "下降トレンド", english: "Downtrend" },
      { romanized: "Mochiai", japanese: "持ち合い", english: "Range / Consolidation" },
      { romanized: "Hōkō-kan", japanese: "方向感", english: "Directional Bias" },
      { romanized: "Kyōjaku", japanese: "強弱", english: "Strength / Weakness" },
      { romanized: "Senkō", japanese: "先行", english: "Leading / Ahead" },
      { romanized: "Chikō", japanese: "遅行", english: "Lagging / Delayed" },
      { romanized: "Sen", japanese: "線", english: "Line" },
      { romanized: "Supan", japanese: "スパン", english: "Span" },
      { romanized: "Hen’i", japanese: "変位", english: "Displacement" },
      { romanized: "Shifuto", japanese: "シフト", english: "Shift" },
      { romanized: "Mirai", japanese: "未来", english: "Future" },
      { romanized: "Kako", japanese: "過去", english: "Past" },
      { romanized: "Genzaichi", japanese: "現在値", english: "Current Price" },
      { romanized: "Owarine", japanese: "終値", english: "Closing Price" },
      { romanized: "Takane", japanese: "高値", english: "High Price" },
      { romanized: "Yasune", japanese: "安値", english: "Low Price" },
      { romanized: "Saikōne", japanese: "最高値", english: "Highest High" },
      { romanized: "Saiyasune", japanese: "最安値", english: "Lowest Low" },
      { romanized: "Chūkan-chi", japanese: "中間値", english: "Midpoint / Middle Value" },
      { romanized: "Kikan", japanese: "期間", english: "Period" },
      { romanized: "Kyū-kikan", japanese: "9期間", english: "9 Periods" },
      { romanized: "Nijūroku-kikan", japanese: "26期間", english: "26 Periods" },
      { romanized: "Gojūni-kikan", japanese: "52期間", english: "52 Periods" },
      { romanized: "Keisan", japanese: "計算", english: "Calculation" },
      { romanized: "Neugoki", japanese: "値動き", english: "Price Movement" },
      { romanized: "Kakaku", japanese: "価格", english: "Price" },
      { romanized: "Uwa-nuke", japanese: "上抜け", english: "Break Above" },
      { romanized: "Shita-nuke", japanese: "下抜け", english: "Break Below" },
      { romanized: "Hane-kaeri", japanese: "跳ね返り", english: "Bounce / Rejection" },
      { romanized: "Oshime", japanese: "押し目", english: "Pullback" },
      { romanized: "Modori", japanese: "戻り", english: "Retracement / Return" },
      { romanized: "Uwari", japanese: "上回り", english: "Move Above" },
      { romanized: "Shitamawari", japanese: "下回り", english: "Move Below" },
      { romanized: "Meikaku na torendo", japanese: "明確なトレンド", english: "Clear Trend" },
    ]
  },

  // Pricing Page
  pricing: {
    hero: {
      heading: "Simple Pricing",
      description: "Start with 14 days completely free. No credit card required."
    },
    tiers: [
      {
        name: "Explorer",
        monthlyPrice: "$0",
        yearlyPrice: "$0",
        tagline: "Start your Ichimoku journey",
        ctaText: "Get Started Free",
        features: [
          { text: "TK Cross Alert (free indicator)", included: true },
          { text: "S/R Auto indicator", included: true },
          { text: "Community Discord access", included: true },
          { text: "Education resources (YouTube)", included: true },
          { text: "Premium indicators", included: false },
          { text: "Multi-timeframe dashboard", included: false },
          { text: "Email alerts", included: false },
        ],
      },
      {
        name: "Samurai",
        monthlyPrice: "$29",
        yearlyPrice: "$23",
        tagline: "The complete Ichimoku Edge system",
        ctaText: "Start 14-Day Free Trial",
        isFeatured: true,
        isTrial: true,
        features: [
          { text: "ALL free indicators", included: true },
          { text: "Ichimoku Edge Pro indicator", included: true },
          { text: "MTF Ichimoku Table dashboard", included: true },
          { text: "Kumo Cloud Scanner", included: true },
          { text: "Chikou Span Analyzer", included: true },
          { text: "Ichimoku Trend Meter", included: true },
          { text: "Session Dashboard", included: true },
          { text: "Priority email support", included: true },
        ],
      },
      {
        name: "Daimyo",
        monthlyPrice: "$79",
        yearlyPrice: "$63",
        tagline: "For serious institutional traders",
        ctaText: "Start 14-Day Free Trial",
        isTrial: true,
        features: [
          { text: "Everything in Samurai PLUS:", included: true },
          { text: "1-on-1 strategy consultation", included: true },
          { text: "Custom indicator requests", included: true },
          { text: "Telegram VIP alerts group", included: true },
          { text: "Portfolio review sessions", included: true },
          { text: "Early beta indicator access", included: true },
          { text: "Dedicated support line", included: true },
        ],
      },
    ],
    trialGuarantee: {
      heading: "14 Days. Full Access. Zero Risk.",
      description: "Try every premium indicator free for 14 days. If it's not the best Ichimoku toolset you've ever used, cancel with one click. No questions asked.",
      button: "Start Your Free Trial Now →"
    }
  },

  // Tools Page
  tools: {
    hero: {
      heading: "Tools & Indicators",
      description: "Precision-built Pine Script indicators for TradingView. Each tool is battle-tested on real markets."
    },
    noResults: "No indicators found for this category.",
    adminLink: {
      enable: "Admin",
      disable: "Disable Admin Mode"
    }
  },

  // Education Page
  education: {
    hero: {
      heading: "Resources Hub",
      description: "Free Ichimoku trading tutorials, strategy breakdowns, and live analysis videos. Subscribe to our YouTube channel to be notified when new resources drop."
    },
    buttons: {
      youtube: "Subscribe on YouTube",
      back: "Back to Home"
    },
    form: {
      placeholder: "Enter your email",
      button: "Notify Me",
      success: "✓ You're on the list! We'll email you when we launch."
    }
  },

  // FAQ Page
  faq: {
    heading: "Frequently Asked Questions",
    searchPlaceholder: "Search questions...",
    categories: ["All", "Getting Started", "Ichimoku Trading", "Technical", "Billing & Pricing", "Indicators"],
    noResults: {
      text: "No results for \"{query}\".",
      clear: "Clear all filters"
    },
    data: [
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
    ]
  },

  // Legal Pages
  legal: {
    lastUpdated: "Last Updated: May 2026",
    terms: {
      title: "Terms of Service",
      description: "Please read these terms carefully before using the Ichimoku Edge platform and indicators.",
      sections: [
        { title: "1. Acceptance of Terms", content: "By accessing and using Ichimoku Edge, you agree to be bound by these Terms of Service. If you do not agree, you must not use our indicators or platform." },
        { title: "2. License & Usage", content: "We grant you a non-exclusive, non-transferable license to use our TradingView indicators for personal or professional trading analysis. You may not redistribute, resell, or reverse-engineer our Pine Script code." },
        { title: "3. TradingView Account", content: "Our tools are built for TradingView. You are responsible for maintaining your own TradingView account. We are not responsible for any limitations or technical issues on the TradingView platform itself." },
        { title: "4. No Financial Advice", content: "Ichimoku Edge provides educational tools and indicators. We do not provide financial, investment, or trading advice. Trading involves significant risk, and you are solely responsible for your own trading decisions and financial outcomes." },
        { title: "5. Indicator Performance", content: "Our indicators are designed to be accurate based on historical data. However, market conditions change. We do not guarantee future profits or specific performance levels." }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      description: "Your privacy and the security of your trading identity are paramount to us.",
      sections: [
        { title: "1. Introduction", content: "Ichimoku Edge respects your privacy and aims to collect only the personal data necessary to provide, secure, and improve our services. This Privacy Policy explains what information we collect, how we use it, how long we keep it, and what rights you have regarding your personal data. By using Ichimoku Edge, you agree to the practices described in this Privacy Policy." },
        { title: "2. Data Controller", content: "For users located in the European Union, Switzerland, the United Kingdom, Canada, the United States, or any other region, the data controller responsible for your personal data is Ichimoku Edge (contact@ichimokuedge.com). For privacy-related requests, you can contact us at our dedicated support email." },
        { title: "3. Data We Collect", content: "We may collect the following information: name, email address, TradingView username, payment status and subscription information, support messages or communications, technical information (browser type, device type, language preference), and cookie/local storage preferences. We aim to collect only the data necessary to operate Ichimoku Edge." },
        { title: "4. Use of Your TradingView Username", content: "Your TradingView username is used to grant and manage access to Ichimoku Edge invite-only indicators on the TradingView platform. We do not use your TradingView username to access your private TradingView account, trading activity, charts, broker account, or financial information. You are responsible for providing the correct TradingView username." },
        { title: "5. How We Use Your Data", content: "We use your personal data to provide access to products, manage subscriptions, grant access to TradingView indicators, process payments, respond to support requests, improve the user experience, prevent fraud, and comply with legal obligations. We do not sell your personal data." },
        { title: "6. Legal Basis for Processing", content: "Depending on the situation, our legal basis for processing includes contractual necessity, legal obligation, legitimate interest (securing the website, preventing abuse), or consent (for non-essential cookies or analytics). You may withdraw consent at any time where processing is based on consent." },
        { title: "7. Payments and Third-Party Services", content: "Payments are processed by secure third-party providers. Ichimoku Edge does not store your full credit card details or crypto wallet private keys. We may use third-party services for hosting, analytics, support, and technical infrastructure. These providers process data only as necessary to provide their services." },
        { title: "8. Cookies and Local Storage", content: "We use cookies and local storage to keep the website functional, remember preferences (theme, language), and understand visitor interaction through analytics. Where required by law, non-essential cookies will only be used with your consent. For more details, please see our Cookie Policy." },
        { title: "9. Data Retention", content: "We keep your personal data only for as long as necessary for the purposes described. This includes maintaining active account information, keeping payment records for tax obligations, and preserving support history. When your data is no longer needed, we will delete or anonymize it." },
        { title: "10. Data Security", content: "We take reasonable technical and organizational measures to protect your data against unauthorized access, loss, or misuse. However, no online system is 100% secure. You are responsible for keeping your own accounts, passwords, and TradingView access secure." },
        { title: "11. International Data Transfers", content: "Some third-party providers may process data in countries outside your region of residence. Where required by law, we aim to use appropriate safeguards for international data transfers, such as contractual protections or other lawful transfer mechanisms." },
        { title: "12. Your Privacy Rights", content: "Depending on your location (including GDPR/Swiss FADP/UK GDPR/CCPA regions), you may have the right to access, correct, delete, object to, or restrict the processing of your data. To exercise your rights, contact us at contact@ichimokuedge.com." },
        { title: "13. Specific Notice for Users in the European Union", content: "EU users have specific rights under the GDPR. If you believe your data protection rights have not been respected, you may contact your local data protection authority. The relevant supervisory authority depends on your country of residence." },
        { title: "14. Specific Notice for Users in Switzerland", content: "Swiss users' data is protected under the Federal Act on Data Protection. You have rights to request access, correction, deletion, or restriction of your personal data, subject to applicable legal limits." },
        { title: "15. Specific Notice for Users in the United Kingdom", content: "UK users are protected under the UK GDPR and the Data Protection Act 2018. You have rights to access, correct, delete, restrict, object to processing, and request data portability where applicable." },
        { title: "16. Specific Notice for Users in Canada", content: "Canadian users are protected under PIPEDA and other applicable privacy laws. You have rights to access information we hold about you and request correction of inaccurate information." },
        { title: "17. Specific Notice for Users in the United States", content: "U.S. privacy rights vary by state (e.g., CCPA). Ichimoku Edge does not sell your personal data. We provide required notice and opt-out mechanisms where legally required for tracking technologies." },
        { title: "18. Specific Notice for Users in Other Countries", content: "We aim to respect applicable privacy rights worldwide. Depending on your location, you may have rights to access, correct, delete, or object to data processing. Contact us at contact@ichimokuedge.com for requests." },
        { title: "19. Children’s Privacy", content: "Ichimoku Edge is not intended for children. We do not knowingly collect personal data from children. If you believe a child has provided us with data, please contact us for appropriate action." },
        { title: "20. Changes to This Privacy Policy", content: "We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated date. Continued use of Ichimoku Edge after changes are published means you accept the updated policy." }
      ]
    },
    disclaimer: {
      title: "Risk Disclaimer",
      description: "Please understand the significant risks involved in financial trading before using our tools.",
      sections: [
        { title: "Educational Purposes Only", content: "Ichimoku Edge provides educational content, technical analysis tools, indicators, screeners, market commentary, and related resources for informational and educational purposes only. Nothing on this website, inside our tools, in our indicators, in our community, or in any related content should be considered financial advice, investment advice, trading advice, tax advice, legal advice, or any other form of professional advice. Ichimoku Edge does not tell you what to buy, sell, hold, trade, or invest in. All trading and investment decisions are your sole responsibility." },
        { title: "No Financial Advice", content: "Ichimoku Edge is not a financial adviser, investment adviser, broker, dealer, portfolio manager, or financial planner. We do not provide personalized investment recommendations and we do not assess your personal financial situation, objectives, risk tolerance, or trading experience. Any analysis, chart example, trading setup, indicator output, screener result, alert, strategy explanation, or educational material shared by Ichimoku Edge is general in nature and is not tailored to any individual person. You should always conduct your own research and, where appropriate, consult a qualified financial professional before making any trading or investment decision." },
        { title: "Trading Risk Disclaimer", content: "Trading and investing involve significant risk. You may lose part or all of your capital. Markets can be volatile, unpredictable, and affected by economic, political, technical, regulatory, and liquidity-related factors. You should never trade with money you cannot afford to lose. Before trading financial markets, including stocks, forex, futures, commodities, indices, cryptocurrencies, or any other asset class, you should carefully consider whether trading is suitable for your financial situation and risk tolerance. Past performance does not guarantee future results. No trading method, indicator, screener, strategy, or analytical framework can guarantee profits or prevent losses." },
        { title: "Indicators, Screeners, and Technical Tools", content: "The indicators, screeners, alerts, and technical tools provided by Ichimoku Edge are designed to assist with market analysis. They are not automatic trading systems and should not be interpreted as guaranteed buy or sell signals. Indicator outputs, screener results, alerts, projections, backtests, and chart examples are analytical tools only. They may help structure your analysis, but they do not remove risk and should not replace your own judgment. No indicator can predict future price movement with certainty. The performance of any tool may vary depending on the market, asset class, timeframe, volatility, liquidity, spread, data source, and market conditions. You are fully responsible for how you use Ichimoku Edge tools in your own trading process." },
        { title: "No Trading Signals or Recommendations", content: "Ichimoku Edge does not provide personalized trading signals, investment recommendations, or instructions to enter or exit trades. Any examples of trade setups, chart scenarios, support and resistance areas, Ichimoku signals, risk/reward structures, stop-loss areas, or potential targets are provided only to demonstrate technical analysis concepts. They should not be understood as instructions to place a trade or as recommendations to copy a specific position. You are solely responsible for your entries, exits, position sizing, risk management, and trading decisions." },
        { title: "Ichimoku Analysis and Market Commentary", content: "Ichimoku Edge focuses on Ichimoku Kinkō Hyō, technical analysis, market structure, and related analytical frameworks. Any market views, chart interpretations, or educational examples shared by Ichimoku Edge represent our own analytical perspective. They are not predictions, guarantees, or personalized advice. Markets can move against any analysis. A valid technical setup can fail. You should always apply your own judgment, risk management, and independent research." },
        { title: "Backtesting and Hypothetical Results", content: "Any backtests, historical examples, simulated results, strategy statistics, equity curves, or performance illustrations shown by Ichimoku Edge are hypothetical and for educational purposes only. Hypothetical performance has limitations. It does not represent live trading and may not account for real-world factors such as slippage, spreads, commissions, liquidity, execution delay, order fills, data differences, or changing market conditions. No representation is made that any account will achieve profits or losses similar to those shown in any example, backtest, or simulation." },
        { title: "Alerts and Automation", content: "Ichimoku Edge tools may include alerts, notifications, webhook-compatible features, or integrations with third-party platforms such as TradingView. Alerts are provided for informational and educational purposes only. Alert delivery is not guaranteed and may be delayed, interrupted, duplicated, or fail due to technical issues, platform limitations, internet connectivity, third-party services, or other factors outside our control. Ichimoku Edge does not execute trades, manage accounts, monitor your portfolio, or control any brokerage activity. You are fully responsible for how you use alerts, webhooks, automation tools, or third-party integrations." },
        { title: "Market Data and Platform Differences", content: "Market data, chart data, calculations, and indicator outputs may vary between platforms, brokers, exchanges, data providers, and timeframes. Results may differ due to differences in pricing data, candles, time zones, session settings, liquidity, spreads, contract specifications, corporate actions, rounding, or calculation methods. If you compare Ichimoku Edge tools with TradingView, broker platforms, exchanges, or other charting services, results may not always match exactly. All market data and tool outputs should be independently verified before making any trading decision." },
        { title: "TradingView Disclosure", content: "Some Ichimoku Edge indicators and tools may be built for or used on TradingView. TradingView® is a registered trademark of TradingView, Inc. Ichimoku Edge is not affiliated with, endorsed by, sponsored by, or officially connected with TradingView, Inc. Any use of TradingView charts, scripts, or platform features is subject to TradingView’s own terms of service and policies. Ichimoku Edge retains all applicable intellectual property rights related to its indicator logic, tool design, educational content, branding, and proprietary materials." },
        { title: "Testimonials and Community Content", content: "Testimonials, user feedback, comments, or community posts may not be representative of typical results and should not be considered a guarantee of performance, profitability, or success. Trading results vary greatly between individuals depending on experience, discipline, risk management, psychology, market conditions, and many other factors. Opinions, trade ideas, or analysis shared by community members do not necessarily represent the views of Ichimoku Edge and should not be treated as financial advice or trading recommendations." },
        { title: "Limitation of Liability", content: "By using this website, our indicators, screeners, educational content, alerts, community, or any related service, you acknowledge that trading and investing involve risk and that you are solely responsible for your own decisions. Ichimoku Edge, its owner, team members, affiliates, partners, or service providers shall not be liable for any loss, damage, cost, or expense arising from your use of our website, tools, indicators, screeners, alerts, educational materials, market commentary, or community content. This includes, but is not limited to, trading losses, investment losses, missed opportunities, technical errors, data inaccuracies, service interruptions, alert failures, platform issues, or reliance on any information provided by Ichimoku Edge." },
        { title: "Acceptance of This Disclaimer", content: "By using Ichimoku Edge, you confirm that you have read, understood, and accepted this disclaimer. If you do not agree with this disclaimer, you should not use this website, our indicators, screeners, alerts, educational materials, community, or related services." }
      ]
    },
    refund: {
      title: "Refund Policy",
      description: "Transparent rules for cancellations, trials, and subscription management.",
      sections: [
        { title: "1. 14-Day Free Trial", content: "All premium subscriptions come with a 14-day free trial. You will not be charged during this period, and you can cancel anytime to prevent any future billing." },
        { title: "2. Monthly Subscriptions", content: "Monthly subscriptions are non-refundable once the billing period has commenced. You may cancel at any time to prevent the next month's charge, and you will retain access until the end of your current cycle." },
        { title: "3. Annual Subscriptions", content: "Annual subscriptions are eligible for prorated refunds in specific cases. If you wish to cancel an annual plan mid-cycle, please contact support to discuss your options." },
        { title: "4. Cryptocurrency Payments", content: "Refunds for payments made in USDT/USDC are subject to network fees and will be processed back to the original sending wallet address. We are not responsible for funds sent to incorrect addresses." },
        { title: "5. Digital Goods Policy", content: "Because our indicators are digital goods delivered via TradingView, 'Invite-only' access is considered the delivery of service. Please ensure you use the 14-day trial to verify the tools meet your needs before subscribing." }
      ]
    },
    cookies: {
      title: "Cookie Policy",
      description: "How we use local storage and cookies to improve your Ichimoku Edge experience.",
      sections: [
        { title: "1. Introduction", content: "This Cookie Policy explains how Ichimoku Edge uses cookies, local storage, and similar technologies to operate the website, remember your preferences, improve user experience, and understand how visitors interact with the platform." },
        { title: "2. What Are Cookies?", content: "Cookies are small text files stored on your device when you visit a website. They help websites function properly, remember preferences, maintain sessions, and improve the browsing experience. Local storage works in a similar way and allows certain information to be stored directly in your browser, such as theme or language preferences." },
        { title: "3. Essential Cookies and Local Storage", content: "We use essential cookies and local storage to make the website function correctly. These are used to maintain sessions, support login features, remember theme preferences (Light, Dark, or Ichimoku mode), remember language preferences (English or Japanese), and improve website stability. Disabling them may prevent parts of the website from functioning correctly." },
        { title: "4. Analytics Cookies", content: "We may use analytics cookies or similar technologies to understand how visitors use Ichimoku Edge. This helps us understand which pages are visited, how users navigate, and where design improvements may be needed. Where required by law, analytics cookies will only be used with your consent." },
        { title: "5. Marketing and Advertising Cookies", content: "At this stage, Ichimoku Edge may not use marketing or advertising cookies. If we later use marketing cookies, advertising pixels, or retargeting tools, they will only be used where permitted by law and, where required, after receiving your explicit consent." },
        { title: "6. Third-Party Cookies", content: "Some third-party services may place cookies when you interact with payment systems, embedded content, analytics tools, or videos. These third parties process data according to their own privacy and cookie policies. Ichimoku Edge does not control all cookies placed by third-party services." },
        { title: "7. Managing Cookies", content: "You can control, delete, or block cookies through your browser settings. Where applicable, you may also be able to accept, reject, or customize non-essential cookies through the cookie banner. In the EU, users can refuse non-essential cookies as easily as accepting them." },
        { title: "8. Cookie Consent", content: "When required by law, we will ask for your consent before placing non-essential cookies on your device. You may withdraw or change your cookie consent at any time through the cookie settings available on our website. Your choices may be stored to remember your preferences." },
        { title: "9. Changes to This Cookie Policy", content: "We may update this Cookie Policy from time to time. Any changes will be published on this page with the updated date. Continued use of Ichimoku Edge after changes are published means you accept the updated Cookie Policy." }
      ]
    }
  }
} as const;

export type ContentType = typeof staticContent;
export const content = staticContent; // Fallback for now
