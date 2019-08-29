const cors = require('koa2-cors');
const helmet = require('koa-helmet');
const Koa = require('koa');
const logger = require('koa-morgan');
const mask = require('koa-json-mask');
const MongoClient = require('mongodb');
const rateLimit = require('koa2-ratelimit').RateLimit;
const responseTime = require('./middleware/response-time');
const count = require('./middleware/count');


// const cache = require('./middleware/redis-cache');
const errorHandler = require('./middleware/error-handler');
// const options = require('./config/redis');

// route imports
const quotes = require('./routes/quotes');

// Production read-only DB
const url = process.env.MONGO_URL || '';

const app = new Koa();

// Set header with API response time
app.use(responseTime());

// HTTP header security
app.use(helmet());

// HTTP requests logger
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('[:date[clf]] ":method :url HTTP/:http-version" :status - :response-time ms'));
}

// Error Handler
app.use(errorHandler());

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  allowMethods: ['GET'],
  allowHeaders: ['Content-Type', 'Accept'],
  exposeHeaders: ['quotes-api-cache', 'quotes-api-count', 'quotes-api-response-time'],
}));

app.use(rateLimit.middleware({
  interval: 15 * 60 * 1000, // 15 minutes
  max: 100,
}));

// Disable Redis caching unless production
// if (process.env.NODE_ENV === 'production') {
//   app.use(cache(options));
// }

// Set header with total objects returned
app.use(count());

// Allow user to restrict the keys returned
app.use(mask({
  name: 'filter',
}));

app.use(quotes.routes());

module.exports = app;

// Mongo Connection + Server Start
console.log('1');

(async () => {
  try {
    console.log('2');
    const client = await MongoClient.connect(url, { poolSize: 20, useNewUrlParser: true });

    global.db = client.db('quotes-parser');

    const port = process.env.PORT || 5000;
    app.listen(port, '0.0.0.0', () => {
      app.emit('ready');
      console.log('Running on port 5000');
    });
  } catch (err) {
    console.log(err.stack);
  }
  console.log('3');
})();

console.log('4');
