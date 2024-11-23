const client = require('./client');
const { getTimeUntil } = require('./utils');
const { getMarketData } = require('./market');

const FUNDING_RATE_THRESHOLD = 0.0001;

async function checkFundingRates() {
  const { getAllUSDTAndUSDCSymbols } = require('./symbols');

  try {
    const symbols = await getAllUSDTAndUSDCSymbols();
    if (symbols.length === 0) {
      console.log('Нет доступных символов для проверки.');
      return;
    }

    for (const { symbol } of symbols) {
      try {
        const fundingResponse = await client.getFundingRateHistory({
          category: 'linear',
          symbol,
          limit: 1,
        });

        const fundingData = fundingResponse.result?.list[0];
        if (!fundingData) continue;

        const latestFundingRate = parseFloat(fundingData.fundingRate);
        if (Math.abs(latestFundingRate) >= FUNDING_RATE_THRESHOLD) {
          const timeUntilFunding = getTimeUntil(fundingData.fundingRateTimestamp);
          const { spread, turnover } = await getMarketData(symbol);

          console.log(`\nСимвол: ${symbol}`);
          console.log(`Ставка финансирования: ${latestFundingRate}`);
          console.log(`Время до расчета ставки: ${timeUntilFunding}`);
          console.log(`Спред: ${spread}%`);
          console.log(`Объем торгов за час: ${turnover}$`);
        }
      } catch (error) {
        console.error(`Ошибка при проверке символа ${symbol}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Ошибка при проверке ставок финансирования:', error.message);
  }
}

module.exports = { checkFundingRates };
