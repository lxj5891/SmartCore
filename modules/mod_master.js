/**
 * @file 分类的module
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , schema      = mongo.Schema
  , Mixed       = mongo.Schema.Types.Mixed
  , constant    = require("../core/constant")
  , conn        = require("../core/connection");

/**
 * 分类的model
 */

var  Master = new schema({
    masterCode         : { type: String,   description: "分类Code:pro,sex,", required: true, unique: true }
  , masterDescription  : { type: String,   description: "分类描述" }
  , masterTrsKey       : { type: String,   description: "翻译Key" }
  , masterType         : { type: String,   description: "类型:Smart,Yukari,FR等" , required: true }
  , fieldSet           : [ {
      fieldCode        : { type: String,   description: "属性Key" }
    , fieldObject      : { type: Mixed,    description: "属性对象" }
    }
  ]
  , valid              : { type: Number,   description: "删除 0:无效 1:有效", default: constant.VALID }
  , createAt           : { type: Date,     description: "创建时间" }
  , createBy           : { type: String,   description: "创建者" }
  , updateAt           : { type: Date,     description: "更新时间" }
  , updateBy           : { type: String,   description: "更新者" }
  });

/**
 * 使用定义好的Schema,生成分类的model
 * @returns {model} Master model
 */
function model() {
  return conn.model(undefined, constant.MODULES_NAME_MASTER, Master);
}

/**
 * 添加分类
 * @param {Object} newMaster 新的分类对象
 * @param {Function} callback 回调函数，返回添加的分类对象
 */
exports.add = function(newMaster, callback) {

  var Maser = model();

  new Maser(newMaster).save(function(err, result) {
    return callback(err, result);
  });
};

/**
 * 获取分类
 * @param {String} masterId 分类ID
 * @param {Function} callback 回调函数，返回分类
 */
exports.get = function(masterId, callback) {

  var master = model();

  master.findById(masterId, function(err, result) {
    callback(err, result);
  });
};

/**
 * 通过类型和Code获取指定分类
 * @param {String} masterType 类型
 * @param {String} masterCode 分类Code
 * @param {Function} callback 回调函数，返回指定分类
 */
exports.getByKey = function(masterType, masterCode, callback) {

  var master = model();
  var conditions = {
      masterType : masterType
    , masterCode : masterCode
    };

  master.findOne(conditions , function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取分类一览
 * @param {Object} condition 条件
 * @param {Number} start 数据开始位置
 * @param {Number} limit 数据件数
 * @param {Number} order 排序
 * @param {Function} callback 回调函数，返回分类一览
 */
exports.getList = function(condition, start, limit, order, callback) {

  var master = model();

  master.find(condition)
    .skip(start || 0)
    .limit(limit || constant.MOD_DEFAULT_LIMIT)
    .sort(order)
    .exec(function(err, result) {
      return callback(err, result);
    });
};

/**
 * 更新指定分类
 * @param {String} masterId 分类ID
 * @param {Object} updateMaster 更新用分类对象
 * @param {Function} callback 回调函数，返回更新结果
 */
exports.update = function(masterId, updateMaster, callback) {

  var master = model();

  master.findByIdAndUpdate(masterId, updateMaster, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 删除指定分类
 * @param {String} masterId 分类ID
 * @param {Object} updateMaster 删除用分类对象
 * @param {Function} callback 回调函数，返回更新结果
 */
exports.remove = function(masterId, updateMaster, callback) {

  var master = model();

  // 逻辑删除
  updateMaster.valid = constant.INVALID;

  master.findByIdAndUpdate(masterId, updateMaster, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 获取分类件数
 * @param {Object} condition 条件
 * @param {function} callback 返回分类件数
 */
exports.total = function(condition, callback) {

  var master = model();

  master.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};