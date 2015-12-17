require('babel-core/register');

var path = require('path');
var koa = require('koa');
var route = require('koa-route');
var views = require('co-views');

var webpack = require('webpack');
var config = require('../webpack/webpack.config.dev');

var app = koa();
var compiler = webpack(config);

app.use(require('koa-webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('koa-webpack-hot-middleware')(compiler));

app.use(function *(next) {
  this.render = views(__dirname + '/views', {
    map: { jade: 'jade' },
    default: 'jade'
  });

  yield next;
});

app.use(route.get('*', function *() {
  this.body = yield this.render('index');
}));

app.listen(3000, 'localhost', function () {
    console.log('Listening at http://localhost:3000');
});
