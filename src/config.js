const redis = require('async-redis');

const redis_prefix = 'discordbot_';

module.exports = {
  server_port: 3000,
  callback_url: 'https://localhost',
  // https://redis.js.org/#-api-rediscreateclient
  redis_prefix,
  redis: redis.createClient({
    port: 6379,
    host: '127.0.0.1',
    prefix: redis_prefix,
  }),
  twitch: {
    client_id: '',
    client_secret: '',
  },
  discord: {
    token: '',
    prefix: '/',
  },
};
