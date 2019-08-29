// Quote Endpoints

const Router = require('koa-router');
const quotes = require('../controllers/quotes');

const app = new Router({
  prefix: '/quotes',
});

// Return upcoming launches filtered by querystrings
app.get('/', quotes.latest);

module.exports = app;
