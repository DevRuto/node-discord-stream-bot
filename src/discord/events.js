const { redis, redis_prefix } = require('../config');
const { discord } = require('./bot');
/*
{
  "id": "0123456789",
  "user_id": "5678",
  "user_name": "wjdtkdqhs",
  "game_id": "21779",
  "community_ids": [],
  "type": "live",
  "title": "Best Stream Ever",
  "viewer_count": 417,
  "started_at": "2017-12-01T10:09:45Z",
  "language": "en",
  "thumbnail_url": "https://link/to/thumbnail.jpg"
}
*/

async function handleStreamEvent(username, event) {
  const offline = event === undefined;

  // For some reason, node redis doesn't prefix the keys for the keys command
  const guild_keys = await redis.keys(`${redis_prefix}streamers_*`);
  guild_keys.forEach(async (guild_key) => {
    const guild_id = guild_key.substring(guild_key.lastIndexOf('_') + 1);
    const streamers = await redis.smembers(`streamers_${guild_id}`);
    if (!streamers.includes(username)) {
      return;
    }
    const channel_id = await redis.hget(`guild_${guild_id}`, 'channel_id');
    if (channel_id) {
      const channel = await discord.channels.fetch(channel_id);

      if (offline) {
        console.log(`[DISCORD] Stream Offline Event - ${username}`);
        channel.send(`${username} went offline`);
      } else {
        console.log(`[DISCORD] Stream Online Event - ${username} - ${JSON.stringify(event)}`);
        channel.send(`${username} went live`);
      }
    }
  });
}

module.exports = {
  async onStreamLive(username, event) {
    handleStreamEvent(username, event);
  },
  onStreamOffline(username) {
    handleStreamEvent(username);
  },
};
