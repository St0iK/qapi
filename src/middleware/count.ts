import * as Koa from 'koa'

export default async (ctx: Koa.Context, next: () => Promise<any>) => {
  await next();
  if (ctx.state.data) {
    const count = await ctx.state.data.count(false);
    ctx.set('quotes-api-count', count);
    ctx.state.count = count;
  }
};
