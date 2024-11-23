const client = require('./client');
const { getTimeUntil } = require('./utils');
const { getMarketData } = require('./market');

const DEFAULT_FUNDING_RATE_THRESHOLD = 0.0001

async function checkFundingRates(fundingRateThreshold = DEFAULT_FUNDING_RATE_THRESHOLD) {
  const { getAllUSDTAndUSDCSymbols } = require('./symbols')

  try {
    const symbols = await getAllUSDTAndUSDCSymbols()
    if (symbols.length === 0) {
      console.log('No instruments')
      return
    }

    for (const { symbol } of symbols) {
      try {
        const fundingResponse = await client.getFundingRateHistory({
          category: 'linear',
          symbol,
          limit: 1
        })

        const latestFundingData = fundingResponse.result?.list[0]
        if (!latestFundingData) continue

        const latestFundingRate = parseFloat(latestFundingData.fundingRate)
        const lastFundingTimestamp = parseInt(latestFundingData.fundingRateTimestamp, 10)
        const fundingIntervalMinutes = 8 * 60 // (8 hours)
        const nextFundingTimestamp = lastFundingTimestamp + fundingIntervalMinutes * 60 * 1000


        if (Math.abs(latestFundingRate) >= fundingRateThreshold) {
          const timeUntilFunding = getTimeUntil(nextFundingTimestamp)
          const { spread, turnover } = await getMarketData(symbol)

          console.log(`\nСимвол: ${symbol}`)
          console.log(`Ставка финансирования: ${latestFundingRate}`)
          console.log(`Время до расчета ставки: ${timeUntilFunding}`)
          console.log(`Спред: ${spread}%`)
          console.log(`Объем торгов за час: ${turnover}$`)
        }
      } catch (error) {
        console.error(`Ошибка при проверке символа ${symbol}:`, error.message)
      }
    }
  } catch (error) {
    console.error('Ошибка при проверке ставок финансирования:', error.message)
  }
}

module.exports = { checkFundingRates }
