var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var midnight_app = require('./core/midnight');
var mixin = require('merge-descriptors');



//var admin = require('./routes/admin');
// var users = require('./routes/users');



//cree l'application et ajoute le necessaire pour MIDNIGHT
//note: on reutilise la meme facon de faire qu'express pour une unité de logique
//et parcequ'on a pas trop le choix non plus :)
var app =  express();
mixin(app, midnight_app,true);



require("./hbs.init");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares!

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//genere les routes a partir du fichier de conf
//ie: en cas de redemarrage du serveur, tout sera stocké la dedans....
app.midnight_generate_sitemap();



//administration du site



let admin_url = app.server_conf.ADMINURL || "midnighAdmin";
app.use(`/${admin_url}`, require("./routes/admin")(app));
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({msg: err.message});
  //res.render('error');
});

module.exports = app;
