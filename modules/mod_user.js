/**
 * @file 存取用户信息的module
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart     = require("smartcore")
  , mongo       = smart.util.mongoose
  , conn        = require("./connection")
  , schema      = mongo.Schema
  , mixed       = schema.Types.Mixed;

/**
 * 用户schema
 * @type {schema}
 */
var User = new schema({
    uid         : { type: String, description: "用户标识"}
  , first       : { type: String, description: "名"}
  , middle      : { type: String, description: "中间名"}
  , last        : { type: String, description: "姓"}
  , password    : { type: String, description: "密码" }
  , group       : { type: Array,  description: "所属组一览" }
  , email       : { type: String, description: "电子邮件地址" }
  , lang        : { type: String, description: "语言" }
  , timezone    : { type: String, description: "时区" }
  , status      : { type: String, description: "状态" } // 密码被锁，离职之类
  , extend      : { type: mixed,  description: "扩展属性" }
  , valid       : { type: Number, description: "删除 0:无效 1:有效", default:1 }
  , createAt    : { type: Date,   description: "创建时间" }
  , creator     : { type: String, description: "创建者" }
  , updateAt    : { type: Date,   description: "最终修改时间" }
  , updater     : { type: String, description: "最终修改者" }
  });

/**
 * 使用定义好的Schema，生成User的model
 * @returns {Object} User model
 */
function model() {

  return conn().model("User", User);
}

/**
 * 创建用户
 * @param <Object> user 用户对象
 * @param <Function> callback(err) 回调函数，返回异常信息
 */
exports.add = function(user, callback) {

  var User = model();

  new User(user).save(function(err){
    callback(err);
  });
};

/**
 * 根据用户标识查询用户
 * @param <String> uid 用户标识
 * @param <Function> callback(err, user) 回调函数，返回用户信息
 */
exports.get = function (uid, callback) {

  var User = model();

  User.findOne({"uid": uid, "valid": 1}, function (err, result) {
    callback(err, result);
  });
};

/**
 * 查询符合条件的用户数目
 * @param <Object> condition 查询条件
 * @param <Function> callback(err, count) 回调函数，返回用户数目
 */
exports.count = function (condition, callback) {

  var User = model();

  User.count(condition, function (err, count) {
    callback(err, count);
  });
};

/**
 * 根据指定条件查询用户
 * @param <Object> condition 查询条件
 * @param <String> fields 查询的字段，例如："uid first email"
 * @param <Number> skip 跳过的文书数，默认为0
 * @param <Number> limit 返回的文书的上限数目，默认为20
 * @param <String> order 排序，例如："uid -first"
 * @param <Function> callback(err, users) 回调函数，返回用户列表
 */
exports.getList = function (condition, fields, skip, limit, order, callback) {

  var User = model();

  User.find(condition)
    .select(fields)
    .skip(skip || 0)
    .limit(limit || 20)
    .sort(order)
    .exec(function (err, result) {
      callback(err, result);
    });
};

/**
 * 根据用户标识更新用户
 * @param <String> uid 用户标识
 * @param <Object> newUser 更新命令
 * @param <Function> callback(err, user) 回调函数，返回异常信息
 */
exports.update = function (uid, newUser, callback) {

  var User = model();

  User.findOneAndUpdate({"uid": uid, "valid": 1}, newUser, function (err) {
    callback(err);
  });
};













