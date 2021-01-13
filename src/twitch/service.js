const axios = require('axios');
const { redis, twitch } = require('../config');

async function getAuthToken() {
  let token = await redis.get('auth_token');
  if (!token) {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: twitch.client_id,
        client_secret: twitch.client_secret,
        grant_type: 'client_credentials',
      },
    });
    await redis.setex('auth_token', response.data.expires_in - 10, token = response.data.access_token);
    console.log('[TSERVICE] Cache OAuth Token');
    token = response.data.access_token;
  } else {
    console.log('[TSERVICE] OAuth from cache');
  }
  return token;
}

module.exports = {
  async subscribe(username) {
    const id = await this.getUserId(username);
    if (!id) return false;
    const response = await axios.post('https://api.twitch.tv/helix/webhooks/hub', {
      'hub.callback': '',
      'hub.mode': 'subscribe',
      'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${id}`,
      'hub.lease_seconds': 108000,
      'hub.secret': 'asdf',
    }, {
      headers: {
        'client-id': twitch.client_id,
        authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return response.status === 200;
  },
  async unsubscribe(username) {
    const id = await this.getUserId(username);
    if (!id) return false;
    const response = await axios.post('https://api.twitch.tv/helix/webhooks/hub', {
      'hub.callback': '',
      'hub.mode': 'unsubscribe',
      'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${id}`,
      'hub.lease_seconds': 108000,
      'hub.secret': 'asdf',
    }, {
      headers: {
        'client-id': twitch.client_id,
        authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return response.status === 200;
  },
  async getUser(username) {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
      params: {
        login: username,
      },
      headers: {
        'client-id': twitch.client_id,
        authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    const user = response.data.data[0];
    console.log(`[TSERVICE] User Query (${username}) - ${user.id}`);
    return user;
  },
  async getGameName(game_id) {
    let name = await redis.hget('game_name', game_id);
    if (!name) {
      const response = await axios.get('https://api.twitch.tv/helix/games', {
        params: {
          id: game_id,
        },
        headers: {
          'client-id': twitch.client_id,
          authorization: `Bearer ${await getAuthToken()}`,
        },
      });
      name = response.data.data[0]?.name;
      console.log(`[TSERVICE] Game Query (${game_id}) - ${name}`);
      await redis.hset('game_name', game_id, name);
    } else {
      console.log(`[TSERVICE] Game Name from cache (${game_id}) - ${name}`);
    }
    return name;
  },
  async getVod(user_id) {
    const response = await axios.get('https://api.twitch.tv/helix/videos', {
      params: {
        user_id,
        period: 'day',
        type: 'archive',
        first: 1,
      },
      headers: {
        'client-id': twitch.client_id,
        authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return response.data.data[0];
  },
};
