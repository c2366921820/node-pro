// var readFileObj = require('./readFile');
// var path = require('path');
// var url = require('url');
// var qs = require('querystring');

// var routes = {
//   login: function(req, res) {

//     // 登录页面提交按钮点击之后，传递过来的用户名与密码，怎么获取到。
//     // 下面是 get 请求的参数获取。
//     // var params = url.parse(req.url, true).query;
//     // console.log(params);

//     // 如果是 post 请求的话呢。参数获取。
//     // post 请求，因为数据是放在请求体里面的，那么我们需要使用 req.on('data')  req.on('end')
//     var body = '';
//     req.on('data', function(chunk) {
//       body += chunk;
//     })

//     req.on('end', function() {
//       // console.log(body);
//       console.log(qs.parse(body));
//     })



//     // 读取文件
//     // PS: 这里的 login.html 的路径地址，如果写相对路径的话，需要根据server.js 来寻找
//     // 推荐大家，做文件读取，写入的一些从操作的时候，请使用 绝对路径
//     var filePath = path.resolve(__dirname, '/views/login.html');
//     var data = readFileObj.readFile(filePath)
//     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//     res.write(data);
//   },

//   register: function(req, res) {
//     var filePath = path.resolve(__dirname, '/views/register.html');
//     var data = readFileObj.readFile(filePath);
//     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//     res.write(data);
//   },

//   home: function(req, res) {
//     var filePath = path.resolve(__dirname, '../views/home.html');
//     var data = readFileObj.readFile(filePath);
//     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//     res.write(data);
//   },

//   img: function(req, res) {
//     // localhost:3000/img?name=pic1
//     // localhost:3000/img?name=pic
//     console.log(req.url);
//     var urlObj = url.parse(req.url, true);
//     // console.log(urlObj.query.name);
//     var picName = urlObj.query.name || 'pic';

//     var filePath = path.resolve(__dirname, '../images/' + picName + '.jpg');
//     var data = readFileObj.readImg(filePath);
//     res.writeHead(200, { 'Content-Type': 'image/jpeg' });
//     res.write(data, 'binary');
//   },
// }

// // 暴露
// module.exports = routes;