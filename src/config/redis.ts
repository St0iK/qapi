
export interface iConfig {
  host: string,
  port: number,
  redisUrl?: string
}

const config = {
  host: process.env.DOCKER ? 'redis_db' : 'localhost',
  port: 6379
};

export { config };
