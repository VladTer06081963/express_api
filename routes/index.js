const express = require('express');
const router = express.Router();
const { fetchStockData } = require('../services/stockService');
const { generateChart } = require('../services/chartService');
const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    console.log('Calling fetchStockData');//added
    const { symbol, maxPrice, maxDate, filteredData } = await fetchStockData();
    console.log('fetchStockData returned:', { symbol, maxPrice, maxDate });//added
    const imagePath = await generateChart(filteredData, symbol);
    const folderPath = path.join(__dirname, '..', 'data');
    const filePath = path.join(folderPath, `${symbol}_data.json`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
    res.render('index', { symbol, maxPrice, maxDate, chartPath: '/images/chart.png' });
  } catch (error) {
    console.error('Ошибка при запросе данных:', error.message);
    res.status(500).send(`Ошибка при запросе данных: ${error.message}`);
  }
});

module.exports = router;
