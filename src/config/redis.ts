import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
});

redis.on('connect', () => {
  console.log('Redis conectado!');
});

redis.on('error', (err) => {
  console.error(`Erro no Redis: ${err}`);
});

export default redis;
