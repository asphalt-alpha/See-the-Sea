var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var logger = require('morgan');
var mysql = require('mysql');
var dbConfig = require('./model/dbConfig');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var ledRouter = require('./routes/led');
var myPageRouter = require('./routes/myPage');

var moment = require('moment');
var led = require('./model/ledControl');

var app = express();
//var conn = mysql.createConnection(dbConfig);
//conn.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
  secret: '%^&*^%#$@#$%^',            //암호화 키
  store: new MySQLStore(dbConfig),   
  resave: true,
  saveUninitialized: true
}));

setInterval(led.autoSet,30000);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/change', myPageRouter);
app.use('/led', ledRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080,function(){
  console.log('Wating on Port-8080');
})
 
module.exports = app;
