const fs = require('fs');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const weappSession = require('weapp-session');
const qcloud = require('qcloud-weapp-server-sdk');
const config = require('config');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/virtualbean');

qcloud.config({
  ServerHost: 'www.javenleung.com',
  AuthServerUrl: 'https://www.javenleung.com/user'
});

const routes = require('./routes/index');
const user = require('./routes/user');
const login = require('./routes/login');
const group = require('./routes/group');
const statistic = require('./routes/statistic');

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

app.use('/', routes);
app.use('/user', user);
app.use('/login', login);
app.use('/group', group);
app.use('/statistic', statistic);

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
  res.status(err.status || 500).send(err.message);
});


module.exports = app;
