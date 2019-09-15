const Router = require('koa-router');
const quotes = require('../controllers/quotes');

const app = new Router();

app.get('/quotes', quotes.all);
app.get('/quote/:id', quotes.one);

export default app;
