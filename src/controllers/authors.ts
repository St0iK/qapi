import * as Koa from 'koa'
import * as mongodb from 'mongodb';
import limit from '../lib/query-builder/limit'
import offset from '../lib/query-builder/offset'
import Author from '../models/author';

export default {

  all: async (ctx: Koa.Context): Promise<any> => {
    ctx.body = await Author
      .find({})
      .sort({id: 1})
      .limit(limit(ctx.request.query))
      .skip(offset(ctx.request.query)).exec();
  },

  one: async (ctx: Koa.Context): Promise<any> => {
    ctx.body = await Author.findOne({_id: new mongodb.ObjectID(ctx.params.id)}).exec();
  },

  create: async (ctx: Koa.Context, next: () => Promise<any>): Promise<any> => {

    try {
      const author = new Author({fullName: ctx.request.body.fullName});
      const existingAuthor = await Author.findOne({'fullName': author.fullName}).exec();

      if (!existingAuthor) {
        ctx.body = await author.save();
        return;
      }

      ctx.body = {status: 'error', message: `Author with name ${author.fullName} already exists.`}

    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
    }
  },

  update: async (ctx: Koa.Context): Promise<any> => {
    try {
      ctx.body = await Author.findOneAndUpdate({
          _id: ctx.params.authorId
        }, ctx.request.body, {new: true}
      );
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
    }
  },

};
