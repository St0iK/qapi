import * as Koa from 'koa'
import * as mongodb from 'mongodb';
import limit from '../lib/query-builder/limit'
import offset from '../lib/query-builder/offset'
const globalAny:any = global;

export default {

  all: async (ctx: Koa.Context): Promise<any> => {
    const data = await globalAny.db
      .collection('quotes')
      .find({})
      .sort({ id: 1 })
      .limit(limit(ctx.request.query))
      .skip(offset(ctx.request.query))
      .toArray();
    ctx.body = data;
  },

  one: async (ctx: Koa.Context): Promise<any> => {
    const data = await globalAny.db
      .collection('quotes')
      .findOne({ _id: new mongodb.ObjectID(ctx.params.id) });
    ctx.body = data;
  },
  
};