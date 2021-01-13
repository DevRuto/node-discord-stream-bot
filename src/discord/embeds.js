const { MessageEmbed } = require('discord.js');
const service = require('../twitch/service');
// https://discordjs.guide/popular-topics/embeds.html
// https://discord.js.org/#/docs/main/stable/class/MessageEmbed
module.exports = {
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
  async createStreamEmbed(stream) {
    return new MessageEmbed()
      .setTitle(`${stream.user_name} went live!`)
      .addField('Title', stream.title)
      .addField('Date', new Date(stream.started_at).toLocaleTimeString())
      .addField('Game', await service.getGameName(stream.game_id))
      .setURL(`https://twitch.tv/${stream.user_name}`)
      .setImage(stream.thumbnail_url.replace('%{width}', '1280').replace('%{height}', '720'))
      .setTimestamp();
  },
  /*
  {
    "id": "234482848",
    "user_id": "67955580",
    "user_name": "ChewieMelodies",
    "title": "-",
    "description": "",
    "created_at": "2018-03-02T20:53:41Z",
    "published_at": "2018-03-02T20:53:41Z",
    "url": "https://www.twitch.tv/videos/234482848",
    "thumbnail_url": "https://static-cdn.jtvnw.net/s3_vods/bebc8cba2926d1967418_chewiemelodies_27786761696_805342775/thumb/thumb0-%{width}x%{height}.jpg",
    "viewable": "public",
    "view_count": 142,
    "language": "en",
    "type": "archive",
    "duration": "3h8m33s"
  }
  */
  async createVodEmbed(vod) {
    return new MessageEmbed()
      .setTitle(`${vod.user_name} VOD`)
      .addField('Title', vod.title)
      .setDescription('Description', vod.description)
      .addField('Duration', vod.duration)
      .setURL(vod.url)
      .setImage(vod.thumbnail_url.replace('%{width}', 1280).replace('%{height}', 720));
  },
};
