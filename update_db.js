const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateIndicator() {
  try {
    const existing = await prisma.indicatorItem.findFirst({
      where: { slug: 'advanced-kumo-breakout' }
    });

    const data = {
      name: 'Ichimoku Multi View',
      slug: 'ichimoku-multi-view',
      description: 'Ichimoku Multi View keeps up to four compact Ichimoku views visible beneath your main TradingView chart. Compare timeframes, markets or settings while keeping your main chart available for drawings, precise price analysis and historical navigation.',
      overview: 'Ichimoku Multi View keeps up to four compact Ichimoku views visible beneath your main TradingView chart. Compare timeframes, markets or settings while keeping your main chart available for drawings, precise price analysis and historical navigation.\n\nEach view combines its own Symbol × Timeframe × Ichimoku configuration.',
      howItWorks: 'Each panel displays 30 price candles by default, together with the available portions of Tenkan-sen, Kijun-sen, Senkou Span A/B, Chikou Span and the Kumo. By rendering these as separate compact views, you can monitor multiple timeframes or completely different assets without cluttering your primary chart.',
      features: JSON.stringify([
        "Up to four compact Ichimoku views simultaneously",
        "Independent Symbol, Timeframe, and configuration per view",
        "Compare timeframes, markets, or settings instantly",
        "Displays 30 price candles with full Ichimoku lines (Tenkan, Kijun, Cloud, Chikou)",
        "Keeps main chart clean for precise price analysis and drawings"
      ]),
      howToUse: 'Add the indicator to your TradingView chart. In the settings, configure up to 4 different views by selecting the desired Symbol and Timeframe for each. The panels will automatically render at the bottom of your chart window.',
      accessStatus: 'Free',
      priceLabel: 'Complimentary',
      tvUrl: 'https://www.tradingview.com/script/AuLbV8hE-Ichimoku-Multi-View-IchimokuEdge/',
      category: JSON.stringify(["ICHIMOKU", "MULTI-TIMEFRAME", "FREE"]),
      sortOrder: 2,
      rating: 5.0,
      numRatings: 7,
      status: 'Published'
    };

    if (existing) {
      await prisma.indicatorItem.update({
        where: { id: existing.id },
        data: data
      });
      console.log('Updated existing indicator!');
    } else {
      await prisma.indicatorItem.create({
        data: data
      });
      console.log('Created new indicator!');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

updateIndicator();
