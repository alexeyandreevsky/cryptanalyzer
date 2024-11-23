const { checkFundingRates } = require('./bybit');

(async () => {
  await checkFundingRates(0.0001);
})();
