/**
 * @file 存取公司信息的module
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , util        = require("../core/util")
  , conn        = require("./connection")
  , schema      = mongo.Schema
  , Mixed       = mongo.Schema.Types.Mixed;

/**
 * 公司schema
 * @type {schema}
 */
var Company = new schema({
    code          : {type: String, description: "公司CODE", unique: true}
  , name          : {type: String, description: "名称"}
  , domain        : {type: String, description: "登陆url用的domain，对应顾客编集画面的公司ID", unique: true}
  , type          : {type: String, description: "0:提案客户 1:委托客户 2:自营客户等"}
  , extend        : {type: Mixed,  description: "扩展属性" }
  , valid         : {type: Number, description: "删除 0:无效 1:有效", default:1}
  , createAt      : {type: Date,   description: "创建时间"}
  , creator       : {type: String, description: "创建者"}
  , updateAt      : {type: Date,   description: "最终修改时间"}
  , updater       : {type: String, description: "最终修改者"}
  });

/**
 * 使用定义好的Schema，生成Company的model
 * @returns {*} company model
 */
function model() {

  return conn().model("Company", Company);
}

/**
 * 取得唯一的Code（系统内部使用）
 * 先生成随机的ID，由于改ID不能确保是唯一的，所以要在数据库中查询是否已经存在来确保获取唯一的ID。
 * @param {function} callback 回调函数，返回生成的内部用公司code
 */
function createCode(callback) {

  var comp = model()
    , guid = util.randomGUID8();

  comp.count({ code: guid }).exec(function(err, count) {
    if (err) {
      callback(err);
      return;
    }

    if (count > 0) {
      createCode(comp, callback);
    } else {
      callback(err, guid);
    }
  });
}

/**
 * 获取公司一览
 * @param {object} condition 条件
 * @param {integer} start 数据开始位置
 * @param {integer} limit 数据件数
 * @param {function} callback 回调函数，返回公司一览
 */
exports.getList = function(condition, start, limit, callback){

  var comp = model();

  comp.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({ "updateAt": "desc" })
    .exec(function(err, result) {
      return callback(err, result);
    });
};

/**
 * 通过公司ID获取一个公司
 * @param {string} domain 公司的域名，一般是邮箱域名，也可以设计成与域名无关
 * @param {function} callback 回调函数，返回公司对象
 */
exports.getByDomain = function(domain, callback) {

  var comp = model();

  comp.findOne({ domain: domain }, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 通过公司Code获取一个公司
 * @param {string} code 内部用公司号
 * @param {function} callback 回调函数，返回公司对象
 */
exports.getByCode = function(code, callback) {

  var comp = model();

  comp.findOne({ code: code }, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 获取指定公司
 * @param {string} compid 公司ID
 * @param {function} callback 回调函数，返回公司对象
 */
exports.get = function(compid, callback) {

  var comp = model();

  comp.findById(compid, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 添加公司
 * @param {object} newComp 新的公司对象
 * @param {function} callback 回调函数，返回添加的公司对象
 */
exports.add = function(newComp, callback){

  createCode(function(err, code) {
    if (err) {
      callback(err);
      return;
    }

    var Comp = model();
    newComp.code = code;

    new Comp(newComp).save(function(err, result){
      return callback(err, result);
    });
  });
};

/**
 * 更新指定公司
 * @param {string} compid 公司ID
 * @param {object} newComp 更新用公司对象
 * @param {function} callback 回调函数，返回更新结果
 */
exports.update = function(compid, newComp, callback) {

  // 当code存在
  var comp = model();

  comp.findByIdAndUpdate(compid, newComp, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 获取公司有效件数
 * @param {object} condition 检索条件
 * @param {function} callback 回调函数，返回件数
 */
exports.total = function(condition, callback) {

  var comp = model();

  condition.valid = 1;
  comp.count(condition).exec(function(err, count) {
    return callback(err, count);
  });
};
