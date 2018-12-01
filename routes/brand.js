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

// 品牌管理页面
router.get('/', function(req, res, next) {
  console.log("niha")
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
        db.collection('brand').find().count(function(err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },

      function(cb) {
        db.collection('brand').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
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

        res.render('brand', {
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
    db.collection('brand').deleteOne({
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
        res.redirect('/brand');
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
       db.collection('brand').find({"_id":ObjectId(Id)}).toArray(function(err, data) {
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
       res.render('operate-brand', {
         list: results[0]
       })
     }
   })
 })
});
//修改手机页面
router.post('/operate', upload.single('file'),  function(req, res) {
 var brandLevel=req.body.brandLevel;
 var brandName=req.body.brandName;
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
        console.log(whereStr);
        var updateStr = {$set: {
            "brandName" : brandName,
            "brandLevel" : brandLevel,
            "logo":pic,
          }}; 
          db.collection("brand").updateOne(whereStr, updateStr, function(err) {
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
        res.redirect('/brand');
      }
      // 不管成功or失败，
      client.close();
    })
  })
});


//新增品牌
router.post('/addBrand', upload.single('file'), function(req, res) {
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
      db.collection('brand').insertOne({
        "brandName": req.body.brandName,
        "logo":  "/images/"+filename,
        "brandLevel" :req.body.sel,
      }, function(err) {
        client.close();
        res.redirect('/brand');
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
