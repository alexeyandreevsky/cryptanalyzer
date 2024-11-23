function getTimeUntil(nextFundingTime) {
  const now = Date.now();
  const fundingTime = new Date(
    nextFundingTime.toString().length === 10 ? nextFundingTime * 1000 : nextFundingTime
  );
  const diffMs = fundingTime - now;

  if (diffMs <= 0) {
    return '00:00:00';
  }

  const hours = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

module.exports = { getTimeUntil };
