var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ignoreRouter = require('./config/ignoreRouter');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 自己实现的中间件函数，用来判断用户是否登录
app.use(function(req, res, next) {
  // req.cookies('username');
  // console.log(req.cookies.nickname);
  // req.get('Cookie')
  // 排除 登录和 注册
  if (ignoreRouter.indexOf(req.url) > -1) {
    next();
    return;
  }

  var nickname = req.cookies.nickname;
  console.log(nickname)
  if (nickname) {
    next();
  } else {
    // 如果 nickname 不存在，就跳转到 登录页面。
    res.redirect('/login.html');
  }
})

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
