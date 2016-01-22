'use strict';

require('dotenv').load();
module.exports = require('./node_modules/express/lib/express');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var credentials = require('./config/credentials.js');
var mongoose = Promise.promisifyAll(require('mongoose'));
var dbConfig = require('./db/credentials.js');
// var routes = require('./routes/index');
// var users = require('./routes/users');
var usersController = require('./controllers/usersController.js');

var app = express();
app.set('view engine', 'ejs');
app.use( require('./node_modules/body-parser').urlencoded({ extended: true }));
app.use( require('cookie-parser')( credentials.cookieSecret));
app.use( require('express-session')({
    resave: false, saveUninitialized: false, secret: credentials.cookieSecret }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
switch(app.get('env')){
    case 'development':
        mongoose.connect(dbConfig.mongo.dev.conn, dbConfig.mongo.options);
        break;
    case 'production':
        mongoose.connect(dbConfig.mongo.prod.conn, dbConfig.mongo.options);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersController);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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


//var routes  = require( './routes' );
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
