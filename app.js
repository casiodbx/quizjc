var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinamicos:
app.use(function(req, res, next){
  
    //guardar path en sesion.dredir para desues de login
    if(!req.path.match(/\/\login|\/logout/)){
        req.session.redir= req.path;
    }

    //Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

//app.use('/', routes);
app.use('/', function(req, res, next) {
    var now = new Date();
    var stamp = req.session.time ? new Date(req.session.time) : new Date();

    if (!req.path.match(/\/login|\/logout/)) {
        // validamos tiempo ultima peticion > 2 minutos
        if ((now.getMinutes() - 2) > stamp.getMinutes()) {
            req.session.time=null;//eliminamos variable de sesión
                       console.log('tendria que dar error');
            var errors = req.session.errors || 'Sesión caducada ...';
            req.session.errors = {};
            res.render('sessions/new', {
            errors: errors
            });
        } else {
             // refrescamos tiempo ultima peticion
            req.session.time = new Date();
            next();
        }
    } else {
        next();
    }

}, routes);


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
            error: err,
            errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});


module.exports = app;
