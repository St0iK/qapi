import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import Koa from 'koa';
import logger from 'koa-morgan';
import mask from 'koa-json-mask';
import responseTime from '../middleware/response-time';
import count from '../middleware/count';
import cache from '../middleware/redis-cache';
import { config } from '../config/redis';
import errorHandler from '../middleware/error-handler';
import routes from '../routes';
import Logger from './logger';

export default ({ app }: { app: Koa }) => {

  // Set header with API response time
  app.use(responseTime);

  // HTTP header security
  app.use(helmet());

  // HTTP requests logger
  if (process.env.NODE_ENV !== 'test') {
    app.use(logger('[:date[clf]] ":method :url HTTP/:http-version" :status - :response-time ms'));
  }

  // Error Handler
  app.use(errorHandler);

  // Enable CORS for all routes
  app.use(cors({
    origin: '*',
    allowMethods: ['GET'],
    allowHeaders: ['Content-Type', 'Accept'],
    exposeHeaders: ['quotes-api-cache', 'quotes-api-count', 'quotes-api-response-time'],
  }));

  // Disable cache on Development properly
  // app.use(cache(config));

  // Set header with total objects returned
  app.use(count);

  // Allow user to restrict the keys returned
  app.use(mask({
    name: 'filter',
  }));

  // Build routes
  routes(app);
}
