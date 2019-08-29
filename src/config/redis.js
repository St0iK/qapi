
/**
 * List Redis cache times for individual routes
 */

const options = {
  routes: [{
    path: '/v2/quotes(.*)',
    expire: 30,
  }],
  passParam: 'pretty',
  redis: {
    host: process.env.DOCKER ? 'redis_db' : 'localhost',
  },
};

module.exports = options;
