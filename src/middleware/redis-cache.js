
const Redis = require('ioredis');

module.exports = (opts = {}) => {
  const {
    host: redisHost,
    port: redisPort,
    redisUrl = `redis://${redisHost}:${redisPort}/`,
  } = opts;

  let redisAvailable = false;
  const redis = new Redis(redisUrl);
  redis.on('error', () => {
    redisAvailable = false;
  });
  redis.on('end', () => {
    redisAvailable = false;
  });
  redis.on('connect', () => {
    redisAvailable = true;
  });

  /**
   * @param {*} ctx
   * @param {*} typeKey
   * @param {*} cacheExpire
   */
  const cacheType = async (ctx, typeKey, cacheExpire) => {
    const { type } = ctx.response.type;
    await redis.set(typeKey, type, 'EX', cacheExpire);
  };

  /**
   * @param {*} ctx
   * @param {*} countKey
   * @param {*} cacheExpire
   */
  const cacheCount = async (ctx, countKey, cacheExpire) => {
    const { count } = ctx.state;
    if (count) {
      await redis.set(countKey, count, 'EX', cacheExpire);
    }
  };

  /**
   * Cache content
   * @param {Object} ctx
   * @param {String} key
   * @param {String} typeKey
   * @param {String} countKey
   * @param {Number} cacheExpire
   */
  const cacheContent = async (ctx, key, typeKey, countKey, cacheExpire) => {
    console.log('Cache Content');
    let { body } = ctx.response;

    if ((ctx.request.method !== 'GET') || (ctx.response.status !== 200) || !body) {
      return;
    }

    if (typeof body === 'string') {
      await redis.set(key, body, 'EX', cacheExpire);
    }

    if (typeof body === 'object' && ctx.response.type === 'application/json') {
      console.log('application/json');
      body = JSON.stringify(body);
      await redis.set(key, body, 'EX', cacheExpire);
    }

    await cacheType(ctx, typeKey, cacheExpire);
    await cacheCount(ctx, countKey, cacheExpire);
    ctx.response.set('quotes-api-cache', 'MISS');
  };

  const getCache = async (ctx, key, tkey, ckey) => {
    const value = await redis.get(key);
    const count = await redis.get(ckey);
    let cached = false;

    if (value) {
      ctx.response.status = 200;
      type = (await redis.get(tkey)) || 'text/html';
      ctx.response.set('quotes-api-cache', 'HIT');
      ctx.response.type = 'application/json';
      ctx.response.body = value;
      cached = true;
    }
    if (count) {
      ctx.response.set('quotes-api-count', count);
    }

    return cached;
  };

  return async (ctx, next) => {
    const { url } = ctx.request;
    const key = `redis-cache:${url}`;
    const tkey = `${key}:type`;
    const ckey = `${key}:count`;
    if (!redisAvailable) {
      return;
    }

    let cached;
    try {
      cached = await getCache(ctx, key, tkey, ckey);
      console.log('e');
    } catch (error) {
      console.log(error);
      cached = false;
    }
    console.log(cached);
    if (cached) {
      console.log('Content served from redis cache');
      return;
    }

    // continue with the rest of the middlewares to build the response
    await next();
    console.log('Content served from db');
    try {
      await cacheContent(ctx, key, tkey, ckey, 10000);
    } catch (e) {
      console.log('Failed to set cache');
    }
  };
};
