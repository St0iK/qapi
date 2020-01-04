import Router from 'koa-router'
import quotes from '../controllers/quotes';

const app = new Router();

app.get('/quote/create', quotes.create);
app.get('/quotes', quotes.all);
app.get('/quote/:id', quotes.one);
app.post('/quote/create', quotes.create);
app.patch('/quote/update/:quoteId', quotes.update);


export default app.routes();
