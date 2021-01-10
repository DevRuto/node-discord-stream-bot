// const twitch = require('./twitch/server');
const service = require('./twitch/service');

// twitch.start();
async function main() {
  console.log('Started');

  const id = await service.getGameName('33214');
  await service.getGameName('33214');
  console.log(id);
}

main().then();
