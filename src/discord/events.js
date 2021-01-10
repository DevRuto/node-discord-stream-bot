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
  onStreamLive(username, event) {
    console.log(`[DISCORD] Stream Online Event - ${username}`);
  },
  onStreamOffline(username) {
    console.log(`[DISCORD] Stream Offline Event - ${username}`);
  },
};
