const fs = require('fs');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const weappSession = require('weapp-session');
const config = require('config');
// const mongoose = require('mongoose');
//
// mongoose.connect('mongodb://localhost/virtualbean');

const routes = require('./routes/index');
const users = require('./routes/users');
const group = require('./routes/group');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(weappSession({
  appId: config.appId,      // 微信小程序 APP ID
  appSecret: config.appSecret,  // 微信小程序 APP Secret

  // REDIS 配置
  // @see https://www.npmjs.com/package/redis#options-object-properties
  redisConfig: {
    host: '127.0.0.1',
    port: 6379,
    password: '123456'
  },

  // （可选）指定在哪些情况下不使用 weapp-session 处理
  ignore(req, res) {
    return /^\/static\//.test(req.url);
  }
}));

app.use((req, res) => {
  res.json({
    // 在 req 里可以直接取到微信用户信息
    wxUserInfo: req.$wxUserInfo
  });
});

app.use('/', routes);
app.use('/users', users);
app.use('/group', group);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
