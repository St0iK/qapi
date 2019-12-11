import * as Koa from 'koa'
import * as mongodb from 'mongodb';
import limit from '../lib/query-builder/limit'
import offset from '../lib/query-builder/offset'
import Quote from '../models/quote';

export default {

  all: async (ctx: Koa.Context): Promise<any> => {
    ctx.body = await Quote
      .find({})
      .sort({id: 1})
      .limit(limit(ctx.request.query))
      .skip(offset(ctx.request.query))
      .exec();
  },

  one: async (ctx: Koa.Context): Promise<any> => {
    ctx.body = await Quote.findOne({_id: new mongodb.ObjectID(ctx.params.id)}).exec();
  },

  create: async (ctx: Koa.Context): Promise<any> => {

    try {
      const quote = new Quote(ctx.request.body);
      const existingQuote = await Quote.findOne({'quote': quote.quote}).exec();

      if (!existingQuote) {
        ctx.body = await quote.save();
        return;
      }

      ctx.body = {status: 'error', message: `Quote already exists.`}

    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
    }
  },

  update: async (ctx: Koa.Context): Promise<any> => {
    try {
      ctx.body = await Quote.findOneAndUpdate({
          _id: ctx.params.quoteId
        }, ctx.request.body, {new: true}
      );
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
    }
  },
};
