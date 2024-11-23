const client = require('./client');

async function getMarketData(symbol) {
  try {
    const orderbookResponse = await client.getOrderbook({ category: 'linear', symbol });
    const asks = orderbookResponse.result?.a || [];
    const bids = orderbookResponse.result?.b || [];

    if (!asks.length || !bids.length) {
      return { spread: 'нет данных', turnover: 'нет данных' };
    }

    const bestAsk = parseFloat(asks[0][0]);
    const bestBid = parseFloat(bids[0][0]);
    const spread = ((bestAsk - bestBid) / bestAsk * 100).toFixed(2);

    const tickerResponse = await client.getTickers({ category: 'linear', symbol });
    const turnover = tickerResponse.result.list[0]?.turnover24h || 'нет данных';

    return { spread, turnover };
  } catch (error) {
    console.error(`Ошибка при получении рыночных данных для ${symbol}:`, error.message);
    return { spread: 'нет данных', turnover: 'нет данных' };
  }
}

module.exports = { getMarketData };
