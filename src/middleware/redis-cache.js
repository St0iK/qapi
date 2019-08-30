
const Redis = require('ioredis');

const redis = new Redis();

/**
 * Total object count middleware
 * @return {function} Koa Middleware
 */
module.exports = () => async (ctx, next) => {
  await next();

  // get the body of the response
  // const { body, url } = ctx;
  // console.log(body);
  // console.log(url);


  // redis.set(url, JSON.stringify(body), 'EX', 10000);

  // const storedResponse = await redis.get(url);
  // console.log(storedResponse);
  // // let type;
  // let cached = false;

  // if (storedResponse) {
  //   ctx.response.status = 200;
  //   // type = (await redis.get(tkey)) || 'text/html';
  //   ctx.response.set('quotes-api-cache', 'HIT');
  //   // ctx.response.type = type;
  //   ctx.response.body = storedResponse;
  //   cached = true;
  // }
  

  // return cached;
};
