var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var settings = require('./settings');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // 设置模板引擎为ejs

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 将静态文件目录设置为public文件夹

// 将会话信息存储到MongoDB中
app.use(session({
  resave: false, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项
  secret: settings.cookieSecret, // 防止篡改Cookie
  key: settings.db, // cookie name
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 // cookie的生存期 30 days
  },
  store: new MongoStore({  // 将会话信息存储到数据库中
    url: 'mongodb://localhost/blog',
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
