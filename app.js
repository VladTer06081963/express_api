const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const indexRouter = require('./routes/index');

dotenv.config();
// console.log('Loaded environment variables:');
// console.log('PORT:', process.env.PORT);
// console.log('API_KEY:', process.env.API_KEY);
// console.log('SYMBOL:', process.env.SYMBOL);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
