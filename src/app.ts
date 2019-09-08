const globalAny:any = global;
import * as cors from 'koa2-cors';
import helmet from 'koa-helmet';
import Koa from 'koa';
import logger from 'koa-morgan';
import mask from 'koa-json-mask';
import MongoClient from 'mongodb';
// const rateLimit = require('koa2-ratelimit').RateLimit;
import responseTime from './middleware/response-time';
import count from './middleware/count';
import cache from './middleware/redis-cache';
import { config } from './config/redis';

// const cache = require('./middleware/redis-cache');
import errorHandler from './middleware/error-handler';
// const options = require('./config/redis');

// route imports
const quotes = require('./routes/quotes');
const authors = require('./routes/authors');

// Production read-only DB
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/quotes-parser';

const app = new Koa();

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

// app.use(rateLimit.middleware({
//   interval: 15 * 60 * 1000, // 15 minutes
//   max: 100,
// }));

// Disable Redis caching unless production
// if (process.env.NODE_ENV === 'production') {
//   app.use(cache(options));
// }
app.use(cache(config));

// Set header with total objects returned
app.use(count);

// Allow user to restrict the keys returned
app.use(mask({
  name: 'filter',
}));

app.use(quotes.routes());
app.use(authors.routes());

module.exports = app;

// Mongo Connection + Server Start
console.log('1');

(async () => {
  try {
    console.log('2');
    const client = await MongoClient.connect(url, { poolSize: 20, useNewUrlParser: true });

    globalAny.db = client.db('quotes-parser');

    const port = parseInt(process.env.PORT) || 5000;
    const hostname = '127.0.0.1';
    app.listen(port, hostname, () => {
      app.emit('ready');
      console.log('Running on port 5000');
    });
  } catch (err) {
    console.log(err.stack);
  }
  console.log('3');
})();

console.log('4');
