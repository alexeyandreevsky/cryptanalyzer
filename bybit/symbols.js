const client = require('./client');

async function getAllUSDTAndUSDCSymbols() {
  try {
    const response = await client.getInstrumentsInfo({ category: 'linear' });

    if (!response.result?.list) {
      console.error('Не удалось получить список инструментов.');
      return [];
    }

    return response.result.list
      .filter((instrument) =>
        instrument.symbol.endsWith('USDT') || instrument.symbol.endsWith('USDC')
      )
      .map((instrument) => ({
        symbol: instrument.symbol,
        fundingInterval: instrument.fundingInterval,
      }));
  } catch (error) {
    console.error('Ошибка при получении символов:', error.message);
    return [];
  }
}

module.exports = { getAllUSDTAndUSDCSymbols };
