import dbLoader from './db';
import Logger from './logger';
import koaLoader from './koa'

export default async ({ koaApp }) => {

  await dbLoader();
  Logger.info('✌️ DB loaded and connected!');

  await koaLoader({ app: koaApp });
  Logger.info('✌️ DB Koa App loaded!');
};
