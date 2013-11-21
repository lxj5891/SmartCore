/**
 * @file 存取用户信息的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , schema      = mongo.Schema
  , mixed       = schema.Types.Mixed
  , _           = require("underscore")
  , conn        = require("../core/connection")
  , constant    = require("../core/constant");

/**
 * 用户schema
 * @type {schema}
 */
var User = new schema({
    userName    : { type: String, description: "用户标识", unique: true}
  , first       : { type: String, description: "名"}
  , middle      : { type: String, description: "中间名"}
  , last        : { type: String, description: "姓"}
  , password    : { type: String, description: "密码" }
  , groups      : { type: Array,  description: "所属组一览" }
  , email       : { type: String, description: "电子邮件地址" }
  , lang        : { type: String, description: "语言" }
  , timezone    : { type: String, description: "时区" }
  , status      : { type: String, description: "状态" } // 密码被锁，离职之类
  , extend      : { type: mixed,  description: "扩展属性" }
  , valid       : { type: Number, description: "删除 0:无效 1:有效", default:1 }
  , createAt    : { type: Date,   description: "创建时间" }
  , createBy    : { type: String, description: "创建者" }
  , updateAt    : { type: Date,   description: "最终修改时间" }
  , updateBy    : { type: String, description: "最终修改者" }
  });

/**
 * 使用定义好的Schema，生成User的model
 * @param {String} code 公司code
 * @returns {Object} User model
 */
function model(code) {

  return conn.model(code, constant.MODULES_NAME_USER, User);
}

/**
 * 创建用户
 * @param {String} code 公司code
 * @param {Object} user 用户对象
 * @param {Function} callback 回调函数，返回新插入的用户
 */
exports.add = function(code, user, callback) {

  var User = model(code);

  new User(user).save(function(err, result){

    if(result) {
      delete result._doc.password; // 擦除密码
    }

    callback(err, result);
  });
};

/**
 * 根据用户标识(_id)查询用户
 * @param {String} code 公司code
 * @param {String} uid 用户标识
 * @param {Function} callback 回调函数，返回用户信息
 */
exports.get = function (code, uid, callback) {

  var user = model(code);

  user.findById(uid, function (err, result) {

    if(result) {
      delete result._doc.password; // 擦除密码
    }

    callback(err, result);
  });
};

/**
 * 根据指定条件查询用户(只返回第一个有效的结果)
 * @param {String} code 公司code
 * @param {Object} condition 查询条件
 * @param {Function} callback 回调函数，返回用户信息
 */
exports.getOne = function (code, condition, callback) {

  var user = model(code);

  user.findOne(condition, function (err, result) {

    callback(err, result);
  });
};

/**
 * 查询符合条件的有效用户的数目
 * @param {String} code 公司code
 * @param {Object} condition 查询条件
 * @param {Function} callback  回调函数，返回用户数目
 */
exports.total = function (code, condition, callback) {

  var user = model(code);

  user.count(condition, function (err, count) {
    callback(err, count);
  });
};

/**
 * 根据指定条件查询用户
 * @param {String} code 公司code
 * @param {Object} condition 查询条件
 * @param {Number} skip 跳过的文书数，默认为0
 * @param {Number} limit 返回的文书的上限数目，默认为20
 * @param {String} order 排序
 * @param {Function} callback 回调函数，返回用户列表
 */
exports.getList = function (code, condition, skip, limit, order, callback) {

  var user = model(code);

  user.find(condition)
    .skip(skip || constant.MOD_DEFAULT_START)
    .limit(limit || constant.MOD_DEFAULT_LIMIT)
    .sort(order)
    .exec(function (err, result) {

      if(result) {
        _.each(result, function(user) {
          delete user._doc.password; // 擦除密码
        });
      }

      callback(err, result);
    });
};

/**
 * 根据用户标识更新用户
 * @param {String} code 公司code
 * @param {String} uid 用户标识
 * @param {Object} newUser 更新用用户对象
 * @param {Function} callback 回调函数，返回更新后的用户
 */
exports.update = function (code, uid, newUser, callback) {

  var user = model(code);

  user.findByIdAndUpdate(uid, newUser, function (err, result) {

    if(result) {
      delete result._doc.password; // 擦除密码
    }

    callback(err, result);
  });
};













