
export interface iConfig {
  host: string,
  port: number,
  redisUrl?: string
}

export const config = {
  host: process.env.DOCKER ? 'redis_db' : 'localhost',
  port: 6379
};
