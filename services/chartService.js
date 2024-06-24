const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

// Импортируем chart.js как CommonJS модуль
const chartJs = require('chart.js');
const { Chart, TimeScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend } = chartJs;

// Импортируем адаптер для moment
require('chartjs-adapter-moment');

// Регистрируем необходимые компоненты Chart.js
Chart.register(TimeScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend);

const width = 800;
const height = 600;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function generateChart(filteredData, symbol) {
  const labels = filteredData.map(item => item.date);
  const dataPoints = filteredData.map(item => item.price);

  const configuration = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${symbol} Stock Prices`,
        data: dataPoints,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month',
            tooltipFormat: 'YYYY-MM-DD',
            parser: 'YYYY-MM-DD'
          }
        }
      }
    }
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  const imagePath = path.join(__dirname, '..', 'public', 'images', 'chart.png');
  fs.writeFileSync(imagePath, image);
  return imagePath;
}

module.exports = { generateChart };
