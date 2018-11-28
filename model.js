/**
 * Created by linziyu on 2017/7/15.
 */
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({ //定义数据模型
    name: String,
    pwd: String
 
});
mongoose.model('u2', UserSchema);//将该Schema发布为Model,第一个参数为数据库的集合，没有会自动创建
