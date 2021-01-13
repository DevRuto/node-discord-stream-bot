# Discord Stream Bot in NodeJS

## Important Note
`./src/discord/events.js` uses the KEYS command for redis to get all guild keys which they dont recommend in production. If you care about that, change it as you wish

## Configuration
`./src/config.js` should be the only thing you need to change

`./src/discord/embeds.js` contains the functions for generating stream/vod embed if you wish to change them

```bash
docker run --name discordredis \
    -p 6379:6379 \
    -d \
    redis
```
