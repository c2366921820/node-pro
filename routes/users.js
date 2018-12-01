var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var async = require('async');
var router = express.Router();

var url = 'mongodb://127.0.0.1:27017';

// location:3000/users
router.get('/', function(req, res, next) {
  var page = parseInt(req.query.page) || 1; // 页码
  var pageSize = parseInt(req.query.pageSize) || 5; // 每页显示的条数
  var totalSize = 0;  // 总条数
  var data = [];
  var prePage= (page-1)*pageSize;

  MongoClient.connect(url, { useNewUrlParser: true}, function(err, client) {
    if (err) {
      res.render('error', {
        message: '链接失败',
        error: err
      })
      return;
    }

    var db = client.db('product');

    async.series([
      function(cb) {
        db.collection('user').find().count(function(err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },

      function(cb) {

        db.collection('user').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
          if (err) {
            cb(err)
          } else {
            // data = data;
            cb(null, data)
          }
        })

      }
    ], function(err, results) {
      if (err) {
        res.render('error', {
          message: '错误',
          error: err
        })
      } else {
        var totalPage = Math.ceil(totalSize / pageSize); // 总页数

        res.render('users', {
          list: results[1],
          // totalSize: totalSize,
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page,
          prePage:prePage
        })
      }
    })
  })
});


// 登录操作 location:3000/users/login
router.post('/login', function(req, res) {
  // 1. 获取前端传递过来的参数
  var username = req.body.name;
  var password = req.body.pwd;
  // 2. 验证参数的有效性
  if (!username) {
    res.render('error', {
      message: '用户名不能为空',
      error: new Error('用户名不能为空')
    })
    return;
  }

  if (!password) {
    res.render('error', {
      message: '密码不能为空',
      error: new Error('密码不能为空')
    })
    return;
  }

  // 3. 链接数据库做验证
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) {
      console.log('连接失败', err);
      res.render('error', {
        message: '连接失败',
        error: err
      })
      return;
    }

    var db = client.db('product');


    db.collection('user').find({
      username: username,
      password: password
    }).toArray(function(err, data) {
      if (err) {
        console.log('查询失败', err);
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else if (data.length <= 0) {
        // 没找到，登录失败
        res.render('error', {
          message: '登录失败,账户或密码错误',
          error: new Error('登录失败，账户或密码错误')
        })
      } else {
        // 登录成功

        // cookie操作
        console.log(data[0].nickname)
        console.log(data[0].username)
        res.cookie('nickname', data[0].nickname, {
          maxAge: 60 * 600 * 1000
        });
        res.cookie('username', data[0].username, {
          maxAge: 60 * 600 * 1000
        });
        res.cookie('isAdmin', data[0].isAdmin, {
          maxAge: 60 * 600 * 1000
        });


        res.redirect('/');
      }
      client.close();
    })

  })
  // res.send(''); 注意这里，因为 mongodb 的操作时异步操作。
});

// 注册操作 localhost:3000/users/register
router.post('/register', function(req, res) {
  var name = req.body.name;
  var pwd = req.body.pwd;
  var nickname = req.body.nickname;
  var age = parseInt(req.body.age);
  var sex = req.body.sex;
  var phoneNumber=req.body.phoneNumber;
  var isAdmin = req.body.isAdmin === '是' ? true : false;

  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if (err) {
      res.render('error', {
        message: '链接失败',
        error: err
      })
      return;
    }

    var db = client.db('product');

    async.series([
      function(cb) {
        db.collection('user').find({username: name}).count(function(err, num) {
          if (err) {
            cb(err)
          } else if (num > 0) {
            // 这个人已经注册过了，
            cb(new Error('已经注册'));
          } else {
            // 可以注册了
            cb(null);
          }
        })
      },

      function(cb) {
        db.collection('user').insertOne({
          username: name,
          password: pwd,
          nickname: nickname,
          age: age,
          sex: sex,
          phoneNumber:phoneNumber,
          isAdmin: isAdmin
        }, function(err) {
          if (err) {
            cb(err);
          } else {
            cb(null);
          }
        })
      }
    ], function(err, result) {
      if (err) {
        res.render('error', {
          message: '错误',
          error: err
        })
      } else {
        res.redirect('/login.html');
      }
      // 不管成功or失败，
      client.close();
    })
  })


});

// 删除操作 localhost:3000/users/delete
router.get('/delete', function(req, res){
  var id = req.query.id;

  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if (err) {
      res.render('error', {
        message: '链接失败',
        error: err
      })
      return;
    }
    var db = client.db('product');
    db.collection('user').deleteOne({
      _id: ObjectId(id)
    }, function(err, data) {
      console.log(data);
      if (err) {
        res.render('error', {
          message: '删除失败',
          error: err
        })
      } else {
       
        res.redirect('/users');
      }

      client.close();
    })
  })
})
var Id=0;
var pag=0;
var pagSize=0;
router.get('/operate', function(req, res, next) {
   Id = req.query.id;
   pag = req.query.page;
   pagSize = req.query.pageSize;
   MongoClient.connect(url, { useNewUrlParser: true}, function(err, client) {
    if (err) {
      res.render('error', {
        message: '链接失败',
        error: err
      })
      return;
    }

    var db = client.db('product');

    async.series([
      function(cb) {
        db.collection('user').find({"_id":ObjectId(Id)}).toArray(function(err, data) {
          if (err) {
            cb(err)
          } else {
            cb(null, data)
          }
        })

      }
    ], function(err, results) {
      if (err) {
        res.render('error', {
          message: '错误',
          error: err
        })
      } else {
        console.log(results)
        res.render('operate', {
          list: results[0]
        })
      }
    })
  })
});

router.post('/operate', function(req, res) {
  var pwd = req.body.pwd;
  var nickname = req.body.nickname;
  var age = parseInt(req.body.age);
  var sex = req.body.sex;
  var phoneNumber=req.body.phoneNumber;
  


  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if (err) {
      res.render('error', {
        message: '链接失败',
        error: err
      })
      return;
    }

    var db = client.db('product');

    async.series([
      function(cb) {
        var whereStr = {"_id":ObjectId(Id)};
        var updateStr = {$set: {
          "password": pwd,
          "nickname": nickname,
          "age": age,
          "sex": sex,
          "phoneNumber":phoneNumber, }}; 
          db.collection("user").updateOne(whereStr, updateStr, function(err) {
          if (err) {
            cb(err);
          } else {
            cb(null);
          }
        })
      }
    ], function(err, result) {
      if (err) {
        res.render('error', {
          message: '错误',
          error: err
        })
      } else {
        var str= '/users?page='+pag+'&pageSize='+pagSize;
        res.redirect(str);
      }
      // 不管成功or失败，
      client.close();
    })
  })
});

//搜索功能

router.get('/search', function(req, res, next) {
  var page = parseInt(req.query.page) || 1; // 页码
  var pageSize = parseInt(req.query.pageSize) || 5; // 每页显示的条数
  var totalSize = 0;  // 总条数
  var data = [];
  var prePage= (page-1)*pageSize;
  var name=req.query.name;
  var filter=new RegExp(name);

  MongoClient.connect(url, { useNewUrlParser: true}, function(err, client) {
    if (err) {
      res.render('error', {
        message: '链接失败',
        error: err
      })
      return;
    }

    var db = client.db('product');

    async.series([
      function(cb) {
        db.collection('user').find({nickname:filter}).count(function(err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },

      function(cb) {

        db.collection('user').find({nickname:filter}).limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
          if (err) {
            cb(err)
          } else {
            // data = data;
            cb(null, data)
          }
        })

      }
    ], function(err, results) {
      if (err) {
        res.render('error', {
          message: '错误',
          error: err
        })
      } else {
        var totalPage = Math.ceil(totalSize / pageSize); // 总页数

        res.render('users', {
          list: results[1],
          // totalSize: totalSize,
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page,
          prePage:prePage
        })
      }
    })
  })
});











module.exports = router;
