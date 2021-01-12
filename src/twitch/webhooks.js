const koaRouter = require('koa-router');
const { onStreamLive, onStreamOffline } = require('../discord/events');

const router = koaRouter({
  prefix: '/api/twitch',
});

router.get('/test', (ctx) => {
  ctx.body = 'Hi there';
});

// TwitchAPI Subscription Challenge
router.get('/:username', (ctx) => {
  const { username } = ctx.params;
  ctx.body = ctx.query['hub.challenge'];
  console.log(`[TWITCH] Challenge for ${username}`);
});

// TwitchAPI Webhook Stream Change event
router.post('/:username', (ctx) => {
  const { username } = ctx.params;
  const isOffline = ctx.request.body.data.length === 0;
  console.log(`[TWITCH] Stream Event for ${username} - ${isOffline ? 'offline' : 'online'}`);
  (isOffline ? onStreamOffline : onStreamLive)(username, ctx.request.body.data[0]);
  ctx.status = 200;
});

module.exports = router;
