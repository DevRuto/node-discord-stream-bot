const Koa = require('koa');
const koaBody = require('koa-body');
const routes = require('./webhooks').routes();
const { server_port } = require('../config');

const app = new Koa();

app.use(koaBody());
app.use(routes);

module.exports = {
  start() {
    app.listen(server_port);
    console.log(`Listening on port ${server_port}`);
  },
};
