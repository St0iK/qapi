
const limit = require('../lib/query-builder/limit');
const offset = require('../lib/query-builder/offset');

module.exports = {

  latest: async (ctx) => {
    const data = await global.db
      .collection('quotes')
      .find({})
      .sort({ id: 1 })
      .limit(limit(ctx.request.query))
      .skip(offset(ctx.request.query))
      .toArray();
    ctx.body = data;
  },

};
