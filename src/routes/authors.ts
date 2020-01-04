import Router from 'koa-router';
import authors from '../controllers/authors';

const app = new Router();

app.get('/authors', authors.all);
app.get('/author/:id', authors.one);
app.post('/author/create', authors.create);
app.patch('/author/update/:authorId', authors.update);

export default app.routes();
