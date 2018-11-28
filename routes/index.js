var express = require('express');
var router = express.Router();

// 首页
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/index.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 登录页面
router.get('/login.html', function(req, res, next) {
  res.render('login');
});

// 注册页面
router.get('/register.html', function(req, res) {
  res.render('register');
})


// router.get('/users.html', function(req, res) {
//   res.render('users');
// });

router.get('/brand.html', function(req, res) {
  res.render('brand');
});

router.get('/phone.html', function(req, res) {
  res.render('phone');
})

module.exports = router;
