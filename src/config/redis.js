const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  lazyConnect: true,
});

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.warn('Redis error:', err.message));

module.exports = redisClient;
