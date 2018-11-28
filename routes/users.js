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
        // limit()
        // skip()
        // 1 - 0     page * pageSize - pageSize
        // 2 - 5
        // 3 - 10
        // 4- 15
        // db.collection('user').find().limit(5).skip(0)
        // db.collection('user').find().limit(5).skip(5)
        // db.collection('user').find().limit(5).skip(10)
        // db.collection('user').find().limit(5).skip(15)

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
          currentPage: page
        })
      }
    })
  })



  // MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  //   if (err) {
  //     // 链接数据库失败
  //     console.log('链接数据库失败', err);
  //     res.render('error', {
  //       message: '链接数据库失败',
  //       error: err
  //     });
  //     return;
  //   }
  //   var db = client.db('project');

  //   db.collection('user').find().toArray(function(err, data) {
  //     if (err) {
  //       console.log('查询用户数据失败', err);
  //       // 有错误，渲染 error.ejs
  //       res.render('error', {
  //         message: '查询失败',
  //         error: err
  //       })
  //     } else {
  //       console.log(data);
  //       res.render('users', {
  //         list: data
  //       });
  //     }

  //     // 记得关闭数据库的链接
  //     client.close();
  //   })
  // });
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

    // db.collection('user').find({
    //   username: username,
    //   password: password
    // }).count(function(err, num) {
    //   if (err) {
    //     console.log('查询失败', err);
    //     res.render('error', {
    //       message: '查询失败',
    //       error: err
    //     })
    //   } else if (num > 0) {
    //     // 登录成功 - 跳转到首页
    //     // res.render('index');

    //     // 注意，当前url地址是 location:3000/users/login。 如果直接使用 render() .页面地址是不会改变的。

    //     // 登录成功，写入cookie
    //     res.cookie('nickname', )


    //     // res.redirect('http://localhost:3000/');
    //     res.redirect('/');
    //   } else {
    //     // 登录失败
    //     res.render('error', {
    //       message: '登录失败',
    //       error: new Error('登录失败')
    //     })
    //   }
    //   client.close();
    // })

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
          message: '登录失败',
          error: new Error('登录失败')
        })
      } else {
        // 登录成功

        // cookie操作
        console.log(data[0].nickname)
        res.cookie('nickname', data[0].nickname, {
          maxAge: 60 * 60 * 1000
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

  // MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  //   if (err) {
  //     res.render('error', {
  //       message: '链接失败',
  //       error: err
  //     })
  //     return;
  //   }

  //   var db = client.db('project');
  //   db.collection('user').insertOne({
  //     username: name,
  //     password: pwd,
  //     nickname: nickname,
  //     age: age,
  //     sex: sex,
  //     isAdmin: isAdmin
  //   }, function(err) {
  //     if (err) {
  //       console.log('注册失败');
  //       res.render('error', {
  //         message: '注册失败',
  //         error: err
  //       })
  //     } else {
  //       // 注册成功 跳转到登陆页面
  //       res.redirect('/login.html');
  //     }

  //     client.close();
  //   })
  // })
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
        // 删除成功，页面刷新一下
        // res.reload  nodejs
        // location.reload();
        // res.redirect('/users');
        // res.send('<script>location.reload();</script>');
        res.redirect('/users');
      }

      client.close();
    })
  })
})
var Id=0;
router.get('/operate', function(req, res, next) {
  res.render('operate');
   Id = req.query.id;
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
        res.redirect('/users');
      }
      // 不管成功or失败，
      client.close();
    })
  })
});











module.exports = router;
