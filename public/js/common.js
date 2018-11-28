// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://127.0.0.1:27017';
// MongoClient.connect(url, function(err, client) {
//     // 4.1 选择数据库
//     const db = client.db('product');
   
//     // 4.2 选择集合并操作
//     db.collection('admin').find({user:'2366921820'});
//     console.log()
//     // 4.3 记得关闭连接
//     client.close();
//    });
//    var express = require('express');
// var router = express.Router();
// var app = express();
// app.post('/login', function (req, res) {
//     res.render('users')
//   })