const { redis, redis_prefix } = require('../config');
const { discord } = require('./bot');
const service = require('../twitch/service.js');
const { createStreamEmbed, createVodEmbed } = require('./embeds.js');

async function handleStreamEvent(username, event) {
  const offline = event === undefined;

  // For some reason, node redis doesn't prefix the keys for the keys command
  const guild_keys = await redis.keys(`${redis_prefix}streamers_*`);
  guild_keys.forEach(async (guild_key) => {
    const guild_id = guild_key.substring(guild_key.lastIndexOf('_') + 1);
    const setting_key = `guild_${guild_id}`;
    const streamers = await redis.smembers(`streamers_${guild_id}`);
    if (!streamers.includes(username)) {
      return;
    }
    const channel_id = await redis.hget(setting_key, 'announce_id');
    if (channel_id) {
      const channel = await discord.channels.fetch(channel_id);
      const message_key = `messages_${username}`;

      if (offline) {
        console.log(`[DISCORD] Stream Offline Event - ${username}`);

        // Delete message
        const msg_id = await redis.hget(message_key, guild_id);
        await redis.hdel(message_key, guild_id);
        const message = await channel.messages.fetch(msg_id);
        if (!message) {
          console.log('Message doesn\'t exist');
        } else {
          await message.delete();
        }

        // Vods?
        const vod_id = await redis.hget(setting_key, 'vod_id');
        if (vod_id) {
          const vod_channel = await discord.channels.fetch(vod_id);
          const vod = await service.getVod((await service.getUser(username)).id);
          if (vod) {
            vod_channel.send(await createVodEmbed(vod));
          } else {
            vod_channel.send(`No VOD found for ${username}`);
          }
        }
      } else {
        console.log(`[DISCORD] Stream Online Event - ${username}`);

        const msg_id = await redis.hget(message_key, guild_id);
        if (msg_id) {
          console.log(`Editing existing live event for ${guild_id}`);
          // Edit existing message
          const message = await channel.messages.fetch(msg_id);
          await message.edit(await createStreamEmbed(event));
        } else {
          console.log(`New live event for ${guild_id}`);
          // Guild doesn't have any existing stream message for this user
          const message = await channel.send(await createStreamEmbed(event));
          await redis.hset(message_key, guild_id, message.id);
        }
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
