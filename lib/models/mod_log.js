/**
 * @file 日志的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

var mongo   = require("mongoose")
  , conn    = require("../connection")
  , schema  = mongo.Schema;

/**
 * @type {schema} 日志schema
 */
var Log = new schema({
    time      : { type: Number, description: "日志输出时间" }
  , user      : { type: String, description: "执行操作的用户的标识" }
  , host      : { type: String, description: "产生日志的机器的IP地址" }
  , source    : { type: String, description: "产生日志的软件分类" }
  , type      : { type: String, description: "日志类型，audit | operation | application" }
  , level     : { type: String, description: "日志输出级别" }
  , category  : { type: String, description: "分类" }
  , code      : { type: String, description: "信息编号" }
  , message   : { type: String, description: "详细信息" }
  , file      : { type: String, description: "输出日志的代码文件" }
  , line      : { type: String, description: "输出日志的代码在文件中的行号" }
  });

/**
 * 使用定义好的Schema，生成LOG的model
 * @returns {*} device model
 */
function model() {
  return conn().model("Log", Log);
}

/**
 * 获取日志件数
 * @param condition 查询条件
 * @param callback 返回件数
 */
exports.total = function(condition, callback) {

  var log = model();

  log.count(condition).exec(function(err, count) {
    return callback(err, count);
  });

};

/**
 * 获取日志一览
 * @param condition 查询条件
 * @param start 数据开始位置
 * @param limit 数据件数
 * @param callback 返回日志一览
 */
exports.getList = function(condition, start, limit, callback) {

  var log = model();

  log.find(condition)
    .sort({time: "asc"})
    .skip(start || 0)
    .limit(limit || 50)
    .exec(function(err, result) {
      return callback(err, result);
    });

};

/**
 * 获取日志详情
 * @param docId 文档标识
 * @param callback 返回日志详情
 */
exports.get = function(docId, callback) {

  var log = model();

  log.findById(docId, function(err, result) {
    return callback(err, result);
  });

};


