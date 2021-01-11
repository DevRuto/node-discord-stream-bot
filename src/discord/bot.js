const Discord = require('discord.js');
const { discord } = require('../config');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('discord bot started');
});

client.on('message', (message) => {
  if (!message.content.startsWith(discord.prefix) || message.author.bot) return;
  console.log('message event');
});

module.exports = {
  start() {
    return client.login(discord.token);
  },
  discord: client,
};
