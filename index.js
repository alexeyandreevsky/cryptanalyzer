const { checkFundingRates } = require('./bybit');

(async () => {
  await checkFundingRates();
})();
