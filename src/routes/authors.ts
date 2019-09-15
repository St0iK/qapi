import Router from 'koa-router';
import authors from '../controllers/authors';

const app = new Router();

app.get('/authors', authors.all);
app.get('/author/:id', authors.one);

export default app.routes();
