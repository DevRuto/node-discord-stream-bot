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
module.exports = {
  async onStreamLive(username, event) {
    console.log(`[DISCORD] Stream Online Event - ${username} - ${JSON.stringify(event)}`);
    const channel = await discord.channels.fetch('793736736575324213');
    channel.send(`Stream online ${username}`);
  },
  async onStreamOffline(username) {
    console.log(`[DISCORD] Stream Offline Event - ${username}`);
    const channel = await discord.channels.fetch('793736736575324213');
    channel.send(`Stream offline ${username}`);
  },
};
