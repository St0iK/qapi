import dbLoader from './db';
import Logger from './logger';
import koaLoader from './koa'

// const globalAny:any = global;

export default async ({ koaApp }) => {

  // globalAny.db = await dbLoader();
  Logger.info('✌️ DB loaded and connected!');

  await koaLoader({ app: koaApp });
  Logger.info('✌️ DB Koa App loaded!');
};
