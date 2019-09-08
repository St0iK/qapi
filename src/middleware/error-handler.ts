import * as Koa from 'koa'

export default async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.status === 404) {
      ctx.body = {
        error: 'Not Found',
      };
    } else {
      ctx.body = {
        error: 'Internal Server Error',
      };
    }
    ctx.app.emit('error', err, ctx);
  }
};
