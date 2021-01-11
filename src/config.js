const redis = require('async-redis');

module.exports = {
  server_port: 3000,
  callback_url: '',
  // https://redis.js.org/#-api-rediscreateclient
  redis: redis.createClient({
    port: 6379,
    host: '127.0.0.1',
    prefix: 'discordbot_',
  }),
  twitch: {
    client_id: '',
    client_secret: '',
  },
  discord: {
    token: '',
    prefix: '!',
  },
};
