
import Redis from 'ioredis';
import { iConfig } from '../config/redis'
import * as Koa from 'koa'

export default (opts: iConfig) => {
  console.log("Not being loaded");
  const redisUrl = `redis://${opts.host}:${opts.port}/`;
  
  let redisAvailable:boolean = false;
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

  const cacheType = async (ctx: Koa.Context, typeKey:string, cacheExpire: number) => {
    // Export 'type' from the object that you will get from the response
    const { type } = ctx.response;
    await redis.set(typeKey, type, 'EX', cacheExpire);
  };
  
  const cacheCount = async (ctx: Koa.Context, countKey: string, cacheExpire: number) => {
    // Export 'count' from the object that you will get from the response
    const { count } = ctx.state;
    if (count) {
      await redis.set(countKey, count, 'EX', cacheExpire);
    }
  };

  const cacheContent = async (ctx: Koa.Context, key: string, typeKey: string, countKey: string, cacheExpire: number) => {
    // Export 'body' from the object that you will get from the response
    let { body } = ctx.response;

    // we only want to cache GET requests
    // TODO: Move that to config
    if ((ctx.request.method !== 'GET') || (ctx.response.status !== 200) || !body) {
      return;
    }

    if (typeof body === 'string') {
      await redis.set(key, body, 'EX', cacheExpire);
    }

    if (typeof body === 'object' && ctx.response.type === 'application/json') {
      body = JSON.stringify(body);
      await redis.set(key, body, 'EX', cacheExpire);
    }

    await cacheType(ctx, typeKey, cacheExpire);
    await cacheCount(ctx, countKey, cacheExpire);
    ctx.response.set('quotes-api-cache', 'MISS');
  };

  const getCache = async (ctx: Koa.Context, key: string, tkey: string, ckey: string) => {
    const value = await redis.get(key);
    const count = await redis.get(ckey);
    let cached = false;

    if (value) {
      ctx.response.status = 200;
      const type = (await redis.get(tkey)) || 'text/html';
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

  return async (ctx: Koa.Context, next: <Promise>() => any) => {
    
    const { url } = ctx.request;
    const key = `redis-cache:${url}`;
    const tkey = `${key}:type`;
    const ckey = `${key}:count`;

    if (!redisAvailable) {
      return;
    }

    let cached:string|boolean;
    try {
      cached = await getCache(ctx, key, tkey, ckey);
    } catch (error) {
      console.log(error);
      cached = false;
    }
    
    if (cached) {
      return;
    }

    // continue with the rest of the middlewares to build the response
    await next();
    
    try {
      // Add context to the cache
      await cacheContent(ctx, key, tkey, ckey, 10000);
    } catch (e) {
      console.log('Failed to set cache');
    }
  };
};
