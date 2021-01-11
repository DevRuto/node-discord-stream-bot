const twitch = require('./twitch/server');
const discord = require('./discord/bot');

async function main() {
  await twitch.start();
  await discord.start();

  console.log('App started');
}

main().then();
