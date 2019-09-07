// Quote Endpoints

const Router = require('koa-router');
const authors = require('../controllers/authors');

const app = new Router({
  prefix: '/authors',
});

app.get('/', authors.all);

module.exports = app;
