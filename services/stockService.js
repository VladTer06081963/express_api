const fetch = require('node-fetch');
const moment = require('moment');
const dotenv = require('dotenv');

async function fetchStockData() {
  try {
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${process.env.SYMBOL}&apikey=${process.env.API_KEY}`;
    // console.log(`API URL: ${apiUrl}`);//added
    //  console.log('SYMBOL:', process.env.SYMBOL);//added
    // console.log('API_KEY:', process.env.API_KEY);//added
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    // console.log('Received data from API:', data);//added
    const timeSeries = data['Time Series (Daily)'];

    if (!timeSeries) {
      throw new Error('Invalid data format from API');
    }

    const startDate = moment('2024-03-01');
    const endDate = moment('2024-05-31');

    let filteredData = [];
    let maxPrice = 0;
    let maxDate = '';

    for (const date in timeSeries) {
      const currentDate = moment(date, 'YYYY-MM-DD');
      if (currentDate.isBetween(startDate, endDate, 'days', '[]')) {
        const highPrice = parseFloat(timeSeries[date]['2. high']);
        filteredData.push({ date: currentDate.format('YYYY-MM-DD'), price: highPrice });
        if (highPrice > maxPrice) {
          maxPrice = highPrice;
          maxDate = currentDate.format('YYYY-MM-DD');
        }
      }
    }

    if (filteredData.length === 0) {
      throw new Error('No data available for the specified date range');
    }

    return { symbol: process.env.SYMBOL, maxPrice, maxDate, filteredData };
  } catch (error) {
    console.error('Error in fetchStockData:', error.message);
    throw error;
  }
}

module.exports = { fetchStockData };

