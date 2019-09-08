import * as Koa from 'koa';

export default async (ctx: Koa.Context, next: () => Promise<any>) => {
  // get current timestamp
  const start:number = Date.now();
  // continue with the rest of the middlewares to build request
  await next();
  // when they are all finsihed, calculate the difference
  const ms:number = Date.now() - start;
  ctx.set('quotes-api-response-time', `${ms}ms`);
};
