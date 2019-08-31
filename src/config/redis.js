
/**
 * List Redis cache times for individual routes
 */

const options = {
  host: process.env.DOCKER ? 'redis_db' : 'localhost',
  port: 6379,
};

module.exports = options;
