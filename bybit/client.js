require('dotenv').config();
const { RestClientV5 } = require('bybit-api');

// Загружаем параметры из .env
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const useTestnet = process.env.USE_TESTNET === 'true'; // Преобразуем в логическое значение

const client = new RestClientV5({
  key: API_KEY,
  secret: API_SECRET,
  testnet: useTestnet,
});

module.exports = client;