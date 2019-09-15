import Koa from 'koa';
import Logger from './loaders/logger';

async function startServer() {

  const app = new Koa();
  await require('./loaders').default({ koaApp: app });

  try {
    Logger.info('🇬🇷');
    const port:number = parseInt(process.env.PORT) || 5000;
    const hostname:string = '127.0.0.1';

    app.listen(port, hostname, () => {
      app.emit('ready');

      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${port} 🛡️ 
      ################################################
    `);
    });
  } catch (err) {
    console.log(err.stack);
  }
}

startServer();
