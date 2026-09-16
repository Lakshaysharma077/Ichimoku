const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateIndicator() {
  try {
    const existing = await prisma.indicatorItem.findFirst({
      where: { slug: 'ichimoku-multi-view' }
    });

    const fullText = `█ OVERVIEW

Ichimoku Multi View keeps up to four compact Ichimoku views visible beneath your main TradingView chart. Compare timeframes, markets or settings while keeping your main chart available for drawings, precise price analysis and historical navigation.

Each view combines its own:

Symbol × Timeframe × Ichimoku configuration

Each panel displays 30 price candles by default, together with the available portions of Tenkan-sen, Kijun-sen, Senkou Span A/B, Chikou Span and the Kumo.`;

    const description = "█ OVERVIEW Ichimoku Multi View keeps up to four compact Ichimoku views visible beneath your main TradingView chart. Compare timeframes, markets or settings while keeping your main chart available for drawings, precise price analysis and...";

    const data = {
      name: 'Ichimoku Multi View [IchimokuEdge]',
      description: description,
      overview: fullText
    };

    if (existing) {
      await prisma.indicatorItem.update({
        where: { id: existing.id },
        data: data
      });
      console.log('Updated existing indicator!');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

updateIndicator();
