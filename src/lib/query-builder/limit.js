const maxResults = 1000;

/**
 * Returns number to limit documents in mongo query
 * @param {Object} query Koa querystring object from ctx.request
 * @return {number} Number of documents to limit
 */
module.exports = (q) => {
  if (q.limit) {
    return parseInt(q.limit, 10);
  }

  return maxResults;
};
