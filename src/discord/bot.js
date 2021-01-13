const Discord = require('discord.js');
const twitch = require('../twitch/service.js');
const { discord, redis } = require('../config');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('discord bot started');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(discord.prefix) || message.author.bot) return;
  const args = message.content.slice(discord.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const guild_key = `streamers_${message.guild.id}`;

  if (command === 'add') {
    const username = args[0];
    const user = await twitch.getUser(username);
    if (user && user.id) {
      await redis.sadd(guild_key, user.login);
      message.channel.send(`Streamer added: ${user.display_name}`);
    } else {
      message.channel.send(`No such user (${username}) found`);
    }
  } else if (command === 'remove') {
    const username = args[0];
    if (await redis.srem(guild_key, username.toLocaleLowerCase())) {
      message.channel.send(`${username} removed from streamer watch list`);
    } else {
      message.channel.send(`${username} was not in the list`);
    }
  } else if (command === 'list') {
    const streamers = await redis.smembers(guild_key);
    message.channel.send(`Streamers: ${streamers}`);
  } else if (command === 'announce') {
    const setting_key = `guild_${message.guild.id}`;
    if (!args[0]) {
      const id = await redis.hget(setting_key, 'announce_id');
      if (!id) {
        message.channel.send('No announcement channel set');
      } else {
        message.channel.send(`Announcement channel is set to: <#${id}>`);
      }
    } else if (args[0].toLocaleLowerCase() === 'clear') {
      message.channel.send('Announce channel disabled');
      await redis.hdel(setting_key, 'announce_id');
    } else {
      message.channel.send(`Setting announcement channel to ${args[0]}`);
      await redis.hset(setting_key, 'announce_id', args[0].slice(2, -1));
    }
  } else if (command === 'vods') {
    const setting_key = `guild_${message.guild.id}`;
    if (!args[0]) {
      const id = await redis.hget(setting_key, 'vod_id');
      if (!id) {
        message.channel.send('No VOD channel set');
      } else {
        message.channel.send(`VOD channel is set to: <#${id}>`);
      }
    } else if (args[0].toLocaleLowerCase === 'clear') {
      message.channel.send('VOD channel disabled');
      await redis.hdel(setting_key, 'vod_id');
    } else {
      message.channel.send(`Setting VOD channel to ${args[0]}`);
      await redis.hset(setting_key, 'vod_id', args[0].slice(2, -1));
    }
  }
});

module.exports = {
  start() {
    return client.login(discord.token);
  },
  discord: client,
};
