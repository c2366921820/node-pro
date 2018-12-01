var express = require('express');
var router = express.Router();
var multer = require('multer');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://127.0.0.1:27017';
var upload = multer({dest: 'C:/tmp'});
var fs = require('fs');
var path = require('path');

var upload=multer({dest:'c:/tmp'})

// 手机管理页面
router.get('/', function(req, res, next) {
  console.log("niha")
  var page = parseInt(req.query.page) || 1; // 页码
  var pageSize = parseInt(req.query.pageSize) || 5; // 每页显示的条数
  var totalSize = 0;  // 总条数
  var prePage= (page-1)*pageSize;
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
        db.collection('phone').find().count(function(err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },

      function(cb) {
        db.collection('phone').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
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

        res.render('phone', {
          list: results[1],
          // totalSize: totalSize,
          prePage:prePage,
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page
        })
      }
    })
  })


});
//删除手机
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
    db.collection('phone').deleteOne({
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
        res.redirect('/phone');
      }

      client.close();
    })
  })
})

//点击操作，渲染页面
var Id=0;
router.get('/operate', function(req, res, next) {
  Id = req.query.id;
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
       db.collection('phone').find({"_id":ObjectId(Id)}).toArray(function(err, data) {
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
       res.render('operate-phone', {
         list: results[0]
       })
     }
   })
 })
});
//修改手机的页面
router.post('/operate', upload.single('file'), function(req, res) {
  var pname = req.body.pname;
  var brandName = req.body.brandName;
  var price = parseInt(req.body.price);
  var price1 = parseInt(req.body.price1);
  var isChange=req.body.isChange;
  //判断是否传入图片
 if(isChange=="true"){ 
  var filename = new Date().getTime() + '_' + req.file.originalname;
  var newFileName = path.resolve(__dirname, '../public/images/', filename);
  var data = fs.readFileSync(req.file.path);
  fs.writeFileSync(newFileName, data);
  pic="/images/"+filename;
      }else{
        pic=req.body.pic;
}
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
          "phonename": pname,
          "brand": brandName,
          "pic":pic,
          "price": price,
          "price1": price1,
          }}; 
          db.collection("phone").updateOne(whereStr, updateStr, function(err) {
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
        res.redirect('/phone');
      }
      // 不管成功or失败，
      client.close();
    })
  })
});





// 新增手机
router.post('/addPhone', upload.single('file'), function(req, res) {
  // 如果想要通过浏览器访问到这张图片的话，是不是需要将图片放到public里面去
  var filename = new Date().getTime() + '_' + req.file.originalname;
  var newFileName = path.resolve(__dirname, '../public/images/', filename);
  try {
    // fs.renameSync(req.file.path, newFileName);
    var data = fs.readFileSync(req.file.path);
    fs.writeFileSync(newFileName, data);

    // console.log(req.body);
    // res.send('上传成功');
    // 操作数据库写入
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {

      var db = client.db('product');
      db.collection('phone').insertOne({
        "phonename": req.body.phoneName,
        "pic":  "/images/"+filename,
        "brand" :req.body.sel,
        "price" : req.body.price,
        "price1" :req.body. price1
      }, function(err) {
        client.close();
        res.redirect('/phone');
      })

    })


  } catch (error) {
    res.render('error', {
      message: '新增手机失败',
      error: error
    })
  }
})

module.exports = router;
