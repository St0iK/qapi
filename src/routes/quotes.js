// Quote Endpoints

const Router = require('koa-router');
const quotes = require('../controllers/quotes');

const app = new Router();

// Return upcoming launches filtered by querystrings
app.get('/quotes', quotes.all);
app.get('/quote/:id', quotes.one);

module.exports = app;
