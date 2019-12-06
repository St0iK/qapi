import * as Koa from 'koa'
import * as mongodb from 'mongodb';
import limit from '../lib/query-builder/limit'
import offset from '../lib/query-builder/offset'
import Quote, { IQuote } from '../models/quote';


export default {

  all: async (ctx: Koa.Context): Promise<any> => {
    const data:IQuote[] = await Quote
      .find({})
      .sort({ id: 1 })
      .limit(limit(ctx.request.query))
      .skip(offset(ctx.request.query))
      .exec();
    
    ctx.body = data;
  },

  one: async (ctx: Koa.Context): Promise<any> => {
    console.log(ctx.params.id);
    const data = await Quote.findOne({ _id: new mongodb.ObjectID(ctx.params.id) }).exec();
    console.log(data);
    ctx.body = data;
  },

  create: async (ctx: Koa.Context): Promise<any> => {
    // get request body data
    ctx.body = 'Hello World';
  },
};
