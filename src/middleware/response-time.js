
/**
 * Response time header middleware
 * @return {function} Koa Middleware
 */
module.exports = () => async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('quotes-api-response-time', `${ms}ms`);
};
