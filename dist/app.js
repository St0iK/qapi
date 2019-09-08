"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalAny = global;
const cors = __importStar(require("koa2-cors"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_1 = __importDefault(require("koa"));
const koa_morgan_1 = __importDefault(require("koa-morgan"));
const koa_json_mask_1 = __importDefault(require("koa-json-mask"));
const mongodb_1 = __importDefault(require("mongodb"));
// const rateLimit = require('koa2-ratelimit').RateLimit;
const response_time_1 = __importDefault(require("./middleware/response-time"));
const count_1 = __importDefault(require("./middleware/count"));
const redis_cache_1 = __importDefault(require("./middleware/redis-cache"));
const redis_1 = require("./config/redis");
// const cache = require('./middleware/redis-cache');
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
// const options = require('./config/redis');
// route imports
const quotes = require('./routes/quotes');
const authors = require('./routes/authors');
// Production read-only DB
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/quotes-parser';
const app = new koa_1.default();
// Set header with API response time
app.use(response_time_1.default);
// HTTP header security
app.use(koa_helmet_1.default());
// HTTP requests logger
if (process.env.NODE_ENV !== 'test') {
    app.use(koa_morgan_1.default('[:date[clf]] ":method :url HTTP/:http-version" :status - :response-time ms'));
}
// Error Handler
app.use(error_handler_1.default);
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
app.use(redis_cache_1.default(redis_1.config));
// Set header with total objects returned
app.use(count_1.default);
// Allow user to restrict the keys returned
app.use(koa_json_mask_1.default({
    name: 'filter',
}));
app.use(quotes.routes());
app.use(authors.routes());
module.exports = app;
// Mongo Connection + Server Start
console.log('1');
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('2');
        const client = yield mongodb_1.default.connect(url, { poolSize: 20, useNewUrlParser: true });
        globalAny.db = client.db('quotes-parser');
        const port = parseInt(process.env.PORT) || 5000;
        const hostname = '127.0.0.1';
        app.listen(port, hostname, () => {
            app.emit('ready');
            console.log('Running on port 5000');
        });
    }
    catch (err) {
        console.log(err.stack);
    }
    console.log('3');
}))();
console.log('4');
