const Router = require('koa-router');
const authors = require('../controllers/authors');

const app = new Router();

app.get('/authors', authors.all);
app.get('/author/:id', authors.one);

export default app;
