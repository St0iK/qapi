import authorsRoutes from './authors';
import quoteRoutes from './quotes';
import Koa from 'koa';

export default (app: Koa): void => {
  app.use(authorsRoutes);
  app.use(quoteRoutes);
}
